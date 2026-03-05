using Microsoft.AspNetCore.Mvc;

namespace Project_No_Country_E48.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScrapperController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ScrapperController> _logger;

        public ScrapperController(IHttpClientFactory httpClientFactory, ILogger<ScrapperController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpPost("sync")]
        public async Task<IActionResult> SyncLeads()
        {
            _logger.LogInformation("Iniciando petición de sincronización al Scrapper Rust...");

            try
            {
                var client = _httpClientFactory.CreateClient("ScrapperClient");
                var response = await client.PostAsync("/sync", null);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Ok(new { message = "Sincronización iniciada correctamente.", details = content });
                }

                _logger.LogError("El scrapper respondió con error: {StatusCode}", response.StatusCode);
                return StatusCode((int)response.StatusCode, "El servicio de scrapper no respondió correctamente.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error conectando con el servicio de scrapper.");
                return StatusCode(500, "No se pudo conectar con el servicio de scrapper. Asegúrate de que esté ejecutándose en el puerto 8081.");
            }
        }
    }
}
