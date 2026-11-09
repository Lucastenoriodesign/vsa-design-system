#!/usr/bin/env python3
"""Gera um arquivo HTML único do Mesaí v2 (CSS, JS e imagens embutidos).

Uso: python3 tools/build-standalone.py SAIDA.html
Serve para publicar/compartilhar o app como um só arquivo, sem depender de várias requisições.
"""
import base64, io, os, re, sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'dist', 'mesai-standalone.html')

def ler(p):
    with open(os.path.join(RAIZ, p), encoding='utf-8') as f:
        return f.read()

html = ler('index.html')
css = ler('css/tokens.css') + '\n' + ler('css/app.css')
js = ler('js/data.js') + '\n' + ler('js/app.js')

html = re.sub(r'<link rel="stylesheet" href="css/tokens.css">\s*<link rel="stylesheet" href="css/app.css">', lambda m: '<style>' + css + '</style>', html)
html = html.replace('<script src="js/data.js"></script>\n<script src="js/app.js"></script>', '<script>' + js + '</script>')
html = re.sub(r'<link rel="manifest"[^>]*>', '', html)
html = re.sub(r'<link rel="apple-touch-icon"[^>]*>', '', html)

def uri(nome):
    p = os.path.join(RAIZ, 'assets', nome)
    if nome == 'avatar.jpg':
        im = Image.open(p).convert('RGB'); im.thumbnail((240, 320))
        b = io.BytesIO(); im.save(b, 'JPEG', quality=82)
        return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    if nome.endswith('.png'):
        im = Image.open(p).convert('RGBA'); im.thumbnail((600, 200))
        b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
        return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
    im = Image.open(p).convert('RGB'); im.thumbnail((360, 360))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=80)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

nomes = sorted(set(re.findall(r'assets/([A-Za-z0-9_\-]+\.(?:jpg|png))', html)))
cache = {n: uri(n) for n in nomes if not n.startswith('icon-')}
for n in cache:
    html = html.replace('assets/' + n, '@@' + n + '@@')
for n, u in cache.items():
    html = html.replace('@@' + n + '@@', u)

os.makedirs(os.path.dirname(saida), exist_ok=True)
with open(saida, 'w', encoding='utf-8') as f:
    f.write(html)
print('ok:', saida, len(html) // 1024, 'KB')
