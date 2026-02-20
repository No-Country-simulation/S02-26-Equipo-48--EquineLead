# 03.5. 🎨 Frontend Web - Tests

> **Analogía**: El Frontend Web es el **tablero de instrumentos** del auto de carreras EquineLead. Estos tests verifican que el tablero muestre información correctamente, responda a interacciones del piloto, y presente datos de forma clara y precisa.

---

## 🎯 **Propósito**

Esta carpeta contiene todos los tests para el componente Frontend Web del proyecto EquineLead, que incluye:

- Dashboard de análisis de leads
- Landing page para captura de leads
- Componentes UI reutilizables
- Integración con Backend API

---

## 🏗️ **Estructura de Tests**

```
frontend-web/
├── unit/                         # Tests unitarios
│   ├── components/               # Tests de componentes React
│   │   ├── Dashboard.test.js
│   │   └── LandingPage.test.js
│   └── utils/                    # Tests de utilidades
│       └── helpers.test.js
├── integration/                  # Tests de integración
│   ├── dashboard-flow.test.js    # Tests de flujos de usuario
│   └── landing-page-flow.test.js
├── e2e/                          # Tests end-to-end
│   ├── dashboard.spec.js         # Tests E2E del dashboard
│   └── landing-page.spec.js      # Tests E2E de landing page
├── health_check.test.js          # ✅ Test básico de salud
├── jest.config.js                # Configuración de Jest
├── package.json                  # Dependencias de testing
└── README.md                     # Este archivo
```

---

## 🚗 **La Analogía del Tablero**

| Tipo de Test | Qué Verifica | Analogía |
|--------------|--------------|----------|
| **Health Check** | ¿Node.js y Jest funcionan? | ¿El tablero está encendido? |
| **Unit Tests** | ¿Componentes individuales renderizan? | ¿Cada indicador muestra datos? |
| **Integration Tests** | ¿Flujos de usuario funcionan? | ¿El piloto puede navegar el tablero? |
| **E2E Tests** | ¿La aplicación completa funciona? | ¿Todo el tablero funciona en conjunto? |

---

## 🚀 **Cómo Ejecutar los Tests**

### **Usando el script de automatización**

```bash
# Desde la raíz del proyecto
./tests/scripts/run_frontend_tests.sh
```

Este script:
1. ✅ Verifica que Node.js esté instalado
2. ✅ Instala dependencias (Jest, Testing Library)
3. ✅ Ejecuta todos los tests
4. ✅ Muestra resultados con colores

---

### **Manualmente con npm**

```bash
# Navegar a la carpeta de tests
cd tests/frontend-web

# Instalar dependencias
npm install

# Ejecutar todos los tests
npm test

# Ejecutar con cobertura de código
npm test -- --coverage

# Ejecutar en modo watch (re-ejecuta al cambiar archivos)
npm test -- --watch

# Ejecutar solo un archivo específico
npm test health_check.test.js
```

---

## 📦 **Requisitos**

### **Software Necesario**

