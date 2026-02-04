import "@/styles/globals.css";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GHOSTLY",
    description: "Connect with nearby souls. Low pressure, high privacy.",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    manifest: "/manifest.json",
    themeColor: "#0a0a0c",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Link href="/feed" className="fixed top-6 left-6 z-[10000] hidden md:block font-black text-2xl tracking-tighter hover:opacity-80 transition-opacity">
                    GHOSTLY
                </Link>
                <main className="min-h-screen">
                    {children}
                </main>
                {/* <BottomNav /> - Removed by user request */}
            </body>
        </html>
    );
}
