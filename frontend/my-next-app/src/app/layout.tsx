import "@/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hệ thống Quản lý Sinh viên",
    description: "Quản lý sinh viên với Next.js",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body>
                <header className="bg-blue-200 text-center rounded-sm mb-4 p-4 font-bold text-3xl">
                    <h1>HỆ THỐNG QUẢN LÝ SINH VIÊN</h1>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
