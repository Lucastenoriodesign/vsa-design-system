/* Escudo do navegador do Mesaí. Carrega primeiro. Em desenvolvimento (localhost/IP da rede) fica de fora para não quebrar o modo ao vivo;
   para testar a política em local use ?csp=1 na URL. */
(function () {
  var h = location.hostname, dev = h === 'localhost' || h === '127.0.0.1' || /^192\.168\.|^10\./.test(h);
  var force = /[?&]csp=1\b/.test(location.search);
  if (dev && !force) return;
  // Anti-clickjacking: o app não deve rodar dentro do quadro de outro site.
  try { if (window.top !== window.self) { document.documentElement.style.display = 'none'; window.top.location = window.self.location; } } catch (e) { document.documentElement.style.display = 'none'; }
  // Política de conteúdo: só scripts do próprio app; conexão só com o próprio app e o Supabase; sem plugins, sem quadros, sem mudar <base>.
  var csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; " +
    "connect-src 'self' https://qheadmopevmckkmugugy.supabase.co; media-src 'self'; manifest-src 'self'; worker-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'";
  var m = document.createElement('meta'); m.httpEquiv = 'Content-Security-Policy'; m.content = csp;
  (document.head || document.documentElement).appendChild(m);
})();
