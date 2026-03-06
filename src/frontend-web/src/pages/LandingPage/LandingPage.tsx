import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminGate from "../../components/ui/AdminGate";

export default function LandingPage() {
    const { t } = useTranslation();
    const [showGate, setShowGate] = useState(false);
    const navigate = useNavigate();

    const handleAuthenticated = () => {
        setShowGate(false);
        navigate("/dashboard");
    };

    const isAlreadyAuth = sessionStorage.getItem("admin_auth") === "true";

    // If already authenticated, redirect to dashboard
    if (isAlreadyAuth) {
        navigate("/dashboard");
        return null;
    }

    return (
        <>
            <AdminGate
                isOpen={showGate}
                onSuccess={handleAuthenticated}
                onClose={() => setShowGate(false)}
            />

            <div className="max-w-6xl mx-auto space-y-20 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
                        {t("landing.heroTitle")}
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t("landing.heroSubtitle")}
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            onClick={() => setShowGate(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition flex items-center gap-2 mx-auto shadow-lg shadow-blue-500/20"
                        >
                            {t("landing.ctaButton")} <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* Features */}
                <section className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition">
                        <div className="bg-blue-500/20 p-3 rounded-2xl w-fit mb-4">
                            <svg className="text-blue-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t("landing.features.scraping.title")}</h3>
                        <p className="text-slate-400">{t("landing.features.scraping.desc")}</p>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition">
                        <div className="bg-indigo-500/20 p-3 rounded-2xl w-fit mb-4">
                            <svg className="text-indigo-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t("landing.features.scoring.title")}</h3>
                        <p className="text-slate-400">{t("landing.features.scoring.desc")}</p>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition">
                        <div className="bg-teal-500/20 p-3 rounded-2xl w-fit mb-4">
                            <svg className="text-teal-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t("landing.features.analytics.title")}</h3>
                        <p className="text-slate-400">{t("landing.features.analytics.desc")}</p>
                    </div>
                </section>
            </div>
        </>
    );
}
