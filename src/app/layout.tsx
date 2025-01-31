import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Group Links",
  description: "Grupo de Links",
  icons: {
    icon: "/1.png",
    
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
