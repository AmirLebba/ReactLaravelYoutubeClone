import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./VideoPlayer.css";

const VideoPlayer = () => {
    const { id } = useParams();
    const videoRef = useRef(null);
    const [currentQuality, setCurrentQuality] = useState(null);
    const [isLoadingQuality, setIsLoadingQuality] = useState(false);

    // Fetch video metadata
    const {
        data: video,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["video", id],
        queryFn: async () => {
            const response = await axios.get(
                `http://localhost:8000/api/videos/${id}/metadata`
            );
            return response.data;
        },
    });

    // Loading and error states
    if (isLoading) return <div className="loading">Loading video...</div>;
    if (error)
        return (
            <div className="error">Error loading video: {error.message}</div>
        );

    // Extract qualities and default quality
    const availableQualities = video?.qualities || {};
    const defaultQuality = availableQualities["720p"] || video?.url;

    // Quality change handler
    const handleQualityChange = async (url) => {
        if (videoRef.current) {
            setIsLoadingQuality(true);
            try {
                const currentTime = videoRef.current.currentTime;
                videoRef.current.src = url;
                videoRef.current.load();
                videoRef.current.currentTime = currentTime;
                await videoRef.current.play();
                setCurrentQuality(url);
            } catch (e) {
                console.error("Failed to change video quality:", e);
                alert("An error occurred while changing the video quality.");
            } finally {
                setIsLoadingQuality(false);
            }
        }
    };

    // Playback error handler
    const handleError = () => {
        alert(
            "An error occurred while playing the video. Please try again later."
        );
    };

    return (
        <div className="video-player-container">
            {/* Video Player */}
            <div className="video-wrapper">
                <video
                    controls
                    ref={videoRef}
                    src={currentQuality || defaultQuality}
                    className="html5-video-player"
                    onError={handleError}
                    poster={video?.thumbnail || "default-thumbnail.jpg"} // Display thumbnail
                >
                    Your browser does not support the video tag.
                </video>
                {isLoadingQuality && (
                    <div className="loading-spinner">Changing quality...</div>
                )}
            </div>

            {/* Title */}
            <h1 className="video-title">{video?.title || "Untitled Video"}</h1>
            <div className="video-description">
                {/* Metadata */}
                <div className="video-metadata">
                    <p>
                        Published on:{" "}
                        {new Date(
                            video?.published_time || video?.created_at
                        ).toLocaleDateString()}
                    </p>
                    <p>Views: {video?.views || 0}</p>
                </div>
                <p>{video?.description || "No description available."}</p>
            </div>
            {/* Quality Selector */}
            <div className="quality-selector">
                <h3>Select Quality:</h3>
                {Object.keys(availableQualities).length > 0 ? (
                    Object.entries(availableQualities).map(([label, url]) => (
                        <button
                            key={label}
                            onClick={() => handleQualityChange(url)}
                            className={`quality-button ${
                                currentQuality === url ? "active-quality" : ""
                            }`}
                            disabled={isLoadingQuality}
                        >
                            {label}
                        </button>
                    ))
                ) : (
                    <p>No additional qualities available.</p>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
