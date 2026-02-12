# 🤖 Scripts de Automatización - Tests

> **Analogía**: Estos scripts son los **mecánicos automáticos** del taller de EquineLead. Cada script es como un mecánico especializado que sabe exactamente qué inspeccionar y cómo hacerlo, trabajando sin descanso para asegurar que el auto de carreras esté en perfecto estado.

---

## 🎯 **Propósito**

Esta carpeta contiene scripts bash que automatizan la ejecución de tests para todos los componentes del proyecto EquineLead. Son la columna vertebral de la infraestructura de CI/CD.

---

## 📁 **Scripts Disponibles**

```
scripts/
├── run_all_tests.sh          # 🚀 Ejecuta TODOS los tests
├── check_builds.sh            # 🔍 Verifica compilación de todos los componentes
├── run_backend_tests.sh       # 🔧 Tests del Backend C#
├── run_datascience_tests.sh   # 🧠 Tests de Data Science
├── run_scrapper_tests.sh      # 🦀 Tests del Scrapper Rust
├── run_frontend_tests.sh      # 🎨 Tests del Frontend Web
├── run_integration_tests.sh   # 🔗 Tests de integración
├── setup_test_env.sh          # ⚙️ Configura entorno de testing
└── README.md                  # Este archivo
```

---

## 🚗 **La Analogía del Mecánico Automático**

| Script | Mecánico Especializado | Qué Inspecciona |
|--------|------------------------|-----------------|
| `run_all_tests.sh` | 👨‍🔧 Jefe de Taller | Coordina todos los mecánicos |
| `check_builds.sh` | 🔍 Inspector de Calidad | Verifica que todo compile |
| `run_backend_tests.sh` | 🔧 Mecánico del Motor | Inspecciona el motor (Backend) |
| `run_datascience_tests.sh` | 🧠 Técnico Electrónico | Revisa el cerebro (IA/ML) |
| `run_scrapper_tests.sh` | 📡 Especialista en Sensores | Verifica sensores (Scrapper) |
| `run_frontend_tests.sh` | 🎨 Diseñador de Interiores | Inspecciona el tablero (UI) |

---

## 🚀 **Cómo Usar los Scripts**

### **1. Ejecutar TODOS los tests** (Recomendado para CI/CD)

```bash
# Desde la raíz del proyecto
./tests/scripts/run_all_tests.sh
```

**Qué hace**:
- ✅ Ejecuta tests de Backend C#
- ✅ Ejecuta tests de Data Science
- ✅ Ejecuta tests de Scrapper Rust
- ✅ Ejecuta tests de Frontend Web
- ✅ Muestra resumen final con estadísticas

**Cuándo usarlo**:
- Antes de hacer un Pull Request
- En Jenkins (CI/CD automático)
- Antes de hacer merge a `dev` o `main`

---

### **2. Verificar solo compilación** (Rápido)

```bash
./tests/scripts/check_builds.sh
```

**Qué hace**:
- ✅ Verifica que Backend C# compile
- ✅ Verifica que Data Science no tenga errores de sintaxis
- ✅ Verifica que Scrapper Rust compile
- ✅ Verifica que Frontend Web compile

**Cuándo usarlo**:
- Verificación rápida antes de commit
- Cuando solo quieres saber si el código compila
- Como primer paso antes de ejecutar tests

---

### **3. Ejecutar tests de un componente específico**

```bash
# Backend C#
./tests/scripts/run_backend_tests.sh

# Data Science
./tests/scripts/run_datascience_tests.sh

# Scrapper Rust
./tests/scripts/run_scrapper_tests.sh

# Frontend Web
./tests/scripts/run_frontend_tests.sh
```

**Cuándo usarlo**:
- Cuando trabajas solo en un componente
- Para debugging de tests específicos
- Para ahorrar tiempo en desarrollo

---

## 📊 **Estructura de un Script**

Todos los scripts siguen la misma estructura:

```bash
#!/bin/bash

# 1. Header con descripción y analogía
###############################################################################
# Script: run_backend_tests.sh
# Propósito: Ejecutar tests del Backend C#
# Analogía: Este script es como el "mecánico del motor"...
###############################################################################

# 2. Configuración de seguridad
set -e  # Detener si hay errores

# 3. Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'  # No Color

# 4. Verificación de requisitos
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ Error: .NET SDK no está instalado${NC}"
    exit 1
fi

# 5. Ejecución de tests
dotnet test

# 6. Reporte de resultados
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TESTS EXITOSOS${NC}"
else
    echo -e "${RED}❌ TESTS FALLARON${NC}"
fi
```

---

## 🎓 **Para Principiantes**

### **¿Qué es un script bash?**

Un **script bash** es como una "receta automatizada" que le dice a la computadora qué hacer paso a paso.

