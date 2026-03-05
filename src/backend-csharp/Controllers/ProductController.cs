using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Data;
using Project_No_Country_E48.Models;

namespace Project_No_Country_E48.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }
        /*public IActionResult Index()
        {
            return View();
        }*/

        //Post productos
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            // Evitar duplicados por nombre o URL
            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => 
                p.ProductName == product.ProductName || 
                p.ProductUrl == product.ProductUrl);

            if (existingProduct != null)
            {
                return Ok(existingProduct); // Retornar el existente en lugar de crear uno nuevo
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById),
                                   new { id = product.ProductId },
                                   product);
        }

        //Get producto en general 
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }
        
        //Get productos por id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }
    }
}


