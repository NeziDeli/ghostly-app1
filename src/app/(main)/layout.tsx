"use client";

import AuthGuard from "@/components/AuthGuard";
import { usePathname } from "next/navigation";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isMap = pathname === "/map";

    return (
        <AuthGuard>
            <div className="ghost-fog" />
            <div className={`min-h-screen ${!isMap ? "pb-24" : "h-screen overflow-hidden"}`}>
                {children}
            </div>
        </AuthGuard>
    );
}