- **Node.js 16+** - [Descargar aquí](https://nodejs.org/)
- **npm** - Viene incluido con Node.js
- **Jest** - Framework de testing
- **Testing Library** - Utilidades para testing de React

### **Instalación de Dependencias**

```bash
cd tests/frontend-web
npm install
```

Esto instalará:
- `jest` - Framework de testing
- `@testing-library/react` - Testing de componentes React
- `@testing-library/jest-dom` - Matchers adicionales
- `@testing-library/user-event` - Simulación de eventos de usuario

### **Verificar Instalación**

```bash
# Verificar que Node.js está instalado
node --version

# Verificar que npm está instalado
npm --version
```

---

## 🧪 **Tests Actuales**

### **Health Check Test**

**Archivo**: `health_check.test.js`

**Propósito**: Verificar que el entorno de testing funciona correctamente.

```javascript
test('should compile successfully', () => {
    expect(true).toBe(true);
});
```

**Cuándo se ejecuta**:
- En cada push a GitHub
- Antes de aprobar un Pull Request
- Localmente antes de hacer commit

---

## 🎓 **Para Principiantes**

### **¿Qué es Jest?**

**Jest** es un framework de testing para JavaScript. Es como un "evaluador automático" que:

1. Encuentra todos los archivos `*.test.js` o `*.spec.js`
2. Ejecuta todas las funciones `test()` o `it()`
3. Verifica si pasan o fallan
4. Te muestra un reporte detallado

### **Anatomía de un Test en Jest**

```javascript
describe('Nombre del componente o funcionalidad', () => {
    
    test('descripción de qué prueba este test', () => {
        // Arrange (Preparar): Configurar datos de prueba
        const input = 'test data';
        const expected = 'processed data';
        
        // Act (Actuar): Ejecutar la función a probar
        const actual = processData(input);
        
        // Assert (Afirmar): Verificar el resultado
        expect(actual).toBe(expected);
    });
});
```

### **Matchers Comunes de Jest**

```javascript
// Igualdad
expect(value).toBe(4);
expect(value).toEqual({ name: 'test' });

// Booleanos
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Números
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);

// Strings
expect(value).toContain('substring');
expect(value).toMatch(/regex/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Objetos
expect(obj).toHaveProperty('key');
```

---

## 📊 **Tipos de Tests**

### **Tests de Componentes**

**Qué prueban**: Que un componente renderiza correctamente.

**Ejemplo**:
```javascript
import { render, screen } from '@testing-library/react';
import Dashboard from '../../src/components/Dashboard';

test('Dashboard renders title correctly', () => {
    // Arrange & Act
    render(<Dashboard />);
    
    // Assert
    const title = screen.getByText(/EquineLead Dashboard/i);
    expect(title).toBeInTheDocument();
});
```

---

### **Tests de Interacción**

**Qué prueban**: Que el usuario puede interactuar con la UI.

**Ejemplo**:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import LeadForm from '../../src/components/LeadForm';

test('User can submit lead form', () => {
    // Arrange
    render(<LeadForm />);
    
    // Act
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);
    
    // Assert
    expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

---

### **Tests End-to-End (E2E)**

**Qué prueban**: Flujos completos de usuario en un navegador real.

**Ejemplo** (con Playwright):
```javascript
import { test, expect } from '@playwright/test';

test('User can complete lead capture flow', async ({ page }) => {
    // Navigate to landing page
    await page.goto('http://localhost:3000');
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## 🔄 **Integración con Jenkins**

Estos tests se ejecutan automáticamente cuando:

1. **Push a feature branch** → Ejecuta health checks
2. **Pull Request** → Ejecuta todos los tests
3. **Merge a dev/main** → Ejecuta tests + linting

Ver: [Jenkinsfile.frontend](../../ci-cd/jenkins/Jenkinsfile.frontend)

---

## 📈 **Roadmap de Tests**

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 1** | Health checks básicos | ✅ Completado |
| **Fase 2** | Tests de componentes UI | ⚠️ Pendiente |
| **Fase 3** | Tests de flujos de usuario | ⚠️ Pendiente |
| **Fase 4** | Tests E2E completos | ⚠️ Pendiente |

---

## 🐛 **Troubleshooting**

### **jest: command not found**

**Solución**: Instala las dependencias
```bash
cd tests/frontend-web
npm install
```

### **Cannot find module '@testing-library/react'**

**Solución**: Instala Testing Library
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### **Tests pasan localmente pero fallan en Jenkins**

**Posibles causas**:
- Variables de entorno diferentes
- Versiones de Node.js diferentes
- Dependencias no instaladas

**Solución**: Usa versiones fijas en `package.json`
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

---

## 🤝 **Cómo Contribuir**

### **Agregar un Nuevo Test**

1. Crea un archivo `*.test.js` en la carpeta apropiada
2. Usa nombres descriptivos
3. Sigue el patrón Arrange-Act-Assert
4. Ejecuta localmente antes de commit

```bash
# Ejecutar solo tus nuevos tests
npm test -- Dashboard.test.js
```

---

## 📚 **Recursos Adicionales**

- [Documentación oficial de Jest](https://jestjs.io/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright E2E Testing](https://playwright.dev/)

---

## 🔗 **Enlaces Relacionados**

- [⬆️ Volver a Tests Principal](../README.md)
- [📖 Scripts de Automatización](../scripts/README.md)
- [📖 Jenkins CI/CD](../../ci-cd/jenkins/README.md)

---

> **Recuerda**: Un tablero bien probado muestra información precisa. ¡Escribe tests para tu UI! 🎨✨
