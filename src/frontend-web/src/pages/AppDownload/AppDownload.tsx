import { Smartphone, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { downloadApk } from "../../services/api";
import { useState } from "react";

export default function AppDownload() {
    const { t } = useTranslation();
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const response = await downloadApk();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "equine-lead-mobile.apk");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("APK download failed", err);
            alert(t("downloadPage.downloadFailed"));
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Info */}
                <div className="space-y-6 text-center md:text-left">
                    <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold inline-block mb-4">
                        {t("downloadPage.beta")}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        {t("downloadPage.title")} <span className="text-blue-500">{t("downloadPage.titleBlue")}</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md mx-auto mb-8">
                        {t("downloadPage.desc")}
                    </p>

                    <ul className="space-y-4 mb-10 text-left max-w-xs mx-auto">
                        {[
                            t("downloadPage.features.scoring"),
                            t("downloadPage.features.contact"),
                            t("downloadPage.features.offline")
                        ].map((text, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="text-emerald-400" size={20} />
                                <span className="font-medium">{text}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 ${downloading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Download size={22} className={downloading ? 'animate-bounce' : ''} />
                        {downloading ? t("downloadPage.preparing") : t("downloadPage.button")}
                    </button>
                </div>

                {/* Right: Visual */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-slate-800 rounded-[2.5rem] p-4 border border-slate-700 aspect-[9/18] w-64 mx-auto shadow-2xl flex flex-col items-center justify-center">
                        <Smartphone size={80} className="text-slate-700 mb-4" />
                        <div className="w-40 h-1 bg-slate-700 rounded-full mb-8"></div>
                        <div className="w-12 h-12 rounded-full border-4 border-slate-700"></div>
                    </div>

                    {/* Badge */}
                    <div className="absolute -bottom-4 -right-4 md:right-0 bg-blue-600 p-4 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-slate-900">
                        <AlertCircle size={20} />
                        <span className="text-sm font-bold italic">BETA 1.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
