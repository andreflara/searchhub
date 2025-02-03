import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Search Link",
  description: "home page para pesquisar e redirecionar para o site",
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
