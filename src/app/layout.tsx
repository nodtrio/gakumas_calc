import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gakumas_calc",
  description: "Stage and policy aware MVP recommender for six support cards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
