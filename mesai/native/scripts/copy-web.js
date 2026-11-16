// Copia o app web (mesai/v2) para www/, que é o que vai dentro do app nativo.
// Fica de fora o que só faz sentido no site: testes, ferramentas e o service worker.
const fs = require('fs'), path = require('path');
const src = path.resolve(__dirname, '../../v2'), dst = path.resolve(__dirname, '../www');
const skip = new Set(['tests', 'tools', 'README.md', 'sw.js']);
fs.rmSync(dst, { recursive: true, force: true });
(function copy(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const n of fs.readdirSync(a)) {
    if (skip.has(n) || n.startsWith('.')) continue;
    const s = path.join(a, n), d = path.join(b, n);
    fs.statSync(s).isDirectory() ? copy(s, d) : fs.copyFileSync(s, d);
  }
})(src, dst);
console.log('www pronto a partir de', src);
