#!/bin/bash
# Uso: agencia/status.sh <agente> <aguardando|trabalhando|concluido|bloqueado> <progresso 0-100> "<o que está fazendo>"
D="$(cd "$(dirname "$0")" && pwd)/status"
python3 - "$D" "$1" "$2" "$3" "$4" <<'PY'
import json,sys,datetime
d,a,e,p,t=sys.argv[1:6]
json.dump({"agente":a,"estado":e,"progresso":int(p),"tarefa":t,"atualizado":datetime.datetime.now().isoformat(timespec="seconds")},open(f"{d}/{a}.json","w"),ensure_ascii=False)
PY
