import { useState } from "react";
import { Lock, Eye, EyeOff, X } from "lucide-react";

interface AdminGateProps {
    onAuthenticated: () => void;
    onClose?: () => void;
}

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || "equinelead2026";

export default function AdminGate({ onAuthenticated, onClose }: AdminGateProps) {
    const [key, setKey] = useState("");
    const [error, setError] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key === ADMIN_KEY) {
            sessionStorage.setItem("admin_auth", "true");
            onAuthenticated();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm">
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition bg-slate-800/50 hover:bg-slate-800 rounded-full border border-slate-700 sm:-right-12 sm:top-0"
                        title="Cerrar"
                    >
                        <X size={20} />
                    </button>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-300"
                >
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <Lock className="text-indigo-400" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Acceso al Panel</h2>
                        <p className="text-sm text-slate-400">
                            Ingresa la clave de administrador para continuar
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type={showKey ? "text" : "password"}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Clave de acceso"
                            className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${error
                                ? "border-red-500 focus:ring-red-500 shake"
                                : "border-slate-700 focus:ring-indigo-500"
                                }`}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                        >
                            {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center animate-in fade-in duration-200">
                            Clave incorrecta. Intenta de nuevo.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}
