# Comunidade e moderação do Mesaí

Data: 22/11/2026. Fonte: leitura de `v2/js/app.js` e `v2/js/sync.js` (e `v2/js/api.js` para confirmar as chamadas). Não consultei o banco, então o que está em `private.banned_terms` e no trigger `comments_moderate_trg` não foi verificado.

## 1. Diretrizes da comunidade (texto para o app)

**A Comunidade do Mesaí serve para ajudar quem vai comer no local. Conte como foi, de forma honesta e com respeito.**

### O que pode
- Dica: "vá cedo, as mesas do fundo são mais tranquilas".
- Elogio: atendimento, comida, ambiente, preço.
- Reclamação educada, sobre algo que você viveu. Fale do que aconteceu, sem atacar ninguém.
- Falar do lugar, do prato e do serviço.

### O que não pode
- Xingamento e ataque pessoal a funcionários, donos ou outros usuários.
- Ameaça, discriminação ou assédio.
- Dados pessoais de qualquer pessoa: CPF, telefone, endereço de casa, foto de alguém sem permissão.
- Acusação grave sem prova (por exemplo, dizer que o lugar vende comida estragada).
- Links, propaganda e spam.
- Falar em nome de um lugar que não é seu, ou fingir ser outra pessoa.
- Avaliação inventada ou combinada (do dono, de parentes ou paga).
- Conteúdo ilegal, sexual ou violento.

### Como denunciar
- Hoje o app não tem botão de denúncia. Até ele existir: escreva para beyonddesign.empresa@gmail.com com o texto e o lugar da mensagem.
- Responderemos em até 7 dias úteis (prazo sugerido, o Lucas confirma).
- Meta para o app: botão "Denunciar" em cada mensagem (veja as lacunas).

### O que acontece com mensagem barrada
- Mensagem com palavra proibida não é publicada. O app avisa: "Seu comentário não foi publicado. Revise as palavras e tente de novo." Você pode editar e enviar de novo.
- Mensagem publicada que a equipe considerar fora das regras é removida.
- Quem repete a infração pode perder o acesso para comentar. Em caso grave, a conta pode ser suspensa.
- Pedidos de dono de estabelecimento: se o conteúdo for falso ou expuser dados, pode ser removido. Opinião honesta, mesmo negativa, fica.

### Seus dados (LGPD)
- Sua mensagem fica ligada à sua conta e aparece para os outros como "Membro". Seu e-mail nunca aparece.
- Você pode apagar cada mensagem, ou a conta inteira em Perfil > Excluir minha conta. Tudo é apagado.
- Detalhes na Política de Privacidade (`privacidade.html`).

## 2. Como a aba Comunidade funciona hoje

**Envio** (`app.js`, ~linha 289): formulário com texto (máx. 280 caracteres), lugar opcional e tipo. Sem conta, o app pede para entrar. Com conta, `API.addComment` grava em `comments` (Supabase) com `user_id`, `place_id`, `kind`, `body` e `flags`.

**Filtro no navegador** (`screen()`, `app.js` ~linha 200): só gera avisos (flags), não bloqueia. Procura: xingamentos, ameaça, CPF ou telefone, link, acusação grave (intoxica, vencid, barata, rato) e texto em maiúsculas.

**Filtro no servidor**: segundo o CLAUDE.md, `private.banned_terms` + trigger `comments_moderate_trg`. É ele que barra de fato, e o app trata a recusa com a mensagem "Seu comentário não foi publicado...". Não verifiquei o conteúdo.

**Leitura** (`sync.js` `syncComments`): busca os 60 mais recentes com `status=aprovado`, mais os 60 do próprio usuário (qualquer status). O dono vê ainda os `pendente`. Autor aparece sempre como "Membro".

**Exclusão**: o autor apaga o próprio comentário (`data-delpost`). O dono (admin) remove qualquer um pelo painel "Pendentes" (`setStatus` rejeitado).

**Sem conta no servidor (modo local)**: posts ficam em `localStorage` (`mesai-posts`). `SEED` está vazio (`var SEED=[]`), então não há post de exemplo. Isso está certo, pois ainda não há post real.

**Curtir**: só no modo local. Com Supabase, o botão não aparece.

## 3. Lacunas de moderação

1. **Texto desatualizado e contraditório.** A Central de ajuda diz "Todo comentário passa por aprovação antes de ficar visível", e a notificação diz "Respostas e aprovação dos meus comentários". Mas o painel diz que "os comentários são publicados na hora, com filtro automático". Escolher um e corrigir os outros dois (decisão já tomada: automático).
2. **Não existe denúncia.** Falta botão "Denunciar" e tabela de denúncias (ex.: `reports`). O dono só descobre abuso se ler o feed. Passar ao `backend-supabase` e ao front.
3. **Sem bloqueio de usuário nem suspensão.** Só dá para apagar o comentário, não impedir quem reincide. Falta campo `suspended` em `profiles` e checagem na RLS.
4. **Filtro do cliente é só aviso, e o do servidor não foi auditado.** Precisa conferir a lista, se normaliza acento, maiúscula, letras repetidas ("p0rra", "meeerda") e espaços. Se o filtro no servidor for só correspondência exata, é fácil de driblar.
5. **Sem limite de envio.** Nada impede flood ou spam. Sugerir limite por usuário (ex.: 5 por hora) no banco.
6. **Painel de moderação quase vazio por desenho.** Se tudo é publicado na hora, `pendente` raramente aparece. O dono não tem fila das mensagens publicadas com flags. Sugerir: mensagem com flag (link, CPF/telefone, acusação grave) entra como `pendente` em vez de publicar.
7. **CPF e telefone** só são sinalizados no cliente. Se o servidor não barrar, dado pessoal fica público. Prioridade por causa da LGPD.
8. **Sem política publicada.** As diretrizes acima não estão em lugar nenhum do app. Sugerir link no formulário e em `termos.html`. Quem edita o app é o front.
9. **Reclamação sobre estabelecimento**: sem canal de contestação para o dono do lugar (risco jurídico). O e-mail serve de canal provisório.
10. **Autor sempre "Membro".** Bom para privacidade, mas dificulta saber quem reincide (só o dono vê o `user_id`). Aceitável.
11. **Imagem e perfil:** foto de perfil no bucket `avatars` não tem moderação. Não vi o fluxo de revisão.
12. **Termos do filtro:** o cliente trata "rato" e "barata" como acusação, o que dá falso positivo (ex.: "tapioca barata"). Trocar por "barata na comida", ou revisar.

## 4. Planilha de posts reais

`agencia/relatorios/modelo-posts-reais.csv` está só com o cabeçalho. Nenhuma linha de exemplo foi criada, para não haver post inventado.

Como preencher:
- lugar: nome como está no app.
- tipo: dica, elogio ou reclamação.
- texto: palavras da pessoa, até 280 caracteres.
- autor_apelido: como a pessoa quer ser chamada (pode ficar vazio).
- data: AAAA-MM-DD do relato.
- autorizacao: sim ou não. Só entram linhas com "sim", e guarde a prova (print da conversa).
- origem: onde o relato foi dado (WhatsApp, pessoalmente, Instagram, e quem coletou).

Observação: o app grava o post na conta de quem envia. Para semear, o Lucas ou o autor real precisa postar com a própria conta, ou o `backend-supabase` insere com a identificação correta. Postar em nome de outra pessoa sem avisar não deve ser feito. Confirmar com o Lucas.
