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
        <div className="min-h-screen dark:bg-gray-950 flex flex-col relative">
            {/* Header */}
            <header className="w-full z-40 bg-white dark:bg-gray-950 xl:dark:bg-gray-950/80 backdrop-blur-lg sticky top-0 !bg-transparent dark:!bg-transparent">
                <div className="px-6 lg:px-8">
                    <div className="flex items-center relative h-16">
                        {/* Logo */}
                        <div className="shrink-0 lg:ml-0 flex items-center gap-x-5">
                            <a href="/">
                                <svg
                                    height="24"
                                    className="text-gray-700 dark:text-white"
                                    viewBox="0 0 230 57"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Add your logo path here */}
                                </svg>
                            </a>
                        </div>
                        {/* Navigation */}
                        <nav className="flex ml-auto rtl:mr-auto rtl:ml-0 lg:w-96">
                            <ul className="flex grow justify-end flex-wrap items-center text-sm gap-x-6 lg:gap-x-7">
                                <li className="block lg:hidden">
                                    <button
                                        type="button"
                                        className="w-5 h-5 flex items-center text-gray-500 dark:text-gray-400 dark:hover:text-primary-500 hover:text-primary-500 justify-center hover:text-primary-500 transition duration-150 rounded-full"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            strokeLinecap="round"
                                            strokeWidth="1.75"
                                            strokeLinejoin="round"
                                            className="w-5 h-5"
                                        >
                                            {/* Add your search icon path here */}
                                        </svg>
                                    </button>
                                </li>
                                <li className="hidden lg:block">
                                    <a
                                        href="/login"
                                        className="text-gray-700 dark:text-gray-400 dark:hover:text-white hover:text-primary-500 inline-flex items-center px-1 py-2 text-sm"
                                    >
                                        Sign in
                                    </a>
                                </li>
                                <li className="hidden lg:block">
                                    <a
                                        href="/register"
                                        className="bg-primary-500 rounded-full border-transparent text-white dark:text-gray-200 hover:text-white hover:bg-primary-500 transition-all inline-flex items-center px-6 lg:px-8 py-3.5 text-sm group"
                                    >
                                        <span>Sign up</span>
                                        <span className="tracking-normal group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-3">
                                            -&gt;
                                        </span>
                                    </a>
                                </li>
                                <li className="block lg:hidden">
                                    <a
                                        href="/login"
                                        className="bg-primary-500 rounded-full border-transparent text-white dark:text-gray-200 hover:text-white hover:bg-primary-500 transition-all inline-flex items-center w-10 h-10 flex items-center justify-center text-sm group"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            strokeLinecap="round"
                                            strokeWidth="1.75"
                                            strokeLinejoin="round"
                                            className="w-5 h-5"
                                            stroke="currentColor"
                                        >
                                            {/* Add your user icon path here */}
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="my-auto relative">
                <div className="absolute lg:flex items-center justify-center top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/4 aspect-square hidden dark:flex">
                    <div className="absolute inset-0 translate-z-0 bg-gray-100 dark:bg-gray-800 rounded-full blur-[120px] opacity-70"></div>
                    <div className="absolute w-1/4 h-1/4 translate-z-0 bg-gray-100 dark:bg-gray-800 rounded-full blur-[40px]"></div>
                </div>
                <div className="max-w-lg mx-auto w-full px-4 my-auto">
                    <div className="text-center">
                        <h1 className="block text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white">
                            Sign in to your account
                        </h1>
                    </div>
                    <div className="mt-10">
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
                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-8 text-center">
                            <span>Don't have an account yet?</span>
                            <a
                                href="/register"
                                className="hover:underline font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                            >
                                Create an Account
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full lg:py-10 custom-container mt-auto">
                <div className="text-center">
                    <a className="mx-auto inline-flex mb-5" href="/">
                        <svg
                            height="24"
                            className="text-gray-700 dark:text-white"
                            viewBox="0 0 230 57"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Add your logo path here */}
                        </svg>
                    </a>
                    <div className="text-center max-w-2xl w-full mx-auto">
                        <p className="text-gray-500 leading-6">
                            We let you watch movies online without having to
                            register or paying, with over 10000 Movies and TV
                            Shows.
                        </p>
                    </div>
                    <ul className="text-center mt-4">
                        {/* Add footer links here */}
                    </ul>
                    <p className="text-gray-500 text-sm mt-4">
                        © 2025 DreamTube. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Login;
