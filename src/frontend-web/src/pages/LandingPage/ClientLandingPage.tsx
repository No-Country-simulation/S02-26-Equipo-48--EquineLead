import { useState, useMemo } from "react";
import { Send, ChevronDown, Sparkles, Heart, Trophy, X, ShieldCheck, HelpCircle } from "lucide-react";
import api from "../../services/api";
import { LATAM_COUNTRIES, getCitiesForCountry } from "../../data/geoLatam";

interface FormData {
    userName: string;
    userPhone: string;
    userEmail: string;
    userCountry: string;
    userCountryOther: string;
    userCity: string;
    userType: number;
    userBudget: string;
}

const initialForm: FormData = {
    userName: "",
    userPhone: "",
    userEmail: "",
    userCountry: "",
    userCountryOther: "",
    userCity: "",
    userType: 1,
    userBudget: "",
};

// ─── Per-field validators ────────────────────────────────────────────────────
const validators = {
    userName: (v: string) => {
        if (!v.trim()) return "El nombre es requerido.";
        if (v.trim().length < 3) return "Debe tener al menos 3 caracteres.";
        if (/\d/.test(v)) return "El nombre no puede contener números.";
        if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/.test(v)) return "Solo se permiten letras y espacios.";
        return null;
    },
    userPhone: (v: string) => {
        if (!v.trim()) return "El teléfono es requerido.";
        if (/[a-zA-Z]/.test(v)) return "El teléfono no puede contener letras.";
        if (!/^\+?[\d\s\-().]{7,20}$/.test(v)) return "Formato inválido. Ej: +57 300 000 0000";
        return null;
    },
    userEmail: (v: string) => {
        if (!v) return null;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Formato de correo inválido.";
        return null;
    },
    userCountry: (v: string) => {
        if (!v) return "Selecciona un país.";
        return null;
    },
    userCountryOther: (v: string, country: string) => {
        if (country === "Otro" && !v.trim()) return "Por favor especifica tu país.";
        if (country === "Otro" && /\d/.test(v)) return "El país no puede contener números.";
        return null;
    },
    userCity: (v: string, country: string) => {
        if (!v.trim()) return "La ciudad es requerida.";
        if (country !== "Otro" && v.trim().length < 2) return "Debe tener al menos 2 caracteres.";
        if (country === "Otro" && /\d/.test(v)) return "La ciudad no puede contener números.";
        return null;
    },
    userBudget: (v: string) => {
        if (!v) return "El presupuesto es requerido.";
        const num = Number(v);
        if (isNaN(num) || num <= 0) return "Ingresa un valor mayor a 0.";
        return null;
    },
};

type FieldName = "userName" | "userPhone" | "userEmail" | "userCountry" | "userCountryOther" | "userCity" | "userBudget";

