import React, { useState, useRef } from "react";
import axios from "axios";
import "./Upload.scss";

const Upload = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleGenerateThumbnail = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions based on video aspect ratio
    const width = 320; // Desired width
    const height = (video.videoHeight / video.videoWidth) * width;
    canvas.width = width;
    canvas.height = height;

    // Capture the frame at the current playback time
    context.drawImage(video, 0, 0, width, height);

    // Convert the canvas content to a Blob and set it as the thumbnail
    canvas.toBlob((blob) => {
      setThumbnail(blob);
    }, "image/jpeg");
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

    if (thumbnail) {
      formData.append("thumbnail", thumbnail, "thumbnail.jpg");
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
      setStep(1);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error uploading video.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-group">
            <label>Video File:</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            {file && (
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                className="video-preview"
              />
            )}
            <button onClick={() => setStep(2)} disabled={!file} className="next-button">Next</button>
          </div>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="thumbnail-section">
              <label>Generate Thumbnail:</label>
              {file && (
                <>
                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(file)}
                    controls
                    className="video-preview"
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <button onClick={handleGenerateThumbnail} className="generate-thumbnail-button">
                    Capture Thumbnail
                  </button>
                </>
              )}
              {thumbnail && (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail Preview"
                  className="thumbnail-preview"
                />
              )}
            </div>
            <button onClick={() => setStep(3)} className="next-button">Next</button>
            <button onClick={() => setStep(1)} className="back-button">Back</button>
          </>
        );
      case 3:
        return (
          <div className="form-review">
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Video File:</strong> {file?.name}</p>
            {thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="thumbnail-preview" />}
            <button type="submit" className="upload-button">Upload</button>
            <button onClick={() => setStep(2)} className="back-button">Back</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleUpload} className="upload-form">
        {renderStep()}
      </form>
      {progress > 0 && <div className="progress-bar">Upload Progress: {progress}%</div>}
    </div>
  );
};

export default Upload;
