import { Rocket, Shield, BarChart4, ChevronRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-20 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Equine Growth Engine
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    The ultimate platform for stable managers and wholesale dealers.
                    Identify high-value leads and automate your sales funnel with data science.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition flex items-center gap-2">
                        Get Started <ChevronRight size={20} />
                    </button>
                    <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-3 rounded-full font-bold transition">
                        Watch Demo
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition">
                    <div className="bg-blue-500/20 p-3 rounded-2xl w-fit mb-4">
                        <Rocket className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Automated Scraping</h3>
                    <p className="text-slate-400">Identify thousands of potential buyers across the industry automatically.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition">
                    <div className="bg-indigo-500/20 p-3 rounded-2xl w-fit mb-4">
                        <Shield className="text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Lead Scoring</h3>
                    <p className="text-slate-400">Our machine learning models rank every lead so you focus on what matters.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition">
                    <div className="bg-teal-500/20 p-3 rounded-2xl w-fit mb-4">
                        <BarChart4 className="text-teal-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
                    <p className="text-slate-400">Track your conversion funnel and ROI in a real-time dashboard.</p>
                </div>
            </section>
        </div>
    );
}
