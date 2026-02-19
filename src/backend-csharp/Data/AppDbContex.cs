using Microsoft.EntityFrameworkCore;
using Project_No_Country_E48.Models;
using System;

namespace Project_No_Country_E48.Data
{
    public class AppDbContex : DbContext
    {
        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options)
                : base(options)
            {
            }

            // Data
            public DbSet<User> Users { get; set; }
            public DbSet<Product> Products { get; set; }
            public DbSet<LeadInteraction> LeadInteractions { get; set; }
            public DbSet<LeadScore> LeadScores { get; set; }



            //Configuracion del modelo
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

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
}
