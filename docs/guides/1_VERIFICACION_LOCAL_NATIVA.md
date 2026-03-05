# 1. Verificación Local Nativa (Desarrollo)

Esta guía detalla los pasos para levantar y validar cada componente del proyecto de forma nativa en tu entorno local.

## Objetivo
Validar la **lógica de negocio** y permitir un **ciclo de desarrollo rápido**. Este flujo es el ideal para realizar cambios en el código, ya que permite aprovechar el "Hot Reload" y herramientas de depuración (debuggers) sin la capa extra de abstracción de contenedores para el código fuente.

## Prerrequisitos
- .NET 8 SDK instalado.
- Node.js (v18 o superior) y npm.
- Python 3.12 y venv.
- Docker (solo para la base de datos).

## 🛠️ Configuración Crucial de la Terminal (Paso Previo)
Este paso es fundamental antes de iniciar cualquier validación. Sirve para que tu terminal pueda localizar las herramientas necesarias (`dotnet-ef`, `uvicorn`, `dotnet`) que están instaladas en rutas específicas del sistema. Sin esto, los comandos de los siguientes pasos fallarán con errores de "comando no encontrado".

Ejecuta lo siguiente en cada nueva terminal que abras para esta verificación:
```bash
export DOTNET_ROOT=/snap/dotnet-sdk/current
export PATH="$PATH:$DOTNET_ROOT:$HOME/.dotnet/tools"
```

## ⚠️ Configuración de Red (MANDATORIO)
Para que el Frontend encuentre al Backend en modo nativo, debes ajustar la URL en el archivo `.env`:

1. Abre `src/frontend-web/.env`.
2. Cambia `VITE_API_URL=http://localhost/api` por:
   ```env
   VITE_API_URL=http://localhost:5286/api
   ```
3. **Reinicia** el comando `npm run dev` para que Vite tome el cambio.

> [!WARNING]
>
> Al volver al flujo de **Docker (Despliegue)**, deberás revertir este cambio a `http://localhost/api`.

## 🐳 Limpieza de Contenedores Previos (Opcional)
Antes de iniciar la verificación nativa, es recomendable asegurarse de que no haya contenedores de Docker activos que puedan entrar en conflicto con los puertos locales.

1. **Verificar contenedores:** Ejecuta `docker ps` para identificar qué contenedores están activos en el sistema.
2. **Detener si es necesario:** Al apreciar el nombre de los contenedores que estén activos y que puedan interferir, puedes detenerlos con:
   ```bash
   docker stop [nombre_del_contenedor]
   ```

---

## Pasos de Verificación

### 1. Base de Datos (Único componente en Docker)
La base de datos se mantiene en Docker por comodidad de persistencia y limpieza.
- **Levantar:** `docker compose up -d db`

### 2. Motor de Data Science (Python)
1. Ve a la carpeta del motor: `cd src/data-science`
2. Activa el entorno virtual: `source venv/bin/activate` (o la ruta correspondiente).
3. Levanta el servicio:
```bash
PYTHONPATH=. uvicorn api:app --host 0.0.0.0 --port 8090 --reload
```
- **Validación:** Accede a [http://localhost:8090/docs](http://localhost:8090/docs).

### 3. Backend API (.NET)
1. Ve a la carpeta del backend: `cd src/backend-csharp`
2. Asegúrate de que las migraciones estén aplicadas: `dotnet ef database update`
3. Inicia la aplicación:
```bash
dotnet run
```
- **Validación:** Accede a [http://localhost:5286/swagger](http://localhost:5286/swagger).

### 4. Frontend Web (React)
1. Ve a la carpeta del frontend: `cd src/frontend-web`
2. Instala dependencias (si no lo has hecho): `npm install`
3. Inicia el servidor de desarrollo:
```bash
npm run dev
```
- **Validación:** Accede a [http://localhost:5173](http://localhost:5173).
  
### 5. Scrapper Rust (Alimentación de Datos)
1. Ve a la carpeta del scrapper: `cd src/scrapper-rust`
2. **Configurar entorno de Rust**:
   ```bash
   source $HOME/.cargo/env
   ```
3. Asegúrate de que el `.env` apunte a `http://localhost:5286`.
4. Ejecuta el scrapper:
   ```bash
   cargo run
   ```
- **Validación:** Observa los logs de la terminal. Deberías ver mensajes como `Lead enviado correctamente desde fuente ID X`.

### 6. Verificación de Puertos Activos
Para confirmar que todos los servicios están escuchando en sus respectivos puertos, ejecuta:
```bash
lsof -i :5432,8090,5286,5173
```
Este comando te mostrará una lista de los procesos que ocupan los puertos de la Database (5432), Data Science (8090), Backend (5286) y Frontend (5173). Si alguno no aparece, ese servicio no se inició correctamente.

---

## Resumen de Integración
Una vez que los cuatro pasos anteriores estén activos, navega por el Dashboard en el puerto 5173. El sistema debería mostrar las métricas obtenidas del Backend, el cual a su vez consulta al motor de Data Science y a la base de datos PostgreSQL.

> [!TIP]
> Si todo funciona correctamente en este paso, puedes proceder a la **[2. Verificación de Orquestación (Docker)](/home/degops/Projects/Repositorios/repo_NoCountryChallenges/work-simulation/equine-lead/docs/guides/2_VERIFICACION_ORQUESTACION_DOCKER.md)** para validar el empaquetado final.
