// Cliente mínimo do Supabase (REST + login por e-mail), sem bibliotecas.
// Se o servidor não responder, o app continua funcionando só com dados locais (S2.on = false).
var S2 = { on: false, admin: false, points: 0, feed: [], pend: [], amb: {}, name: null };

var API = (function () {
  var URL = MESAI_CONFIG.supabaseUrl, KEY = MESAI_CONFIG.supabaseKey;
  var session = null;
  try { session = JSON.parse(localStorage.getItem('mesai-session')); } catch (e) {}

  function saveSession(s) {
    session = s;
    try { if (s) localStorage.setItem('mesai-session', JSON.stringify(s)); else localStorage.removeItem('mesai-session'); } catch (e) {}
  }
  function normSession(r) {
    if (!r || !r.access_token) return null;
    return { access_token: r.access_token, refresh_token: r.refresh_token, expires_at: Date.now() + (r.expires_in || 3600) * 1000, user: { id: r.user && r.user.id, email: r.user && r.user.email } };
  }
  function http(path, opts, retry) {
    opts = opts || {};
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 9000) : null;
    var h = { apikey: KEY, 'Content-Type': 'application/json', Authorization: 'Bearer ' + ((session && session.access_token) || KEY) };
    if (opts.prefer) h.Prefer = opts.prefer;
    return fetch(URL + path, { method: opts.method || 'GET', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined, signal: ctl ? ctl.signal : undefined })
      .then(function (res) {
        if (timer) clearTimeout(timer);
        if (res.status === 401 && session && session.refresh_token && !retry) {
          return refresh().then(function () { return http(path, opts, true); });
        }
        return res.text().then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
          if (!res.ok) { var err = new Error((j && (j.message || j.msg || j.error_description)) || ('HTTP ' + res.status)); err.status = res.status; err.body = j; throw err; }
          return j;
        });
      }, function (e) { if (timer) clearTimeout(timer); throw e; });
  }
  function refresh() {
    return fetch(URL + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: session && session.refresh_token }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error('sessão expirou'); saveSession(normSession(j)); }); })
      .catch(function (e) { saveSession(null); throw e; });
  }

  return {
    user: function () { return session && session.user; },
    // login por e-mail
    signUp: function (email, password, name) {
      return http('/auth/v1/signup', { method: 'POST', body: { email: email, password: password, data: { display_name: name || '' } } })
        .then(function (r) { var s = normSession(r); if (s) saveSession(s); return { session: !!s }; });
    },
    signIn: function (email, password) {
      return http('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: email, password: password } })
        .then(function (r) { saveSession(normSession(r)); });
    },
    signOut: function () {
      var p = session ? http('/auth/v1/logout', { method: 'POST' }).catch(function () {}) : Promise.resolve();
      return p.then(function () { saveSession(null); });
    },
    // dados
    places: function () { return http('/rest/v1/places?select=*&order=name.asc'); },
    comments: function () { return http('/rest/v1/comments?select=*&status=eq.aprovado&order=created_at.desc&limit=60'); },
    myComments: function () { return http('/rest/v1/comments?select=*&user_id=eq.' + session.user.id + '&order=created_at.desc&limit=60'); },
    pending: function () { return http('/rest/v1/comments?select=*&status=eq.pendente&order=created_at.asc&limit=100'); },
    addComment: function (c) { return http('/rest/v1/comments', { method: 'POST', body: { user_id: session.user.id, place_id: c.place_id || null, kind: c.kind, body: c.body, flags: c.flags || [] }, prefer: 'return=minimal' }); },
    setStatus: function (id, status) { return http('/rest/v1/comments?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: { status: status, reviewed_at: new Date().toISOString() }, prefer: 'return=minimal' }); },
    delComment: function (id) { return http('/rest/v1/comments?id=eq.' + encodeURIComponent(id), { method: 'DELETE' }); },
    profile: function () { return http('/rest/v1/profiles?select=display_name,points&id=eq.' + session.user.id).then(function (r) { return r && r[0]; }); },
    isAdmin: function () { return http('/rest/v1/admins?select=user_id').then(function (r) { return !!(r && r.length); }); },
    checkin: function (placeId) { return http('/rest/v1/checkins', { method: 'POST', body: { user_id: session.user.id, place_id: placeId }, prefer: 'return=minimal' }); },
    saved: function () { return http('/rest/v1/saved_places?select=place_id'); },
    save: function (placeId) { return http('/rest/v1/saved_places', { method: 'POST', body: { user_id: session.user.id, place_id: placeId }, prefer: 'resolution=ignore-duplicates,return=minimal' }); },
    unsave: function (placeId) { return http('/rest/v1/saved_places?place_id=eq.' + encodeURIComponent(placeId), { method: 'DELETE' }); },
    ambience: function () { return http('/rest/v1/ambience_marks?select=place_id,tag,user_id'); },
    mark: function (placeId, tag) { return http('/rest/v1/ambience_marks', { method: 'POST', body: { user_id: session.user.id, place_id: placeId, tag: tag }, prefer: 'resolution=ignore-duplicates,return=minimal' }); },
    unmark: function (placeId, tag) { return http('/rest/v1/ambience_marks?place_id=eq.' + encodeURIComponent(placeId) + '&tag=eq.' + encodeURIComponent(tag), { method: 'DELETE' }); },
    suggest: function (s) { return http('/rest/v1/suggestions', { method: 'POST', body: { user_id: session.user.id, name: s.name, category: s.category, about: s.about || null }, prefer: 'return=minimal' }); }
  };
})();
