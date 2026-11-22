# Legal e Financeiro: revisão de termos, privacidade e lojas (22/11/2026)

Orientação, não aconselhamento jurídico. Itens marcados [ADVOGADO] ou [CONTADOR] precisam de profissional antes de publicar ou cobrar.
Base: v2/termos.html, v2/privacidade.html, v2/index.html (tela Planos), v2/js/sync.js, v2/js/native.js, v2/js/app.js.

## 1. Divergências entre texto legal e app

1. **Preços e trial não estão nos Termos.** O app mostra teste de 14 dias, R$ 27,90/mês, R$ 119,88 no 1º ano (12x R$ 9,99) e R$ 219/ano depois (índice 75-76 do index.html). Os Termos (item 8) dizem só "preço aparece na tela". Isso é aceitável hoje, mas na hora de cobrar precisa constar: valores, renovação, o que muda do 1º para o 2º ano, e a regra de cancelamento.
2. **Trial é contado no aparelho** (localStorage, "contado neste aparelho"). Os Termos dizem "o teste dura o período indicado". Reinstalar ou trocar de aparelho reinicia o teste. Não é problema legal, mas o texto não deve prometer "um teste por pessoa".
3. **"Guardar meu interesse"** (`mesai-interest`) fica só no aparelho. A Privacidade não cita isso. Se um dia for ao servidor, vira dado coletado e precisa constar.
4. **Notificações** (sino, "teste grátis começou", lugar novo): são montadas localmente, mas a Privacidade não diz nada sobre notificações. Hoje não há push; quando entrar (Firebase/APNs), é coleta de token de dispositivo e precisa de texto novo.
5. **Pontos:** o app diz "cada check-in soma 10 pontos" e a futura promessa "pontos que viram vantagens em parceiros". Termos item 7: "pontos não valem dinheiro, não transferíveis" está coerente, mas "vantagens em parceiros" ainda não existe. Não prometer na loja.
6. **Mesaí+ "Tudo do teste, sem prazo"**: três recursos pagos estão marcados "em desenvolvimento". Os Termos item 8 dizem "quando a assinatura começar, avisaremos antes". Está coerente, mas o item "alertas de lugar novo" já funciona sob `hasPlus()`, e o texto "o resto do app segue liberado" depende de decisão de produto. Alinhar antes de cobrar.
7. **Privacidade item 6 e 8 (exclusão):** diz que apaga "conta, perfil, foto, comentários, check-ins, pontos e favoritos" na hora. O app (`delete_my_account`) e o texto do confirm batem. Falta confirmar com o Backend se também apaga: sugestões (`suggestions`), marcações de ambiente (`ambience_marks`) e o arquivo da foto no bucket `avatars` (não só a linha do perfil). Pedir ao agente backend-supabase para verificar. A conta do dono (admin) é bloqueada para exclusão, o que não está dito (aceitável, mas é caso interno).
8. **Privacidade item 2 "Uso do app" cita "idioma"**: confirmar se o app tem seleção de idioma de fato; se não, remover.
9. **Idade (13 anos):** Termos e Privacidade dizem 13+, mas o cadastro só tem checkbox de aceite dos termos (sync.js linha 110); não pergunta idade. Ver item de menores abaixo.
10. **Prazos:** Privacidade diz 15 dias para responder; a LGPD (art. 19) exige resposta imediata para confirmação/acesso simplificado e até 15 dias para declaração completa. O texto está ok, só não prometer menos que isso.
11. **Moderação:** Termos dizem "filtro automático bloqueia termos proibidos... também podemos remover conteúdo". Coerente com o trigger. Mas não existe no app botão de denunciar/bloquear (busca por "denunc/bloquear" não achou nada no JS). O texto de Termos não promete denúncia, porém as lojas exigem (item 3 abaixo).
12. **Google Maps/Capacitor:** Privacidade cita Google Maps; no app nativo o plugin de geolocalização (Capacitor) também usa o GPS do sistema. Texto ok, mas confirmar se a rota abre no Google Maps externo ou usa SDK embutido (se tiver SDK, a Google coleta dados no app e muda o rótulo da loja).
13. **Hospedagem:** privacidade lista GitHub Pages e Supabase, mas se o app nativo carrega `www/` local, GitHub só vale para a web. Ok. Se houver Resend (e-mail de confirmação, pendência V1) ou Firebase, **adicionar à lista de operadores**.

## 2. Lacunas de LGPD

