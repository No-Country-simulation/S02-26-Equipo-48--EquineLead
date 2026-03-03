# 📊 EquineLead Analytics Dashboard - Frontend

Frontend moderno desarrollado con **React + Vite + TailwindCSS +
Recharts**\
Conectado a un backend en **ASP.NET Core Web API**.

------------------------------------------------------------------------

# 🚀 1️⃣ Requisitos Previos

-   Node.js (v18 o superior)
-   npm
-   Backend ASP.NET Core ejecutándose
-   Git

------------------------------------------------------------------------

# 📦 2️⃣ Instalación del Proyecto

git clone https://github.com/TU-USUARIO/equinelead-dashboard.git\
cd equinelead-dashboard\
npm install

------------------------------------------------------------------------

# 🎨 3️⃣ Tecnologías Utilizadas

-   React
-   Vite
-   TailwindCSS
-   Recharts
-   Axios

------------------------------------------------------------------------

# 🔌 4️⃣ Configuración del Backend

Editar:

src/services/api.js

Desarrollo: baseURL: "https://localhost:5001/api"

Producción: baseURL: "https://api.tudominio.com/api"

------------------------------------------------------------------------

# 📡 5️⃣ Endpoints Esperados

GET /api/metrics/dashboard\
GET /api/metrics/interactions\
GET /api/metrics/funnel\
GET /api/metrics/classification

------------------------------------------------------------------------

# ▶️ 6️⃣ Ejecutar en Desarrollo

npm run dev\
http://localhost:5173

------------------------------------------------------------------------

# 🏗 7️⃣ Build Producción

npm run build\
Carpeta generada: /dist

------------------------------------------------------------------------

# 🔄 8️⃣ Integración Jenkins

npm install\
npm run build

Publicar carpeta /dist o desplegar en servidor.

------------------------------------------------------------------------

# 🌍 9️⃣ Variables de Entorno

Archivo .env:

VITE_API_URL=https://localhost:5001/api

En api.js: baseURL: import.meta.env.VITE_API_URL

------------------------------------------------------------------------

# 📁 10️⃣ Estructura

src/ ├── components/ ├── pages/ ├── services/ ├── App.jsx └── main.jsx

------------------------------------------------------------------------

# 👨‍💻 Autor

Junior Alexis Valera\
Proyecto SaaS EquineLead
