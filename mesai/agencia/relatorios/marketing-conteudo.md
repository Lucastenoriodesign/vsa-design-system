# Marketing e Conteúdo — rascunhos de lançamento do Mesaí

Status: RASCUNHO. Nada foi publicado nem enviado. Tudo abaixo precisa da confirmação do Lucas.
Data: 22/11/2026.

## 0. Fatos do app que podem ser citados (conferidos em `v2/js/data.js` e `v2/js/app.js`)

- **38 lugares publicados** (`pub:true`) hoje. Há 40 cadastros; 2 estão despublicados (Kidelícia e Self Serv Talharim, do Farol). O número muda: **reconferir antes de postar**.
- Bairros/regiões presentes: Cidade Universitária, Graciliano Ramos (conjunto), Grand Jardim, Eustáquio Gomes, Loteamento Acauã e Shopping Pátio Maceió.
- Categorias na home: Restaurante, Hamburgueria, Pizzaria, Lanchonete, Pastelaria, Cafeteria e padaria, Açaíteria. **Hoje não há nenhum lugar publicado na categoria Açaíteria**, então não a destaque nos textos.
- Filtros: Aberto agora, Tem telefone, No shopping, Ambiente que marquei, Aceita criança, Aceita pet.
- "Aberto agora": só funciona para lugares com horário cadastrado (**17 dos 38** hoje). Vários horários são do shopping ou de entrega e estão marcados "confirmar". Por isso não escrever "todos os lugares mostram se estão abertos".
- Criança e pet: só aparecem com fonte verificável; na maioria dos lugares está "Não informado". Não prometer.
- Mesaí+ : tela e banner existem, **não há cobrança real**. Nos textos: não falar de preço, plano pago, assinatura nem de listas compartilháveis/alertas/pontos que viram vantagens (não existem ainda). Quando o assunto for o Mesaí+, usar só "teste" e "ainda não cobra".
- Dados vêm de listagens públicas, sem visita física (cabeçalho do `data.js`). Por isso nada de "avaliado por nós", "o melhor", nota ou promessa de qualidade.
- Link do app: https://lucastenoriodesign.github.io/vsa-design-system/ (endereço provisório; ver item pendente de link melhor).
- Android: APK v1.0 em `download/mesai.apk`. iPhone: sem app na App Store; só pelo Safari.

Não citei nomes de lugares nas legendas para não depender de foto/horário ainda marcado "confirmar" nem de autorização de donos. Se o Lucas quiser destacar um lugar, ele indica e eu reviso o dado.

---

## 1. Instagram: 5 legendas

**Legenda 1 — Apresentação**
> Parte alta de Maceió, fome e nenhuma ideia de onde ir?
> O Mesaí é um guia de restaurantes, lanchonetes e cafés pra comer NO LOCAL. Não é delivery. É pra sentar, pedir e aproveitar.
> Começamos por Cidade Universitária, Graciliano Ramos e vizinhos, com 38 lugares no app.
> Link na bio.
> #Maceió #ParteAlta #CidadeUniversitária #GracilianoRamos #ondecomerMaceió

**Legenda 2 — Filtro "Aberto agora"** (sugestão de vídeo de tela: abrir o filtro)
> Bateu a fome e você não sabe se tá aberto?
> No Mesaí tem o filtro "Aberto agora". Ele mostra os lugares que têm horário cadastrado e estão funcionando naquele momento.
> Ainda estamos completando os horários, então vale confirmar com o lugar. Mas já ajuda a não ir até lá e dar com a porta fechada.
> Link na bio.
> #Maceió #ParteAlta #AbertoAgora

**Legenda 3 — Categorias**
> Hamburgueria, pizzaria, lanchonete, pastelaria, restaurante, cafeteria e padaria. Tudo na parte alta, tudo pra comer no local.
> Escolhe a categoria no Mesaí e vê o que tem perto de você.
> Link na bio.
> #ComerEmMaceió #ParteAlta #Mesaí

