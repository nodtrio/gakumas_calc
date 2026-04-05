import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gakumas_calc",
  description: "스테이지와 정책을 반영해 서폿카 6장을 추천하는 MVP입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-black/10 bg-white/70 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-7xl items-center gap-5 px-4 py-4 text-sm font-medium text-black/70 md:px-8">
            <Link href="/" className="text-ink">추천</Link>
            <Link href="/collection" className="text-black/60 hover:text-ink">보유 카드 업로드</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}