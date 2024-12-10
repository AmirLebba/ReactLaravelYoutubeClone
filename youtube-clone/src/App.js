import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Upload from "./upload/Upload";
import VideoBrowser from "./Browse/VideoBrowser";
import VPlayer from "./Player/VPlayer";
import Register from "./Register/Register";
import Login from "./Login/Login";  // Import Login component
import "./App.css";
import "video.js/dist/video-js.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="navbar">
          <nav>
            <ul>
              <li>
                <Link to="/">Video Browser</Link>
              </li>
              <li>
                <Link to="/upload">Upload Video</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link> {/* Add link to login page */}
              </li>
            </ul>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<VideoBrowser />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/video/:id" element={<VPlayer />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> {/* Add route for login page */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
