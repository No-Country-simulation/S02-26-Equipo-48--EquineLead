using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Enums;
using Project_No_Country_E48.Models;
using Project_No_Country_E48.Data;

namespace Project_No_Country_E48.Services
{
    /// <summary>
    /// Orquesta el cálculo y persistencia del score.
    /// El cálculo real lo realiza el servicio de Data Science (FastAPI Python).
    /// </summary>
    public class ScoreService
    {
        private readonly AppDbContext _context;
        private readonly ScoringApiService _scoringApiService;

        public ScoreService(AppDbContext context, ScoringApiService scoringApiService)
        {
            _context = context;
            _scoringApiService = scoringApiService;
        }

        /// <summary>
        /// Calcula el score de un usuario delegando al FastAPI de Data Science,
        /// luego guarda o actualiza el resultado en la tabla LeadScores.
        /// </summary>
        public async Task RecalculateLeadScore(int userId)
        {
            // 1. Llamar a Python para obtener el score calculado
            var scoreResult = await _scoringApiService.GetScoreAsync(userId);

            // 2. Mapear la clasificación numérica al enum de C#
            var classification = scoreResult.LeadScoreClassification switch
            {
                1 => ScoreClassificationEnum.Cold,
                2 => ScoreClassificationEnum.Warm,
                3 => ScoreClassificationEnum.Hot,
                _ => ScoreClassificationEnum.Cold
            };

            // 3. Buscar si ya existe un registro de score para este usuario
            var existingScore = await _context.LeadScores
                .FirstOrDefaultAsync(ls => ls.UserId == userId);

            if (existingScore == null)
            {
                // Crear nuevo registro
                _context.LeadScores.Add(new LeadScore
                {
                    UserId = userId,
                    LeadScoreValue = scoreResult.LeadScoreValue,
                    LeadScoreClassification = classification,
                    LeadScoreDate = scoreResult.ScoreDate,
                    ScoreModelVersion = scoreResult.ScoreModelVersion   // "v1-rule-based" desde Python
                });
            }
            else
            {
                // Actualizar registro existente
                existingScore.LeadScoreValue = scoreResult.LeadScoreValue;
                existingScore.LeadScoreClassification = classification;
                existingScore.LeadScoreDate = scoreResult.ScoreDate;
                existingScore.ScoreModelVersion = scoreResult.ScoreModelVersion;
            }

            await _context.SaveChangesAsync();
        }
    }
}
