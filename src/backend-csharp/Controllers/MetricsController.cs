using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Data;
using Project_No_Country_E48.Enums;
using Project_No_Country_E48.Models;

namespace Project_No_Country_E48.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetricsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public MetricsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardMetrics()
        {
            var totalLeads = await _context.Users.CountAsync();
            if (totalLeads == 0) return Ok(new { averageScore = 0, totalLeads = 0, effectivity = 0, pipelineValue = 0, winRate = 0 });

            var avgScore = await _context.LeadScores.AverageAsync(s => s.LeadScoreValue);
            var hotLeads = await _context.LeadScores.CountAsync(s => s.LeadScoreClassification == ScoreClassificationEnum.Hot);
            
            // Pipeline Value: Suma de presupuestos de leads Hot (SQL)
            var hotLeadIds = await _context.LeadScores
                .Where(s => s.LeadScoreClassification == ScoreClassificationEnum.Hot)
                .Select(s => s.UserId)
                .ToListAsync();
            
            var pipelineValue = await _context.Users
                .Where(u => hotLeadIds.Contains(u.UserId))
                .SumAsync(u => u.UserBudget);

            // Win Rate Mock: Basado en la conversión 0.4 que usamos en el Funnel
            var winRate = 40.0;

            return Ok(new
            {
                averageScore = Math.Round(avgScore, 1),
                totalLeads,
                effectivity = Math.Round((double)hotLeads / totalLeads * 100, 1),
                pipelineValue = Math.Round((double)pipelineValue, 0),
                winRate
            });
        }

        [HttpGet("interactions")]
        public async Task<IActionResult> GetInteractionSources()
        {
            var interactions = await _context.LeadInteractions
                .GroupBy(i => i.InteractionSource)
                .Select(g => new
                {
                    source = g.Key.ToString(),
                    value = g.Count()
                })
                .ToListAsync();

            return Ok(interactions);
        }

        [HttpGet("funnel")]
        public async Task<IActionResult> GetFunnelData()
        {
            var totalLeads = await _context.Users.CountAsync();
            
            // MQL (Marketing Qualified Leads): Leads identificados como Warm o Hot
            var mqls = await _context.LeadScores
                .CountAsync(s => s.LeadScoreClassification == ScoreClassificationEnum.Warm || 
                                 s.LeadScoreClassification == ScoreClassificationEnum.Hot);
            
            // SQL (Sales Qualified Leads): Leads identificados directamente como Hot
            var sqls = await _context.LeadScores
                .CountAsync(s => s.LeadScoreClassification == ScoreClassificationEnum.Hot);
            
            // Mock de cierre de ventas (oportunidades ganadas)
            var closed = (int)(sqls * 0.4);

            var funnel = new[]
            {
                new { name = "Total Registrados", value = totalLeads },
                new { name = "MQLs (Leads Calificados)", value = mqls },
                new { name = "SQLs (Listos para Venta)", value = sqls },
                new { name = "Ventas Cerradas", value = closed }
            };

            return Ok(funnel);
        }

        [HttpGet("classification")]
        public async Task<IActionResult> GetClassificationEvolution()
        {
            // Group lead scores by month and classification
            var data = await _context.LeadScores
                .GroupBy(s => new { s.LeadScoreDate.Month, s.LeadScoreClassification })
                .Select(g => new
                {
                    Month = g.Key.Month,
                    Classification = g.Key.LeadScoreClassification,
                    Count = g.Count()
                })
                .ToListAsync();

            var months = data.Select(d => d.Month).Distinct().OrderBy(m => m);
            var result = months.Select(m => new
            {
                month = new DateTime(2024, m, 1).ToString("MMM"),
                cold = data.FirstOrDefault(d => d.Month == m && d.Classification == ScoreClassificationEnum.Cold)?.Count ?? 0,
                warm = data.FirstOrDefault(d => d.Month == m && d.Classification == ScoreClassificationEnum.Warm)?.Count ?? 0,
                hot = data.FirstOrDefault(d => d.Month == m && d.Classification == ScoreClassificationEnum.Hot)?.Count ?? 0
            });

            return Ok(result);
        }

        [HttpGet("lead-types")]
        public async Task<IActionResult> GetLeadTypeDistribution()
        {
            var b2cCount = await _context.Users.CountAsync(u => u.UserType == UserTypeEnum.B2C);
            var b2bCount = await _context.Users.CountAsync(u => u.UserType == UserTypeEnum.B2B);

            var distribution = new[]
            {
                new { name = "B2C (Personas)", value = b2cCount },
                new { name = "B2B (Empresas)", value = b2bCount }
            };

            return Ok(distribution);
        }

        [HttpGet("../reports/download")]
        public IActionResult DownloadReport()
        {
            var filePath = Path.Combine(_env.ContentRootPath, "wwwroot/files/report.pdf");
            if (!System.IO.File.Exists(filePath)) return NotFound("Report not found");
            
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/pdf", "report.pdf");
        }

        [HttpGet("../builds/latest-apk")]
        public IActionResult DownloadApk()
        {
            var filePath = Path.Combine(_env.ContentRootPath, "wwwroot/files/app-release.apk");
            if (!System.IO.File.Exists(filePath)) return NotFound("APK not found");

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/vnd.android.package-archive", "app-release.apk");
        }
    }
}
