# ============================================
# EquineLead - Motor de Lead Scoring
# Responsable: Data Science
# ============================================

class LeadScoringEngine:
    def __init__(self):
        self.score = 0

    def score_by_price(self, price):
        if price > 40000:
            self.score += 20
        elif price > 20000:
            self.score += 10

    def score_by_interaction(self, interaction_type):
        if interaction_type == "contact":
            self.score += 30
        elif interaction_type == "click":
            self.score += 10
        elif interaction_type == "view":
            self.score += 5

    def score_by_user_type(self, user_type):
        if user_type == "B2B":
            self.score += 15

    def get_classification(self):
        if self.score >= 70:
            return "Hot"
        elif self.score >= 30:
            return "Warm"
        else:
            return "Cold"



# ============================================
# Prueba básica del motor
# ============================================

if __name__ == "__main__":
    engine = LeadScoringEngine()

    # Simulación de un usuario
    engine.score_by_price(45000)
    engine.score_by_interaction("contact")
    engine.score_by_user_type("B2B")

    print("Score final:", engine.score)
    print("Clasificación:", engine.get_classification())
