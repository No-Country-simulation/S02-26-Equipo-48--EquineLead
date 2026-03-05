import { X, CheckCircle2, XCircle, Clock, History } from "lucide-react";

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
    error: <XCircle size={16} className="text-red-400 shrink-0" />,
    pending: <Clock size={16} className="text-indigo-400 shrink-0 animate-pulse" />,
};

function formatTimestamp(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("es-CO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function SyncHistoryPanel({ isOpen, onClose, events, onClear }: SyncHistoryPanelProps) {
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
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <History size={18} className="text-indigo-400" />
                        <span>Historial de Sincronización</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Events list */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
                            <History size={40} className="opacity-30" />
                            <p className="text-sm text-center">Aún no hay eventos de sincronización.</p>
                        </div>
                    ) : (
                        events.map((ev) => (
                            <div
                                key={ev.id}
                                className="flex items-start gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700"
                            >
                                <div className="mt-0.5">{statusIcon[ev.status]}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400">{formatTimestamp(ev.timestamp)}</p>
                                    <p className="text-sm text-white leading-snug mt-0.5">{ev.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-700">
                    <button
                        onClick={onClear}
                        className="w-full text-sm text-slate-400 hover:text-red-400 transition py-2"
                    >
                        Limpiar historial
                    </button>
                </div>
            </div>
        </>
    );
}
