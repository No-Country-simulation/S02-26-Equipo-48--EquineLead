# 🔄 Guía de Sincronización de Git - EquineLead

Esta guía detalla el flujo de trabajo diario para mantener el repositorio local actualizado con los cambios del equipo en GitHub, evitando conflictos y manteniendo el orden sin mezclar ramas prematuramente.

---

## 🚀 Opción 1: Sincronización Paso a Paso (Recomendado)

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

3. **Actualizar tu rama de trabajo:**
   Trae tus propios cambios o los de tus colaboradores directos.
   ```bash
   git pull origin $(git branch --show-current)
   ```

---

## ⚡ Opción 2: El "Comando Ninja" (Un solo paso)

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

## 📊 Visualización de Cambios

Para confirmar que tus ramas están al día y ver el estado del repositorio:

### Listar todas las ramas con detalle técnico
Muestra qué rama local está atrasada (`behind`) o adelantada (`ahead`) respecto a GitHub.
```bash
git branch -a -vv
```

### Estado de la rama actual
Revisar si tienes archivos pendientes por subir o cambios locales.
```bash
git status
```

---

> [!NOTE]
> Mantener el repositorio sincronizado diariamente facilita la detección temprana de bloqueos y asegura que tu **Tracking Issue** de gestión siempre reporte datos reales.
