using Microsoft.AspNetCore.SignalR;
using Project_No_Country_E48.Enums;
using System.ComponentModel.DataAnnotations;

namespace Project_No_Country_E48.Models
{
    public class LeadInteraction
    {
        [Key]
        public int InteractionId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public InteractionSourceEnum InteractionSource { get; set; }
        public InteractionTypeEnum InteractionType { get; set; }
        public DateTime InteractionDate { get; set; }
        public string? InteractionMetadataJson { get; set; }

        //Relaciones
        public User? User { get; set; }
        public Product? Product { get; set; }
    }
}
