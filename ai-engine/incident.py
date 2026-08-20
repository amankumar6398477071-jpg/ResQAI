from dataclasses import dataclass


@dataclass
class Incident:
    incident_id: str
    description: str
    people_affected: int
    injuries: int
    urgency: int
    fire: bool = False
    flood: bool = False
    people_trapped: int = 0