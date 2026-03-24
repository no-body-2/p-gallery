// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 폰트는 다를 수 있음
import "./globals.css";
import Navbar from "@/components/Navbar"; // 👈 Navbar 가져오기

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "씹석이 갤러리",
    description: "박제 환영",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body className={inter.className}>
        {/* 👇 여기에 Navbar를 넣으면 모든 페이지 상단에 고정됨 */}
        <Navbar />

        {/* 각 페이지의 내용은 이 children 자리에서 렌더링 됨 */}
        <div className="max-w-5xl mx-auto">
            {children}
        </div>
        </body>
        </html>
    );
}