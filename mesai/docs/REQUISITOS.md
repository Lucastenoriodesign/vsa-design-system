# Produto, design e estado real

## Conceito
Mesaí: descoberta de restaurantes e lanchonetes onde a pessoa pode ir comer presencialmente. Mostrar ambiente, estrutura, fotos, tipo de comida, localização e atributos. O ponto de partida é Cidade Universitária, parte alta de Maceió, AL. Busca por bairro/cidade/estado é direção do produto; a localização atual está fixa e não usa GPS real.

Não é um fluxo de delivery/checkout. Não há venda, pagamento, carrinho nem reserva implementados.

## Marca e direção visual aprovadas
- Nome: Mesaí.
- Logo: mesa simples e expressiva, sem seta. Usar assets/mesai-logo.png; preservar a marca.
- Inspirações: iFood, Uber, Decolar, Google Maps e Airbnb. Hub principal limpo e bonito, com prioridade mobile.
- Cabeçalho: logo alinhada à esquerda e foto do usuário à direita. Sem coração no topo.
- Foto pessoal: site/assets/avatar.jpg, fornecida pelo usuário (pessoa de costas junto ao carro).
- Navegação: Início, Buscar, Em alta, Perfil.
- Título aprovado: “Qual sua vontade de comer hoje?”
- Seção: “Em alta na Cidade Universitária”.
- Removidos: “Onde bateu vontade de comer?”, “Encontre um lugar gostoso para sentar e aproveitar.” e a legenda geral “Exemplos visuais · nomes, fotos e detalhes ilustrativos”.

## Categorias e filtros
Categorias com pratos/fotos reais recortados em círculos pastel: Todos, Regional, Hambúrguer, Café, Pizza, Lanches, Japonesa (valor de filtro Sushi), Açaí e Doces.
Filtros incluem Aceita VR e Aceita pets, além de Tranquilo, Ao ar livre, Família e Presencial.
A grade original aprovada foi incluída em referencias/image(20261109-032203).png. O arquivo tem 1774×887, quatro colunas e duas linhas. Recortes atuais: cerca de 437×437 cada, preservados sem deformação. CSS usa 76×76 e object-fit:contain; manter proporção e visibilidade integral dos pratos. Imagens foram geradas por IA, não são fotos de restaurantes reais.
Referências adicionais IMG_6214(2).jpg e IMG_6215.jpg mostram a direção das categorias.

## Implementado no HTML atual
- Layout responsivo com header, busca, grade de categorias, destaque horizontal e lista.
- 11 fichas ilustrativas: Quintal da Brasa, Brasa & Ponto, Café Manhã Boa, Forno da Praça, Dona Tapioca, Pátio do Sabor, Bendito Cuscuz, Varanda 081, Sushi da Vila, Açaí da Praça, Doce Encontro.
- Filtro por categoria, atributos e texto digitado.
- Modal de detalhes e modal de perfil/salvos.
- Formulário de sugestão adiciona itens localmente.
- Persistência local de favoritos/sugestões com localStorage (mesai-saved e mesai-suggestions).
- Mapa ilustrativo por CSS, com três pins que abrem detalhes.
- Botão flutuante de mapa escondido.

## Lacunas e limitações constatadas no código
- Não existe backend, banco, login, GPS, mapa cartográfico ou rota real. Ver rota exibe aviso de endereço ilustrativo.
- As tabs são rolagem/reset de filtros, não rotas independentes.
- Favoritos possuem lógica, mas .heart{display:none!important} oculta os controles de salvar. Não considerar o fluxo completo.
- Header ainda usa compensação margin-left:-15px na logo; revisar alinhamento baseado no conteúdo real do arquivo.
- Perfil do HTML é painel de salvos, não perfil completo com preferências. As telas Perfil/Filtros desenhadas no Figma são propostas, não funções prontas.
- Notas “Exemplo”, demonstração e fotos ilustrativas ainda aparecem em cards e detalhes. Usuário quer direção v1, mas os dados ainda não são reais; substituir por conteúdo real antes de retirar todas as indicações de demonstração.
- Mapa não está realmente restrito à tela Buscar porque tudo é a mesma página.
- Navegação inferior é escondida por CSS em desktop.
- Não houve revisão visual completa via navegador nesta entrega; checagens anteriores de sintaxe não provam fluxo completo.

## Figma
Arquivo: https://www.figma.com/design/DzIvsbVc0DRF5R5FZsSEnK/MESA%C3%8D---APP
Foram criados frames nativos editáveis de 390×844: Início (3:15), Buscar e mapa (4:2), Resultados (4:46), Em alta (4:91), Perfil (4:127), Detalhe (4:161), Filtros (4:194).
O usuário rejeitou as primeiras telas por falta de fidelidade. A reconstrução continua incompleta: usa emojis no lugar de fotos de categorias, ícones em texto, placeholders para capa/avatar e não reproduz os cards do HTML com fidelidade. Não tratar esses frames como resultado final aprovado. Usar o HTML e assets como referência de produto; corrigir o Figma ou importação posteriormente.

## Futuro
Onboarding/telas de abertura conforme referências anteriores, hub refinado, cadastro de locais e perfis reais, localização e mapa, conta/perfil/favoritos reais. Priorizar web funcional antes de empacotar para lojas. Nenhuma submissão às lojas foi feita.
