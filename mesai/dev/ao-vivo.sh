#!/bin/bash
# Modo ao vivo do Mesaí: serve mesai/v2 em http://localhost:8124 e recarrega o app sozinho a cada arquivo salvo.
cd "$(dirname "$0")/../v2" || exit 1
echo "Mesaí ao vivo em http://localhost:8124  (Ctrl+C para parar)"
open "$(cd .. && pwd)/dev/iphone.html" 2>/dev/null
exec npx -y live-server --port=8124 --no-browser --wait=300 --ignore=download
