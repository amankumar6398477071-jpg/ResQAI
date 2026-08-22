import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import Requests from "./Requests";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [bestMatch, setBestMatch] = useState(null);

  const [resources, setResources] = useState([
    {
      id: "A1",
      name: "Ambulance Unit A1",
      type: "Medical",
      status: "Available",
      distance: "2.4 km",
      location: "Central Delhi",
    },
    {
      id: "F1",
      name: "Fire Response Team",
      type: "Fire & Rescue",
      status: "Available",
      distance: "4.1 km",
      location: "South Delhi",
    },
    {
      id: "R3",
      name: "Relief Vehicle R3",
      type: "Relief",
      status: "Available",
      distance: "6.8 km",
      location: "Gurgaon",
    },
  ]);

  // Find the best resource for the urgent medical request
  const findBestMatch = () => {
    const medicalResource = resources.find(
      (resource) =>
        resource.type === "Medical" &&
        resource.status === "Available"
    );

    if (medicalResource) {
      setBestMatch(medicalResource);
    } else {
      alert("No available medical resource found.");
    }
  };

  // Assign selected resource
  const assignResource = () => {
    if (!bestMatch) return;

    setResources((currentResources) =>
      currentResources.map((resource) =>
        resource.id === bestMatch.id
          ? {
              ...resource,
              status: "Assigned",
            }
          : resource
      )
    );

    setBestMatch({
      ...bestMatch,
      status: "Assigned",
    });

    alert(`${bestMatch.name} assigned successfully!`);
  };

  return (
    <div className="dashboard">
      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">GIS</div>

          <div>
            <h2>ResQAI</h2>
            <span>Authority Dashboard</span>
          </div>
        </div>

        <nav>
          {[
            "Dashboard",
            "Live Map",
            "Resources",
            "Requests",
            "Alerts",
          ].map((page) => (
            <a
              key={page}
              href="#"
              className={activePage === page ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActivePage(page);
              }}
            >
              {page}
            </a>
          ))}
        </nav>

        <div className="authority">
          <div className="avatar">A</div>

          <div>
            <strong>Authority</strong>
            <small>Control Center</small>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="main">
        {/* ================= HEADER ================= */}

        <header className="topbar">
          <div>
            <h1>
              {activePage === "Dashboard"
                ? "GIS Authority Dashboard"
                : activePage}
            </h1>

            <p>
              {activePage === "Dashboard"
                ? "Real-time resource monitoring and emergency matching"
                : "ResQAI authority control center"}
            </p>
          </div>

          <div className="status">
            <span></span>
            System Online
          </div>
        </header>

        {/* ================= DASHBOARD ================= */}

        {activePage === "Dashboard" && (
          <>
            <section className="stats">
              <div className="stat-card">
                <span>Total Resources</span>
                <strong>48</strong>
                <small>Registered units</small>
              </div>

              <div className="stat-card available">
                <span>Available</span>

                <strong>
                  {resources.filter(
                    (resource) => resource.status === "Available"
                  ).length}
                </strong>

                <small>Ready for deployment</small>
              </div>

              <div className="stat-card assigned">
                <span>Assigned</span>

                <strong>
                  {resources.filter(
                    (resource) => resource.status === "Assigned"
                  ).length}
                </strong>

                <small>Currently deployed</small>
              </div>

              <div className="stat-card alert">
                <span>Emergency Requests</span>
                <strong>5</strong>
                <small>Require attention</small>
              </div>
            </section>

            <section className="content-grid">
              <MapSection />

              <MatchingSection
                resources={resources}
                bestMatch={bestMatch}
                findBestMatch={findBestMatch}
                assignResource={assignResource}
              />
            </section>
          </>
        )}

        {/* ================= LIVE MAP ================= */}

        {activePage === "Live Map" && (
          <section className="page-panel">
            <div className="panel-header">
              <div>
                <h2>Live GIS Map</h2>
                <p>
                  Real-time resource locations and emergency zones
                </p>
              </div>
            </div>

            <MapContainer
              center={[28.6139, 77.209]}
              zoom={11}
              className="large-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[28.6139, 77.209]}>
                <Popup>
                  <strong>Authority Control Center</strong>
                  <br />
                  New Delhi
                </Popup>
              </Marker>

              <Marker position={[28.628, 77.219]}>
                <Popup>
                  <strong>Ambulance Unit A1</strong>
                  <br />
                  Medical Resource
                </Popup>
              </Marker>

              <Marker position={[28.59, 77.23]}>
                <Popup>
                  <strong>Fire Response Team</strong>
                  <br />
                  Fire &amp; Rescue
                </Popup>
              </Marker>

              <Marker position={[28.55, 77.25]}>
                <Popup>
                  <strong>Relief Vehicle R3</strong>
                  <br />
                  Relief Resource
                </Popup>
              </Marker>
            </MapContainer>
          </section>
        )}

        {/* ================= RESOURCES ================= */}

        {activePage === "Resources" && (
          <section className="page-panel">
            <div className="panel-header">
              <div>
                <h2>Resource Management</h2>
                <p>
                  Monitor registered emergency response resources
                </p>
              </div>
            </div>

            <div className="resource-list">
              {resources.map((resource) => (
                <div
                  className="resource-row"
                  key={resource.id}
                >
                  <div className="resource-icon">+</div>

                  <div className="resource-info">
                    <strong>{resource.name}</strong>

                    <span>{resource.type}</span>

                    <small>
                      {resource.location} • {resource.distance}
                    </small>
                  </div>

                  <span
                    className={
                      resource.status === "Available"
                        ? "badge available-badge"
                        : "badge assigned-badge"
                    }
                  >
                    {resource.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= REQUESTS ================= */}

        {activePage === "Requests" && (
          <Requests
            resources={resources}
            setResources={setResources}
          />
        )}

        {/* ================= ALERTS ================= */}

        {activePage === "Alerts" && (
          <section className="page-panel">
            <div className="panel-header">
              <div>
                <h2>Active Alerts</h2>
                <p>
                  Current emergency situations requiring attention
                </p>
              </div>
            </div>

            <div className="alert-card danger-alert">
              <strong>HIGH PRIORITY</strong>

              <h3>Medical Emergency</h3>

              <p>
                <b>Location:</b> Central Delhi
              </p>

              <p>
                Immediate medical response required.
              </p>
            </div>

            <div className="alert-card danger-alert">
              <strong>HIGH PRIORITY</strong>

              <h3>Fire Emergency</h3>

              <p>
                <b>Location:</b> North Delhi
              </p>

              <p>
                Fire response team required.
              </p>
            </div>

            <div className="alert-card warning-alert">
              <strong>MEDIUM PRIORITY</strong>

              <h3>Flood Relief Required</h3>

              <p>
                <b>Location:</b> East Delhi
              </p>

              <p>
                Relief resources required in affected area.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ================================================= */
/* MAP COMPONENT */
/* ================================================= */

function MapSection() {
  const [mapKey, setMapKey] = useState(0);

  return (
    <div className="panel map-panel">
      <div className="panel-header">
        <div>
          <h2>Live GIS Map</h2>
          <p>Resource locations and emergency zones</p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={() => setMapKey((key) => key + 1)}
        >
          Refresh
        </button>
      </div>

      <MapContainer
        key={mapKey}
        center={[28.6139, 77.209]}
        zoom={11}
        className="map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[28.6139, 77.209]}>
          <Popup>
            <strong>Authority Control Center</strong>
            <br />
            New Delhi
          </Popup>
        </Marker>

        <Marker position={[28.628, 77.219]}>
          <Popup>Ambulance Unit A1</Popup>
        </Marker>

        <Marker position={[28.59, 77.23]}>
          <Popup>Fire Response Team</Popup>
        </Marker>

        <Marker position={[28.55, 77.25]}>
          <Popup>Relief Vehicle R3</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

/* ================================================= */
/* MATCHING COMPONENT */
/* ================================================= */

function MatchingSection({
  resources,
  bestMatch,
  findBestMatch,
  assignResource,
}) {
  return (
    <div className="panel matching-panel">
      <div className="panel-header">
        <div>
          <h2>Resource Matching</h2>
          <p>Best resources for current requests</p>
        </div>
      </div>

      <div className="request-box">
        <span className="request-label">
          URGENT REQUEST
        </span>

        <h3>Medical Emergency</h3>

        <p>Location: Central Delhi</p>

        <strong>Priority: HIGH</strong>
      </div>

      <h3 className="section-title">
        Recommended Resources
      </h3>

      {resources.map((resource) => (
        <div
          className="resource-card"
          key={resource.id}
        >
          <div className="resource-icon">+</div>

          <div className="resource-info">
            <strong>{resource.name}</strong>

            <span>{resource.type}</span>

            <small>{resource.distance} away</small>
          </div>

          <span
            className={
              resource.status === "Available"
                ? "badge available-badge"
                : "badge assigned-badge"
            }
          >
            {resource.status}
          </span>
        </div>
      ))}

      <button
        type="button"
        className="match-btn"
        onClick={findBestMatch}
      >
        Find Best Match
      </button>

      {bestMatch && (
        <div className="request-box best-match-box">
          <span className="request-label">
            BEST MATCH FOUND
          </span>

          <h3>{bestMatch.name}</h3>

          <p>Type: {bestMatch.type}</p>

          <p>Distance: {bestMatch.distance}</p>

          <strong>
            Status: {bestMatch.status}
          </strong>

          <button
            type="button"
            className="match-btn"
            onClick={assignResource}
            disabled={bestMatch.status === "Assigned"}
          >
            {bestMatch.status === "Assigned"
              ? "Resource Assigned"
              : "Assign Resource"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;