from models.incident import Incident


def calculate_priority_score(incident: Incident) -> int:
    """
    Calculate the priority score for an incident.

    Higher score = higher priority.
    """

    score = 0

    # Number of people affected
    score += incident.people_affected * 2

    # Injuries are more serious
    score += incident.injuries * 5

    # Urgency: expected range 1-10
    score += incident.urgency * 5

    # Fire is a high-priority emergency
    if incident.fire:
        score += 20

    # Flood adds significant priority
    if incident.flood:
        score += 15

    # Trapped people are extremely high priority
    score += incident.people_trapped * 10

    return score