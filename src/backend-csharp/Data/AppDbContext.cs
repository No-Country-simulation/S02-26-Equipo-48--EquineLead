using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Models;

namespace Project_No_Country_E48.Data
{
    /// <summary>
    /// Contexto de base de datos principal de la aplicación.
    /// Contiene las tablas de Usuarios, Productos, Interacciones y Scores.
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Tablas
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<LeadInteraction> LeadInteractions { get; set; } = null!;
        public DbSet<LeadScore> LeadScores { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de precisión para decimales (PostgreSQL)
            modelBuilder.Entity<User>()
                .Property(u => u.UserBudget)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.ProductPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<LeadScore>()
                .Property(ls => ls.LeadScoreValue)
                .HasPrecision(18, 2);
        }
    }
}