- **Bases legais:** estão informais ("execução do serviço", "legítimo interesse"). Falta citar o artigo (art. 7º, V contrato; IX legítimo interesse; I consentimento para localização/câmera/foto; II obrigação legal). Associar cada finalidade a uma base. [ADVOGADO]
- **Localização:** o texto diz que fica só no celular. Está correto pelo código (native.js só calcula distância). Mas falta: finalidade explícita, que é opcional, como revogar a permissão (Ajustes do sistema), e que o check-in hoje não valida GPS (se passar a validar e enviar coordenadas, atualizar). Se algum dia enviar coordenadas, é dado a declarar.
- **Menores:** 13+ não é suficiente. Pelo art. 14 da LGPD, tratamento de dados de crianças (até 12) exige consentimento específico dos pais. Adolescentes (12-17) exigem tratamento no melhor interesse. Sugerido: barreira de idade no cadastro e declaração "tenho 13 anos ou mais" (ou 18, mais simples; o app tem comentários públicos e foto). Decisão do Lucas; [ADVOGADO] para validar o limite. Apple e Google também pedem classificação etária.
- **Retenção:** falta prazos concretos: logs, backups do Supabase (um backup pode manter dados excluídos por alguns dias), comentários removidos por moderação, dados exigidos por lei (nota fiscal, quando houver assinatura: 5 anos). [CONTADOR] para prazo fiscal.
- **Encarregado (DPO):** art. 41 exige indicar encarregado e divulgar o contato. Hoje só há o e-mail geral (um Gmail). Indicar nominalmente (pode ser o próprio Lucas) e usar e-mail de domínio próprio quando existir. Pequeno porte pode ter dispensa simplificada da ANPD (Res. CD/ANPD 2/2022), mas o canal de atendimento continua obrigatório. [ADVOGADO]
- **Direitos do titular:** a lista está boa; falta mencionar oposição ao tratamento, revisão de decisões automatizadas (o filtro de palavras bloqueia comentário automaticamente, é decisão automatizada leve; dizer como contestar) e informação sobre consequência de não dar consentimento.
- **Transferência internacional:** diz "segue as regras da LGPD". Melhor nomear: Supabase (região do projeto, confirmar no painel), GitHub (EUA), Google. Citar o mecanismo (cláusulas-padrão/art. 33). [ADVOGADO]
- **Incidentes:** diz "avisaremos" sem prazo; a ANPD pede comunicação em até 3 dias úteis (Res. CD/ANPD 15/2024). Pode citar "em prazo razoável conforme a ANPD".
- **Registro das operações (ROPA) e RIPD:** documento interno, não público; recomendável fazer uma versão simples.
- **Cookies/armazenamento local:** sessão e preferências no localStorage. O texto menciona. Ok.
- **Contrato com operadores:** conferir o DPA do Supabase (aceito nos termos deles).

## 3. O que as lojas exigem

### Apple (App Store)
- **Compra dentro do app (IAP):** assinatura digital no iPhone tem de usar StoreKit (Guideline 3.1.1). O app não pode mandar para cobrança externa (Pix/cartão no site) para liberar o Mesaí+. Em geral comissão de 15% (Small Business Program, até US$ 1 mi/ano) ou 30%. [CONTADOR] sobre tributação da receita via Apple.
- **Pré-requisito do Lucas:** contas de Apple Developer (D-U-N-S em andamento) e acordos de apps pagos / dados bancários e fiscais no App Store Connect. Não mexer sem confirmação dele.
- **Restaurar compras:** botão "Restaurar compras" visível na tela de planos (3.1.1). Hoje não existe (a tela só tem "Guardar meu interesse").
- **Informações da assinatura na tela de venda (3.1.2):** título, duração, preço por período e preço total, trial com data, link para Termos e Privacidade (EULA padrão da Apple ou o próprio), como cancelar. A tela tem preços e trial; falta link legal e frase de renovação automática e cancelamento nas Configurações da Apple.
- **Mesaí+ prometendo recursos que não existem:** não aprovável como produto pago. Lançar só com recursos entregues.
- **Preço promocional "12x de R$ 9,99":** a Apple vende assinatura por período, não parcelamento. A frase "12x" é enganosa nesse contexto. Reescrever: "R$ 119,88 no primeiro ano" (ou configurar como oferta introdutória, preço pago por X períodos). Ver também CDC. A transição R$ 119,88 para R$ 219 tem de ser configurada como oferta introdutória/ preço de renovação na Apple e informada na tela.
- **Exclusão de conta no app (5.1.1(v)):** existe (Perfil > Conta e segurança > Excluir). OK. Se houver assinatura ativa, avisar que ela precisa ser cancelada na Apple.
- **Conteúdo gerado por usuário (1.2):** exige filtro (tem), **denunciar conteúdo (falta)**, **bloquear usuário (falta)**, contato publicado (tem) e remoção em até 24h de conteúdo ofensivo. Passar para dev-app e comunidade-moderacao. Alto risco de reprovação.
- **Rótulos de privacidade (App Privacy):** declarar, ligados à identidade: e-mail, nome, foto, conteúdo do usuário (comentários), identificador de usuário, dados de uso (check-ins, pontos, favoritos). Localização: se só processa no aparelho e não sai, pode declarar "não coletado". Sem rastreamento (ATT não necessário). Link de política obrigatório.
- **Login:** só e-mail/senha, então "Login com Apple" não é exigido (4.8 só vale se houver login social).
- **Texto de permissão** (Info.plist) de localização, câmera e fotos em português, claro.
- **Idade:** questionário de classificação etária.

