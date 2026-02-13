from model.lead_scoring import LeadScoring


if __name__ == "__main__":

    lead = LeadScoring(
        event_interest=80,
        budget_level=60,
        engagement_level=50
    )

    print("Score final:", lead.score)
    print("Clasificación:", lead.get_classification())
