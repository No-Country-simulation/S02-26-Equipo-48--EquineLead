# 03.4. 🦀 Scrapper Rust - Tests

> **Analogía**: El Scrapper Rust son los **sensores** del auto de carreras EquineLead. Estos tests verifican que los sensores capten datos del exterior correctamente, procesen la información a alta velocidad, y la transmitan sin errores al cerebro (Data Science).

---

## 🎯 **Propósito**

Esta carpeta contiene todos los tests para el componente Scrapper Rust del proyecto EquineLead, que incluye:

- Extracción de datos web (web scraping)
- Procesamiento de alta velocidad
- Validación de datos capturados
- Integración con el backend

---

## 🏗️ **Estructura de Tests**

```
scrapper-rust/
├── unit/                         # Tests unitarios
│   └── lib.rs                    # Tests de funciones individuales
├── integration/                  # Tests de integración
│   └── scraper_test.rs           # Tests del scraper completo
├── health_test.rs                # ✅ Test básico de salud
├── Cargo.toml                    # Configuración del proyecto de tests
└── README.md                     # Este archivo
```

---

## 🚗 **La Analogía de los Sensores**

| Tipo de Test | Qué Verifica | Analogía |
|--------------|--------------|----------|
| **Health Check** | ¿Rust y Cargo funcionan? | ¿Los sensores están encendidos? |
| **Unit Tests** | ¿Funciones individuales trabajan? | ¿Cada sensor lee correctamente? |
| **Integration Tests** | ¿El scraper completo funciona? | ¿Los sensores se comunican con el cerebro? |

---

## 🚀 **Cómo Ejecutar los Tests**

### **Usando el script de automatización**

```bash
# Desde la raíz del proyecto
./tests/scripts/run_scrapper_tests.sh
```

Este script:
1. ✅ Verifica que Rust/Cargo esté instalado
2. ✅ Compila el proyecto
3. ✅ Ejecuta todos los tests
4. ✅ Muestra resultados con colores

---

### **Manualmente con cargo**

```bash
# Navegar a la carpeta de tests
cd tests/scrapper-rust

# Ejecutar todos los tests
cargo test

# Ejecutar con output detallado
cargo test -- --nocapture

# Ejecutar solo tests unitarios
cargo test --lib

# Ejecutar solo tests de integración
cargo test --test '*'
```

---

## 📦 **Requisitos**

### **Software Necesario**

- **Rust 1.70+** - [Instalar desde rustup.rs](https://rustup.rs/)
- **Cargo** - Viene incluido con Rust

### **Instalación de Rust**

```bash
# Instalar Rust y Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Agregar Rust al PATH
source $HOME/.cargo/env
```

### **Verificar Instalación**

```bash
# Verificar que Rust está instalado
rustc --version

# Verificar que Cargo está instalado
cargo --version
```

---

## 🧪 **Tests Actuales**

### **Health Check Test**

**Archivo**: `health_test.rs`

**Propósito**: Verificar que el entorno de testing funciona correctamente.

```rust
#[test]
fn it_compiles_successfully() {
    assert_eq!(2 + 2, 4);
}
```

**Cuándo se ejecuta**:
- En cada push a GitHub
- Antes de aprobar un Pull Request
- Localmente antes de hacer commit

---

## 🎓 **Para Principiantes**

### **¿Qué es Cargo Test?**

**Cargo Test** es el framework de testing integrado en Rust. Es como un "inspector automático" que:

1. Encuentra todos los módulos marcados con `#[cfg(test)]`
2. Ejecuta todas las funciones marcadas con `#[test]`
3. Verifica si pasan o fallan
4. Te muestra un reporte detallado

### **Anatomía de un Test en Rust**

```rust
#[cfg(test)]  // ← Marca este módulo como tests
mod tests {
    use super::*;  // Importa funciones del módulo padre
    
    #[test]  // ← Marca esta función como un test
    fn test_nombre_descriptivo() {
        // Arrange (Preparar)
        let input = "test data";
        let expected = "processed data";
        
        // Act (Actuar)
        let actual = process_data(input);
        
        // Assert (Afirmar)
        assert_eq!(actual, expected);
    }
}
```

### **Macros de Assertion en Rust**

```rust
// Verificar igualdad
assert_eq!(actual, expected);

// Verificar desigualdad
assert_ne!(actual, unexpected);

// Verificar condición booleana
assert!(condition);

// Test que debe fallar (panic)
#[should_panic(expected = "mensaje de error")]
#[test]
fn test_that_should_panic() {
    panic!("mensaje de error");
}
```

---

## 📊 **Tipos de Tests**

### **Tests Unitarios**

**Qué prueban**: Una función individual, aislada.

**Ejemplo**:
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_parse_html_extracts_title() {
        // Arrange
        let html = r#"<html><head><title>Test Page</title></head></html>"#;
        
        // Act
        let title = parse_html_title(html);
        
        // Assert
        assert_eq!(title, Some("Test Page".to_string()));
    }
}
```

---

### **Tests de Integración**

**Qué prueban**: El scraper completo funcionando.

**Ejemplo**:
```rust
// En tests/integration/scraper_test.rs
use scrapper_rust::Scraper;

