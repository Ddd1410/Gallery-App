import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Import your pages
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";

function App() {
  return (
    <BrowserRouter>
      {/* Simple navigation */}
      <nav
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #ccc",
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Gallery
        </Link>
        <Link to="/upload" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Upload
        </Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Gallery />} />       {/* Consumer Gallery */}
        <Route path="/upload" element={<Upload />} />  {/* Creator Upload */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
