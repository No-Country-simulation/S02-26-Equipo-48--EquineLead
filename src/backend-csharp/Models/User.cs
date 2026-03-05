using Project_No_Country_E48.Enums;
using System.ComponentModel.DataAnnotations;

namespace Project_No_Country_E48.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public UserTypeEnum UserType { get; set; }
        public decimal UserBudget { get; set; }
        public string UserName { get; set; }
        public string UserPhone { get; set; }
        public string? UserEmail { get; set; }
        public string? UserCity { get; set; }
        public string? UserCountry { get; set; }
        public DateTime UserCreatedAt { get; set; }

        //Relaciones entre tablas
        public ICollection<LeadInteraction> LeadInteractions { get; set; } = new List<LeadInteraction>();
        public ICollection<LeadScore> LeadScores { get; set; } = new List<LeadScore>();
    }
}