export default function ClientLandingPage() {
    const [form, setForm] = useState<FormData>(initialForm);
    const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [showTypeTooltip, setShowTypeTooltip] = useState(false);

    const availableCities = useMemo(() => getCitiesForCountry(form.userCountry), [form.userCountry]);
    const isOtro = form.userCountry === "Otro";

    // Compute per-field errors
    const fieldErrors = useMemo(() => ({
        userName: validators.userName(form.userName),
        userPhone: validators.userPhone(form.userPhone),
        userEmail: validators.userEmail(form.userEmail),
        userCountry: validators.userCountry(form.userCountry),
        userCountryOther: validators.userCountryOther(form.userCountryOther, form.userCountry),
        userCity: validators.userCity(form.userCity, form.userCountry),
        userBudget: validators.userBudget(form.userBudget),
    }), [form]);

    const isFormValid = useMemo(
        () => Object.values(fieldErrors).every((e) => e === null),
        [fieldErrors]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Reset city and other fields when country changes
        if (name === "userCountry") {
            setForm((prev) => ({ ...prev, userCountry: value, userCity: "", userCountryOther: "" }));
            setTouched((prev) => ({ ...prev, userCity: false, userCountryOther: false }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: name === "userType" ? Number(value) : value,
            }));
        }
    };

    const handleBlur = (name: FieldName) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const openModal = () => {
        setForm(initialForm);
        setTouched({});
        setApiError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const allTouched = Object.fromEntries(
            ["userName", "userPhone", "userEmail", "userCountry", "userCountryOther", "userCity", "userBudget"].map((k) => [k, true])
        );
        setTouched(allTouched as Record<FieldName, boolean>);
        if (!isFormValid) return;

        setLoading(true);
        setApiError(null);

        try {
            const actualCountry = form.userCountry === "Otro" ? form.userCountryOther.trim() : form.userCountry;
            const payload = {
                userName: form.userName.trim(),
                userPhone: form.userPhone.trim(),
                userEmail: form.userEmail.trim() || null,
                userCountry: actualCountry,
                userCity: form.userCity.trim(),
                userType: form.userType,
                userBudget: Number(form.userBudget),
            };

            const userRes = await api.post("/User", payload);
            const userId = userRes.data.userId;

            await api.post("/Interaction", {
                userId,
                productId: 1,
                interactionSource: 3,
                interactionType: 4,
                interactionMetadataJson: JSON.stringify({
                    origin: "landing-popup",
                    form: true,
                    country: payload.userCountry,
                    city: payload.userCity,
                    budget: payload.userBudget,
                    currency: "USD",
                }),
            });

            setSubmitted(true);
            setIsModalOpen(false);
        } catch {
            setApiError("Hubo un error al enviar tus datos. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const scrollToFeatures = () => {
        document.getElementById("hooks")?.scrollIntoView({ behavior: "smooth" });
    };

    const FieldError = ({ name }: { name: FieldName }) =>
        touched[name] && fieldErrors[name] ? (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {fieldErrors[name]}
            </p>
        ) : null;

    const inputClass = (name: FieldName) =>
        `w-full bg-slate-900 border ${touched[name] && fieldErrors[name] ? "border-red-500 focus:ring-red-500" : "border-slate-700 focus:ring-blue-500"
        } rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition`;

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-20 animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="text-emerald-400 w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-white">¡Registro Exitoso!</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Tus datos han sido recibidos. Nuestro equipo se pondrá en contacto contigo con las mejores oportunidades del mundo ecuestre.
                </p>
                <button onClick={() => setSubmitted(false)} className="text-blue-400 hover:underline font-medium">
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-20 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero */}
            <section className="text-center space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Tu Conexión con el Mundo Ecuestre
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Descubre oportunidades exclusivas en caballos, monturas y equipamiento premium. Regístrate y recibe ofertas personalizadas.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={openModal}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        Registrarme <Send size={18} />
                    </button>
                    <button
                        onClick={scrollToFeatures}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-3 rounded-full font-bold transition flex items-center gap-2"
                    >
                        Descubre Más <ChevronDown size={18} />
                    </button>
                </div>
            </section>

            {/* Hook Phrases */}
            <section id="hooks" className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition text-center">
                    <div className="bg-blue-500/20 p-3 rounded-2xl w-fit mx-auto mb-4">
                        <Trophy className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Caballos de Élite</h3>
                    <p className="text-slate-400">Accede a un catálogo seleccionado de ejemplares de alto valor, verificados y evaluados por expertos del sector.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500/50 transition text-center">
                    <div className="bg-indigo-500/20 p-3 rounded-2xl w-fit mx-auto mb-4">
                        <Heart className="text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ofertas Personalizadas</h3>
                    <p className="text-slate-400">Nuestro sistema de inteligencia artificial encuentra las mejores oportunidades según tu perfil y presupuesto.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-teal-500/50 transition text-center">
                    <div className="bg-teal-500/20 p-3 rounded-2xl w-fit mx-auto mb-4">
                        <Sparkles className="text-teal-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Conexión Directa</h3>
                    <p className="text-slate-400">Conecta directamente con criadores, proveedores y establos premium sin intermediarios.</p>
                </div>
            </section>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800 sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Regístrate Ahora</h2>
                                <p className="text-sm text-slate-400">Acceso exclusivo a oportunidades premium</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-700 rounded-full transition text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-5">
                            {/* Privacy Note */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex gap-3 items-start">
                                <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" size={18} />
                                <p className="text-xs text-blue-200 leading-relaxed">
                                    Tratamos tus datos con estricta confidencialidad. Tu información personal está protegida y solo se utilizará para enviarte ofertas relevantes del sector ecuestre.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                {/* Nombre */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">Nombre Completo *</label>
                                    <input
                                        type="text" name="userName" value={form.userName}
                                        onChange={handleChange} onBlur={() => handleBlur("userName")}
                                        placeholder="Ej. Juan Pérez" className={inputClass("userName")}
                                    />
                                    <FieldError name="userName" />
                                </div>

                                {/* Teléfono + Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">Teléfono *</label>
                                        <input
                                            type="tel" name="userPhone" value={form.userPhone}
                                            onChange={handleChange} onBlur={() => handleBlur("userPhone")}
                                            placeholder="+57 300 000 0000" className={inputClass("userPhone")}
                                        />
                                        <FieldError name="userPhone" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">
                                            Email <span className="text-slate-500 normal-case font-normal">(opcional)</span>
                                        </label>
                                        <input
                                            type="email" name="userEmail" value={form.userEmail}
                                            onChange={handleChange} onBlur={() => handleBlur("userEmail")}
                                            placeholder="persona@ejemplo.com" className={inputClass("userEmail")}
                                        />
                                        <FieldError name="userEmail" />
                                    </div>
                                </div>

                                {/* País */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">País *</label>
                                        <select
                                            name="userCountry" value={form.userCountry}
                                            onChange={handleChange} onBlur={() => handleBlur("userCountry")}
                                            className={`${inputClass("userCountry")} appearance-none cursor-pointer`}
                                        >
                                            <option value="">— Selecciona —</option>
                                            {LATAM_COUNTRIES.map((c) => (
                                                <option key={c.name} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                        <FieldError name="userCountry" />
                                    </div>
                                    {isOtro && (
                                        <div className="animate-in slide-in-from-left-2 duration-300">
                                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">Especificar País *</label>
                                            <input
                                                type="text" name="userCountryOther" value={form.userCountryOther}
                                                onChange={handleChange} onBlur={() => handleBlur("userCountryOther")}
                                                placeholder="Nombre del país"
                                                className={inputClass("userCountryOther")}
                                            />
                                            <FieldError name="userCountryOther" />
                                        </div>
                                    )}
                                </div>

                                {/* Ciudad — cascading */}
                                {form.userCountry && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">Ciudad *</label>
                                        {isOtro ? (
                                            <input
                                                type="text" name="userCity" value={form.userCity}
                                                onChange={handleChange} onBlur={() => handleBlur("userCity")}
                                                placeholder="Ingresa tu ciudad"
                                                className={inputClass("userCity")}
                                            />
                                        ) : (
                                            <select
                                                name="userCity" value={form.userCity}
                                                onChange={handleChange} onBlur={() => handleBlur("userCity")}
                                                className={`${inputClass("userCity")} appearance-none cursor-pointer`}
                                            >
                                                <option value="">— Selecciona tu ciudad —</option>
                                                {availableCities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        )}
                                        <FieldError name="userCity" />
                                    </div>
                                )}

                                {/* Tipo + Presupuesto */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1 flex items-center gap-1.5">
                                            Tipo de Cliente
                                            <div className="relative inline-block">
                                                <button
                                                    type="button"
                                                    onMouseEnter={() => setShowTypeTooltip(true)}
                                                    onMouseLeave={() => setShowTypeTooltip(false)}
                                                    className="text-slate-500 hover:text-blue-400 transition"
                                                >
                                                    <HelpCircle size={13} />
                                                </button>
                                                {showTypeTooltip && (
                                                    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl p-3 text-xs text-slate-300 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left normal-case tracking-normal font-normal">
                                                        <p className="font-semibold text-white mb-1">¿Cuál es tu perfil?</p>
                                                        <p className="mb-1.5"><span className="text-blue-400 font-semibold">Individual (B2C):</span> Persona natural que busca caballos, equipos o servicios ecuestres para uso personal o familiar.</p>
                                                        <p><span className="text-indigo-400 font-semibold">Empresa (B2B):</span> Establo, hacienda, proveedor o empresa que adquiere en volumen o con fines comerciales.</p>
                                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45" />
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                        <select
                                            name="userType" value={form.userType} onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
                                        >
                                            <option value={1}>Individual (B2C)</option>
                                            <option value={2}>Empresa (B2B)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">
                                            Presupuesto Equino * <span className="text-slate-500 normal-case font-normal">(USD)</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm pointer-events-none">$</span>
                                            <input
                                                type="number" name="userBudget" value={form.userBudget}
                                                onChange={handleChange} onBlur={() => handleBlur("userBudget")}
                                                min="1" placeholder="5,000"
                                                className={`${inputClass("userBudget")} pl-7`}
                                            />
                                        </div>
                                        <FieldError name="userBudget" />
                                    </div>
                                </div>

                                {apiError && (
                                    <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{apiError}</p>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit" disabled={loading}
                                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl flex items-center justify-center gap-2 ${loading
                                                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 active:scale-[0.98]"
                                            }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Procesando...
                                            </span>
                                        ) : (
                                            <>Enviar Registro <Send size={18} /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
