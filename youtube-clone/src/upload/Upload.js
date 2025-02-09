import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const handleGenerateThumbnail = () => {
        if (!videoRef.current || !canvasRef.current) {
            console.error("Video or canvas reference is missing.");
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const width = 320; // Thumbnail width
        const height = (video.videoHeight / video.videoWidth) * width; // Maintain aspect ratio
        canvas.width = width;
        canvas.height = height;

        context.drawImage(video, 0, 0, width, height);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    setThumbnail(blob);
                } else {
                    console.error("Failed to generate thumbnail blob.");
                }
            },
            "image/jpeg",
            0.9 // Quality (optional)
        );
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || !user.id) {
            setMessage("You must be logged in to upload a video.");
            return;
        }

        if (!thumbnail) {
            setMessage("Thumbnail is not generated.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);
        formData.append("title", title || ""); // Default empty title
        formData.append("description", description || ""); // Default empty description
        formData.append("user_id", user.id);
        formData.append("thumbnail", thumbnail, "thumbnail.jpg");

        const metadata = {
            title: title || "",
            description: description || "",
        };
        formData.append("metadata", JSON.stringify(metadata));

        try {
            const response = await axios.post(
                "http://localhost:8000/api/videos",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                    onUploadProgress: (event) => {
                        const percent = Math.round(
                            (event.loaded * 100) / event.total
                        );
                        setProgress(percent);
                    },
                }
            );

            setMessage("Video uploaded successfully!");
            resetForm();
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            console.error(
                "Error response:",
                error.response?.data || error.message
            );
            setMessage(
                error.response?.data?.message || "Error uploading video."
            );
        }
    };

    const resetForm = () => {
        setFile(null);
        setThumbnail(null);
        setTitle("");
        setDescription("");
        setProgress(0);
        setStep(1);
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
                            <button
                                onClick={() => setStep(2)}
                                disabled={!file}
                                className="next-button"
                            >
                                Next
                            </button>
                        )}
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
                                    <canvas
                                        ref={canvasRef}
                                        style={{ display: "none" }}
                                    />
                                    <button
                                        onClick={handleGenerateThumbnail}
                                        className="generate-thumbnail-button"
                                    >
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
                        <button
                            onClick={() => setStep(3)}
                            className="next-button"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            className="back-button"
                        >
                            Back
                        </button>
                    </>
                );
            case 3:
                return (
                    <div className="form-review">
                        <p>
                            <strong>Title:</strong> {title}
                        </p>
                        <p>
                            <strong>Description:</strong> {description}
                        </p>
                        <p>
                            <strong>Video File:</strong> {file?.name}
                        </p>
                        {thumbnail && (
                            <img
                                src={URL.createObjectURL(thumbnail)}
                                alt="Thumbnail"
                                className="thumbnail-preview"
                            />
                        )}
                        <button type="submit" className="upload-button">
                            Upload
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className="back-button"
                        >
                            Back
                        </button>
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
            {progress > 0 && (
                <div className="progress-bar">Upload Progress: {progress}%</div>
            )}
        </div>
    );
};

export default Upload;
