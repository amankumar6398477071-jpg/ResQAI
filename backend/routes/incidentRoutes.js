const express = require("express");

const router = express.Router();

// Temporary incident storage
let incidents = [];

// GET all incidents
router.get("/", (req, res) => {
  res.json({
    success: true,
    incidents: incidents
  });
});

// POST a new incident
router.post("/", (req, res) => {
  const { title, description, location, severity } = req.body;

  const incident = {
    id: incidents.length + 1,
    title,
    description,
    location,
    severity,
    createdAt: new Date()
  };

  incidents.push(incident);

  res.status(201).json({
    success: true,
    message: "Incident created successfully",
    incident: incident
  });
});

module.exports = router;