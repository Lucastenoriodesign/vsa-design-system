import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Studio — direção criativa por IA",
  description: "Envie uma página existente. A IA entende a oferta, redefine a direção criativa e constrói uma nova experiência digital.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
