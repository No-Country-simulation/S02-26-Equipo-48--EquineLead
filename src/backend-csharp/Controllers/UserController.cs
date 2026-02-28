using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Data;
using Project_No_Country_E48.Models;

namespace Project_No_Country_E48.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }


        //Metodo Get 
        [HttpGet] //Obtener todos
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]//Obtener por ID
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        //Metodo Post

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            user.UserCreatedAt = DateTime.UtcNow;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        //Metodo Put (Update-Actualizar)

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            // actualizar campos
            user.UserName = updatedUser.UserName;
            user.UserPhone = updatedUser.UserPhone;
            user.UserEmail = updatedUser.UserEmail;
            user.UserCity = updatedUser.UserCity;
            user.UserBudget = updatedUser.UserBudget;
            user.UserType = updatedUser.UserType;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        //Metodo Delete

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
