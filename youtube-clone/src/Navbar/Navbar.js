import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import SearchButton from "./SearchButton";
import UserIcon from "./UserIcon";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md dark:bg-gray-900 z-50">
            <div className="custom-container flex items-center justify-between py-4">
                <div className="flex items-center gap-6 ml-6">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={() => setSidebarToggle(!sidebarToggle)}
                        className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <g
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray="8"
                                strokeDashoffset="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            >
                                <path d="M12 5h6M12 5h-6">
                                    <animate
                                        fill="freeze"
                                        attributeName="strokeDashoffset"
                                        dur="0.2s"
                                        values="8;0"
                                    />
                                </path>
                                <path d="M12 10h6M12 10h-6">
                                    <animate
                                        fill="freeze"
                                        attributeName="strokeDashoffset"
                                        begin="0.2s"
                                        dur="0.2s"
                                        values="8;0"
                                    />
                                </path>
                                <path d="M12 15h6M12 15h-6">
                                    <animate
                                        fill="freeze"
                                        attributeName="strokeDashoffset"
                                        begin="0.4s"
                                        dur="0.2s"
                                        values="8;0"
                                    />
                                </path>
                                <path d="M12 20h6M12 20h-6">
                                    <animate
                                        fill="freeze"
                                        attributeName="strokeDashoffset"
                                        begin="0.6s"
                                        dur="0.2s"
                                        values="8;0"
                                    />
                                </path>
                            </g>
                        </svg>
                    </button>

                    {/* Home Link */}
                    <Link
                        to="/"
                        className="text-lg font-semibold dark:text-white"
                    >
                        Home
                    </Link>
                </div>

                {/* Search Button */}
                <SearchButton />

                {/* User Actions */}
                <div className="flex items-center space-x-6 mr-6">
                    {isAuthenticated() ? (
                        <>
                            <Link
                                to="/upload"
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Upload Video
                            </Link>

                            <UserIcon />
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="py-2.5 px-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
