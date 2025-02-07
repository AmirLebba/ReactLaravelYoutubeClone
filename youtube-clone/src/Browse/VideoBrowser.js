import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const fetchVideos = async () => {
    const response = await axios.get("http://localhost:8000/api/videos");
    console.log(response.data);
    return response.data;
};

const VideoBrowser = ({ setFilterOpen }) => {
    const navigate = useNavigate();
    const [sidebarToggle, setSidebarToggle] = useState(false);
    const [compactToggle, setCompactToggle] = useState(false);

    const {
        data: videos,
        isLoading,
        error,
        refetch, // Allow retry on failure
    } = useQuery({
        queryKey: ["videos"],
        queryFn: fetchVideos,
        retry: 2, // Automatically retry twice before failing
    });

    const handlePlay = (id) => {
        navigate(`/video/${id}`);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar
                sidebarToggle={sidebarToggle}
                compactToggle={compactToggle}
                onClose={() => setSidebarToggle(false)}
            />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-200 ease-out ${
                    sidebarToggle ? "lg:ml-60" : "ml-0"
                }`}
            >
                {/* Navbar */}
                <Navbar
                    sidebarToggle={sidebarToggle}
                    setSidebarToggle={setSidebarToggle}
                />

                {/* Main Content */}
                <div className="custom-container mt-20 pl-3 pr-3">
                    <div className="mb-4 mt-2 relative">
                        <div className="flex items-center gap-6">
                            <h1 className="text-2xl font-semibold dark:text-white">
                                Videos
                            </h1>
                            <div className="flex items-center space-x-8 ml-auto">
                                {/* Filter Button */}
                                <button
                                    className="w-full py-2.5 px-4 inline-flex justify-center items-center gap-3 text-sm text-center text-gray-500 rounded-lg hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                                    onClick={() => setFilterOpen(true)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
                                        />
                                    </svg>
                                    <span>Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-gray-500">Loading videos...</div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-red-500">
                            Error loading videos:{" "}
                            {error.message || "Unknown error"}
                            <button
                                onClick={() => refetch()}
                                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Video Grid */}
                    {videos && videos.length > 0 ? (
                        <>
                            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                                {videos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="each mb-10 m-2 shadow-lg border-gray-800 bg-gray-100 relative"
                                    >
                                        <img
                                            src={`data:image/jpeg;base64,${video.thumbnail}`}
                                            alt={video.title}
                                            className="video-thumbnail w-full h-auto rounded-lg shadow-md"
                                            loading="lazy"
                                        />

                                        <div className="badge absolute top-0 right-0 bg-red-500 m-1 text-gray-200 p-1 px-2 text-xs font-bold rounded">
                                            {video.duration}
                                        </div>
                                        <div className="info-box text-xs flex p-1 font-semibold text-gray-500 bg-gray-300">
                                            <span className="mr-1 p-1 px-2 font-bold">
                                                {video.views} views
                                            </span>
                                        </div>
                                        <div className="desc p-4 text-gray-800">
                                            <a
                                                href={`/video/${video.id}`}
                                                className="title font-bold block cursor-pointer hover:underline"
                                            >
                                                {video.title}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        !isLoading && (
                            <div className="no-videos-container flex flex-col items-center text-center mt-10">
                                <p className="text-lg text-gray-500">
                                    No videos available. Upload your first video
                                    now!
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoBrowser;
