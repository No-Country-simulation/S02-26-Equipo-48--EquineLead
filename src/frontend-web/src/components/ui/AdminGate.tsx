import { useState, useEffect } from "react";
import { Lock, X, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    isOpen: boolean;
    onSuccess: () => void;
    onClose?: () => void;
}

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || "equinelead2026";

export default function AdminGate({ isOpen, onClose, onSuccess }: Props) {
    const { t } = useTranslation();
    const [key, setKey] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setKey("");
            setError(null);
            setShowKey(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key === ADMIN_KEY) {
            sessionStorage.setItem("admin_auth", "true");
            onSuccess();
        } else {
            setError(t("adminGate.error"));
            setTimeout(() => setError(null), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm">
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition bg-slate-800/50 hover:bg-slate-800 rounded-full border border-slate-700 sm:-right-12 sm:top-0"
                        title={t("common.close")}
                    >
                        <X size={20} />
                    </button>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800 border border-slate-700 rounded-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300"
                >
                    <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500/20 p-2 rounded-lg">
                                <Lock className="text-indigo-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{t("adminGate.title")}</h2>
                                <p className="text-xs text-slate-400">{t("adminGate.subtitle")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="relative">
                            <input
                                type={showKey ? "text" : "password"}
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder={t("adminGate.placeholder")}
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
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20"
                        >
                            {t("adminGate.submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
