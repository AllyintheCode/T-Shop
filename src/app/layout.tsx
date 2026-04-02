import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T-Shop | Premium E-Commerce",
  description: "Trendyol clone with premium design and animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>
        {children}
      </body>
    </html>
  );
}
