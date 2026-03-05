import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, LogIn } from "lucide-react";
import AdminGate from "../components/ui/AdminGate";

interface Props {
    children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
    const [showGate, setShowGate] = useState(false);
    const navigate = useNavigate();

    const handleAuthenticated = () => {
        setShowGate(false);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* AdminGate modal triggered from this layout */}
            {showGate && (
                <AdminGate
                    onAuthenticated={handleAuthenticated}
                    onClose={() => setShowGate(false)}
                />
            )}

            {/* Minimal header — branding + login */}
            <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-blue-500 w-7 h-7" />
                        <span className="text-lg font-bold tracking-tight">EquineLead</span>
                    </div>

                    <button
                        onClick={() => setShowGate(true)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-600"
                    >
                        <LogIn size={16} />
                        <span>Iniciar sesión</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="p-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700 py-6 text-center text-xs text-slate-500">
                © 2026 EquineLead — Motor de Crecimiento Ecuestre
            </footer>
        </div>
    );
}
