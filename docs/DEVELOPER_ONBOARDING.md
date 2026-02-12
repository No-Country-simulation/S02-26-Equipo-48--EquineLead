# 🎓 Developer Onboarding Guide - EquineLead

> **Bienvenido al equipo EquineLead!**<br> 
Esta guía te llevará paso a paso desde cero hasta estar completamente productivo en el proyecto.

---

## 🏁 **Analogía del Proyecto**

EquineLead es como un **auto de carreras de alta tecnología**. Antes de salir a la pista (producción), cada componente debe pasar por inspección técnica rigurosa. Tu rol es ser parte del equipo que construye, prueba y mantiene este vehículo de alto rendimiento.

---

## 📚 **Ruta de Aprendizaje Recomendada**

### **Día 1: Entender el Panorama General**

#### **1. Lee el README Principal** (15 minutos)
📖 [README.md](../README.md)

**Qué aprenderás:**
- ✅ ¿Qué problema resuelve EquineLead?
- ✅ ¿Cuál es el objetivo del proyecto?
- ✅ ¿Qué tecnologías usamos?
- ✅ ¿Cómo está organizado el código?

**Puntos clave:**
- Somos un motor de crecimiento para la industria ecuestre
- Convertimos visitantes en leads de alto valor ($50K caballos, $2K saddles)
- Usamos C#, Python, Rust, Swift, Kotlin

---

#### **2. Entiende la Infraestructura** (20 minutos)
📖 [infrastructure/README.md](../infrastructure/README.md)

**Qué aprenderás:**
- ✅ ¿Dónde corre el código? (Oracle Cloud Infrastructure)
- ✅ ¿Cómo se despliega? (Terraform + Docker)
- ✅ ¿Cuál es el flujo de desarrollo? (Feature → Dev → Main)

**Puntos clave:**
- Tenemos 2 instancias en OCI: Jenkins (1GB) + App Server (6GB)
- Usamos Terraform para infraestructura como código
- Docker para empaquetar servicios

---

#### **3. Conoce el Flujo de Testing** (30 minutos)
📖 [tests/README.md](../tests/README.md)

**Qué aprenderás:**
- ✅ ¿Cómo probamos el código?
- ✅ ¿Qué tipos de tests tenemos?
- ✅ ¿Cómo ejecuto tests localmente?

**Puntos clave:**
- Tenemos health checks, tests unitarios, y tests de integración
- Ejecutas `./tests/scripts/run_all_tests.sh` antes de cada push
- Jenkins ejecuta automáticamente los mismos tests en cada PR

---

#### **4. Entiende la Automatización (CI/CD)** (20 minutos)
📖 [ci-cd/jenkins/README.md](../ci-cd/jenkins/README.md)

**Qué aprenderás:**
- ✅ ¿Qué hace Jenkins?
- ✅ ¿Cómo funciona el pipeline?
- ✅ ¿Qué pasa cuando hago push?

**Puntos clave:**
- Jenkins es el "director del taller mecánico"
- Ejecuta tests automáticamente en cada push
- Reporta resultados en GitHub PRs

---

### **Día 2: Setup y Primer Código**

#### **5. Configura tu Entorno Local** (1 hora)

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd equine-lead

# 2. Instalar herramientas según tu componente
# Ver sección "Getting Started" en README.md

# 3. Configurar entorno de testing
./tests/scripts/setup_test_env.sh

# 4. Ejecutar tests para verificar setup
./tests/scripts/run_all_tests.sh
```

**Si algo falla:**
- Ver [tests/README.md - Troubleshooting](../tests/README.md#-troubleshooting)
- Preguntar en el canal del equipo

---

#### **6. Lee la Documentación de tu Componente** (30 minutos)

Según tu rol, lee el README específico:

- **Backend Developer**: [src/backend-csharp/README.md](../src/backend-csharp/README.md)
- **Data Scientist**: [src/data-science/README.md](../src/data-science/README.md)
- **Systems Engineer**: [src/scrapper-rust/README.md](../src/scrapper-rust/README.md)
- **Frontend Developer**: [src/frontend-web/README.md](../src/frontend-web/README.md)
- **Mobile Developer**: [src/mobile-apps/README.md](../src/mobile-apps/README.md)

---

#### **7. Haz tu Primer Cambio** (1 hora)

```bash
# 1. Crear feature branch
git checkout -b feature/mi-primer-cambio

# 2. Hacer un cambio pequeño (ej: agregar un comentario)
# ...

# 3. Ejecutar tests localmente
./tests/scripts/run_all_tests.sh

# 4. Commit y push
git add .
git commit -m "feat: Mi primer cambio"
git push origin feature/mi-primer-cambio

# 5. Crear Pull Request en GitHub
# - Ir a GitHub
# - Crear PR: feature/mi-primer-cambio → dev
# - Esperar que Jenkins valide
# - Solicitar review
```

---

### **Día 3-5: Profundizar en tu Área**

#### **8. Explora el Código de tu Componente**

- Lee el código existente
- Entiende la arquitectura
- Identifica patrones comunes
- Pregunta sobre lo que no entiendas

#### **9. Escribe tu Primer Test**

- Lee [tests/README.md - Cómo Contribuir](../tests/README.md#-cómo-contribuir)
- Escribe un test unitario simple
- Ejecuta localmente
- Haz PR

#### **10. Participa en Code Reviews**

- Revisa PRs de otros developers
- Aprende de los comentarios que recibes
- Haz preguntas constructivas

---

## 🔄 **Flujo de Trabajo Diario**

### **Antes de Empezar a Codear**

```bash
# 1. Actualizar tu rama local
git checkout dev
git pull origin dev

