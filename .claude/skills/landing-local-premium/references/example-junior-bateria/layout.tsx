import type { Metadata } from "next";
import "./globals.css";

/* No web fonts: the page uses the system font stack, so nothing extra to download. */

export const metadata: Metadata = {
  title: "Bateria em Maceió | Troca e Entrega em até 30 min – Júnior Bateria",
  description:
    "Socorro de bateria em Maceió: levamos, testamos e trocamos a bateria do seu carro onde você estiver, em até 30 minutos. Moura, MG3, Kondor. Chame no WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
