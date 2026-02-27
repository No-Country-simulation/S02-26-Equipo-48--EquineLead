namespace Project_No_Country_E48.DTOs
{
    // ─── REQUEST: Backend C# → FastAPI Python ──────────────────────────────────

    /// <summary>
    /// Payload que el backend envía al servicio de Data Science para calcular el score.
    /// Contrato acordado en: docs/data-contracts/contrato-json-scoring-v1.md
    /// </summary>
    public class ScoringRequestDto
    {
        public string UserId { get; set; }
        public string UserType { get; set; }       // "B2B" o "B2C"
        public float UserBudget { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<InteractionDto> Interactions { get; set; } = new();
    }

    /// <summary>
    /// Interacción individual dentro del payload de scoring.
    /// </summary>
    public class InteractionDto
    {
        public int InteractionType { get; set; }   // 1=View, 2=Click, 3=Download, 4=Consult, 5=ContactRequest
        public DateTime InteractionDate { get; set; }
    }

    // ─── RESPONSE: FastAPI Python → Backend C# ─────────────────────────────────

    /// <summary>
    /// Respuesta que devuelve el FastAPI de Data Science con el score calculado.
    /// </summary>
    public class ScoringResponseDto
    {
        public string UserId { get; set; }
        public decimal LeadScoreValue { get; set; }
        public int LeadScoreClassification { get; set; }  // 1=Cold, 2=Warm, 3=Hot
        public string LeadScoreLabel { get; set; }        // "Cold", "Warm", "Hot"
        public DateTime ScoreDate { get; set; }
        public string ScoreModelVersion { get; set; }     // "v1-rule-based"
    }
}
