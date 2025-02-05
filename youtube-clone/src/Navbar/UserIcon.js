import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const UserIcon = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        // Attach the event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <li className="relative inline-flex mx-auto" ref={dropdownRef}>
            {/* Button to toggle dropdown */}
            <button
                className="inline-flex justify-center items-center group"
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                <div className="text-white h-9 w-9 rounded-full bg-primary-500 text-xs font-bold flex items-center justify-center">
                    A
                </div>
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="origin-top-right z-10 absolute top-full mt-3 bg-white py-6 w-56 px-3 left-auto right-0 lg:-mr-1.5 lg:rounded-xl shadow-lg border border-gray-100 text-sm divide-y divide-gray-100 dark:bg-gray-900 dark:border-gray-900">
                    {/* Profile Link */}
                    <Link
                        to="/profile"
                        className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                        onClick={() => setOpen(false)}
                    >
                        My Profile
                    </Link>

                    {/* Watch History Link */}
                    <Link
                        to="/profile/admin/history"
                        className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                        onClick={() => setOpen(false)}
                    >
                        Watch History
                    </Link>

                    {/* Liked Link */}
                    <Link
                        to="/profile/admin/liked"
                        className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                        onClick={() => setOpen(false)}
                    >
                        Liked
                    </Link>

                    {/* Watchlist Link */}
                    <Link
                        to="/profile/admin/watchlist"
                        className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                        onClick={() => setOpen(false)}
                    >
                        Watchlist
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-gray-100 dark:border-gray-800/50 mt-4 pt-4"></div>

                    {/* Settings Link */}
                    <Link
                        to="/settings"
                        className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                        onClick={() => setOpen(false)}
                    >
                        Settings
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </li>
    );
};

export default UserIcon;
