/// Health Check Tests - Verificación básica de compilación
/// 
/// Analogía: Este test es como el "check engine light" de un auto.
/// No verifica que el auto corra bien, solo que el motor enciende.

#[cfg(test)]
mod health_tests {
    
    #[test]
    fn it_compiles_successfully() {
        // Test básico para verificar que el proyecto compila
        assert_eq!(2 + 2, 4, "El proyecto debe compilar sin errores");
    }

    #[test]
    fn basic_string_operations() {
        // Test básico de operaciones con strings
        let greeting = String::from("Hello, EquineLead!");
        assert!(greeting.contains("EquineLead"));
    }

    #[test]
    fn basic_vector_operations() {
        // Test básico de operaciones con vectores
        let numbers = vec![1, 2, 3, 4, 5];
        assert_eq!(numbers.len(), 5);
        assert_eq!(numbers[0], 1);
    }

    #[test]
    #[should_panic(expected = "Este test debe fallar intencionalmente")]
    fn intentional_panic_test() {
        // Test para verificar que el framework maneja panics correctamente
        panic!("Este test debe fallar intencionalmente");
    }
}

#[cfg(test)]
mod environment_tests {
    
    #[test]
    fn test_result_type() {
        // Test usando Result<T, E> para manejo de errores
        let result: Result<i32, &str> = Ok(42);
        assert!(result.is_ok());
    }

    #[test]
    fn test_option_type() {
        // Test usando Option<T>
        let some_value = Some(100);
        assert!(some_value.is_some());
        assert_eq!(some_value.unwrap(), 100);
    }
}
