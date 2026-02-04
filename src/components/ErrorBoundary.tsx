"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-black/50 backdrop-blur-md rounded-3xl border border-white/10 m-4">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong.</h2>
                    <p className="text-white/60 text-sm mb-4">The map encountered an error.</p>
                    <pre className="text-xs text-left bg-black/50 p-4 rounded-lg overflow-auto max-w-full text-red-300 mb-4">
                        {this.state.error?.message}
                    </pre>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-all"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
