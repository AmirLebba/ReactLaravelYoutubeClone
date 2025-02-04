import React, { useState, useRef, useEffect } from "react";
import { isAuthenticated } from "../utils/auth";

import { Link, useNavigate } from "react-router-dom";

const UserIcon = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    <div>
                        <a
                            className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                            href="/profile/admin"
                        >
                            My Profile
                        </a>
                        <a
                            className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                            href="/profile/admin/history"
                        >
                            Watch History
                        </a>
                        <a
                            className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                            href="/profile/admin/liked"
                        >
                            Liked
                        </a>
                        <a
                            className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                            href="/profile/admin/watchlist"
                        >
                            Watchlist
                        </a>
                        <div className="border-t border-gray-100 dark:border-gray-800/50 mt-4 pt-4"></div>
                        <a
                            className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                            href="/settings"
                        >
                            Settings
                        </a>

                        <button
                            onClick={handleLogout}
                            className="block py-2.5 px-6 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
};

export default UserIcon;
