# Mesaí — contexto para o Claude Code

App de Lucas Tenório (MESAÍ APP LTDA, CNPJ 45.165.617/0001-03, Maceió/AL). Guia de restaurantes, lanchonetes e cafés **para comer no local** (não é delivery), começando pela parte alta de Maceió (Cidade Universitária, Graciliano Ramos e vizinhos). Fale com o Lucas em português, direto e sem enrolação.

## Onde está cada coisa
- `v2/` — **o app** (HTML/CSS/JS puro, sem build). É o que vai ao ar.
  - `index.html`, `css/tokens.css` (cores e medidas da marca), `css/app.css`, `js/app.js` (telas e lógica), `js/api.js` (Supabase via REST), `js/sync.js` (login, conta, comentários), `js/native.js` (ponte com recursos do celular), `js/data.js` (lugares locais).
  - `termos.html`, `privacidade.html` (LGPD, contato beyonddesign.empresa@gmail.com).
  - `download/mesai.apk` — app Android v1.0 publicado para download.
  - `sw.js` — service worker em modo **rede primeiro**. A cada mudança de CSS/JS: subir o `?v=` em `index.html` **e** a `VERSAO` do `sw.js`.
  - `tests/smoke.js` — teste rápido com Playwright (`python3 -m http.server 8124` em `v2/` e depois `BASE=http://localhost:8124 node tests/smoke.js`). Duas falhas antigas esperadas: ele ainda supõe check-in de 10 pontos e moderação manual — atualizar o teste, não o app.
- `native/` — app nativo com **Capacitor** (iOS e Android). `npm run sync` copia `v2/` para `www/` e sincroniza. Ver `native/README.md`.
  - ID do app: `com.mesaiapp.app`. Ícone e splash gerados de `native/assets/`.
  - Assinatura Android: `android/keystore.properties` + `mesai-release.jks` ficam **fora do Git** (o Lucas tem o zip com a chave e a senha). Sem eles não há como gerar atualização do APK.
  - iOS: o Mac do Lucas tem macOS antigo e o Xcode atual não instala; alternativa é build na nuvem. Distribuição no iPhone depende da conta Apple Developer (D-U-N-S pedido em 16/11/2026, aguardando).

## Ver ao vivo (iPhone ao lado do terminal)
- Quando o Lucas pedir "modo ao vivo": rode `./dev/ao-vivo.sh` em segundo plano (serve `v2/` em http://localhost:8124 com recarga automática via live-server e abre `dev/iphone.html`, um iPhone com o app dentro). Detalhes em `dev/README.md`.
- `?primeiro-acesso=1` na URL mostra as boas-vindas de novo.

## Publicação
- Site: https://lucastenoriodesign.github.io/vsa-design-system/ — publica sozinho pelo workflow `.github/workflows/mesai-pages.yml` a cada push na branch `claude/mesai-projeto-continuacao-xavx7b` (pasta `mesai/v2`).
- Supabase: projeto `qheadmopevmckkmugugy`. Tabelas `places`, `profiles`, `comments`, `checkins`, `saved_places`, `ambience_marks`, `suggestions`, `admins`; bucket `avatars`. Tudo com RLS. Moderação **automática** por filtro de palavras (`private.banned_terms` + trigger `comments_moderate_trg`). Exclusão de conta pela função `public.delete_my_account()` (bloqueada para a conta dona).
- Papéis: só DONO (o Lucas, tabela `admins`) e USUÁRIO.

## Decisões já tomadas (não desfazer sem o Lucas pedir)
- **Mensalidade de volta** (decisão do Lucas em 16/11/2026): tela do Mesaí Plus no fim das boas-vindas, banner do Mesaí+ e "Planos" no Perfil estão ativos. Ainda **não há cobrança real** (o texto da tela diz isso). Antes de cobrar: os recursos prometidos (listas compartilháveis, alertas de lugar novo, pontos que viram vantagens) precisam existir, e no iPhone a cobrança tem que ser pela compra dentro do app da Apple.
- Boas-vindas com 3 telas (Descobrir, Comunidade, Salve e vá), aprovadas pelo Lucas. Ilustrações ainda provisórias.
- Hub da home: saudação pelo horário de Maceió + bairro + sino; categorias 4×2 no singular (Restaurante, Hamburgueria, Pizzaria, Lanchonete, Pastelaria, Cafeteria e padaria, Açaíteria); depois banners; depois o resto.
- Notificações são montadas com dados reais (lugar do dia, lugares novos, pontos). Nada de exemplo inventado.
- Crianças/pets (`kid`, `pet`) e coordenadas (`lat`, `lng`) só com fonte verificável; sem fonte, fica "Não informado".

## Agência (um agente por setor)
- Os agentes ficam em `.claude/agents/` e o mapa está em `AGENCIA.md` (dados, fotos, dev, QA, design, backend, comunidade, marketing, legal, nativo/lojas). A sessão principal coordena; antes de publicar, o `qa-testes` reporta.

## Regras de trabalho
- Nunca inventar lugar, avaliação, foto, horário, preço ou telefone. Só publicar lugar verificado.
- Fotos de cada lugar (`fotos` em `v2/js/data.js`): capa = ambiente presencial (salão, mesas, fachada); fotos de prato só depois. Sem foto do ambiente, avisar o Lucas em vez de usar prato como capa sem avisar. Formato 4:3, ~1200x900, JPEG otimizado em `v2/assets/places/`; foto de terceiro leva crédito (`fs`).
- Pedir confirmação antes de: criar contas, mexer em cobrança, apagar dados, enviar algo às lojas, mudar a identidade visual.
- Testar antes de commitar (sintaxe JS, Playwright em tamanho de celular) e dizer com honestidade o que não foi testado.
- Commits em português, claros.

## O que falta para a V1
1. Mais lugares (meta ~60 na parte alta) com foto, coordenada e horário.
2. E-mail de confirmação do Supabase (limite de ~2/hora no plano grátis): desligar a confirmação ou ligar o Resend.
3. Link mais apresentável (repositório `mesai` próprio ou domínio mesai.com.br).
4. Semear a comunidade com posts reais.
5. Ilustrações finais das boas-vindas, imagem de prévia do link (WhatsApp/Instagram), página "Como instalar".
6. Push notifications (precisa Firebase e conta Apple).
