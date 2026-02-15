from datetime import datetime

class LeadScoring:

    def __init__(self, user_type, user_budget, interactions):
        self.user_type = user_type
        self.user_budget = user_budget
        self.interactions = interactions  # lista de diccionarios
        self.score = 0

    def calculate_interaction_points(self):
        points = 0

        interaction_weights = {
        1: 5,   # visit
        2: 10,  # click
        3: 15,  # download
        4: 25,  # form
        5: 40   # contact
        }

        for interaction in self.interactions:
            interaction_type = interaction["type"]
            points += interaction_weights.get(interaction_type, 0)

        return points

    def calculate_budget_points(self):
        if self.user_budget < 2000:
            return 5
        elif self.user_budget < 10000:
            return 15
        elif self.user_budget < 50000:
            return 25
        else:
            return 40

    def calculate_user_type_points(self):
        if self.user_type == "B2B":
            return 20
        return 10

    def calculate_inactivity_penalty(self):
        if not self.interactions:
            return 0

        last_interaction = max(i["date"] for i in self.interactions)
        days_inactive = (datetime.now() - last_interaction).days

        if 30 <= days_inactive < 90:
            return 15
        elif 90 <= days_inactive < 180:
            return 25
        elif days_inactive >= 180:
            return 35
        return 0

    def calculate_score(self):
        interaction_points = self.calculate_interaction_points()
        budget_points = self.calculate_budget_points()
        type_points = self.calculate_user_type_points()
        penalty = self.calculate_inactivity_penalty()

        total = interaction_points + budget_points + type_points - penalty

        self.score = max(total, 0)
        return self.score

    def get_classification(self):
        if self.score >= 80:
            return "Hot"
        elif self.score >= 40:
            return "Warm"
        return "Cold"

