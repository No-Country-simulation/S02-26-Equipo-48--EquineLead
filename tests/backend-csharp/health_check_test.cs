using Xunit;

namespace EquineLead.Tests
{
    /// <summary>
    /// Health Check Tests - Verificación básica de compilación
    /// 
    /// Analogía: Este test es como el "check engine light" de un auto.
    /// No verifica que el auto corra bien, solo que el motor enciende.
    /// </summary>
    public class HealthCheckTests
    {
        [Fact]
        public void Application_Should_Compile_Successfully()
        {
            // Arrange: Preparar el test
            var expectedResult = true;
            
            // Act: Ejecutar la acción
            var actualResult = true;
            
            // Assert: Verificar el resultado
            Assert.True(actualResult == expectedResult, 
                "El proyecto debe compilar sin errores");
        }

        [Fact]
        public void Basic_Math_Operations_Should_Work()
        {
            // Test básico para verificar que el framework de testing funciona
            var result = 2 + 2;
            Assert.Equal(4, result);
        }
    }
}
