import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const VideoPlayer = () => {
    const { id } = useParams();
    const videoRef = useRef(null);
    const [currentQuality, setCurrentQuality] = useState(null);

    const { data: video, isLoading, error } = useQuery({
      queryKey: ["video", id],
      queryFn: async () => {
        const response = await axios.get(`http://localhost:8000/api/videos/${id}`);
        return response.data;
      },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading video: {error.message}</div>;

    // Check if qualities are available
    const availableQualities = video?.qualities || {};
    const defaultQuality = availableQualities["720p"] || video?.url; // Fallback to original video if no qualities

    const handleQualityChange = (url) => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        videoRef.current.src = url;
        videoRef.current.load();
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
        setCurrentQuality(url);
      }
    };

    return (
      <div className="video-player-container">
        <h1>{video.title}</h1>
        <video
          controls
          ref={videoRef}
          src={currentQuality || defaultQuality}
          className="html5-video-player"
        >
          Your browser does not support the video tag.
        </video>
        <div className="quality-selector">
          <h3>Select Quality:</h3>
          {Object.entries(availableQualities).map(([label, url]) => (
            <button
              key={label}
              onClick={() => handleQualityChange(url)}
              className={currentQuality === url ? "active-quality" : ""}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  };


export default VideoPlayer;
