import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import SearchButton from "./SearchButton";
import UserIcon from "./UserIcon";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
    const handleSidebarToggle = () => {
        setSidebarToggle((prev) => !prev);
    };

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md dark:bg-gray-900 z-25">
            <div className="custom-container flex items-center justify-between py-4">
                <div className="flex items-center gap-6 ml-6">
                    {/* Sidebar Toggle Buttons */}
                    {!sidebarToggle ? (
                        <button
                            onClick={handleSidebarToggle}
                            className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
                        >
                            {/* Open Sidebar Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M4.975 15q-.425 0-.7-.288T4 14t.288-.712T5 13h14.025q.425 0 .7.288T20 14t-.288.713T19 15zm0 4q-.425 0-.7-.288T4 18t.288-.712T5 17h14.025q.425 0 .7.288T20 18t-.288.713T19 19zm0-8q-.425 0-.7-.288T4 10t.288-.712T5 9h14.025q.425 0 .7.288T20 10t-.288.713T19 11zm0-4q-.425 0-.7-.288T4 6t.288-.712T5 5h14.025q.425 0 .7.288T20 6t-.288.713T19 7z"
                                />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleSidebarToggle}
                            className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
                        >
                            {/* Close Sidebar Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    fill="none"
                                    stroke="currentColor"
                                    strokeDasharray="16"
                                    strokeDashoffset="16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                >
                                    <path d="M7 7l10 10">
                                        <animate
                                            fill="freeze"
                                            attributeName="stroke-dashoffset"
                                            dur="0.4s"
                                            values="16;0"
                                        />
                                    </path>
                                    <path d="M17 7l-10 10">
                                        <animate
                                            fill="freeze"
                                            attributeName="stroke-dashoffset"
                                            begin="0.4s"
                                            dur="0.4s"
                                            values="16;0"
                                        />
                                    </path>
                                </g>
                            </svg>
                        </button>
                    )}

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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <g
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    >
                                        <path
                                            fill="currentColor"
                                            fillOpacity="0"
                                            strokeDasharray="20"
                                            strokeDashoffset="20"
                                            d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                                        >
                                            <animate
                                                attributeName="d"
                                                begin="0.5s"
                                                dur="1.5s"
                                                repeatCount="indefinite"
                                                values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                                            />
                                            <animate
                                                fill="freeze"
                                                attributeName="fill-opacity"
                                                begin="0.7s"
                                                dur="0.5s"
                                                values="0;1"
                                            />
                                            <animate
                                                fill="freeze"
                                                attributeName="stroke-dashoffset"
                                                dur="0.4s"
                                                values="20;0"
                                            />
                                        </path>
                                        <path
                                            strokeDasharray="14"
                                            strokeDashoffset="14"
                                            d="M6 19h12"
                                        >
                                            <animate
                                                fill="freeze"
                                                attributeName="stroke-dashoffset"
                                                begin="0.5s"
                                                dur="0.2s"
                                                values="14;0"
                                            />
                                        </path>
                                    </g>
                                </svg>
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
