using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Enums;
using Project_No_Country_E48.Models;
using Project_No_Country_E48.Services;
using System;
using Project_No_Country_E48.Data;

namespace Project_No_Country_E48.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ScoreService _scoreService;

        public ScoreController(AppDbContext context, ScoreService scoreService)
        {
            _context = context;
            _scoreService = scoreService;
        }

        //Get TOP LEADS
        [HttpGet("top")]
        public async Task<IActionResult> GetTopLeads([FromQuery] int take = 10)
        {
            var topLeads = await _context.LeadScores
                .Include(ls => ls.User)
                .OrderByDescending(ls => ls.LeadScoreValue)
                .Take(take)
                .Select(ls => new
                {
                    userId = ls.UserId,
                    userName = ls.User.UserName,
                    score = ls.LeadScoreValue,
                    classification = ls.LeadScoreClassification,
                    date = ls.LeadScoreDate
                })
                .ToListAsync();

            return Ok(topLeads);
        }
        
        //Metodo para llamar servicio ScoreService para calcular la score manualmente
        [HttpPost("calculate/{userId}")]
        public async Task<IActionResult> CalculateScore(int userId)
        {
            await _scoreService.RecalculateLeadScore(userId);

            return Ok(new { message = "Score recalculado correctamente" });
        }

        /*
        //(Movilizado a service)
        //Metodo para calcular la score manualmente
        [HttpPost("calculate/{userId}")]
        public async Task<IActionResult> CalculateScore(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var interactions = await _context.LeadInteractions
                .Where(i => i.UserId == userId)
                .Include(i => i.Product)
                .ToListAsync();

            if (!interactions.Any())
                return NotFound("User has no interactions");

            int score = 0;

            // =========================
            // I — INTERACCIONES
            // =========================
            foreach (var interaction in interactions)
            {
                // por precio del producto
                if (interaction.Product != null)
                {
                    if (interaction.Product.ProductPrice > 40000)
                        score += 20;
                    else if (interaction.Product.ProductPrice > 20000)
                        score += 10;
                }

                // evento consulta
                if (interaction.InteractionType == InteractionTypeEnum.Consult)
                    score += 30;
            }

            // =========================
            // RECURRENCIA
            // =========================
            if (interactions.Count > 1)
                score += 5;

            // =========================
            // T — TIPO USUARIO
            // =========================
            if (user.UserType == UserTypeEnum.B2B)
                score += 15;

            // =========================
            // P — PENALIZACIÓN POR INACTIVIDAD
            // =========================
            var lastInteraction = interactions
                .Max(i => i.InteractionDate);

            var daysInactive = (DateTime.UtcNow - lastInteraction).Days;

            if (daysInactive > 30)
                score -= 20;
            else if (daysInactive > 15)
                score -= 10;

            // score nunca negativo
            if (score < 0)
                score = 0;

            // =========================
            // CLASIFICACIÓN
            // =========================
            ScoreClassificationEnum classification;

            if (score <= 30)
                classification = ScoreClassificationEnum.Cold;
            else if (score <= 70)
                classification = ScoreClassificationEnum.Warm;
            else
                classification = ScoreClassificationEnum.Hot;

            // =========================
            // GUARDAR
            // =========================
            var leadScore = new LeadScore
            {
                UserId = userId,
                LeadScoreValue = score,
                LeadScoreClassification = classification,
                LeadScoreDate = DateTime.UtcNow,
                ScoreModelVersion = "1"
            };

            _context.LeadScores.Add(leadScore);
            await _context.SaveChangesAsync();

            //return Ok(leadScore);
            return Ok(new
            {
                leadScoreId = leadScore.LeadScoreId,
                userId = leadScore.UserId,
                score = leadScore.LeadScoreValue,
                classification = leadScore.LeadScoreClassification,
                date = leadScore.LeadScoreDate
            });
        }
        */

    }
}
