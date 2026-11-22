# Levantamento de fotos de ambiente (22/11/2026)

Escopo: 40 registros em `v2/js/data.js`, só os `pub:true` (39). Nada foi baixado nem editado.
Método: leitura do data.js, conferência visual das capas locais e buscas na web. A busca web achou **poucas fontes novas** (Instagram não aparece bem em buscador; nenhum perfil oficial foi confirmado). Handles abaixo só entram quando já estão em `fs` no data.js; o resto fica "a localizar no Instagram pelo Lucas".

## A. Sem foto nenhuma (foto = null)
| Lugar | Situação | Fonte candidata | Direitos / observação |
|---|---|---|---|
| mcz-cu-001 JK Delícias | sem foto; só logo (Linktree) | https://linktr.ee/jkdeliciapizzaria (logo, não serve) | Procurar Instagram oficial; pedir ao dono. Atenção: iFood lista endereço diferente. |
| mcz-cu-004 O Bodão | sem foto | Busca web: nada confirmado | Fotografar / pedir ao dono. |
| mcz-cu-013 Beef Boss | sem foto | Busca web: nada (só cardápios) | Fotografar / pedir ao dono. |
| mcz-cu-018 Dom Angelo Pizzaria | sem foto | Nada confirmado (resultados eram de Campinas-SP: não usar) | Fotografar / pedir ao dono. |
| mcz-cu-021 Topadão Pastelaria | sem foto | Galeria RestaurantGuru (sem URL direta) | Foto de usuário de agregador: sem autorização. Citada em TNH1 (Nide Lins), mas foto de jornal é protegida. Fotografar. |
| mcz-cu-022 Padaria Graciliano | sem foto | https://padariagraciliano.com/ (site oficial, imagens de produto em wp-content/uploads/2025/11/) | Site é do próprio lugar (autorizável), mas as imagens são de produto e não se prova que são reais. Procurar no site/Instagram foto de salão/fachada; senão fotografar. |
| mcz-cu-023 GSL | sem foto | Nada | Fotografar / pedir ao dono. |
| mcz-cu-026 Subway (Pátio) | sem foto | Página da loja no https://www.patioshoppingmaceio.com.br/ | Só logotipo na página. Fotografar a loja (praça de alimentação) com autorização do shopping. |
| mcz-cu-027 Dom da Empada (Pátio) | sem foto | idem | idem |
| mcz-cu-028 Executivos Grill (Pátio) | sem foto | idem | idem |
| mcz-cu-030 Frango Favorito | sem foto | Nada | Fotografar / pedir ao dono. |
| mcz-cu-031 Duda Fest | sem foto | Nada (busca só trouxe eventos homônimos) | Fotografar. |
| mcz-cu-032 Divina Grelha | sem foto | Nada (não confundir com Divina Gula, Stella Maris) | Fotografar. |
| mcz-cu-033 Compadre Churrascaria | sem foto | Só listagem Bendito Guia (sem foto) | Fotografar. |
| mcz-cu-035 Burger King (Pátio) | sem foto | https://www.patioshoppingmaceio.com.br/lojas/burger-king | Franquia: pedir autorização ao shopping/gerente ou fotografar a loja. |
| mcz-cu-036 KFC (Pátio) | sem foto | .../lojas/kfc | idem |
| mcz-cu-037 Bob's (Pátio) | sem foto | .../lojas/bobs | idem |
| mcz-cu-038 McDonald's (Pátio) | sem foto | .../lojas/mc-donalds | idem |
| mcz-cu-039 Divino Fogão (Pátio) | sem foto | .../lojas/divino-fogao | idem |

