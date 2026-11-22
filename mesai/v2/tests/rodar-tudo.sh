#!/bin/bash
# Roda a bateria completa de QA do Mesaí contra um servidor local na porta 8127.
# Uso (de qualquer pasta): v2/tests/rodar-tudo.sh
# Variáveis opcionais: PW (caminho do playwright-core), CHANNEL (padrão chrome), PORTA (padrão 8127).
AQUI="$(cd "$(dirname "$0")" && pwd)"
V2="$(cd "$AQUI/.." && pwd)"
PORTA="${PORTA:-8127}"
export PW="${PW:-/usr/local/lib/node_modules/@playwright/cli/node_modules/playwright-core}"
export CHANNEL="${CHANNEL:-chrome}"
export BASE="http://localhost:$PORTA"

(cd "$V2" && python3 -m http.server "$PORTA" >/dev/null 2>&1) &
SERV=$!
trap 'kill $SERV 2>/dev/null' EXIT
for i in 1 2 3 4 5 6 7 8 9 10; do curl -fs "$BASE/" >/dev/null && break; sleep 0.5; done

TOTAL=0; FALHAS=0; RESUMO=""
for t in smoke alertas-lugar-novo fora-da-tela filtros barra-inferior offline-rota seguranca; do
  echo "=== $t ==="
  (cd "$V2" && node "tests/$t.js"); COD=$?
  TOTAL=$((TOTAL+1))
  if [ $COD -eq 0 ]; then RESUMO="$RESUMO\nOK      $t"; else FALHAS=$((FALHAS+1)); RESUMO="$RESUMO\nFALHA   $t"; fi
done
echo; echo "===== RESUMO ====="; printf "$RESUMO\n"
echo "$((TOTAL-FALHAS))/$TOTAL arquivos OK"
[ $FALHAS -eq 0 ]
