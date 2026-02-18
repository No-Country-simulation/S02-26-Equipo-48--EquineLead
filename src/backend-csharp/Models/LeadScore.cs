using Project_No_Country_E48.Enums;
using System.ComponentModel.DataAnnotations;

namespace Project_No_Country_E48.Models
{
    public class LeadScore
    {
        [Key]
        public int LeadScoreId { get; set; }
        public int UserId   { get; set; }
        public decimal LeadScoreValue { get; set; }
        public ScoreClassificationEnum LeadScoreClassification { get; set; }
        public DateTime LeadScoreDate { get; set; }
        public string? ScoreModelVersion { get; set; }

        //Relaciones
        public User? User { get; set; }

    }
}
