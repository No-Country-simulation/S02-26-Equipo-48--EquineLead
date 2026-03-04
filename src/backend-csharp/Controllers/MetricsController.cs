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
            var scores = await _context.LeadScores.ToListAsync();
            
            var averageScore = scores.Any() ? (double)scores.Average(s => s.LeadScoreValue) : 0;
            var hotLeads = scores.Count(s => s.LeadScoreClassification == ScoreClassificationEnum.Hot);
            var effectivity = totalLeads > 0 ? (double)hotLeads / totalLeads * 100 : 0;
            
            // Average ticket based on user budget
            var averageTicket = await _context.Users.AnyAsync() ? (double)await _context.Users.AverageAsync(u => u.UserBudget) : 0;

            return Ok(new
            {
                averageScore = Math.Round(averageScore, 1),
                totalLeads,
                effectivity = Math.Round(effectivity, 1),
                averageTicket = Math.Round(averageTicket, 0)
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
            var interactions = await _context.LeadInteractions.CountAsync();
            var scoredLeads = await _context.LeadScores.CountAsync();
            var hotLeads = await _context.LeadScores.CountAsync(s => s.LeadScoreClassification == ScoreClassificationEnum.Hot);
            
            // Mocking a closed state since we don't have a clear "Sale" record yet
            var closed = (int)(hotLeads * 0.4);

            var funnel = new[]
            {
                new { name = "Leads", value = totalLeads },
                new { name = "Interactions", value = interactions },
                new { name = "Scored", value = scoredLeads },
                new { name = "Hot Leads", value = hotLeads },
                new { name = "Closed", value = closed }
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
