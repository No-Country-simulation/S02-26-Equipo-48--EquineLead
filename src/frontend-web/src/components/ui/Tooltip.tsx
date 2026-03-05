import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
    content: string;
}

export default function Tooltip({ content }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-1">
            <button
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none"
            >
                <HelpCircle size={16} />
            </button>

            {isVisible && (
                <div className="absolute z-50 right-0 top-6 w-64 p-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="relative text-xs leading-relaxed text-slate-300 font-normal">
                        {content}
                        <div className="absolute -top-4 right-1 w-3 h-3 bg-slate-900 border-l border-t border-slate-700 transform rotate-45" />
                    </div>
                </div>
            )}
        </div>
    );
}
