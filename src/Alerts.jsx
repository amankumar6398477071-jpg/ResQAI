import "./App.css";

function Alerts() {
  const alerts = [
    {
      id: "ALT-001",
      title: "Medical Emergency",
      location: "Central Delhi",
      priority: "HIGH",
      message: "Immediate medical response required.",
      type: "danger-alert",
    },
    {
      id: "ALT-002",
      title: "Fire Emergency",
      location: "North Delhi",
      priority: "HIGH",
      message: "Fire response team required.",
      type: "danger-alert",
    },
    {
      id: "ALT-003",
      title: "Flood Relief Required",
      location: "East Delhi",
      priority: "MEDIUM",
      message: "Relief resources required in affected area.",
      type: "warning-alert",
    },
  ];

  return (
    <section className="panel">
      <h2>Active Alerts</h2>
      <p>Current emergency situations requiring attention</p>

      <div style={{ marginTop: "20px" }}>
        {alerts.map((alert) => (
          <div
            className={`alert-card ${alert.type}`}
            key={alert.id}
          >
            <strong>{alert.priority} PRIORITY</strong>

            <h3>{alert.title}</h3>

            <p>
              <strong>Location:</strong> {alert.location}
            </p>

            <p>{alert.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Alerts;