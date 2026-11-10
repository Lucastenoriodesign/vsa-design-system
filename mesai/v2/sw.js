// Mesaí · service worker: abre o app mesmo com sinal fraco ou sem internet.
// Estratégia: o "casco" do app (HTML, CSS, JS, imagens) vem do cache primeiro e é atualizado em segundo plano.
// Mapas e fotos de terceiros não são guardados.
const VERSAO = 'mesai-rede-primeiro-22';
const CASCO = [
  './', 'index.html', 'manifest.webmanifest',
  'css/tokens.css', 'css/app.css', 'js/data.js', 'js/config.js', 'js/api.js', 'js/app.js', 'js/sync.js',
  'assets/mesai-logo.png', 'assets/avatar.jpg', 'assets/icon-192.png', 'assets/icon-512.png',
  'assets/cat-regional.jpg', 'assets/cat-hamburguer.jpg', 'assets/cat-cafe.jpg', 'assets/cat-pizza.jpg',
  'assets/cat-lanches.jpg', 'assets/cat-sushi.jpg', 'assets/cat-acai.jpg', 'assets/cat-doces.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(CASCO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // fotos e mapas de terceiros passam direto
  // Rede primeiro: sempre busca a versão nova; sem internet, usa o cache
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) caches.open(VERSAO).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req))
  );
});
