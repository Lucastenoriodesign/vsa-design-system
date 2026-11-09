# Instruções de continuidade — Mesaí

Você está continuando o app Mesaí, de Lucas Tenório, Maceió/AL. Leia REQUISITOS.md e examine site/index.html e assets antes de alterar o design. Preserve a marca e o foco em descoberta de restaurantes presenciais e seus ambientes.

## Objetivo
Evoluir o protótipo funcional atual para uma v1 bem acabada, mobile primeiro. O usuário quer experimentar as funções de verdade. Evite refazer a identidade do zero ou trocar o layout por telas genéricas.

## Prioridades de execução
1. Abrir o HTML e revisar visualmente em celular e desktop. Ler código, identificar o que realmente funciona e corrigir as lacunas abaixo.
2. Consolidar um design system consistente preservando fundo creme, coral e marca Mesaí. Fotografias de categorias devem ser quadradas e proporcionais, pratos inteiros e dimensões iguais. Não esticar imagens nem comprimir um recorte retangular para quadrado.
3. Transformar a navegação em telas/estados coerentes. Hoje Início, Buscar e Em alta são atalhos/rolagens da mesma página; Perfil é um modal.
4. Buscar deve trazer restaurantes em alta próximos, filtros e mapa com opção de abrir/fechar. Não colocar mapa flutuante na home.
5. Corrigir favoritos: existe código de salvamento e leitura no localStorage, mas os corações foram escondidos globalmente. O pedido foi remover o coração do cabeçalho; decidir um acesso claro para salvar nos detalhes sem reintroduzir esse coração no cabeçalho.
6. Usar dados e fotos ilustrativos com transparência até haver cadastro real. Não inventar estabelecimentos reais ou avaliações, distância e localização verificadas. Alguns frames Figma contêm estrelas/distâncias ilustrativas que não existem no site.
7. Concluir revisão de fluxo, acessibilidade, estados vazios, feedback e persistência antes de afirmar que tudo funciona.

## Comunicação
Executar o trabalho e mostrar resultado concreto. Não encerrar turnos apenas prometendo fazer. Relatar de forma honesta o que está pronto e o que falta. O usuário já autorizou continuidade, correções e refinamento.

## Entrega
Uma versão web funcional e bem acabada primeiro; publicação Play Store/App Store é etapa futura, ainda sem implementação nativa ou empacotamento. Não presumir backend/autenticação já existentes. Se mudar a stack, preservar o conteúdo e comportamento e explicar a necessidade.
