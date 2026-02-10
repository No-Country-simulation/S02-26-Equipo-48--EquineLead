class LeadScoring:

    def __init__(self, event_interest, budget_level, engagement_level):
        self.event_interest = event_interest
        self.budget_level = budget_level
        self.engagement_level = engagement_level
        self.score = self.calculate_score()

    def calculate_score(self):
        score = (
            self.event_interest * 0.3 +
            self.budget_level * 0.4 +
            self.engagement_level * 0.3
        )
        return score

    def get_classification(self):
        if self.score >= 70:
            return "Hot"
        elif self.score >= 30:
            return "Warm"
        else:
            return "Cold"
