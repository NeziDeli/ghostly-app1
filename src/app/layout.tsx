import "@/styles/globals.css";
import Link from "next/link";
import AuthListener from "@/components/AuthListener";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0a0a0c",
};

export const metadata: Metadata = {
    title: "GHOSTLY",
    description: "Connect with nearby souls. Low pressure, high privacy.",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" style={{ backgroundColor: "#0a0a0c" }}>
            <body
                className="bg-[#0a0a0c] text-white"
                style={{ backgroundColor: "#0a0a0c" }}
            >
                <Link href="/map" className="fixed top-6 left-6 z-[10000] hidden md:block font-black text-2xl tracking-tighter hover:opacity-80 transition-opacity">
                    GHOSTLY
                </Link>
                <main className="min-h-screen">
                    {children}
                </main>
                <AuthListener />
                {/* <BottomNav /> - Removed by user request */}
            </body>
        </html>
    );
}
