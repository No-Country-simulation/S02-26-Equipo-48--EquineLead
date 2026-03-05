import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Home, Download, TrendingUp, LogOut } from "lucide-react";

export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = sessionStorage.getItem("admin_auth") === "true";

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth");
        navigate("/");
    };

    // Define nav items based on auth status
    const navItems = isAuthenticated
        ? [
            { name: "Home", path: "/", icon: Home },
            { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
            { name: "Download App", path: "/download", icon: Download },
        ]
        : [{ name: "Home", path: "/", icon: Home }];

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

                <div className="p-4 border-t border-slate-700 space-y-3">
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition text-sm w-full px-4 py-2 rounded-xl hover:bg-slate-700"
                        >
                            <LogOut size={16} />
                            <span>Cerrar sesión</span>
                        </button>
                    )}
                    <p className="text-xs text-slate-500 text-center">v1.0.0-beta</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Nav */}
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
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
