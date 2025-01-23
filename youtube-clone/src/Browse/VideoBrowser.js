import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./videoBrowser.scss"; // Import the CSS file for styles

// Fetch videos from the server
const fetchVideos = async () => {
    const response = await axios.get("http://localhost:8000/api/videos");
    return response.data;
};

// Delete video by ID
const deleteVideo = async (id) => {
    await axios.delete(`http://localhost:8000/api/videos/${id}`);
};

const VideoBrowser = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch videos
    const {
        data: videos,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["videos"],
        queryFn: fetchVideos,
    });

    // Mutation for deleting a video
    const deleteMutation = useMutation({
        mutationFn: deleteVideo,
        onSuccess: () => {
            // Invalidate the "videos" query to refresh the list
            queryClient.invalidateQueries(["videos"]);
        },
    });

    // Handle navigation to video player
    const handlePlay = (id) => {
        navigate(`/video/${id}`);
    };

    // Handle navigation to upload page
    const handleUploadRedirect = () => {
        navigate("/upload");
    };

    // Handle delete video
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            deleteMutation.mutate(id);
        }
    };

    // Loading and error states
    if (isLoading) {
        return (
            <>
                <Navbar />
                <div>Loading videos...</div>
            </>
        );
    }
    if (error) return <div>Error loading videos: {error.message}</div>;

    // No videos available
    if (videos.length === 0) {
        return (
            <>
                <Navbar />
                <div className="no-videos-container">
                    <p className="no-videos-message">
                        No videos available. Upload your first video now!
                    </p>
                    <button
                        className="upload-button"
                        onClick={handleUploadRedirect}
                    >
                        Upload Video
                    </button>
                </div>
            </>
        );
    }

    // Display video cards
    return (
        <>
            <Navbar />
            <div className="video-grid">
                {videos.map((video) => (
                    <div key={video.id} className="video-card">
                        <div
                            className="thumbnail-container"
                            onClick={() => handlePlay(video.id)}
                        >

                            <img
                                src={`data:image/jpeg;base64,${video.thumbnail}`}

                                alt={video.title}
                                className="video-thumbnail"
                            />
                            <span className="video-duration">
                                {video.duration || "00:00"}
                            </span>
                        </div>
                        <div className="video-info">
                            <h3 className="video-title">{video.title}</h3>
                            <p className="video-description">
                                {video.description}
                            </p>
                        </div>
                        
                    </div>
                ))}
            </div>
        </>
    );
};

export default VideoBrowser;