**Ejemplo simple**:
```bash
#!/bin/bash
echo "Hola, mundo!"
echo "Ejecutando tests..."
npm test
echo "¡Listo!"
```

### **¿Cómo hacer un script ejecutable?**

```bash
# Dar permisos de ejecución
chmod +x mi_script.sh

# Ejecutar el script
./mi_script.sh
```

### **Comandos bash comunes en los scripts**

```bash
# Verificar si un comando existe
if ! command -v node &> /dev/null; then
    echo "Node.js no está instalado"
fi

# Cambiar de directorio
cd /path/to/directory

# Ejecutar un comando
npm test

# Verificar código de salida
if [ $? -eq 0 ]; then
    echo "Éxito"
else
    echo "Error"
fi
```

---

## 🔧 **Detalles de Cada Script**

### **`run_all_tests.sh`** - Maestro de Orquesta

**Propósito**: Ejecuta todos los tests del proyecto en secuencia.

**Características**:
- ✅ Ejecuta tests en orden lógico
- ✅ Captura resultados de cada componente
- ✅ Muestra resumen final con estadísticas
- ✅ Retorna código de error si algún test falla

**Output ejemplo**:
```
🚀 EquineLead - Ejecutando TODOS los tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶ Ejecutando: Backend C#
✅ Backend C# Tests: PASSED

▶ Ejecutando: Data Science
✅ Data Science Tests: PASSED

📊 RESUMEN DE RESULTADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Backend C#: PASSED
✅ Data Science: PASSED
✅ Scrapper Rust: PASSED
✅ Frontend Web: PASSED

Total: 4 tests
Pasados: 4
Fallados: 0

🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!
```

---

### **`check_builds.sh`** - Inspector de Calidad

**Propósito**: Verifica que todos los componentes compilen sin ejecutar tests.

**Ventajas**:
- ⚡ Más rápido que ejecutar tests completos
- ✅ Detecta errores de compilación temprano
- ✅ Útil para verificación rápida

---

### **Scripts Individuales** - Mecánicos Especializados

Cada script individual (`run_backend_tests.sh`, etc.):

1. **Verifica requisitos** (SDK, runtime, etc.)
2. **Instala dependencias** (si es necesario)
3. **Compila el proyecto** (si aplica)
4. **Ejecuta los tests**
5. **Reporta resultados** con colores

---

## 🔄 **Integración con Jenkins**

Los Jenkinsfiles llaman a estos scripts:

```groovy
// En Jenkinsfile
stage('Test') {
    steps {
        sh './tests/scripts/run_backend_tests.sh'
    }
}
```

**Ventajas**:
- ✅ Mismos scripts localmente y en CI/CD
- ✅ Fácil de debuggear (puedes ejecutar el mismo script)
- ✅ Consistencia entre ambientes

---

## 🐛 **Troubleshooting**

### **Error: "Permission denied"**

**Solución**: Dar permisos de ejecución
```bash
chmod +x tests/scripts/*.sh
```

### **Error: "command not found"**

**Solución**: Instalar la herramienta faltante
```bash
# Para .NET
sudo apt-get install dotnet-sdk-6.0

# Para Node.js
sudo apt-get install nodejs npm

# Para Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### **Script falla en Jenkins pero funciona localmente**

**Posibles causas**:
- Variables de entorno diferentes
- Rutas absolutas vs relativas
- Herramientas no instaladas en Jenkins

**Solución**: Verificar que Jenkins tenga:
- Mismas versiones de SDKs
- Variables de entorno configuradas
- Permisos de ejecución

---

## 🤝 **Cómo Contribuir**

### **Crear un Nuevo Script**

1. Copia la estructura de un script existente
2. Actualiza el header con descripción y analogía
3. Implementa la lógica específica
4. Agrega manejo de errores
5. Prueba localmente antes de commit

```bash
# Template básico
#!/bin/bash
set -e

echo "🔧 Ejecutando mi nuevo test..."

# Tu lógica aquí

if [ $? -eq 0 ]; then
    echo "✅ ÉXITO"
else
    echo "❌ ERROR"
    exit 1
fi
```

---

## 📚 **Recursos Adicionales**

- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [ShellCheck](https://www.shellcheck.net/) - Linter para bash

---

## 🔗 **Enlaces Relacionados**

- [⬆️ Volver a Tests Principal](../README.md)
- [📖 Backend C# Tests](../backend-csharp/README.md)
- [📖 Data Science Tests](../data-science/README.md)
- [📖 Scrapper Rust Tests](../scrapper-rust/README.md)
- [📖 Frontend Web Tests](../frontend-web/README.md)
- [📖 Jenkins CI/CD](../../ci-cd/jenkins/README.md)

---

> **Recuerda**: Los mecánicos automáticos nunca descansan. ¡Automatiza todo lo que puedas! 🤖✨
