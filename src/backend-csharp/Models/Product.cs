using System.ComponentModel.DataAnnotations;

namespace Project_No_Country_E48.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public decimal ProductPrice { get; set; }
        public string ProductName { get; set; }
        public string ProductCategory { get; set; }
        public string? ProductUrl { get; set; }

        //Relaciones
        public ICollection<LeadInteraction> LeadInteractions { get; set; } = new List<LeadInteraction>();
    }
}
