import React, { useState } from "react";
import axios from "axios";
import './Upload.scss'

const Upload = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [generateThumbnail, setGenerateThumbnail] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  // Generate thumbnail function
  const handleGenerateThumbnail = (videoFile) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);

      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 320; // Set desired thumbnail width
        canvas.height = (video.videoHeight / video.videoWidth) * 320; // Maintain aspect ratio
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };

      video.onerror = (error) => {
        reject("Error generating thumbnail");
      };
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You must be logged in to upload a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    if (generateThumbnail && file) {
      try {
        const generatedThumbnail = await handleGenerateThumbnail(file);
        formData.append("thumbnail", generatedThumbnail, "thumbnail.jpg");
      } catch (error) {
        setMessage("Failed to generate thumbnail.");
        return;
      }
    } else if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setMessage("Video uploaded successfully!");
      setFile(null);
      setThumbnail(null);
      setTitle("");
      setDescription("");
      setProgress(0);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error uploading video.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleUpload}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Video File:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <div>
          <label>Thumbnail:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            disabled={generateThumbnail}
          />
          <label>
            <input
              type="checkbox"
              checked={generateThumbnail}
              onChange={(e) => setGenerateThumbnail(e.target.checked)}
            />
            Generate Thumbnail Automatically
          </label>
        </div>
        <div>
          <button type="submit">Upload</button>
        </div>
      </form>
      {progress > 0 && <div>Upload Progress: {progress}%</div>}
    </div>
  );
};

export default Upload;
