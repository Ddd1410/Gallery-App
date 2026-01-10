import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");


// inside Upload component
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) return alert("Please select a file!");

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("caption", caption);

  try {
    const res = await fetch(
      "https://db-akb2hbahcqfhdehn.francecentral-01.azurewebsites.net/api/photos",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (res.ok) {
      setMessage("Upload successful!");
      setFile(null);
      setTitle("");
      setCaption("");

      // Redirect to gallery to see new image
      setTimeout(() => navigate("/"), 1000);
    } else {
      setMessage(`Upload failed: ${data.error}`);
    }
  } catch (err) {
    console.error(err);
    setMessage("Upload failed: network error");
  }
};


  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Upload Photo</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Upload;
