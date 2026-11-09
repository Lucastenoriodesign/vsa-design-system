# Mesaí · proposta de planos (rascunho para decisão)

Preços e custos abaixo são **estimativas de trabalho**, não cotações. Confirme valores atuais de cada fornecedor antes de lançar.

## Ideia central
Quem usa o app (consumidor) tem pouco motivo para pagar assinatura num guia local. Quem tem motivo é o **restaurante**, que quer aparecer, ter foto e horário corretos e ser achado. Recomendação: **consumidor grátis, receita vinda dos estabelecimentos**, com um plano premium opcional para o consumidor depois que houver base de usuários.

## DECISÃO: as duas opções valem, lançadas juntas
- Consumidor: Mesaí+ por R$ 9,90/mês ou R$ 79/ano (R$ 6,58/mês, 33% de desconto sobre R$ 118,80).
- Estabelecimentos: Gratuito, Destaque (~R$ 49/mês) e Premium (~R$ 99/mês), valores a validar.
- Na versão atual não há cobrança: a tela Planos só coleta interesse.

## Opção A: consumidor grátis + planos para restaurantes

| | Gratuito | Destaque | Premium |
|---|---|---|---|
| Preço sugerido (a decidir) | R$ 0 | ~R$ 49/mês | ~R$ 99/mês |
| Ficha com endereço e telefone | ✔ | ✔ | ✔ |
| Reivindicar e confirmar o próprio cadastro | ✔ | ✔ | ✔ |
| Confirmar atendimento no local (selo) | ✔ | ✔ | ✔ |
| Horários e fotos próprias (até 3) | — | ✔ | ✔ (até 12) |
| Cardápio em foto ou PDF | — | ✔ | ✔ |
| Aparecer em "Para conhecer na região" | — | ✔ (rodízio) | ✔ (prioridade) |
| Responder comentários | — | ✔ | ✔ |
| Painel com visitas, cliques em rota e salvos | — | básico | completo |
| Selo "Parceiro Mesaí" | — | — | ✔ |

Regra de ouro: **destaque pago nunca altera avaliação, comentário ou selo de confirmação**, e deve vir identificado como "Parceiro".

## Opção B: consumidor com plano premium (só depois de ter base)

| | Grátis | Mesaí+ |
|---|---|---|
| Preço sugerido | R$ 0 | ~R$ 9,90/mês ou ~R$ 79/ano |
| Busca, filtros, rota, salvos, comunidade | ✔ | ✔ |
| Listas ilimitadas e compartilháveis | até 3 | ✔ |
| Alertas de novos lugares | — | ✔ |
| Sem anúncios de parceiros | — | ✔ |

Só faz sentido com milhares de usuários ativos. Não recomendo começar por aqui.

## Estimativa de custo (ordem de grandeza, a validar)

| Item | Como cobra | Estimativa inicial |
|---|---|---|
| Servidor e banco (Supabase) | plano mensal fixo + uso | plano gratuito para testar; plano pago na casa de US$ 25/mês para valer |
| Moderação por IA (Claude, modelo pequeno) | por volume de texto | frações de centavo por comentário; centenas de reais por mês só com volume muito alto |
| Armazenar fotos | por GB | baixo no início (dezenas de fotos) |
| Mapa (Google Maps/Places) | por requisição, com cota mensal gratuita | pode ser zero no início; cresce com uso |
| Cobrança (Pix/cartão) | % por transação | em geral alguns % por venda |
| Publicar nas lojas | taxa anual de desenvolvedor | Apple e Google cobram anuidade/taxa; confirmar valor |

Conclusão provisória: o custo fixo inicial é baixo (mais o servidor). Com **15 a 20 restaurantes pagando Destaque (~R$ 49)** já se cobre o servidor e a moderação com folga. O desafio real é conseguir os restaurantes, não o custo técnico.

## O que preciso que você decida
1. Opção A, B ou só grátis por enquanto?
2. Preços finais (ou faixas) de cada plano.
3. Posso usar o nome "Parceiro Mesaí" e a regra de transparência do destaque?
4. Início: só Gratuito + Destaque, com Premium depois?

## O que o app já tem e o que falta para vender isso
Já existe: cadastro real, fila de fotos, painel de pendentes, comunidade com aprovação.
Falta: contas de usuário e de dono de restaurante, banco de dados, cobrança (Pix/cartão), painel do restaurante e termos de uso/privacidade.
