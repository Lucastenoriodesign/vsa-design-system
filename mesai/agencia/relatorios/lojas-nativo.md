# Prontidão para Google Play e App Store (auditoria de 22/11/2026)

Auditoria só de leitura em `native/`. Não foi feito build, conta nem envio. Nenhuma chave ou senha foi lida ou copiada.

## O que já está pronto
- Capacitor 8.6: `appId` com.mesaiapp.app, nome Mesaí, igual no Android (`applicationId`) e no iOS (`PRODUCT_BUNDLE_IDENTIFIER`).
- Plugins: app, camera, geolocation, haptics, push-notifications, share, splash-screen e status-bar. Todos são usados ou previstos.
- Ícone e splash: existem em `native/assets/` e já foram gerados para Android (mipmaps, splash por densidade e modo escuro) e iOS (AppIcon 512@2x, Splash claro e escuro).
- Android: minSdk 24, target/compile 36 (atende à exigência atual do Play). Há `allowMixedContent: false`.
- Permissões Android: INTERNET, localização (coarse e fine), CAMERA e POST_NOTIFICATIONS. Câmera e GPS têm `required=false`.
- iOS: Info.plist tem os textos de uso em português (localização, câmera, fotos). Tem `ITSAppUsesNonExemptEncryption=false`, o que evita a pergunta de exportação.
- Assinatura Android: `build.gradle` lê `keystore.properties`. `.gitignore` bloqueia `keystore.properties`, `*.jks` e `*.keystore`. Nenhum arquivo de chave está no Git (conferido com `git ls-files`). Sem o arquivo, o release sai sem assinatura, sem quebrar.
- Push Android: `build.gradle` aplica o plugin do Google Services sozinho quando `google-services.json` existir.
- APK de download (`v2/download/mesai.apk`): 13,5 MB, de 16/11/2026, com classes.dex e libs nativas de câmera.

