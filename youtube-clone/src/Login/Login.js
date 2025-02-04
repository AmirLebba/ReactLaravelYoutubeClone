import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/login",
                formData
            );

            // Store the authentication token
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data
            setMessage("Login successful!");
            navigate("/"); // Redirect to the home page or protected route
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
                <label
                    className="block text-sm font-medium text-gray-600 mb-3 dark:text-gray-300 dark:font-normal rtl:text-right"
                    htmlFor="email"
                >
                    Email
                </label>
                <input
                    className="block w-full border-gray-200 rounded-md text-sm px-5 py-3.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400 placeholder-gray-400/70 shadow-sm dark:focus:ring-primary-500 dark:focus:border-primary-500 block mt-1 w-full"
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                />
            </div>
            {/* Password */}
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <label
                        className="block text-sm font-medium text-gray-600 mb-3 dark:text-gray-300 dark:font-normal rtl:text-right"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <a
                        href="/forgot-password"
                        className="hover:underline text-sm text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 mb-3"
                    >
                        Forgot your password?
                    </a>
                </div>
                <input
                    className="block w-full border-gray-200 rounded-md text-sm px-5 py-3.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400 placeholder-gray-400/70 shadow-sm dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full"
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                />
            </div>
            {/* Submit Button */}
            <div className="mt-5">
                <button
                    className="inline-flex whitespace-nowrap gap-x-3 items-center justify-center px-6 py-3.5 text-sm rounded-base font-[450] disabled:opacity-50 disabled:pointer-events-none transition border border-transparent text-white bg-primary-500 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:hover:bg-primary-500/70 dark:focus:ring-offset-gray-800 w-full"
                    type="submit"
                >
                    Sign in
                </button>
            </div>
        </form>
    );
};

export default Login;
