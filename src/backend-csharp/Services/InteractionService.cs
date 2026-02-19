using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Models;
using static Project_No_Country_E48.Data.AppDbContex;
using static Project_No_Country_E48.Services.InteractionService;

namespace Project_No_Country_E48.Services
{
    public class InteractionService //: IInteractionService
    {
        private readonly AppDbContext _context;
        private readonly ScoreService _scoreService;

        public InteractionService(
            AppDbContext context,
            ScoreService scoreService)
        {
            _context = context;
            _scoreService = scoreService;
        }

        //Metodo Principal para interacciones
        public async Task<LeadInteraction> CreateInteraction(LeadInteraction interaction)
        {
            // Validar que exista el usuario
            var userExists = await _context.Users
                .AnyAsync(u => u.UserId == interaction.UserId);

            if (!userExists)
                throw new Exception("User does not exist");

            // Validar que exista el producto
            var productExists = await _context.Products
                .AnyAsync(p => p.ProductId == interaction.ProductId);

            if (!productExists)
                throw new Exception("Product does not exist");

            // Fecha automática
            interaction.InteractionDate = DateTime.UtcNow;

            _context.LeadInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            // Recalcular score
            await _scoreService.RecalculateLeadScore(interaction.UserId);

            return interaction;
        }



    }
}