### Google Play
- **Data safety:** declarar dados coletados e compartilhados (e-mail, nome, foto, conteúdo, IDs, atividade no app), se criptografados em trânsito (sim, HTTPS) e se o usuário pode pedir exclusão (sim).
- **Política de privacidade:** URL pública funcionando, dentro do app e na ficha. Hoje o endereço do GitHub Pages serve, mas é link "provisório"; recomendável domínio próprio.
- **Exclusão de conta:** exige opção no app **e** uma URL web para pedir exclusão (política de Account Deletion). Falta a página web (hoje só e-mail). Criar uma página com instruções e formulário/e-mail.
- **UGC:** também exige denúncia/bloqueio dentro do app.
- **Billing:** assinatura digital no Android deve usar Google Play Billing. Trial e preços configurados na Play Console.
- **Alvo de público/Families:** declarar que não é para crianças.
- **Permissões:** declarar localização e câmera. Se o app pedir localização em segundo plano, formulário extra (não é o caso).
- **Conta:** conta de desenvolvedor com verificação (CNPJ) e, para contas novas, teste fechado com 12 testadores por 14 dias (regra para contas pessoais; contas de organização costumam ficar isentas, confirmar na Play Console).

## 4. Cobrança, nota fiscal e tributos [CONTADOR]
- Enquadramento da MESAÍ APP LTDA (Simples? MEI não). Anexo e alíquota para software/assinatura (SaaS).
- Como emitir nota: nas vendas via Apple/Google, quem recebe a receita da loja precisa registrar e, em geral, a loja retém/recolhe alguns tributos sobre sua comissão; o contador define a nota.
- ISS (Maceió) e possíveis retenções; receita do exterior (loja envia valor pelo exterior).
- CNAE precisa cobrir desenvolvimento/licenciamento de software e publicidade, se houver parceiros.
- Política de reembolso: Apple e Google decidem pelos canais deles; os Termos devem dizer isso. Direito de arrependimento do CDC (7 dias) vale em compra à distância, tratado pelas lojas.

## 5. Texto novo proposto

### 5.1 Termos, item 4 (Sua conta)
> - Você precisa ter **18 anos ou mais** para criar conta (**ou 13 a 17 anos com autorização do responsável**). *(decisão do Lucas; validar com advogado)*
> - Use um e-mail verdadeiro e mantenha sua senha em segredo. Você responde pelo que for feito com a sua conta.
> - Você pode sair ou excluir a conta quando quiser em Perfil > Conta e segurança > Excluir minha conta. Se tiver assinatura ativa, ela não é cancelada automaticamente: cancele na App Store ou no Google Play.

### 5.2 Termos, item 5 (Regras da comunidade), acrescentar ao final
> Você pode denunciar qualquer comentário ou perfil pelo botão de denúncia no app ou por beyonddesign.empresa@gmail.com. Analisamos as denúncias e removemos o conteúdo que violar estas regras, em regra em até 24 horas. Você também pode bloquear outro usuário. *(só publicar depois que o botão existir)*

### 5.3 Termos, item 8 (Mesaí Plus), reescrito para o momento da cobrança
> **8. Mesaí+ (assinatura)**
> Nesta versão não há cobrança: o Mesaí+ está em teste e os recursos pagos ainda estão em desenvolvimento. Avisaremos no app antes de qualquer cobrança.
> Quando a assinatura começar:
> - Preços: R$ 27,90 por mês; ou plano anual com R$ 119,88 no primeiro ano e R$ 219 por ano a partir do segundo. Os valores finais aparecem na tela de compra, na moeda e com os impostos da sua loja.
> - Teste grátis de 14 dias, uma vez por conta de loja. Se você não cancelar até 24 horas antes do fim, a assinatura paga começa.
> - A compra, a cobrança e o cancelamento são feitos pela App Store ou pelo Google Play, conforme o aparelho. Para cancelar: Ajustes > seu nome > Assinaturas (iPhone) ou Google Play > Pagamentos e assinaturas (Android). Excluir o app ou a conta no Mesaí não cancela a assinatura.
> - A assinatura renova automaticamente por períodos iguais até você cancelar; o cancelamento vale a partir do próximo período.
> - Reembolsos seguem as regras da loja onde você comprou.
> - Se mudarmos preço ou recursos, avisamos com antecedência e você pode cancelar antes.
> - Existe o botão "Restaurar compras" para recuperar sua assinatura em outro aparelho.