**Legenda 4 — Bairrista / shopping**
> Parte alta também é rolê. Tem lugar no Graciliano, na Cidade Universitária e até no Shopping Pátio.
> Quer só o que fica no shopping? Tem filtro "No shopping". Quer ligar antes de ir? Filtro "Tem telefone".
> Tudo no Mesaí. Link na bio.
> #Maceió #ShoppingPátio #GracilianoRamos

**Legenda 5 — Convite para sugerir**
> Falta um lugar que você ama na parte alta?
> O Mesaí está começando e vai crescendo com a ajuda de quem mora aqui. Abre o app, conta pra gente e a gente confere antes de publicar.
> Link na bio.
> #Maceió #ParteAlta #Mesaí

(Legenda 5 pressupõe a função "sugerir lugar": existe a tabela `suggestions` no Supabase, mas **Dev deve confirmar que há tela no app antes de postar**. Se não houver, trocar por "chama a gente no direct".)

### Roteiro curto de Reel (15 s) para a legenda 2
1. 0–3 s: tela cheia de texto "Fome na parte alta?"
2. 3–10 s: gravação de tela abrindo Filtros e ligando "Aberto agora".
3. 10–15 s: "Mesaí. Pra comer no local. Link na bio."
Usar só lugares e fotos que já estão no app e passaram pela revisão (Fotos/Ambiente).

---

## 1b. WhatsApp: 3 mensagens (enviar só com ok do Lucas, a contatos que pediram ou conhecem)

**Mensagem 1 — Amigos e família**
> Oi! Lancei o Mesaí, um guia de lugares pra comer NO LOCAL na parte alta de Maceió (Cidade Universitária, Graciliano Ramos e vizinhos). Já tem 38 lugares. Dá uma olhada e me diz o que achou: https://lucastenoriodesign.github.io/vsa-design-system/

**Mensagem 2 — Grupos de bairro/condomínio**
> Pessoal da parte alta, apresento o Mesaí: um guia gratuito de restaurantes, lanchonetes e cafés pra comer no local (não é delivery). Dá pra filtrar por categoria e por "Aberto agora". Link: https://lucastenoriodesign.github.io/vsa-design-system/
> Se faltar algum lugar, me avisa que a gente confere e inclui.

**Mensagem 3 — Convite com instruções**
> Quer testar o Mesaí? No Android, baixa o app pela página e instala. No iPhone, abre o link no Safari, toca em Compartilhar e em "Adicionar à Tela de Início". Link: https://lucastenoriodesign.github.io/vsa-design-system/
> Ainda está no começo; qualquer erro ou lugar faltando, me conta.

Observação: "gratuito" vale hoje porque o Mesaí+ não cobra. Se o Lucas preferir não prometer isso para o futuro, trocar por "sem custo por enquanto".

---

## 2a. Briefing da imagem de prévia do link (Open Graph, 1200x630)

- **Quem faz:** o setor de Design/Marca produz a arte; Dev coloca as tags `og:image`, `og:title`, `og:description` e `twitter:card` no `index.html` (subir `?v=` e `VERSAO` do `sw.js`). Este setor só entrega o briefing e o texto.
- **Formato:** 1200x630 px, JPEG ou PNG, menos de 300 KB. Manter o conteúdo importante dentro de uma área central de ~1000x500 (WhatsApp e Instagram cortam as bordas).
- **Conteúdo:**
  - Logo do Mesaí (a existente, sem alterar a identidade) + cores de `css/tokens.css`.
  - Título grande: **"Onde comer na parte alta de Maceió"**.
  - Subtítulo: **"Guia pra comer no local. Não é delivery."**
  - Rodapé pequeno: "Cidade Universitária · Graciliano Ramos · Shopping Pátio".
  - Opcional: uma captura real da home do app dentro de um celular. Só com lugares/fotos já aprovados; não usar foto de prato como destaque nem foto de terceiro sem crédito.
