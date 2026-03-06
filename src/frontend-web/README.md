# 📊 EquineLead Analytics Dashboard

Frontend moderno desarrollado para la gestión y análisis de leads en la industria ecuestre. Esta aplicación permite visualizar métricas críticas, tendencias de clasificación y fuentes de interacción, todo con soporte completo multi-idioma.

## 🚀 Características Principales

- **Dashboard en Tiempo Real**: Visualización de métricas clave como Pipeline Value, Win Rate y Score promedio.
- **Gráficas Interactivas**:
  - Distribución de Usuarios (B2B vs B2C).
  - Embudo de Conversión.
  - Fuente de Interacciones (Redes sociales, web, formularios).
  - Evolución de Clasificación (Frío, Tibio, Caliente).
- **Internacionalización (i18n)**: Soporte completo para **Español, Inglés y Portugués**. Cambio de idioma instantáneo con persistencia en `localStorage`.
- **Gestión de Sincronización**: Botón de sincronización con el Scrapper de Rust y panel de historial de actividad.
- **Generación de Reportes**: Exportación de datos de leads a formato PDF/Excel (generación local).

## 🛠 Stack Tecnológico

- **Core**: React 18 + TypeScript + Vite
- **Estilo**: TailwindCSS
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **i18n**: i18next + react-i18next
- **Notificaciones**: React Toastify

## 📥 Instalación y Setup

1. Navegar al directorio del frontend:
   ```bash
   cd src/frontend-web
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno (archivo `.env`):
   ```bash
   VITE_API_URL=http://localhost:8000/api
   ```

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🌍 Internacionalización

La aplicación utiliza un sistema centralizado de traducciones ubicado en `src/i18n/locales/`. 

- `es.json`: Español (Predeterminado)
- `en.json`: Inglés
- `pt.json`: Portugués

Para añadir nuevos textos, edite los archivos JSON y utilice el hook `useTranslation` de `react-i18next` en los componentes:

```tsx
const { t } = useTranslation();
return <h1>{t('dashboard.title')}</h1>;
```

## 📁 Estructura del Proyecto

- `src/components/`: Componentes UI reutilizables (Botones, Gráficas, Layouts).
- `src/pages/`: Páginas principales (Dashboard, Landing, App Download).
- `src/services/`: Clientes API y lógica de reportes.
- `src/i18n/`: Configuración y archivos de traducción.
- `src/assets/`: Imágenes y recursos estáticos.

---
**Desarrollado por el equipo EquineLead**
