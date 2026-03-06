import { X, CheckCircle2, AlertCircle, Trash2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface SyncEvent {
    id: string;
    timestamp: string;   // ISO string
    status: "success" | "error" | "pending";
    message: string;
}

interface SyncHistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    events: SyncEvent[];
    onClear: () => void;
}

const statusIcon: Record<SyncEvent["status"], React.ReactNode> = {
    success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={16} className="text-red-400 shrink-0" />,
    pending: <Clock size={16} className="text-indigo-400 shrink-0 animate-pulse" />,
};

function formatTimestamp(iso: string, locale: string) {
    const date = new Date(iso);
    const localeMap: Record<string, string> = { es: "es-ES", en: "en-GB", pt: "pt-BR" };
    return new Intl.DateTimeFormat(localeMap[locale] || "es-ES", {
        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    }).format(date);
}

export default function SyncHistoryPanel({ isOpen, onClose, events, onClear }: SyncHistoryPanelProps) {
    const { t, i18n } = useTranslation();

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Slide-in Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 z-40 bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800 sticky top-0 z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Clock className="text-blue-500" />
                        {t("dashboard.syncHistory.title")}
                    </h2>
                    <div className="flex items-center gap-2">
                        {events.length > 0 && (
                            <button
                                onClick={() => {
                                    if (window.confirm(t("dashboard.syncHistory.clearConfirm"))) {
                                        onClear();
                                    }
                                }}
                                className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-full transition"
                                title={t("dashboard.syncHistory.clear")}
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Events list */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
                            <Clock size={40} className="opacity-30" />
                            <p className="text-sm text-center">{t("dashboard.syncHistory.empty")}</p>
                        </div>
                    ) : (
                        events.map((ev) => (
                            <div
                                key={ev.id}
                                className="flex items-start gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700"
                            >
                                <div className="mt-0.5">{statusIcon[ev.status]}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400">{formatTimestamp(ev.timestamp, i18n.language)}</p>
                                    <p className="text-sm text-white leading-snug mt-0.5">{ev.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
