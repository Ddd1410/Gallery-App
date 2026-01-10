import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          "https://db-akb2hbahcqfhdehn.francecentral-01.azurewebsites.net/api/photos"
        );
        const data = await res.json();
        setImages(data.images || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setLoading(false);
      }
    };

    fetchImages(); // initial fetch

    const interval = setInterval(fetchImages, 5000); // auto-refresh every 5s

    return () => clearInterval(interval); // cleanup interval on unmount
  }, []);

  if (loading) return <p>Loading gallery...</p>;
  if (!images.length) return <p>No images yet.</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
      }}
    >
      {images.map((img) => (
        <div
          key={img.name}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#fafafa",
          }}
        >
          <img
            src={img.url}
            alt={img.title || "Image"}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <h3 style={{ margin: "10px 0 5px" }}>{img.title}</h3>
          <p style={{ margin: 0 }}>{img.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
