import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Download, TrendingUp } from "lucide-react";

interface Props {
    children: ReactNode;
}

export default function MainLayout({ children }: Props) {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Landing Page", path: "/landing", icon: FileText },
        { name: "Download App", path: "/download", icon: Download },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-slate-700">
                    <TrendingUp className="text-blue-500 w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight">EquineLead</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-slate-700 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
                    v1.0.0-beta
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Nav Placeholder */}
                <div className="md:hidden bg-slate-800 p-4 border-b border-slate-700 flex justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={isActive ? "text-blue-500" : "text-slate-400"}
                            >
                                <Icon size={24} />
                            </Link>
                        );
                    })}
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
