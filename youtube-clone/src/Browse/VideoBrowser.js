import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const fetchVideos = async () => {
    const response = await axios.get("http://localhost:8000/api/videos");
    return response.data;
};

const VideoBrowser = ({ setFilterOpen }) => {
    const navigate = useNavigate();
    const [sidebarToggle, setSidebarToggle] = useState(false);

    const { data: videos, isLoading, error } = useQuery({
        queryKey: ["videos"],
        queryFn: fetchVideos,
    });

    const handlePlay = (id) => {
        navigate(`/video/${id}`);
    };

    if (isLoading) {
        return <div>Loading videos...</div>;
    }
    if (error) return <div>Error loading videos: {error.message}</div>;

    return (
        <div className="flex">
            <Sidebar sidebarToggle={sidebarToggle} />
            <div className={`flex-1 transition-all duration-200 ease-out ${sidebarToggle ? "lg:ml-60" : "ml-0"}`}>
                <Navbar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
                <div className="custom-container mt-16">
                    <div className="mb-6 relative">
                        <div className="flex items-center gap-6">
                            <h1 className="text-2xl font-semibold dark:text-white"></h1>
                            <div className="flex items-center space-x-8 ml-auto">
                                <button
                                    className="w-full py-2.5 px-4 inline-flex justify-center items-center gap-3 text-sm text-center text-gray-500 rounded-lg hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                                    onClick={() => setFilterOpen(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                                        <use xlinkHref="/static/sprite/sprite.svg#sort-2" />
                                    </svg>
                                    <span>Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
                        {videos.length === 0 ? (
                            <div className="no-videos-container">
                                <p className="no-videos-message">
                                    No videos available. Upload your first video now!
                                </p>
                            </div>
                        ) : (
                            videos.map((video) => (
                                <div key={video.id} className="video-card" onClick={() => handlePlay(video.id)}>
                                    <img
                                        src={`data:image/jpeg;base64,${video.thumbnail}`}
                                        alt={video.title}
                                        className="video-thumbnail"
                                    />
                                    <div className="video-info">
                                        <h3 className="video-title">{video.title}</h3>
                                        <p className="video-description">{video.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoBrowser;