- **Não colocar:** número de estrelas, "o melhor", preço, Mesaí+, "grátis para sempre", selos de loja de apps que ainda não existem.
- **Texto das tags:**
  - `og:title`: "Mesaí — onde comer na parte alta de Maceió"
  - `og:description`: "Guia de restaurantes, lanchonetes e cafés pra comer no local. Filtre por categoria e por Aberto agora."
- Validar depois de publicar: colar o link no WhatsApp e no Instagram (o cache de prévia demora a atualizar; trocar o nome do arquivo ajuda).

## 2b. Texto da página "Como instalar"

Sugestão de arquivo: `v2/como-instalar.html` (Dev cria; este texto é o conteúdo). Tom direto, com passos curtos e uma captura de tela por passo (o Design faz).

---
**Título:** Como instalar o Mesaí

**Abertura:** O Mesaí funciona no seu celular como um app. Escolha o seu aparelho.

### Tenho Android
1. Toque em **"Baixar app Android"** (arquivo `mesai.apk`, versão 1.0).
2. Quando terminar, abra o arquivo baixado.
3. O Android pode avisar que o app vem de fora da Play Store. Toque em **Configurações** e permita a instalação desta fonte (só para esse arquivo).
4. Volte e toque em **Instalar**. Pronto, o ícone do Mesaí aparece na sua tela.

Dúvida de segurança? O arquivo vem da página oficial do Mesaí. Se aparecer algum aviso do navegador, é normal para apps fora da loja.

> Pendente de conferência pelo setor Lojas/Nativo: se o aviso e o nome do menu variam por marca de celular (Samsung, Motorola etc.) e se o APK atual instala em Android recente. Não testei a instalação.

### Tenho iPhone
O app para iPhone ainda não está na App Store. Por enquanto você usa o Mesaí pelo Safari e coloca o ícone na tela:
1. Abra o link do Mesaí **no Safari** (não funciona igual em outros navegadores).
2. Toque no botão **Compartilhar** (o quadrado com a seta pra cima, na barra de baixo).
3. Role e toque em **Adicionar à Tela de Início**.
4. Confirme em **Adicionar**. O ícone do Mesaí aparece na tela, e ele abre como um app.

### Perguntas rápidas
- **Precisa de cadastro?** Para ver os lugares, o texto atual do app é quem manda; Dev confirmar antes de publicar esta resposta.
- **É delivery?** Não. O Mesaí é pra comer no local.
- **Tem custo?** Hoje o Mesaí não cobra nada. (O Mesaí+ aparece no app, mas ainda não existe cobrança.)
- **Deu problema?** Fale com a gente: beyonddesign.empresa@gmail.com
---

---

## 3. Descrição para as lojas

(Só serve quando as contas existirem; Apple Developer está aguardando D-U-N-S e a Play Console não foi mencionada. Enviar algo às lojas exige confirmação do Lucas.)

**Nome:** Mesaí
**Subtítulo / título curto (até ~30 caracteres):** Onde comer em Maceió

**Descrição curta (até 80 caracteres):**
> Guia pra comer no local na parte alta de Maceió. Não é delivery.

**Descrição longa:**
> O Mesaí é um guia de restaurantes, lanchonetes e cafés para quem quer comer no local, sem pedir delivery. Começamos pela parte alta de Maceió: Cidade Universitária, Graciliano Ramos e vizinhos.
>
> O que você encontra:
> - Lugares organizados por categoria: restaurante, hamburgueria, pizzaria, lanchonete, pastelaria e cafeteria e padaria.
> - Filtros para achar o que importa: Aberto agora, Tem telefone, No shopping, Aceita criança e Aceita pet.
> - Botão para traçar a rota até o lugar, ligar e compartilhar.
> - Salvar seus lugares favoritos.
>
> Sobre os dados: reunimos informações de listagens públicas e vamos confirmando uma a uma. Quando não temos uma informação confirmada, mostramos "Não informado" em vez de chutar. Horários, criança e pet só aparecem quando há fonte.
>
> O Mesaí está no começo e cresce com a ajuda de quem mora aqui. Falta um lugar? Conte pra gente.
>
> Contato: beyonddesign.empresa@gmail.com