### 5.4 Privacidade, item 2, acrescentar
> **Notificações:** os avisos dentro do app (sino) são montados no seu aparelho. Se um dia enviarmos notificações push, pediremos sua permissão e guardaremos o identificador do aparelho para isso; você pode desligar em Ajustes.
> **Assinatura:** a compra é feita pela App Store ou Google Play. Não recebemos nem guardamos seus dados de pagamento; recebemos apenas a confirmação de que a assinatura está ativa.

### 5.5 Privacidade, item 3 com bases legais
> - Criar e manter sua conta e mostrar seu perfil: execução de contrato (LGPD, art. 7º, V).
> - Publicar o que você escreve, com seu nome e foto: execução de contrato (art. 7º, V).
> - Segurança e moderação (filtro automático, remoção de conteúdo): legítimo interesse (art. 7º, IX) e proteção do serviço. Se um comentário for bloqueado pelo filtro, você pode pedir revisão pelo contato.
> - Pontos, check-ins e favoritos: execução de contrato.
> - Localização, câmera e fotos: consentimento (art. 7º, I), dado quando você permite no aparelho; você pode retirar em Ajustes do sistema a qualquer momento.
> - Cumprir obrigações legais e atender autoridades: obrigação legal (art. 7º, II).

### 5.6 Privacidade, item 6 (Retenção), reescrito
> Guardamos seus dados enquanto sua conta existir. Ao excluir a conta no app, apagamos conta, perfil, foto, comentários, check-ins, pontos, favoritos e sugestões do banco de dados em seguida. Cópias de segurança do nosso provedor podem manter esses dados por até **[confirmar com Backend: X] dias** até serem sobrescritas. Dados que a lei exija guardar (por exemplo, registros fiscais de assinatura) ficam pelo prazo legal. Registros técnicos de acesso ficam por **[confirmar]**.

### 5.7 Privacidade, item 9 (Crianças e adolescentes), reescrito
> O Mesaí não é destinado a menores de **[13 / 18]** anos e não criamos contas sabendo que são de crianças. Ao se cadastrar, você declara ter a idade mínima. Se descobrirmos uma conta de criança, ela é excluída. Para adolescentes, tratamos os dados apenas no melhor interesse deles, nos termos do art. 14 da LGPD. Responsáveis podem pedir a exclusão pelo contato.

### 5.8 Privacidade, novo item "Encarregado de dados"
> **Encarregado pelo tratamento de dados (DPO):** [nome do Lucas ou responsável], contato [e-mail]. Fale com ele para exercer seus direitos ou tirar dúvidas.

### 5.9 Privacidade, item 7, acrescentar
> Você também pode se opor a um tratamento feito com base em legítimo interesse e pedir revisão de decisões tomadas só por sistema automático (como o bloqueio de um comentário pelo filtro). Se retirar um consentimento (por exemplo, a localização), o app continua funcionando, apenas sem a função que dependia dele.

### 5.10 Tela Planos (index.html, linhas 75-76), antes de cobrar
- Trocar "ou 12x de R$ 9,99/mês no 1º ano" por "ou R$ 119,88 no primeiro ano, depois R$ 219 por ano". Evitar "12x" (parece parcelamento no cartão, a Apple vende por período).
- Remover "contra R$ 334,80 pagando mês a mês" se não ficar claro que é comparação (comparação de preço precisa ser verdadeira e comparável, CDC art. 37).
- Adicionar links para Termos e Privacidade, "renova automaticamente" e botão "Restaurar compras".
- Manter "em desenvolvimento" até os recursos existirem; **não ativar cobrança antes**.

## 6. Checklist antes de cobrar (resumo)
1. Recursos prometidos prontos (listas compartilháveis, alertas, vantagens de pontos).
2. IAP (StoreKit) e Play Billing implementados, com Restaurar compras.
3. Denunciar/bloquear conteúdo no app.
4. Página web de exclusão de conta (Google) e DPO publicado.
5. Termos e Privacidade atualizados com 5.1 a 5.9, revisados por advogado.
6. Contador define enquadramento, nota fiscal e tributos sobre receita das lojas.
7. Idade mínima decidida e barreira no cadastro.
8. Rótulos Apple e Data safety Google preenchidos com os dados do item 3.

## 7. Quando consultar profissional
- Advogado: texto final de bases legais, menores (art. 14), transferência internacional, encarregado, cláusulas de assinatura e CDC, antes de publicar nas lojas e antes de cobrar.
- Contador: regime tributário, nota fiscal, ISS e receita via Apple/Google, CNAE, antes da primeira cobrança.

Não testado: não executei o app nem conferi o banco (Supabase) para confirmar o que `delete_my_account` apaga; isso fica para o agente backend-supabase. Não rodei `agencia/status.sh` (não tenho terminal neste setor).
