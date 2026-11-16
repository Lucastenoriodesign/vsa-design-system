# Mesaí — app nativo (iOS e Android)

Este é o app de verdade que vai para a App Store e o Google Play. Ele usa o Capacitor para colocar o app web
(`mesai/v2`) dentro de um app nativo e dar acesso a recursos do celular: localização ("perto de mim"),
compartilhar, vibração, câmera, notificações push, tela de abertura e barra de status.

## O que você precisa no Mac (uma vez)
1. **Xcode** (App Store, grátis). Abra uma vez e aceite os termos.
2. **Android Studio** (developer.android.com/studio).
3. **Node.js 20 ou mais novo** (nodejs.org).

## Rodar no seu iPhone
```bash
cd mesai/native
npm install
npm run ios        # copia o app web, sincroniza e abre o Xcode
```
No Xcode: escolha o seu iPhone no topo (conectado no cabo), em *Signing & Capabilities* selecione seu time
(sua conta Apple) e aperte ▶︎ Run.

## Rodar no Android
```bash
npm run android    # abre o Android Studio
```
Escolha o celular ou o emulador e aperte ▶︎ Run.

## Sempre que o app web mudar
```bash
npm run sync
```

## Ainda falta (depende de contas)
- **Push:** precisa da conta Apple Developer (chave APNs) e de um projeto no Firebase (arquivo
  `google-services.json` em `android/app/`). O plugin já está instalado; falta ligar quando as contas existirem.
- **Ícone e tela de abertura:** gerar a partir do logo (pacote `@capacitor/assets`).
- **ID do app:** `com.mesaiapp.app`. Pode ser trocado em `capacitor.config.json` só **antes** do primeiro envio às lojas.
