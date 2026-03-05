import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastProps {
    toasts: ToastMessage[];
    onDismiss: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={18} className="text-red-400 shrink-0" />,
    info: <Info size={18} className="text-indigo-400 shrink-0" />,
};

const styles: Record<ToastType, string> = {
    success: "border-emerald-500/40 bg-emerald-950/80",
    error: "border-red-500/40 bg-red-950/80",
    info: "border-indigo-500/40 bg-indigo-950/80",
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), 5000);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md text-sm text-white shadow-xl transition-all duration-300 ${styles[toast.type]}`}
            style={{ animation: "slideInRight 0.3s ease" }}
        >
            {icons[toast.type]}
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white transition ml-2 -mt-0.5"
            >
                <X size={14} />
            </button>
        </div>
    );
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-80">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}