# 2. Crear feature branch
git checkout -b feature/nombre-descriptivo
```

### **Durante el Desarrollo**

```bash
# 1. Escribir código
# ...

# 2. Ejecutar tests frecuentemente
./tests/scripts/run_backend_tests.sh  # O el script de tu componente

# 3. Commit frecuente
git add .
git commit -m "feat: Descripción del cambio"
```

### **Antes de Push**

```bash
# 1. Ejecutar TODOS los tests
./tests/scripts/run_all_tests.sh

# 2. Si todo pasa, push
git push origin feature/nombre-descriptivo

# 3. Crear Pull Request en GitHub
```

### **Después del PR**

```bash
# 1. Esperar que Jenkins valide (automático)
# 2. Solicitar review de al menos 1 developer
# 3. Atender comentarios si los hay
# 4. Merge cuando esté aprobado
```

---

## 📊 **Mapa de Documentación**

```
README.md (Inicio)
    ├── infrastructure/README.md (¿Dónde corre?)
    │   ├── terraform/ (Provisión de recursos)
    │   └── docker/ (Configuración de servicios)
    │
    ├── tests/README.md (¿Cómo probar?)
    │   ├── scripts/README.md (Scripts de automatización)
    │   ├── backend-csharp/ (Tests del Backend)
    │   ├── data-science/ (Tests de ML/IA)
    │   ├── scrapper-rust/ (Tests del Scrapper)
    │   └── frontend-web/ (Tests del Frontend)
    │
    ├── ci-cd/README.md (¿Cómo automatizar?)
    │   └── jenkins/README.md (Configuración de pipelines)
    │
    └── src/ (Código fuente)
        ├── backend-csharp/
        ├── data-science/
        ├── scrapper-rust/
        ├── frontend-web/
        └── mobile-apps/
```

---

## 🆘 **Recursos de Ayuda**

### **Problemas Comunes**

| Problema | Solución |
|----------|----------|
| Tests fallan localmente | Ver [tests/README.md - Troubleshooting](../tests/README.md#-troubleshooting) |
| Jenkins no ejecuta tests | Ver [ci-cd/jenkins/README.md - Troubleshooting](../ci-cd/jenkins/README.md#-troubleshooting) |
| No sé qué comando ejecutar | Ver [tests/scripts/README.md](../tests/scripts/README.md) |
| Error de compilación | Ver README de tu componente específico |

### **Canales de Comunicación**

- **General**: Canal de equipo en Slack/Discord
- **Testing**: Preguntar en canal de DevOps
- **Componente específico**: Preguntar al líder técnico de tu área

---

## ✅ **Checklist de Onboarding**

### **Semana 1**
- [ ] Leí README.md principal
- [ ] Entiendo la infraestructura (infrastructure/README.md)
- [ ] Entiendo el flujo de testing (tests/README.md)
- [ ] Entiendo CI/CD (ci-cd/jenkins/README.md)
- [ ] Configuré mi entorno local
- [ ] Ejecuté tests exitosamente
- [ ] Hice mi primer PR

### **Semana 2**
- [ ] Leí documentación de mi componente
- [ ] Entiendo la arquitectura de mi área
- [ ] Escribí mi primer test
- [ ] Participé en code reviews
- [ ] Completé mi primera feature

### **Semana 3-4**
- [ ] Trabajo de forma autónoma
- [ ] Ayudo a otros developers
- [ ] Contribuyo a mejorar la documentación
- [ ] Propongo mejoras al proceso

---

## 🎯 **Objetivos de Aprendizaje**

### **Nivel Principiante (Semana 1-2)**
- ✅ Entender el propósito del proyecto
- ✅ Configurar entorno local
- ✅ Ejecutar tests
- ✅ Hacer PRs básicos

### **Nivel Intermedio (Semana 3-4)**
- ✅ Escribir código de calidad
- ✅ Escribir tests completos
- ✅ Revisar PRs de otros
- ✅ Debuggear problemas

### **Nivel Avanzado (Mes 2+)**
- ✅ Diseñar features completas
- ✅ Optimizar código existente
- ✅ Mentorear a nuevos developers
- ✅ Contribuir a arquitectura

---

## 📞 **Contactos Clave**

- **DevOps Lead**: Diego Zapata Salhuana
- **Backend Lead**: [Nombre]
- **Data Science Lead**: [Nombre]
- **Frontend Lead**: [Nombre]
- **Mobile Lead**: [Nombre]

---

## 🔗 **Enlaces Rápidos**

- [🏠 README Principal](../README.md)
- [🏗️ Infraestructura](../infrastructure/README.md)
- [🧪 Testing](../tests/README.md)
- [🤖 CI/CD](../ci-cd/README.md)
- [🔧 Jenkins](../ci-cd/jenkins/README.md)
- [📜 Scripts de Testing](../tests/scripts/README.md)

---

> **Recuerda**: Todos empezamos desde cero. No tengas miedo de hacer preguntas. ¡Bienvenido al equipo! 🏁✨
