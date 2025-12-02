// src/pages/StudentDashboard/StudentDashboard.jsx
import React, { useEffect, useState } from "react";

/**
 * Notes:
 * - For Vite: set VITE_API_BASE in .env (e.g. VITE_API_BASE=http://localhost:8080)
 * - This file falls back to http://localhost:8080 if no env var found.
 */
export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vite exposes env vars on import.meta.env
  const API =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      (import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE)) ||
    // fallback for CRA or other env shapes (guard process too)
    (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
    "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("[Dashboard] token from localStorage:", token);

    if (!token) {
      setError("No auth token found. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API}/api/student/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log("[Dashboard] /api/student/profile status:", res.status);
        const text = await res.text().catch(() => null);
        let body;
        try {
          body = text ? JSON.parse(text) : null;
        } catch (e) {
          body = text;
        }
        console.log("[Dashboard] /api/student/profile body:", body);

        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized (401). Token invalid/expired.");
          throw new Error(
            `Profile fetch failed: ${res.status} - ${typeof body === "string" ? body : JSON.stringify(body)}`
          );
        }
        return body;
      })
      .then((data) => {
        setProfile(data);
        if (data && data.hostelType) {
          fetchMenu(data.hostelType);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("[Dashboard] profile fetch error:", err);
        setError(err.message || "Failed to load profile. Try logging in again.");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMenu = (hostelType) => {
    const token = localStorage.getItem("authToken");
    if (!hostelType) {
      setMenu(null);
      setLoading(false);
      return;
    }

    fetch(`${API}/api/menu/${encodeURIComponent(hostelType)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        console.log("[Dashboard] /api/menu status:", res.status);
        const text = await res.text().catch(() => null);
        let body;
        try {
          body = text ? JSON.parse(text) : null;
        } catch (e) {
          body = text;
        }
        console.log("[Dashboard] /api/menu body:", body);

        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized when fetching menu.");
          throw new Error(`Menu fetch failed: ${res.status}`);
        }
        setMenu(body.meals || null);
      })
      .catch((err) => {
        console.error("[Dashboard] menu fetch error:", err);
        setError(err.message || "Failed to load menu.");
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  if (error)
    return (
      <div style={{ padding: 20 }}>
        <h3>Error</h3>
        <p>{error}</p>
        <p style={{ color: "#666" }}>
          Check the browser Console and Network tab for details. Common causes: missing token, invalid token, CORS blocked, or backend error.
        </p>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => window.location.reload()}>Retry</button>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            }}
            style={{ marginLeft: 8 }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Welcome, {profile?.name || profile?.fullName || "Student"} 👋</h1>
          <p style={{ margin: "4px 0 0 0", color: "#555" }}>{profile?.email}</p>
        </div>
        <div>
          <button onClick={handleLogout} style={{ padding: "8px 12px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <hr style={{ margin: "18px 0" }} />

      <h2 style={{ marginBottom: 10 }}>Weekly Menu</h2>

      {!menu ? (
        <p style={{ color: "#666" }}>{profile?.hostelType ? "No menu available for your hostel." : "Hostel type not set in your profile."}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {Object.entries(menu).map(([day, meals]) => (
            <div key={day} style={{ padding: 12, border: "1px solid #e6e6e6", borderRadius: 8, background: "#fff" }}>
              <h3 style={{ marginTop: 0 }}>{day}</h3>
              {Object.entries(meals).map(([mealType, items]) => (
                <div key={mealType} style={{ marginBottom: 8 }}>
                  <strong>{mealType}</strong>
                  <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                    {Array.isArray(items) && items.length > 0 ? items.map((f, i) => <li key={i}>{f}</li>) : <li><em>No items</em></li>}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
