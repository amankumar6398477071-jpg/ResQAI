from models.incident import Incident
from api.incident_api import create_incident


def main():
    incident = Incident(
        incident_id="INC001",
        description="Building fire with people trapped",
        people_affected=20,
        injuries=2,
        urgency=10,
        fire=True,
        flood=False,
        people_trapped=5,
    )

    result = create_incident(incident)

    print("Incident Priority Result:")
    print(result)


if __name__ == "__main__":
    main()