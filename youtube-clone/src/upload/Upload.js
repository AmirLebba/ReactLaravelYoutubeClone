import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Upload.module.scss";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleUpload = async (e) => {
        e.preventDefault();
        setProgress(0);
        setMessage("");

        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setMessage("You need to be logged in to upload a video.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/videos",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    },
                }
            );
            setMessage("Video uploaded successfully!");
            setTimeout(() => navigate("/"), 2000); // Redirect to home after 2 seconds
        } catch (error) {
            console.error(
                "Upload error:",
                error.response?.data || error.message
            );
            setMessage(
                error.response?.data?.message || "Error uploading the video."
            );
        }
    };

    return (
        <div className={styles["upload-container"]}>
            <h2>Upload Video</h2>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="video/*"
                />
                {progress > 0 && (
                    <div className={styles["progress-bar-container"]}>
                        <div
                            className={styles["progress-bar"]}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
                {message && (
                    <p
                        className={
                            message.includes("successfully")
                                ? styles["success-message"]
                                : styles["error-message"]
                        }
                    >
                        {message}
                    </p>
                )}
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default Upload;
