import type { Metadata } from "next";
import "@/app/styles/reset.css";
import "@/app/styles/_variables.sass"
import React from "react";
import { GlobalStateProvider } from "@/app/context/globalState";

export const metadata: Metadata = {
  title: "MAGI",
  description: "Gerenciamento de localização de ativos por geolocalização.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body>
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  );
}
