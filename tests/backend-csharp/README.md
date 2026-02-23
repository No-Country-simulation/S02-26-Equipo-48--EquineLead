# 03.2. 🔧 Backend C# - Tests

> **Analogía**: El Backend C# es el **motor** del auto de carreras EquineLead. Estos tests verifican que el motor arranque correctamente, responda a comandos, y funcione sin fallos antes de salir a la pista.

---

## 🎯 **Propósito**

Esta carpeta contiene todos los tests para el componente Backend C# del proyecto EquineLead, que incluye:

- API REST para gestión de leads
- Lógica de negocio
- Integración con base de datos
- Orquestación de servicios

---

## 🏗️ **Estructura de Tests**

```
backend-csharp/
├── UnitTests/                    # Tests unitarios
│   ├── Controllers/              # Tests de controladores API
│   │   └── LeadControllerTests.cs
│   ├── Services/                 # Tests de servicios de negocio
│   │   └── LeadServiceTests.cs
│   └── backend-tests.csproj      # Proyecto de tests
├── IntegrationTests/             # Tests de integración
│   ├── ApiTests.cs               # Tests de endpoints completos
│   └── DatabaseTests.cs          # Tests de acceso a datos
├── health_check_test.cs          # ✅ Test básico de salud
└── README.md                     # Este archivo
```

---

## 🚗 **La Analogía del Motor**

| Tipo de Test | Qué Verifica | Analogía |
|--------------|--------------|----------|
| **Health Check** | ¿Compila el código? | ¿El motor enciende? |
| **Unit Tests** | ¿Funciones individuales trabajan bien? | ¿Cada pistón funciona? |
| **Integration Tests** | ¿Los componentes se comunican? | ¿El motor se conecta a la transmisión? |

---

## 🚀 **Cómo Ejecutar los Tests**

### **Usando el script de automatización**

```bash
# Desde la raíz del proyecto
./tests/scripts/run_backend_tests.sh
```

Este script:
1. ✅ Verifica que .NET SDK esté instalado
2. ✅ Compila el proyecto
3. ✅ Ejecuta todos los tests
4. ✅ Muestra resultados con colores

---

### **Manualmente con dotnet**

```bash
# Navegar a la carpeta de tests
cd tests/backend-csharp

# Ejecutar todos los tests
dotnet test

# Ejecutar tests con más detalle
dotnet test --verbosity detailed

# Ejecutar solo un test específico
dotnet test --filter "FullyQualifiedName~HealthCheckTests"
```

---

## 📦 **Requisitos**

### **Software Necesario**

