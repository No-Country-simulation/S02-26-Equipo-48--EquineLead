using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Enums;
using Project_No_Country_E48.Models;
using static Project_No_Country_E48.Data.AppDbContex;

namespace Project_No_Country_E48.Services
{
    public class ScoreService
    {
        private readonly AppDbContext _context;

        public ScoreService(AppDbContext context)
        {
            _context = context;
        }


        //Metodo principal-Logica para calcular Score y Guardar
        public async Task RecalculateLeadScore(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return;

            var interactions = await _context.LeadInteractions
                .Where(i => i.UserId == userId)
                .Include(i => i.Product)
                .ToListAsync();

            int score = 0;

            //=====================
            // I — INTERACCIONES
            //=====================
            foreach (var interaction in interactions)
            {
                if (interaction.InteractionType == null)
                    continue;

                switch (interaction.InteractionType)
                {
                    case InteractionTypeEnum.View:
                        score += 5;
                        break;
                    case InteractionTypeEnum.Click:
                        score += 10;
                        break;
                    case InteractionTypeEnum.Download:
                        score += 15;
                        break;
                    case InteractionTypeEnum.Consulta:
                        score += 25;
                        break;
                    case InteractionTypeEnum.ContactRequest:
                        score += 40;
                        break;
                }
            }

            //====================
            // P — PRESUPUESTO
            //====================
            if (user.UserBudget < 2000)
                score += 5;
            else if (user.UserBudget <= 10000)
                score += 15;
            else if (user.UserBudget <= 50000)
                score += 25;
            else
                score += 40;

            // =========================
            // T — TIPO DE USUARIO
            // =========================

            if (user.UserType == UserTypeEnum.B2C)
                score += 10;
            else if (user.UserType == UserTypeEnum.B2B)
                score += 20;


            // =========================
            // P — PENALIZACIÓN POR INACTIVIDAD
            // =========================

            int inactivityPenalty = 0;

            var lastInteractionDate = interactions
                .OrderByDescending(i => i.InteractionDate)
                .Select(i => i.InteractionDate)
                .FirstOrDefault();

            if (lastInteractionDate != default)
            {
                var daysInactive = (DateTime.UtcNow - lastInteractionDate).TotalDays;

                if (daysInactive >= 30 && daysInactive < 90)
                    inactivityPenalty = 15;
                else if (daysInactive >= 90 && daysInactive < 180)
                    inactivityPenalty = 25;
                else if (daysInactive >= 180)
                    inactivityPenalty = 35;
            }

            // Aplicar penalización
            score -= inactivityPenalty;

            // =========================
            // V — NO DEBE EXISTIR SCORE NEGATIVO
            // =========================

            if (score < 0) score = 0;

            ScoreClassificationEnum classification =
                score <= 30 ? ScoreClassificationEnum.Cold :
                score <= 70 ? ScoreClassificationEnum.Warm :
                ScoreClassificationEnum.Hot;

            var existingScore = await _context.LeadScores
                .FirstOrDefaultAsync(ls => ls.UserId == userId);

            if (existingScore == null)
            {
                _context.LeadScores.Add(new LeadScore
                {
                    UserId = userId,
                    LeadScoreValue = score,
                    LeadScoreClassification = classification,
                    LeadScoreDate = DateTime.UtcNow,
                    ScoreModelVersion = "1"
                });
            }
            else
            {
                existingScore.LeadScoreValue = score;
                existingScore.LeadScoreClassification = classification;
                existingScore.LeadScoreDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
    }
}

