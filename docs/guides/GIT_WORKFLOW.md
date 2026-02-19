# 🔄 Guía de Sincronización de Git - EquineLead

Esta guía detalla el flujo de trabajo diario para mantener el repositorio local actualizado con los cambios del equipo en GitHub, evitando conflictos y manteniendo el orden sin mezclar ramas prematuramente.

## 🛠️ Paso 0: Habilitar Seguimiento (Tracking)

**¿Para qué sirve?**
Si al ejecutar `git branch -vv` no ves corchetes `[origin/...]` al lado de una rama, Git no sabe compararla con la nube.

> [!CAUTION]
> **Estructura Crítica del Comando:** debe llevar DOS argumentos.
> `git branch --set-upstream-to=origin/RAMA_REMOTA RAMA_LOCAL`

**Ejemplos:**
```bash
git branch --set-upstream-to=origin/main main
git branch --set-upstream-to=origin/dev dev
git branch --set-upstream-to=origin/feature/devops-automation feature/devops-automation
```

*Si omites el segundo nombre, Git vinculará la rama donde estés parado actualmente al remoto que pusiste.*

---

## 🚀 Opción 1: Sincronización Paso a Paso (Recomendado)

> 📍 **Ejecutar desde**: Tu rama de trabajo (`feature/*`)

Este método es el más seguro y educativo para entender qué está pasando en el repositorio.

1. **Actualizar la "visión" del servidor:**
   Trae metadatos y limpia ramas que ya fueron borradas en GitHub.
   ```bash
   git fetch --all --prune
   ```

2. **Actualizar ramas base (dev/main) en frío:**
   Sincroniza tus ramas principales sin tener que moverte de tu rama actual.
   ```bash
   git fetch origin dev:dev
   git fetch origin main:main
   ```

3. **Sincronizar tu rama actual:**
   *Este comando SOLO actualiza la rama en la que estás trabajando.*
   ```bash
   git pull origin $(git branch --show-current)
   ```

> [!IMPORTANT]
> **¿Y las otras ramas `feature/*`?**
> Para actualizar otras ramas, debes cambiar a ellas con `git checkout` y repetir el `git pull`. Si quieres saber qué rama necesita actualizarse, ve el paso de **Visualización de Cambios**.

---

## ⚡ Opción 2: El "Comando Ninja" (Un solo paso)

> 📍 **Ejecutar desde**: Tu rama de trabajo (`feature/*`)

Si prefieres la velocidad, usa esta cadena de comandos que ejecuta la lógica anterior en un solo paso:

```bash
git fetch origin '+refs/heads/*:refs/heads/*' --prune ; git pull origin $(git branch --show-current)
```

### 🛠️ Configurar un Alias (Atajo Permanente)
Para no escribir todo lo anterior, configura este alias una sola vez:
```bash
git config --global alias.sync-all "!git fetch origin '+refs/heads/*:refs/heads/*' --prune; git pull origin \$(git branch --show-current)"
```

De ahora en adelante, solo tendrás que escribir:
```bash
git sync-all
```

---

## 🧊 Congelar cambios (Git Stash)

Si quieres cambiar de rama pero tienes cambios pendientes que no quieres comitear todavía, puedes "congelarlos" temporalmente.

1. **Guardar cambios en el "baúl" (Stash):**
   ```bash
   git stash
   ```
   *Esto limpia tu directorio de trabajo y te permite hacer `git checkout` con libertad.*

2. **Recuperar tus cambios después:**
   Vuelve a tu rama original y ejecuta:
   ```bash
   git stash pop
   ```

---

## 🤝 Opción 3: Integrar novedades del equipo (desde `dev`)

> 📍 **Ejecutar desde**: Tu rama de trabajo (`feature/*`)

Usa esta opción cuando quieras traer a tu rama lo que otros compañeros (o el área de DevOps) han subido a la rama principal de desarrollo.

1. **Asegúrate de tener el `dev` de GitHub en tu PC:**
   ```bash
   git fetch origin dev:dev
   ```

2. **Mezcla esas novedades en tu rama actual:**
   ```bash
   git merge dev
   ```

> [!TIP]
> **¿`git pull` sobreescribe mi código?**<br>
> No. `git pull` y `git merge` son comandos "constructivos". <br>
> Intentan **fusionar** el código nuevo con el tuyo. Si ambos editaron la misma línea, Git te avisará para que tú decidas qué versión mantener (Conflicto). Tu código nunca desaparecerá sin aviso.

---

## 📊 Visualización de Cambios

Para confirmar que tus ramas están al día y ver el estado del repositorio:

### Listar todas las ramas con detalle técnico
Te permite identificar qué ramas locales están **atrasadas** (`behind`) después de un `fetch`.
```bash
git branch -vv
```
*Si ves `[origin/nombre-rama: behind X]`, significa que debes hacer checkout a esa rama y ejecutar `git pull`.*

### Estado de la rama actual
Revisar si tienes archivos pendientes por subir o cambios locales.
```bash
git status
```

---

> [!NOTE]
> Mantener el repositorio sincronizado diariamente facilita la detección temprana de bloqueos y asegura que tu **Tracking Issue** de gestión siempre reporte datos reales.
