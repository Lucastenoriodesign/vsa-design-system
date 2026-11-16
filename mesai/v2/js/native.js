// Ponte entre o app web e os recursos do celular.
// No app instalado (Capacitor) usa os plugins nativos; no navegador usa o que o navegador oferece.
var NATIVE = (function () {
  var C = window.Capacitor, P = (C && C.Plugins) || {};
  var isNative = !!(C && C.isNativePlatform && C.isNativePlatform());
  var here = null; // última localização, só na memória deste aparelho

  function haptic(kind) {
    try {
      if (isNative && P.Haptics) {
        if (kind === 'ok') P.Haptics.notification({ type: 'SUCCESS' });
        else P.Haptics.impact({ style: kind === 'strong' ? 'MEDIUM' : 'LIGHT' });
      } else if (navigator.vibrate) navigator.vibrate(kind === 'ok' ? [10, 40, 10] : 8);
    } catch (e) {}
  }

  function share(o) {
    var data = { title: o.title, text: o.text, url: o.url, dialogTitle: 'Compartilhar lugar' };
    if (isNative && P.Share) return P.Share.share(data);
    if (navigator.share) return navigator.share({ title: o.title, text: o.text, url: o.url });
    var t = o.text + ' ' + o.url;
    if (navigator.clipboard) return navigator.clipboard.writeText(t).then(function () { return 'copied'; });
    return Promise.reject(new Error('sem compartilhamento'));
  }

  function locate() {
    if (isNative && P.Geolocation) {
      return P.Geolocation.requestPermissions().catch(function () {}).then(function () {
        return P.Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000 });
      }).then(function (p) { here = { lat: p.coords.latitude, lng: p.coords.longitude }; return here; });
    }
    return new Promise(function (ok, no) {
      if (!navigator.geolocation) return no(new Error('sem gps'));
      navigator.geolocation.getCurrentPosition(function (p) { here = { lat: p.coords.latitude, lng: p.coords.longitude }; ok(here); }, no, { timeout: 10000, maximumAge: 300000 });
    });
  }

  function km(a, b) {
    var R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lng - a.lng) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function distance(p) { return (here && typeof p.lat === 'number' && typeof p.lng === 'number') ? km(here, p) : null; }
  function fmt(d) { return d == null ? '' : d < 1 ? Math.round(d * 1000 / 10) * 10 + ' m' : d.toFixed(1).replace('.', ',') + ' km'; }

  if (isNative) {
    document.documentElement.classList.add('is-native');
    try { P.StatusBar && P.StatusBar.setStyle({ style: 'LIGHT' }); } catch (e) {}
    try { P.SplashScreen && P.SplashScreen.hide(); } catch (e) {}
    // Botão voltar do Android: fecha a janela aberta ou volta de tela
    try {
      P.App && P.App.addListener('backButton', function () {
        var open = document.querySelector('.overlay.open');
        if (open && typeof closeOverlays === 'function') return closeOverlays();
        if (location.hash && location.hash !== '#/inicio') return history.back();
        P.App.minimizeApp();
      });
    } catch (e) {}
  }

  return { isNative: isNative, haptic: haptic, share: share, locate: locate, distance: distance, fmt: fmt, here: function () { return here; } };
})();
