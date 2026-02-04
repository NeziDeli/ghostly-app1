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
            <div className={!isMap ? "pb-24" : ""}>
                {children}
            </div>
        </AuthGuard>
    );
}
