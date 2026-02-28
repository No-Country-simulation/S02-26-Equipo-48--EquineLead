using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.DTOs;
using Project_No_Country_E48.Data;

namespace Project_No_Country_E48.Services
{
    /// <summary>
    /// Servicio que encapsula la llamada HTTP al FastAPI de Data Science.
    /// Construye el payload desde la BD, llama a Python y retorna el resultado.
    /// </summary>
    public class ScoringApiService
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _context;

        public ScoringApiService(HttpClient httpClient, AppDbContext context)
        {
            _httpClient = httpClient;
            _context = context;
        }

        /// <summary>
        /// Obtiene el score de un usuario llamando al FastAPI de Data Science.
        /// </summary>
        /// <param name="userId">ID del usuario a evaluar</param>
        /// <returns>ScoringResponseDto con score, clasificación y metadata del modelo</returns>
        public async Task<ScoringResponseDto> GetScoreAsync(int userId)
        {
            // 1. Cargar usuario desde BD
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception($"Usuario {userId} no encontrado.");

            // 2. Cargar interacciones del usuario
            var interactions = await _context.LeadInteractions
                .Where(i => i.UserId == userId)
                .ToListAsync();

            // 3. Construir el payload según el contrato con Python
            var requestPayload = new ScoringRequestDto
            {
                UserId = userId.ToString(),
                UserType = user.UserType.ToString(),   // "B2B" o "B2C"
                UserBudget = (float)user.UserBudget,
                CreatedAt = user.UserCreatedAt,
                Interactions = interactions.Select(i => new InteractionDto
                {
                    InteractionType = (int)i.InteractionType,
                    InteractionDate = i.InteractionDate
                }).ToList()
            };

            // 4. Serializar y enviar al FastAPI
            var json = JsonSerializer.Serialize(requestPayload, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response;
            try
            {
                response = await _httpClient.PostAsync("/api/v1/scoring/calculate", content);
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"No se pudo conectar al servicio de Data Science: {ex.Message}");
            }

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error HTTP {(int)response.StatusCode} desde Data Science: {error}");
            }

            // 5. Deserializar la respuesta de Python
            var responseJson = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<ScoringResponseDto>(responseJson, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return result!;
        }
    }
}
