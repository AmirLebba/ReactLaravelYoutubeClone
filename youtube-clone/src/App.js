import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Upload from "./upload/Upload";
import VideoBrowser from "./Browse/VideoBrowser";
import VPlayer from "./Player/VPlayer";
import LoginRegisterHandler from "./Login/LoginRegisterHandler";
import ProtectedRoute from "./ProtectRoutes/ProtectRoutes"; // Ensure correct import path

import "./App.css";
import "video.js/dist/video-js.css";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>


                <Routes>
                    <Route path="/" element={<VideoBrowser />} />
                    <Route
                        path="/upload"
                        element={<ProtectedRoute element={<Upload />} />}
                    />
                    <Route path="/video/:id" element={<VPlayer />} />
                    <Route path="/register" element={<LoginRegisterHandler defaultView="false"/>} />
                    <Route path="/login" element={<LoginRegisterHandler defaultView="true"/>} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
