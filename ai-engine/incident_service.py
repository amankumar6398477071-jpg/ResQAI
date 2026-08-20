from models.incident import Incident
from scoring.priority_score import calculate_priority_score


def process_incident(incident: Incident) -> dict:
    score = calculate_priority_score(incident)

    return {
        "incident_id": incident.incident_id,
        "description": incident.description,
        "priority_score": score,
    }