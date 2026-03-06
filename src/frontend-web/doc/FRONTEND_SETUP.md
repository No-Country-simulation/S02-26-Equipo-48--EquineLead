# 📊 EquineLead Analytics Dashboard - Frontend

Frontend moderno desarrollado con **React 18 + Vite + TailwindCSS + Recharts** y soporte multi-idioma nativo.

------------------------------------------------------------------------

# 🚀 1️⃣ Requisitos Previos

-   Node.js (v20 LTS recomendado)
-   npm
-   Backend ASP.NET Core (.NET 8.0)
-   Git

------------------------------------------------------------------------

# 📦 2️⃣ Instalación del Proyecto

```bash
git clone https://github.com/No-Country/equine-lead.git
cd src/frontend-web
npm install
```

------------------------------------------------------------------------

# 🎨 3️⃣ Tecnologías Utilizadas

-   **UI**: React 18, TailwindCSS, Lucide React
-   **Gráficos**: Recharts
-   **Comunicación**: Axios
-   **i18n**: i18next, react-i18next
-   **Notificaciones**: React Toastify
-   **Tooling**: Vite, TypeScript

------------------------------------------------------------------------

# 🔌 4️⃣ Configuración de API

La configuración de la URL base se maneja exclusivamente a través de variables de entorno para facilitar el despliegue.

Archivo: `src/services/api.ts`

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

------------------------------------------------------------------------

# 📡 5️⃣ Endpoints Implementados

- `GET /api/metrics/dashboard`: Métricas generales de leads.
- `GET /api/metrics/interactions`: Distribución por fuentes.
- `GET /api/metrics/funnel`: Datos del embudo de ventas.
- `GET /api/metrics/classification`: Evolución temporal de temperatura.
- `POST /api/scrapper/sync`: Inicia sincronización con el scraper.

------------------------------------------------------------------------

# ▶️ 6️⃣ Ejecutar en Desarrollo

```bash
npm run dev
# URL predeterminada: http://localhost:5173
```

------------------------------------------------------------------------

# 🏗 7️⃣ Build Producción

```bash
npm run build
# Los archivos estáticos se generarán en la carpeta /dist
```

------------------------------------------------------------------------

# 🔄 8️⃣ Integración Pipeline Jenkins

El pipeline de Jenkins en `ci-cd/jenkins/` realiza automáticamente:
1. `npm install`
2. `npm run test` (Validación de estabilidad)
3. `npm run build`

------------------------------------------------------------------------

# 🌍 9️⃣ Internacionalización (i18n)

El sistema soporta ES, EN y PT.

- **Configuración**: `src/i18n/index.ts`
- **Locales**: `src/i18n/locales/*.json`
- **Persistencia**: Se guarda la elección en `localStorage` bajo la llave `equinelead_lang`.

------------------------------------------------------------------------

# 📁 10️⃣ Estructura de Directorios

```text
src/
├── components/     # UI Reutilizable (Charts, Toast, Switchers)
├── pages/          # Vistas de página completa (Dashboard, Landing)
├── services/       # Conectores de API y lógica de negocio
├── i18n/           # Configuración multi-idioma
├── App.tsx         # Enrutamiento y proveedores
└── main.tsx        # Punto de entrada
```

------------------------------------------------------------------------

# 👨‍💻 Créditos

**EquineLead Dev Team**  
Proyecto NoCountry Challenges - E48
