"use client";

import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // If not authenticated and trying to access main routes, redirect to login
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, router, pathname]);

    if (!isAuthenticated) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
