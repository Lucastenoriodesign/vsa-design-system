# Segurança do Mesaí (22/11/2026)

## Auditoria
- Segredos: só a chave pública `sb_publishable` está no código (correto). Nenhuma `service_role`, senha ou chave privada no repositório.
- XSS: todo texto de usuário (comentário, nome, tipo, lugar) passa por `esc()`; nomes entram por `textContent`. Nenhum `eval`/`new Function`/`document.write`. Links externos já têm `noopener`.
- Pendência encontrada: não havia CSP, e existiam 5 `onerror` inline (impediriam a CSP).
- Servidor (somente leitura): RLS ligado nas 8 tabelas; moderação já impede o usuário de mudar o status do próprio comentário.

## Feito no app (enviado)
- `v2/js/seguranca.js`: CSP (só scripts do próprio app; conexão só com o app e o Supabase; sem quadros/plugins), anti-clickjacking e referrer reduzido. Fica desligado em localhost/rede local para não quebrar o modo ao vivo; `?csp=1` força para testar.
- 5 `onerror` inline trocados por um ouvinte central (`data-oe`).
- Anti-spam no aparelho: 30 s entre comentários, 5 a cada 10 min, texto repetido na última hora barrado, sugestão de lugar 1 por min e 5 por dia, campo-isca invisível contra robôs.
- Teste novo `v2/tests/seguranca.js` (8 verificações) dentro do `rodar-tudo.sh`.

## Pendente: precisa aplicar no Supabase (não executado)
`agencia/sql/01-…` (pontos protegidos) e `agencia/sql/03-seguranca-anti-spam-anti-fraude.sql`:
- Fraude de check-in: a coluna `day` é escolhida pelo cliente; mandando datas diferentes dá +10 pontos sem limite. O 03 força o dia de Maceió, exige lugar publicado e limita 6 check-ins/dia.
- Anti-spam real no servidor (cliente pode ser burlado): comentários 5/10 min e 30/dia, sem repetir texto, sugestões 5/dia, marcações 40/dia.
- Avatar só pode apontar para o bucket do projeto; nome até 40 caracteres; bucket `avatars` com limite de 2 MB e só JPEG/PNG/WebP (hoje aceita qualquer arquivo).

## Pendente: configurações no painel do Supabase (não dá por SQL)
- Authentication → proteção contra senhas vazadas (ligar).
- Authentication → CAPTCHA (Turnstile ou hCaptcha) no cadastro e limites de e-mail/SMS (anti-criação em massa de contas).
- Authentication → exigir senha mínima de 8 e confirmação de e-mail quando o Resend estiver ligado.
- Conta do dono: ligar verificação em duas etapas (GitHub, Supabase, Apple, Google).
- GitHub: ativar proteção de branch, alertas de segredo (secret scanning) e Dependabot no repositório.
- Android: guardar a chave de assinatura offline; `allowBackup` desligado (agente Nativo).

## Limites honestos
- Meta CSP não aplica `frame-ancestors`; o anti-clickjacking é por script. Cabeçalhos HTTP de verdade exigem hospedagem com `_headers` (Cloudflare/Netlify), não o GitHub Pages.
- Nada impede alguém de ler o JavaScript do app; por isso o servidor (RLS e travas) é quem protege os dados.
- Anti-spam no aparelho é só a primeira barreira; vale mesmo é o SQL 03.
