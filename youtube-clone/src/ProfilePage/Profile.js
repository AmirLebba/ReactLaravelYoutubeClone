import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Profile() {
    const [nav, setNav] = useState("profile");

    // Fetch profile data with authentication
    const fetchProfile = async () => {
        const token = localStorage.getItem("authToken"); // Ensure you have the token saved after login
        if (!token) throw new Error("User is not authenticated");

        const response = await axios.get("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        return response.data;
    };

    // Use React Query to fetch profile data
    const {
        data: profile,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
        retry: false, // Don't retry on failure
    });

    const navItems = [
        { key: "profile", label: "Overview" },
        { key: "profile.liked", label: "Liked" },
        { key: "profile.history", label: "Watch history" },
        { key: "profile.watchlist", label: "Watchlist" },
    ];

    // Handle loading and error states
    if (isLoading) return <p>Loading profile...</p>;
    if (error)
        return (
            <p className="text-red-500">
                Error fetching profile: {error.message}
            </p>
        );

    return (
        <div className="flex-1 lg:ml-64 rtl:lg:ml-o rtl:lg:mr-64">
            <div className="pb-6 lg:pb-16">
                <div className="custom-container mt-5">
                    <div
                        className="bg-cover bg-primary-500 rounded-xl aspect-[6/1]"
                        style={{ backgroundImage: `url(${profile.cover})` }} // Dynamic background
                    />
                </div>

                <div className="custom-container py-5">
                    <div className="flex space-x-8 lg:px-5">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt="User Avatar"
                                className="w-32 h-32 rounded-full aspect-square border-[6px] border-white dark:border-gray-950 -mt-16"
                            />
                        ) : (
                            <svg
                                className="w-32 h-32 rounded-full aspect-square border-[6px] border-white dark:border-gray-950 -mt-16 bg-violet-500 color-white flex items-center justify-center"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
                                />
                            </svg>
                        )}
                        <div className="flex-1 rtl:pr-8">
                            <h1 className="text-xl font-medium text-gray-700 dark:text-white">
                                {profile.username}
                            </h1>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-500">
                                {profile.email}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b pb-3 border-gray-100 dark:border-gray-900 mt-4">
                        <ul className="flex gap-x-4 whitespace-nowrap overflow-x-auto sm:overflow-x-visible sm:p-2 lg:p-0">
                            {navItems.map(({ key, label }) => (
                                <li key={key}>
                                    <button
                                        className={`w-full py-2.5 px-5 inline-flex justify-center items-center gap-4 text-sm font-medium rounded-lg hover:bg-gray-50 relative after:absolute after:-bottom-3 after:rounded-full after:left-0 after:right-0 after:h-1 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 ${
                                            nav === key
                                                ? "after:bg-primary-500 text-primary-500 hover:bg-transparent dark:text-white dark:hover:!bg-transparent"
                                                : ""
                                        }`}
                                        onClick={() => setNav(key)}
                                        aria-label={label}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Profile Overview */}
                <div className="custom-container">
                    <div className="flex space-x-8">
                        <div className="flex-1">
                            <h3 className="text-xl font-medium text-gray-700 dark:text-white mb-5">
                                Activity
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                                {/* Add activity content here */}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="max-w-sm w-full">
                            <div className="bg-white border border-gray-200 dark:border-gray-900 shadow-sm dark:bg-gray-800 p-8 rounded-xl mb-4">
                                <h3 className="font-medium text-gray-700 dark:text-white mb-5">
                                    Overview
                                </h3>
                                <hr className="my-4 lg:my-6 border-gray-100 dark:border-gray-700/50" />
                                {[
                                    { label: "Content watched", value: "0" },
                                    {
                                        label: "Member for",
                                        value: profile.member_since,
                                    },
                                    { label: "Content liked", value: "0" },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-center mb-5 space-x-8"
                                    >
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {label}
                                            </div>
                                            <div className="text-base font-medium text-gray-700 dark:text-gray-100">
                                                {value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
