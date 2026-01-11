import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const Upload = ({ apiKey, role }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();
  const navigate = useNavigate();

  // ❗ Block consumers from accessing upload page
  if (role !== "creator") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#444" }}>Access Restricted</h2>
        <p style={{ fontSize: "16px", color: "#666" }}>
          Only creators can upload images or videos.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("caption", caption);

    try {
      const res = await fetch(`${API_URL}/photos`, {
        method: "POST",
        body: formData,
        headers: { "x-api-key": apiKey },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Upload successful!");

        setFile(null);
        setTitle("");
        setCaption("");
        if (fileInputRef.current) fileInputRef.current.value = "";

        setTimeout(() => navigate("/gallery"), 800);
      } else {
        setMessage(`Upload failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    }

    setUploading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Upload Photo</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          background: "white",
          padding: "30px",
          borderRadius: "14px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <label style={{ fontWeight: "600", fontSize: "14px" }}>Select Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        />

        <label style={{ fontWeight: "600", fontSize: "14px" }}>Title</label>
        <input
          type="text"
          placeholder="Enter a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "15px",
          }}
        />

        <label style={{ fontWeight: "600", fontSize: "14px" }}>Caption</label>
        <input
          type="text"
          placeholder="Enter a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "15px",
          }}
        />

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        )}

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "14px",
            background: uploading ? "#888" : "#0078ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "17px",
            fontWeight: "600",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "background 0.2s ease, transform 0.1s ease",
          }}
          onMouseDown={(e) => {
            if (!uploading) e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            if (!uploading) e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            fontWeight: "600",
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Upload;
