// Liga o app ao servidor: lugares, conta, comentários, pontos, favoritos e ambiente.
// Se o servidor não responder, tudo continua funcionando só com dados locais.

function mapPlace(r) {
  var local = (typeof DATA !== 'undefined' ? DATA : []).filter(function (d) { return d.id === r.id; })[0] || {};
  // Coordenadas, crianças e pets: vale o servidor; se ele não tiver o dado, usa o cadastro local (js/data.js).
  var num = function (a, b) { return typeof a === 'number' ? a : (typeof b === 'number' ? b : null); };
  var p = { id: r.id, n: r.name, g: r.category, c: r.category_source || r.category, r: r.region, e: r.address, d: r.description || '',
    t: r.phone, ev: r.evidence, pub: !!r.published, f: r.source_url, m: r.maps_url, lat: num(r.lat, local.lat), lng: num(r.lng, local.lng),
    foto: r.photo_url || local.foto || null, fs: r.photo_source || local.fs || null, h: r.hours, fc: local.fc || [], obs: local.obs || '' };
  ['kid', 'pet'].forEach(function (k) {
    var v = typeof r[k] === 'boolean' ? r[k] : local[k];
    if (typeof v === 'boolean') p[k] = v;
  });
  return p;
}

function mapComment(r) {
  var u = API.user();
  return { id: r.id, sv: true, text: r.body, kind: r.kind, place: r.place_id, status: r.status, flags: r.flags || [],
    t: Date.parse(r.created_at), mine: !!(u && r.user_id === u.id), who: 'Membro' };
}

function syncComments() {
  var jobs = [API.comments()];
  if (API.user()) { jobs.push(API.myComments()); jobs.push(S2.admin ? API.pending() : Promise.resolve([])); }
  return Promise.all(jobs).then(function (r) {
    var seen = {}, all = [];
    r[0].concat(r[1] || []).forEach(function (c) { if (!seen[c.id]) { seen[c.id] = 1; all.push(c); } });
    all.sort(function (a, b) { return Date.parse(b.created_at) - Date.parse(a.created_at); });
    S2.feed = all.map(mapComment);
    S2.pend = (r[2] || []).map(mapComment);
    renderFeed(); renderMod();
  });
}

function syncAmbience() {
  return API.ambience().then(function (rows) {
    var out = {}, mine = {}, u = API.user();
    rows.forEach(function (m) {
      out[m.place_id] = out[m.place_id] || {};
      out[m.place_id][m.tag] = (out[m.place_id][m.tag] || 0) + 1;
      if (u && m.user_id === u.id) { mine[m.place_id] = (mine[m.place_id] || []).concat(m.tag); }
    });
    S2.amb = out;
    if (u) { amb = mine; }
  });
}

function syncMe() {
  if (!API.user()) { S2.admin = false; S2.points = 0; S2.name = null; return Promise.resolve(); }
  return Promise.all([API.profile(), API.isAdmin(), API.saved()]).then(function (r) {
    S2.points = (r[0] && r[0].points) || 0;
    S2.name = r[0] && r[0].display_name;
    S2.avatar = (r[0] && r[0].avatar_url) || null;
    S2.admin = !!r[1];
    var server = r[2].map(function (x) { return x.place_id; });
    saved.forEach(function (id) { if (server.indexOf(id) < 0) { API.save(id).catch(function () {}); } });
    server.forEach(function (id) { saved.add(id); });
  });
}

function syncAll() {
  return syncMe().then(function () { return Promise.all([syncComments(), syncAmbience()]); }).then(function () { renderAll(); });
}

// Entrar, criar conta e sair
document.addEventListener('submit', function (e) {
  if (e.target.id !== 'authForm') return;
  e.preventDefault();
  var f = new FormData(e.target), email = String(f.get('email') || '').trim(), pass = String(f.get('password') || ''), name = String(f.get('name') || '').trim();
  var signup = !$('nameRow').hidden, msg = $('authMsg');
  msg.textContent = 'Aguarde...';
  var p = signup ? API.signUp(email, pass, name) : API.signIn(email, pass).then(function () { return { session: true }; });
  p.then(function (r) {
    if (!r.session) { msg.textContent = 'Conta criada. Confirme o e-mail que enviamos e depois entre.'; return; }
    return syncAll().then(function () { closeOverlays(); toast('Conectado'); });
  }).catch(function (err) {
    msg.textContent = /Invalid login/i.test(err.message) ? 'E-mail ou senha incorretos.' : /registered|already/i.test(err.message) ? 'Este e-mail já tem conta. Toque em Entrar.' : 'Não foi possível agora: ' + err.message;
  });
});
document.addEventListener('click', function (e) {
  var t = e.target.closest('button'); if (!t) return;
  if (t.id === 'authSwitch') {
    var nr = $('nameRow'), signup = nr.hidden;
    nr.hidden = !signup;
    $('authGo').textContent = signup ? 'Criar conta' : 'Entrar';
    t.textContent = signup ? 'Já tenho conta' : 'Criar conta';
  }
  if (t.dataset.auth === 'out') {
    API.signOut().then(function () { S2.admin = false; S2.points = 0; S2.name = null; return syncComments(); }).then(function () { renderAll(); closeOverlays(); toast('Você saiu'); });
  }
});

// Início: tenta o servidor; se falhar, segue no modo local
(function () {
  if (typeof API === 'undefined' || !MESAI_CONFIG.supabaseUrl) return;
  API.places().then(function (rows) {
    if (!rows || !rows.length) throw new Error('sem lugares');
    BASE = rows.map(mapPlace);
    places = BASE.concat(sugg);
    S2.on = true;
    LOADING = false;
    document.body.classList.add('srv-on'); // esconde avisos que só valem no modo local
    return syncAll();
  }).catch(function () { S2.on = false; document.body.classList.remove('srv-on'); if (LOADING) { LOADING = false; renderAll(); } });
})();