- **.NET SDK 6.0+** - [Descargar aquí](https://dotnet.microsoft.com/download)
- **xUnit** - Framework de testing (se instala automáticamente)

### **Verificar Instalación**

```bash
# Verificar que .NET está instalado
dotnet --version

# Debería mostrar algo como: 6.0.xxx o 7.0.xxx
```

---

## 🧪 **Tests Actuales**

### **Health Check Test**

**Archivo**: `health_check_test.cs`

**Propósito**: Verificar que el entorno de testing funciona correctamente.

```csharp
[Fact]
public void Application_Should_Compile_Successfully()
{
    // Verifica que el proyecto compila sin errores
    Assert.True(true);
}
```

**Cuándo se ejecuta**:
- En cada push a GitHub
- Antes de aprobar un Pull Request
- Localmente antes de hacer commit

---

## 🎓 **Para Principiantes**

### **¿Qué es xUnit?**

**xUnit** es un framework de testing para C#. Es como un "examinador automático" que:

1. Lee tus tests (métodos con `[Fact]`)
2. Los ejecuta uno por uno
3. Verifica si pasan o fallan
4. Te muestra un reporte

### **Anatomía de un Test**

```csharp
[Fact]  // ← Marca este método como un test
public void NombreDescriptivo_DelTest()
{
    // Arrange (Preparar): Configurar datos de prueba
    var expected = 4;
    
    // Act (Actuar): Ejecutar la función a probar
    var actual = 2 + 2;
    
    // Assert (Afirmar): Verificar el resultado
    Assert.Equal(expected, actual);
}
```

### **Convenciones de Nombres**

```
[Método]_[Escenario]_[ResultadoEsperado]

Ejemplos:
✅ CreateLead_WithValidData_ReturnsSuccess
✅ GetLead_WithInvalidId_ThrowsException
✅ UpdateLead_WhenNotFound_Returns404
```

---

## 📊 **Tipos de Tests**

### **Tests Unitarios**

**Qué prueban**: Una función o método individual, aislado.

**Ejemplo**:
```csharp
[Fact]
public void CalculateLeadScore_WithHighEngagement_ReturnsHighScore()
{
    // Arrange
    var lead = new Lead { Visits = 10, TimeOnSite = 300 };
    var scorer = new LeadScorer();
    
    // Act
    var score = scorer.Calculate(lead);
    
    // Assert
    Assert.True(score > 80);
}
```

---

### **Tests de Integración**

**Qué prueban**: Varios componentes trabajando juntos (API + DB).

**Ejemplo**:
```csharp
[Fact]
public async Task CreateLead_SavesToDatabase()
{
    // Arrange
    var client = new TestHttpClient();
    var newLead = new { Name = "Test", Email = "test@example.com" };
    
    // Act
    var response = await client.PostAsync("/api/leads", newLead);
    
    // Assert
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
}
```

---

## 🔄 **Integración con Jenkins**

Estos tests se ejecutan automáticamente cuando:

1. **Push a feature branch** → Ejecuta health checks
2. **Pull Request** → Ejecuta todos los tests
3. **Merge a dev/main** → Ejecuta tests + validaciones adicionales

Ver: [Jenkinsfile.backend](../../ci-cd/jenkins/Jenkinsfile.backend)

---

## 📈 **Roadmap de Tests**

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 1** | Health checks básicos | ✅ Completado |
| **Fase 2** | Tests unitarios de servicios | ⚠️ Pendiente |
| **Fase 3** | Tests de controladores API | ⚠️ Pendiente |
| **Fase 4** | Tests de integración con DB | ⚠️ Pendiente |

---

## 🐛 **Troubleshooting**

### **dotnet: command not found**

**Solución**: Instala .NET SDK
```bash
# Ubuntu/Debian
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 6.0
```

### **No test is available**

**Solución**: Verifica que el archivo tenga `[Fact]` o `[Theory]`
```csharp
[Fact]  // ← Necesario para que xUnit lo detecte
public void MyTest() { ... }
```

### **Tests pasan localmente pero fallan en Jenkins**

**Posibles causas**:
- Diferencias en variables de entorno
- Rutas absolutas vs relativas
- Dependencias no instaladas en Jenkins

---

## 🤝 **Cómo Contribuir**

### **Agregar un Nuevo Test**

1. Crea un archivo en `UnitTests/` o `IntegrationTests/`
2. Sigue la convención de nombres
3. Usa el patrón Arrange-Act-Assert
4. Ejecuta localmente antes de commit

```bash
# Ejecutar tus nuevos tests
dotnet test --filter "FullyQualifiedName~TuNuevoTest"
```

---

## 📚 **Recursos Adicionales**

- [Documentación oficial de xUnit](https://xunit.net/)
- [Best Practices de Testing en C#](https://docs.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)
- [Guía de Testing de Microsoft](https://docs.microsoft.com/en-us/dotnet/core/testing/)

---

## 🔗 **Enlaces Relacionados**

- [⬆️ Volver a Tests Principal](../README.md)
- [📖 Scripts de Automatización](../scripts/README.md)
- [📖 Jenkins CI/CD](../../ci-cd/jenkins/README.md)

---

> **Recuerda**: Un motor bien probado es un motor confiable. ¡Escribe tests para tu código! 🔧✨