#[test]
fn test_scraper_fetches_data() {
    // Arrange
    let scraper = Scraper::new("https://example.com");
    
    // Act
    let result = scraper.fetch();
    
    // Assert
    assert!(result.is_ok());
    assert!(!result.unwrap().is_empty());
}
```

---

### **Tests Asíncronos**

**Qué prueban**: Operaciones asíncronas (HTTP requests, etc.).

**Ejemplo**:
```rust
#[tokio::test]  // ← Usa tokio para tests async
async fn test_async_scraping() {
    // Arrange
    let url = "https://api.example.com/data";
    
    // Act
    let response = fetch_url(url).await;
    
    // Assert
    assert!(response.is_ok());
}
```

---

## 🔄 **Integración con Jenkins**

Estos tests se ejecutan automáticamente cuando:

1. **Push a feature branch** → Ejecuta health checks
2. **Pull Request** → Ejecuta todos los tests
3. **Merge a dev/main** → Ejecuta tests + Clippy (linter)

Ver: [Jenkinsfile.scrapper](../../ci-cd/jenkins/Jenkinsfile.scrapper)

---

## 📈 **Roadmap de Tests**

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 1** | Health checks básicos | ✅ Completado |
| **Fase 2** | Tests de parsing HTML | ⚠️ Pendiente |
| **Fase 3** | Tests de HTTP requests | ⚠️ Pendiente |
| **Fase 4** | Tests de integración completa | ⚠️ Pendiente |

---

## 🐛 **Troubleshooting**

### **cargo: command not found**

**Solución**: Instala Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### **failed to compile**

**Solución**: Actualiza Rust a la última versión
```bash
rustup update
```

### **Tests lentos**

**Solución**: Ejecuta tests en paralelo (por defecto) o limita threads
```bash
# Ejecutar con 4 threads
cargo test -- --test-threads=4
```

---

## 🤝 **Cómo Contribuir**

### **Agregar un Nuevo Test**

1. Crea tests en el mismo archivo que el código (unit tests)
2. O crea un archivo en `tests/integration/` (integration tests)
3. Usa nombres descriptivos
4. Ejecuta localmente antes de commit

```bash
# Ejecutar solo un test específico
cargo test test_nombre_especifico

# Ejecutar con output detallado
cargo test -- --nocapture
```

---

## 📚 **Recursos Adicionales**

- [Documentación oficial de Rust Testing](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [Rust By Example - Testing](https://doc.rust-lang.org/rust-by-example/testing.html)
- [Cargo Book - Tests](https://doc.rust-lang.org/cargo/guide/tests.html)

---

## 🔗 **Enlaces Relacionados**

- [⬆️ Volver a Tests Principal](../README.md)
- [📖 Scripts de Automatización](../scripts/README.md)
- [📖 Jenkins CI/CD](../../ci-cd/jenkins/README.md)

---

> **Recuerda**: Sensores bien probados capturan datos precisos. ¡Escribe tests para tu scraper! 🦀✨