## O que falta ou precisa de atenção
1. **Google Play exige AAB, não APK.** O projeto só documenta APK. Falta gerar `bundleRelease` (agente faz, com o Lucas liberando a chave).
2. **Versão presa em 1:** `versionCode 1` / `versionName "1.0"` (Android) e `CURRENT_PROJECT_VERSION 1` / `MARKETING_VERSION 1.0` (iOS). Cada envio exige subir o versionCode e o build. Não consegui confirmar se o APK publicado é o mesmo 1.0, porque não há aapt nem apkanalyzer na máquina. Agente confere depois.
3. **Assinatura do APK publicado:** `keytool -printcert` não mostrou certificado. Pode ser só assinatura v2/v3, o que é normal. O Lucas precisa confirmar que o zip da chave existe e está guardado em dois lugares. Sem ele não há atualização do app. Também recomendo ativar o Play App Signing no Play Console.
4. **`allowBackup="true"` no manifesto.** Vale desligar para o release (agente).
5. **`minifyEnabled false`.** Funciona, mas é recomendável ligar com R8 depois de testar (agente).
6. **iOS:** não há `PrivacyInfo.xcprivacy`. A Apple exige o manifesto de privacidade, e é preciso declarar as APIs usadas. Também não há arquivo de entitlements (Push Notifications) nem `GoogleService-Info.plist`, se for usar Firebase no iOS. `UIRequiredDeviceCapabilities` está com `armv7` (herdado do template). Troque por `arm64` (agente).
7. **Permissões de fotos no iOS:** a descrição de NSPhotoLibraryAddUsageDescription só vale se o app realmente salvar fotos na galeria. Conferir (agente).
8. **Lojas pedem, e o Lucas precisa decidir/entregar:**
   - Política de privacidade com URL pública. Já existe `v2/privacidade.html`, mas é preciso confirmar o link público estável. O link atual é de GitHub Pages, o que não é ideal.
   - Formulário de Segurança de Dados no Play e "App Privacy" na Apple. Dados: conta, e-mail, fotos, comentários e localização. Texto base é feito pelo agente.
   - Fluxo de exclusão de conta: já existe (`delete_my_account`). O Play pede também uma URL web para o pedido de exclusão.
   - Capturas de tela (celular e iPhone 6,7"), ícone 512 do Play, gráfico de recursos 1024x500, descrição curta e longa, categoria (Comida e bebida), classificação etária.
   - Conteúdo gerado por usuários (comentários/fotos): a Apple exige denúncia e bloqueio. A moderação é por filtro de palavras. Confirmar se há botão de denunciar (outro setor).
   - **Mesaí+:** na Apple, a cobrança tem que ser pela compra dentro do app (IAP). O Play também exige o Google Play Billing. Hoje não há cobrança real. Enquanto os recursos prometidos não existirem, a tela de planos pode ser motivo de rejeição. Decisão do Lucas.
   - Play: contas pessoais novas precisam de teste fechado com 12 testadores por 14 dias antes da produção. Conta de organização (com D-U-N-S) não tem essa exigência. Confirmar na criação da conta.

## Push (Firebase + Apple)
- Quem faz: o Lucas cria as contas (a criação de contas exige a confirmação dele). O agente faz a integração.
- Android: criar projeto no Firebase com o pacote com.mesaiapp.app, baixar `google-services.json` e colocar em `native/android/app/` (já ignorado? Não está no `.gitignore`. Agente deve adicionar antes). Registrar o token no Supabase (nova tabela, com RLS) e criar o envio (Edge Function com FCM HTTP v1).
- iOS: precisa de conta Apple Developer. Gerar chave APNs (.p8) e subir no Firebase. Ativar a capability Push Notifications e o `aps-environment`. Guardar a .p8 fora do Git.
- Hoje o `native.js` não pede permissão de push no app. Falta a tela de pedir permissão no momento certo.

## Build iOS na nuvem (macOS antigo, Xcode não instala)
Opções, da mais simples para a mais controlável:
1. **Codemagic** ou **Ionic Appflow**: ligam ao repositório, usam Mac na nuvem e enviam ao TestFlight. Há plano grátis limitado (confirmar preço atual antes).
2. **GitHub Actions** com runner macOS: já existe o GitHub no projeto. É preciso colocar certificado de distribuição, perfil de provisionamento e chave da App Store Connect como Secrets (nunca no repositório).
3. Alugar Mac na nuvem (MacinCloud etc.).
Pré-requisito comum: conta Apple Developer paga. O projeto usa Swift Package Manager (CapApp-SPM), o que simplifica a nuvem. O agente monta o workflow. O Lucas só cria a conta e gera as chaves.

## Conta Apple Developer / D-U-N-S
1. O D-U-N-S da MESAÍ APP LTDA foi pedido em 16/11/2026 e está aguardando. Prazo típico: até cerca de 30 dias, às vezes mais. O Lucas acompanha no portal da Dun & Bradstreet.
2. Com o número, o Lucas pede a inscrição como organização no developer.apple.com (US$ 99/ano). A Apple verifica o CNPJ e o site e pode ligar.
3. Depois: App Store Connect (criar o app com o bundle ID), chave APNs, chave da API do App Store Connect.
4. Sem D-U-N-S dá para entrar como pessoa física (CPF) e mudar depois. Mas o nome do vendedor seria o do Lucas, não da empresa. Decisão dele.
5. Enquanto isso, o Android pode ir primeiro ao Google Play (conta de desenvolvedor, taxa única de US$ 25; organização também pede D-U-N-S).

## Quem faz
| Item | Quem |
|---|---|
| Criar conta Google Play, Apple Developer, Firebase | Lucas (com confirmação) |
| Guardar a chave de assinatura e senhas | Lucas |
| Acompanhar o D-U-N-S | Lucas |
| AAB, subir versão, desligar allowBackup, R8, privacy manifest, `arm64` | Agente (nativo) |
| Workflow de build iOS na nuvem | Agente (nativo) |
| Integração do push (cliente) | Agente (nativo) + função no Supabase (setor de dados) |
| Textos e capturas da loja | Agente de conteúdo/design, Lucas aprova |
| Decisão sobre Mesaí+ e IAP | Lucas |
| Envio às lojas | Só com confirmação do Lucas |
