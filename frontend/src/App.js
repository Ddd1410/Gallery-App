import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";

function App() {
  const [role, setRole] = useState("consumer");
  const [apiKey, setApiKey] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const CREATOR_PASSWORD = "1234";
  const CREATOR_API_KEY = "ddd1410";
const [resetSignal, setResetSignal] = useState(false);
const triggerReset = () => { setResetSignal(true); setTimeout(() => setResetSignal(false), 50);  };
  const loginCreator = () => {
    if (passwordInput === CREATOR_PASSWORD) {
      setRole("creator");
      setApiKey(CREATOR_API_KEY);
      setPasswordInput("");
    } else {
      alert("Incorrect password");
    }
  };

  const logoutCreator = () => {
    setRole("consumer");
    setApiKey("");
  };

  return (
    <BrowserRouter>
      <nav
        style={{
          padding: "15px 25px",
          background: "white",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* ⭐ Gallery + Welcome Message */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            to="/gallery"
            onClick={triggerReset}
            style={{
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "18px",
              color: "#0078ff",
            }}
          >
            Gallery
          </Link>

          <span style={{ fontSize: "16px", color: "#555" }}>
            {role === "creator" ? "Welcome, Creator!" : "Welcome, Viewer!"}
          </span>
        </div>

        {/* Upload link (creator only) */}
        {role === "creator" && (
          <Link
            to="/upload"
            style={{
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "18px",
              color: "#0078ff",
            }}
          >
            Upload
          </Link>
        )}

        {/* Login / Logout */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          {role === "consumer" ? (
            <>
              <input
                type="password"
                placeholder="Creator password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={loginCreator}
                style={{
                  padding: "8px 14px",
                  background: "#0078ff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </>
          ) : (
            <button
              onClick={logoutCreator}
              style={{
                padding: "8px 14px",
                background: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
       <Route path="/" element={<Gallery role={role} apiKey={apiKey} resetSignal={resetSignal} />} />
        <Route path="/gallery" element={<Gallery role={role} apiKey={apiKey} resetSignal={resetSignal} />} />

        <Route
          path="/upload"
          element={
            role === "creator"
              ? <Upload apiKey={apiKey} role={role} />
              : <Gallery role={role} apiKey={apiKey} />
          }
        />

        <Route path="*" element={<Gallery role={role} apiKey={apiKey} resetSignal={resetSignal} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