## B. Capa é foto de prato (ambiente passa a primeiro)
| Lugar | Situação | Fonte candidata | Direitos / observação |
|---|---|---|---|
| mcz-cu-010 Feijoada da Naza | capa `feijoada-naza-1.jpg` = prato (bife com ovo); fs = busca iFood | Instagram oficial: não localizado; matéria TNH1 "Feijoada da Naza, estrela do Graciliano" | Foto de jornal é protegida. Fotografar salão/fachada (Rua 69, quadra R6, nº 40). |
| mcz-cu-016 O Passaporte | capa `passaporte-1.jpg` = sanduíche; fs = busca iFood | Nada localizado | Fotografar ou pedir ao dono. |
| mcz-cu-029 Taichi (Pátio) | capa `taichi-1.jpg` = sushi; fs = busca iFood | Página da loja no site do Pátio | Fotografar a loja. |
| mcz-cu-019 Sandubaria Del Lanches | capa OK (fachada); mas `fotos[1]` é hotlink de prato do Tripadvisor | Instagram já em fs: https://www.instagram.com/sandubariadellanches/ | Trocar o hotlink do Tripadvisor por foto própria/Instagram com crédito. |

## C. Têm `foto` externa (hotlink) e `fotos[]` vazio: sem arquivo local e sem fonte autorizada
Qualquer um destes quebra se o link cair e viola a regra de fonte. Os fc marcam algumas como "ambiente", mas são de agregadores/usuários.
| Lugar | Foto atual | Observação |
|---|---|---|
| mcz-cu-005 Casa do Interior | RestaurantGuru (fc: ambiente) | Foto de usuário: não autorizada. Procurar Instagram oficial; senão fotografar. |
| mcz-cu-009 Self Service Dona Geni | RestaurantGuru (ambiente) | Mesma coisa. Obs.: a marca Dona Geni (cu-040) já tem fotos próprias do ambiente; conferir se é a mesma casa antes de reaproveitar. |
| mcz-cu-012 Eduburger's | Google/lh5 (ambiente) | Foto de usuário Google via avaliacoesbrasil: não autorizada. |
| mcz-cu-014 Magno's Burguers | Google/lh5 (ambiente) | idem |
| mcz-cu-007 Parmegianno (Pátio) | imagem da loja no site do Pátio (arquivo "parmegianno.png", provável logo) | Conferir se é logo; fachada real precisa ser fotografada. |
| mcz-cu-008 Giraffas (Pátio) | idem ("giraffas.png") | idem |

## D. Situação OK (ambiente na capa e fonte registrada em fs)
Sabor Nordestino (003), Las Margaridas (006), Sr. Comilão (011), Dentão Burguer (015), Pastelaria do Kel (017), MC Lanches (020, fachada), Ítala (024), Tempero da Vovó (025), Dona Geni Macarrão ao Vivo (040). Obs.: 040 e 010/016/020/029 têm `fs` vazio ou só link de busca do iFood; vale registrar crédito mais preciso.

## Para o Lucas fotografar ou pedir ao dono
Fotografar (ambiente: fachada + salão/mesas, horizontal, 4:3):
- Fora do shopping: O Bodão, Beef Boss, Dom Angelo, Topadão, GSL, Frango Favorito, Duda Fest, Divina Grelha, Compadre, JK Delícias, Padaria Graciliano (se o site não servir).
- Capa a trocar (hoje prato): Feijoada da Naza, O Passaporte.
- Hotlinks a substituir: Casa do Interior, Self Service Dona Geni, Eduburger's, Magno's Burguers.
- Shopping Pátio (uma ida só, com autorização da administração): Subway, Dom da Empada, Executivos Grill, Burger King, KFC, Bob's, McDonald's, Divino Fogão, Taichi, Parmegianno, Giraffas. Alternativa: pedir ao marketing do Pátio (@patioshoppingmaceio, a confirmar) fotos autorizadas da praça de alimentação.

Pedir ao dono (mais rápido, via DM no Instagram oficial): Del Lanches (substituir prato), Casa do Interior, Eduburger's, Magno's, JK Delícias. Pedir permissão por escrito/DM e registrar o crédito em `fs`.

## Limitações
- Busca web não acessa Instagram; nenhum perfil novo foi confirmado. Os "não localizado" significam apenas isso, não que não existam.
- Imagens de Google/RestaurantGuru/Tripadvisor/jornais não são fonte autorizada.
- Não conferi visualmente `fotos[]` secundárias, só as capas ambíguas.
