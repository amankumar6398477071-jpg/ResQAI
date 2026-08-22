import { useState } from "react";
import "./App.css";

function Requests({ resources, setResources }) {
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      type: "Medical Emergency",
      location: "Central Delhi",
      priority: "HIGH",
      status: "Assigned",
      resource: "Ambulance Unit A1",
      resourceId: "A1",
    },
    {
      id: "REQ-002",
      type: "Fire Emergency",
      location: "North Delhi",
      priority: "HIGH",
      status: "Pending",
      resource: "Not Assigned",
      resourceId: null,
    },
    {
      id: "REQ-003",
      type: "Flood Relief",
      location: "East Delhi",
      priority: "MEDIUM",
      status: "Pending",
      resource: "Not Assigned",
      resourceId: null,
    },
  ]);

  /* ================================================= */
  /* FIND REQUIRED RESOURCE TYPE */
  /* ================================================= */

  const getRequiredType = (requestType) => {
    if (requestType === "Medical Emergency") {
      return "Medical";
    }

    if (requestType === "Fire Emergency") {
      return "Fire & Rescue";
    }

    if (requestType === "Flood Relief") {
      return "Relief";
    }

    return null;
  };

  /* ================================================= */
  /* FIND BEST MATCH */
  /* ================================================= */

  const findBestMatch = (requestId) => {
    const request = requests.find(
      (item) => item.id === requestId
    );

    if (!request) {
      return;
    }

    if (request.status === "Assigned") {
      alert(
        `${request.type} is already assigned to ${request.resource}.`
      );
      return;
    }

    const requiredType = getRequiredType(
      request.type
    );

    if (!requiredType) {
      alert(
        "No matching resource type found."
      );
      return;
    }

    const matchedResource = resources.find(
      (resource) =>
        resource.type === requiredType &&
        resource.status === "Available"
    );

    /* ================================================= */
    /* NO RESOURCE AVAILABLE */
    /* ================================================= */

    if (!matchedResource) {
      alert(
        `No available ${requiredType} resource found for ${request.type}.`
      );
      return;
    }

    /* ================================================= */
    /* UPDATE REQUEST */
    /* ================================================= */

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: "Assigned",
              resource: matchedResource.name,
              resourceId: matchedResource.id,
            }
          : item
      )
    );

    /* ================================================= */
    /* UPDATE RESOURCE */
    /* ================================================= */

    setResources((currentResources) =>
      currentResources.map((resource) =>
        resource.id === matchedResource.id
          ? {
              ...resource,
              status: "Assigned",
            }
          : resource
      )
    );

    alert(
      `${matchedResource.name} assigned successfully to ${request.type}!`
    );
  };

  return (
    <section className="panel">

      <h2>
        Emergency Requests
      </h2>

      <p>
        Manage incoming emergency response requests
      </p>

      <div className="request-list">

        {requests.map((request) => (

          <div
            className="request-card"
            key={request.id}
          >

            {/* ================= REQUEST INFO ================= */}

            <div>

              <div className="request-id">
                {request.id}
              </div>

              <h3>
                {request.type}
              </h3>

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {request.location}
              </p>

              <p>
                <strong>
                  Priority:
                </strong>{" "}

                <span
                  className={
                    request.priority === "HIGH"
                      ? "priority-high"
                      : "priority-medium"
                  }
                >
                  {request.priority}
                </span>
              </p>

              <p>
                <strong>
                  Resource:
                </strong>{" "}

                {request.resource}
              </p>

            </div>

            {/* ================= ACTIONS ================= */}

            <div className="request-actions">

              <span
                className={
                  request.status === "Assigned"
                    ? "badge available-badge"
                    : "badge pending-badge"
                }
              >
                {request.status}
              </span>

              {request.status === "Pending" && (

                <button
                  type="button"
                  className="request-match-btn"
                  onClick={() =>
                    findBestMatch(request.id)
                  }
                >
                  Find Best Match
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Requests;