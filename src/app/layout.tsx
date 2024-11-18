import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/_variables.sass"
import 'leaflet/dist/leaflet.css';
import React from "react";
import { GlobalStateProvider } from "@/context/globalState";
import Sidebar from "@/components/Sidebar";

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
          <Sidebar/>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  );
}
