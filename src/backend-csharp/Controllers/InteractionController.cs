using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Models;
using Project_No_Country_E48.Services;
using Project_No_Country_E48.Data;

namespace Project_No_Country_E48.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InteractionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ScoreService _scoreService;
        private readonly InteractionService _interactionService;
        
        public InteractionController(
           AppDbContext context,
            ScoreService scoreService,
            InteractionService interactionService)
        {
            _context = context;
            _scoreService = scoreService;
            _interactionService = interactionService;
        }

        //Metodo post --> llamado a servicio interaccion para ejecutar la logica del metodo
        [HttpPost]
        public async Task<IActionResult> CreateInteraction([FromBody] LeadInteraction interaction)
        {

            try
            {
                if (interaction == null)
                    return BadRequest("Body requerido.");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                //var result = await _interactionService.CreateInteraction(interaction);
                //return Ok(result);
                var created = await _interactionService.CreateInteraction(interaction, HttpContext);
                return Ok(created);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ocurrió un error interno.");
            }
        }



        //Muestra todas las interacciones (trae de user y product solo datos necesarios)
        [HttpGet]
        public async Task<IActionResult> GetAllInteractions()
        {
            var interactions = await _context.LeadInteractions
                .Select(i => new
                {
                    i.InteractionId,
                    i.UserId,
                    UserName = i.User.UserName,        // solo lo que quieras mostrar del usuario
                    UserType = i.User.UserType,       
                    UserBudget = i.User.UserBudget,  
                    i.ProductId,
                    ProductName = i.Product.ProductName,  // solo lo que quieras mostrar del producto
                    ProductPrice = i.Product.ProductPrice,
                    i.InteractionSource,
                    i.InteractionType,
                    i.InteractionDate,
                    i.InteractionMetadataJson
                })
                .ToListAsync();

            return Ok(interactions);
        }

        //Get por id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInteractionById(int id)
        {
            var interaction = await _context.LeadInteractions
                .Where(i => i.InteractionId == id)
                .Select(i => new
                {
                    i.InteractionId,
                    i.UserId,
                    UserName = i.User.UserName,        // campos de usuario que se desea mostrar 
                    UserType = i.User.UserType,
                    UserBudget = i.User.UserBudget,
                    i.ProductId,
                    ProductName = i.Product.ProductName,  // campos de productos que se desea mostrar
                    ProductPrice = i.Product.ProductPrice,
                    i.InteractionSource,
                    i.InteractionType,
                    i.InteractionDate,
                    i.InteractionMetadataJson
                })
                .FirstOrDefaultAsync();

            if (interaction == null)
                return NotFound();

            return Ok(interaction);
        }

        /*[HttpPost]
        public async Task<IActionResult> CreateInteraction([FromBody] LeadInteraction interaction)
        {

            // Validar que exista el usuario
            var userExists = await _context.Users.AnyAsync(u => u.UserId == interaction.UserId);
            if (!userExists)
                return BadRequest("User does not exist");

            // Validar que exista el producto
            var productExists = await _context.Products.AnyAsync(p => p.ProductId == interaction.ProductId);
            if (!productExists)
                return BadRequest("Product does not exist");

            interaction.InteractionDate = DateTime.UtcNow;

            _context.LeadInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            // RECALCULAR SCORE AUTOMÁTICO
            await _scoreService.RecalculateLeadScore(interaction.UserId);

            return Ok(interaction);
        }*/



    }
}