Pontos para a conferência antes de enviar:
- "Salvar favoritos", "traçar rota", "ligar" e "compartilhar" existem hoje no detalhe do lugar (commit 847b72b e tabela `saved_places`). O QA deve testar antes de afirmar na loja.
- Não incluir Mesaí+ na descrição enquanto não houver cobrança real e compra dentro do app no iPhone.
- Apple e Google pedem política de privacidade (já existe `privacidade.html`) e, para app com comentários de usuários, regras de conteúdo: ver com Comunidade/Moderação e Legal.
- Capturas de tela: só com lugares/fotos aprovados.

---

## 4. Calendário de 2 semanas (23/11 a 06/12/2026) — DEPENDE de aprovação e do link estar definido

Ritmo: 4 posts por semana no feed/Reels, 1 story diário opcional (enquete ou bastidor). Horário sugerido: 11h30 (almoço) e 18h (jantar); testar e ajustar.

| Dia | Formato | Conteúdo | Observação |
|---|---|---|---|
| Seg 23/11 | Feed (imagem) | Legenda 1: apresentação do Mesaí | Precisa da prévia de link pronta (ou postar sem) |
| Ter 24/11 | Story | "Você come no local ou pede delivery?" enquete + link | |
| Qua 25/11 | Reel | Legenda 2: filtro Aberto agora (gravação de tela) | Só mostrar lugares com horário cadastrado |
| Qui 26/11 | Story | Passo a passo "Como instalar" (Android) | Só depois da página existir |
| Sex 27/11 | Feed (carrossel) | Legenda 3: categorias, uma lâmina por categoria | Sem Açaíteria (nenhum lugar ainda) |
| Sáb 28/11 | Story | Compartilhar post do dia + pedir "o que está faltando?" | |
| Dom 29/11 | Descanso | Responder mensagens e comentários | |
| Seg 30/11 | Story | Passo a passo "Como instalar" (iPhone, Safari) | |
| Ter 01/12 | Feed | Legenda 4: shopping e telefone | |
| Qua 02/12 | Reel | "3 jeitos de decidir onde comer" usando os filtros | Roteiro a definir com o Lucas |
| Qui 03/12 | Story | Caixa de perguntas: "o que você quer ver no Mesaí?" | |
| Sex 04/12 | Feed | Legenda 5: convite para sugerir lugar | Confirmar antes que a função existe |
| Sáb 05/12 | Story | Resumo da semana: o que o app mostra hoje (nº de lugares atualizado) | Reconferir número em `data.js` |
| Dom 06/12 | Descanso | Balanço: o que engajou, o que repetir | Relatório ao Lucas |

WhatsApp: mensagem 1 na segunda (23/11), mensagem 2 na quarta (25/11) e mensagem 3 sempre que alguém perguntar como instalar.

Regras do calendário:
- Cada post com lugar específico só entra depois de o setor Dados/Fotos aprovar o dado e a foto (ambiente primeiro; foto de terceiro com crédito; autorização dos donos pendente em várias fotos).
- Nada de "melhor", nota ou comparação entre lugares.
- Se o Mesaí+ for citado em algum story, só dizer que o teste existe e que ainda não cobra.

---

## 5. Pendências e dúvidas para o Lucas

1. Aprova o tom e os textos? Pode trocar o termo "gratuito" por "sem custo por enquanto".
2. O link atual (GitHub Pages) vale para o lançamento ou espera o domínio/repositório próprio? A prévia do link e as legendas dependem disso.
3. Quer destacar algum lugar específico (nome e foto)? Eu aviso antes quais dados ainda estão "confirmar".
4. Agente de Dev precisa: criar `como-instalar.html`, tags Open Graph, confirmar a tela de "sugerir lugar" e se o app exige cadastro para ver os lugares.
5. Agente de Design precisa da arte 1200x630 (briefing acima) e das capturas para a página de instalação.
6. Não testei nada no app (apenas li `data.js` e `app.js`); as afirmações sobre telas e botões vêm da leitura do código e de commits recentes.
