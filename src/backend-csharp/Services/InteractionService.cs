using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Enums;
using Project_No_Country_E48.Models;
using Project_No_Country_E48.Data;

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
        public async Task<LeadInteraction> CreateInteraction(LeadInteraction interaction, HttpContext httpContext)
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


            // AUTO-GENERAR METADATA SI VIENE NULL
            if (string.IsNullOrWhiteSpace(interaction.InteractionMetadataJson))
            {
                interaction.InteractionMetadataJson = BuildMetadataFromHeaders(httpContext);
            }

            //  INFERIR en Tipo de Interaccion SOLO SI NO VIENE
            if (interaction.InteractionType == 0)
            {
                interaction.InteractionType = InferInteractionType(interaction);
            }

            //INFERIR en la fuente de interaccion SOLO SI NO VIENE
            if (interaction.InteractionSource == 0)
                interaction.InteractionSource = InferInteractionSource(interaction);

            // Fecha automática
            interaction.InteractionDate = DateTime.UtcNow;

            _context.LeadInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            // Recalcular score
            await _scoreService.RecalculateLeadScore(interaction.UserId);

            return interaction;
        }

        //================================================================================
        // Metodo para detectar metadata-datos extras (InteractionMetadataJson)
        private string BuildMetadataFromHeaders(HttpContext httpContext)
        {
            var headers = httpContext.Request.Headers;

            var metadata = new
            {
                userAgent = headers["User-Agent"].ToString(),
                referrer = headers["Referer"].ToString(),
                origin = headers["Origin"].ToString()
                //timestamp = DateTime.UtcNow //Desactivar captura de fecha
            };

            return System.Text.Json.JsonSerializer.Serialize(metadata);
        }


        //================================================================================
        // Metodo para detectar tipo de interaccion (InteractionType)
        private InteractionTypeEnum InferInteractionType(LeadInteraction interaction)
        {
            // Deteccion tipo de interaccion

            if (!string.IsNullOrEmpty(interaction.InteractionMetadataJson))
            {
                var meta = interaction.InteractionMetadataJson.ToLower();

                if (meta.Contains("download"))
                    return InteractionTypeEnum.Download;

                if (meta.Contains("contact"))
                    return InteractionTypeEnum.ContactRequest;

                if (meta.Contains("consulta"))
                    return InteractionTypeEnum.Consult;

                if (meta.Contains("click"))
                    return InteractionTypeEnum.Click;
            }

            // fallback por defecto
            return InteractionTypeEnum.View;
        }

        //=======================================================================================
        //Metodo para detectar tipo de fuente (InteractionSource)
        private InteractionSourceEnum InferInteractionSource(LeadInteraction interaction)
        {
            // Detectar tipo de fuente a traves del metadata

            if (!string.IsNullOrEmpty(interaction.InteractionMetadataJson))
            {
                var meta = interaction.InteractionMetadataJson.ToLower();

                if (meta.Contains("facebook") || meta.Contains("fb"))
                    return InteractionSourceEnum.Facebook;

                if (meta.Contains("instagram") || meta.Contains("ig"))
                    return InteractionSourceEnum.Instagram;

                if (meta.Contains("form"))
                    return InteractionSourceEnum.Formulario;

                if (meta.Contains("evento"))
                    return InteractionSourceEnum.Evento;

                if (meta.Contains("web"))
                    return InteractionSourceEnum.Web;
            }

            // 🛟 fallback
            return InteractionSourceEnum.Otro;
        }

    }
}
