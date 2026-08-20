from fastapi import FastAPI
from models.incident import Incident
from services.incident_service import process_incident

app = FastAPI(title="ResQAI Incident API")


@app.get("/")
def home():
    return {"message": "ResQAI AI Engine is running"}


@app.post("/incidents")
def create_incident(incident: Incident):
    return process_incident(incident)