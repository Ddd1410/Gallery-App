import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const Gallery = ({ role, apiKey, resetSignal }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Fetch all images
  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/photos`);
      const data = await res.json();
      setImages(data.images || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching images:", err);
      setLoading(false);
    }
  };
// Reset gallery when resetSignal changes 
  useEffect(() => { 
    if (resetSignal) 
      { resetGallery(); } }, 
    [resetSignal]);

  // Auto-refresh only when NOT searching
  useEffect(() => {
    
    if (isSearching) return;

    fetchImages();
    const interval = setInterval(fetchImages, 5000);
    return () => clearInterval(interval);
  }, [isSearching]);

  // Search handler
  const handleSearch = async () => {
    if (!search.trim()) {
      setIsSearching(false);
      fetchImages();
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(search.trim())}`
      );
      const data = await res.json();
      setImages(data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed");
    }
  };
const resetGallery = () => { 
  setSearch(""); 
  setIsSearching(false); 
  setSelectedItem(null); 
  fetchImages(); 
  window.scrollTo(0, 0); 
};
  const openItem = (item) => {
    setSelectedItem(item);
    setCommentText("");
  };

  // Delete (creator only)
  const handleDelete = async (name) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`${API_URL}/api/photos/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: { "x-api-key": apiKey },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Delete failed: ${data.error || res.statusText}`);
        return;
      }

      setImages((prev) => prev.filter((img) => img.name !== name));
      alert("Image deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed: network error");
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!selectedItem || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`${API_URL}/api/photos/${selectedItem.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: role === "creator" ? "Creator" : "Viewer",
          text: commentText.trim(),
        }),
      });

      const data = await res.json();
      const updated = data.item;

      setImages((prev) =>
        prev.map((img) => (img.id === updated.id ? updated : img))
      );
      setSelectedItem(updated);
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
      alert("Could not add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Rate item
  const handleRate = async (rating) => {
    if (!selectedItem) return;

    setIsSubmittingRating(true);
    try {
      const res = await fetch(`${API_URL}/api/photos/${selectedItem.id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await res.json();
      const updated = data.item;

      setImages((prev) =>
        prev.map((img) => (img.id === updated.id ? updated : img))
      );
      setSelectedItem(updated);
    } catch (err) {
      console.error("Rating error:", err);
      alert("Could not add rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const getAverageRating = (item) => {
    if (!item?.ratings || !item.ratings.length) return null;
    const sum = item.ratings.reduce((acc, v) => acc + v, 0);
    return (sum / item.ratings.length).toFixed(1);
  };

  if (loading) return <p>Loading gallery...</p>;
  if (!images.length) return <p>No images yet.</p>;

  return (
    <>
      {/* FULLSCREEN MODAL */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {selectedItem.type === "image" && (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  borderRadius: "10px",
                  marginBottom: "16px",
                }}
              />
            )}

            {selectedItem.type === "video" && (
              <video
                src={selectedItem.url}
                controls
                autoPlay
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  borderRadius: "10px",
                  background: "#000",
                  marginBottom: "16px",
                }}
              />
            )}

            {/* Title + Caption */}
            <div
              style={{
                width: "100%",
                color: "white",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "10px",
                padding: "12px 16px",
              }}
            >
              <h3 style={{ margin: "0 0 4px" }}>{selectedItem.title}</h3>
              <p style={{ margin: "0 0 8px", fontSize: "14px" }}>
                {selectedItem.caption}
              </p>

              {/* Rating */}
              <div style={{ marginBottom: "10px" }}>
                <span style={{ marginRight: "8px", fontSize: "14px" }}>
                  Rating:
                </span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (role === "consumer") handleRate(n);
                    }}
                    style={{
                      fontSize: "22px",
                      cursor: role === "consumer" ? "pointer" : "default",
                      color:
                        selectedItem.ratings &&
                        selectedItem.ratings.length &&
                        selectedItem.ratings.reduce((a, v) => a + v, 0) /
                          selectedItem.ratings.length >= n
                          ? "gold"
                          : "gray",
                      marginRight: "4px",
                    }}
                  >
                    ★
                  </span>
                ))}
                <span style={{ marginLeft: "8px", fontSize: "13px" }}>
                  {getAverageRating(selectedItem)
                    ? `${getAverageRating(selectedItem)} / 5`
                    : "No ratings yet"}
                </span>
                {isSubmittingRating && (
                  <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                    Saving...
                  </span>
                )}
              </div>

              {/* Comments */}
              <div
                style={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  marginBottom: "10px",
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  paddingTop: "8px",
                }}
              >
                {selectedItem.comments && selectedItem.comments.length ? (
                  selectedItem.comments.map((c, idx) => (
                    <div key={idx} style={{ marginBottom: "6px" }}>
                      <strong style={{ fontSize: "13px" }}>
                        {c.user || "User"}:
                      </strong>{" "}
                      <span style={{ fontSize: "13px" }}>{c.text}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "13px", margin: 0 }}>
                    No comments yet.
                  </p>
                )}
              </div>

              {/* Comment input */}
              {role === "consumer" && (
                <div style={{ display: "flex", marginTop: "4px" }}>
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "13px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddComment();
                    }}
                    disabled={isSubmittingComment || !commentText.trim()}
                    style={{
                      marginLeft: "8px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#28a745",
                      color: "white",
                      fontSize: "13px",
                      cursor:
                        isSubmittingComment || !commentText.trim()
                          ? "default"
                          : "pointer",
                      opacity:
                        isSubmittingComment || !commentText.trim()
                          ? 0.7
                          : 1,
                    }}
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div style={{ padding: "10px", textAlign: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or caption..."
          style={{
            padding: "10px",
            width: "60%",
            maxWidth: "400px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Search
        </button>
      </div>

      {/* GALLERY GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          padding: "10px",
        }}
      >
        {images.map((img) => (
          <div
            key={img.name}
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              overflow: "hidden",
              position: "relative",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            {img.type === "image" && (
              <img
                src={img.url}
                alt={img.title || "Image"}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => openItem(img)}
              />
            )}

            {img.type === "video" && (
              <video
                src={img.url}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  background: "#000",
                  cursor: "pointer",
                }}
                onClick={() => openItem(img)}
              />
            )}

            <div style={{ padding: "15px" }}>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#222",
                }}
              >
                {img.title}
              </h3>

              <p
                style={{
                  margin: "0 0 10px",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                {img.caption}
              </p>

              <small style={{ color: "#888", fontSize: "12px" }}>
                {new Date(img.uploadedAt).toLocaleString()}
              </small>

              {getAverageRating(img) && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#f5a623",
                  }}
                >
                  ★ {getAverageRating(img)} / 5 ({img.ratings.length} rating
                  {img.ratings.length !== 1 ? "s" : ""})
                </div>
              )}
            </div>

            {role === "creator" && (
              <button
                onClick={() => handleDelete(img.name)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#ff4d4f",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Gallery;
