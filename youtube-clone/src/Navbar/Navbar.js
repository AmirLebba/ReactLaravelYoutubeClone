import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the authentication token
        localStorage.removeItem("authToken");

        // Redirect to the login page
        navigate("/login");
    };

    return (
        <div className="navbar">
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {isAuthenticated() && (
                        <>
                            <li>
                                <Link to="/upload">Upload Video</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    )}
                    {!isAuthenticated() && (
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
