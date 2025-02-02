import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Sprite } from "./sprite.svg";
//import "./Register.scss";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!formData.username) errors.username = "Username is required";
        if (!formData.email) errors.email = "Email is required";
        if (!formData.password) errors.password = "Password is required";
        if (formData.password !== formData.password_confirmation)
            errors.password_confirmation = "Passwords do not match";
        return errors;
    };

    useEffect(() => {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
            document.getElementsByName(firstErrorField)[0]?.focus();
        }
    }, [errors]);

    const passwordStrength = () => {
        if (formData.password.length < 6) return "Weak";
        if (/[A-Z]/.test(formData.password) && /\d/.test(formData.password))
            return "Strong";
        return "Moderate";
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const baseURL =
                process.env.REACT_APP_API_BASE_URL ||
                "http://localhost:8000/api/auth";
            await axios.post(`${baseURL}/register`, formData);

            setMessage("Registration successful! Logging you in...");
            setErrors({});
            const loginResponse = await axios.post(`${baseURL}/login`, {
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("authToken", loginResponse.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(loginResponse.data.user)
            );
            setMessage("Registration and login successful!");
            setFormData({
                username: "",
                email: "",
                password: "",
                password_confirmation: "",
            });

            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setMessage(
                    error.response?.data?.message || "Registration failed."
                );
            }
        } finally {
            setLoading(false);
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
                                    class="text-gray-700 dark:text-white"
                                    viewBox="0 0 230 57"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M46.04 11.256C48.216 12.088 49.112 14.52 48.28 16.632L38.488 40.44C37.784 42.168 36.504 43 34.712 43C32.92 43 31.64 42.04 30.936 40.44L24.408 24.76L17.944 40.44C17.24 42.168 15.896 43 14.104 43C12.312 43 11.032 42.168 10.328 40.44L0.600007 16.632C-0.231993 14.52 0.664007 12.152 2.84001 11.256C4.88801 10.424 7.32001 11.448 8.15201 13.496L14.808 29.752L21.208 14.456C21.784 13.112 23.064 12.28 24.408 12.28C25.816 12.28 27.096 13.112 27.672 14.456L34.008 29.752L40.664 13.496C41.56 11.448 43.928 10.424 46.04 11.256Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M77.6885 11C79.8645 11 81.6565 12.728 81.6565 14.84V39.16C81.6565 41.272 79.8645 43 77.6885 43C76.1525 43 74.8085 42.104 74.1685 40.76C71.6085 42.488 68.5365 43.448 65.2085 43.448C56.1845 43.448 48.9525 36.088 48.9525 27.064C48.9525 18.104 56.1845 10.744 65.2085 10.744C68.4725 10.744 71.5445 11.704 74.1045 13.368C74.6805 11.96 76.0885 11 77.6885 11ZM65.3365 35.192C69.8165 35.192 73.4645 31.544 73.4645 27.064C73.4645 22.648 69.8165 19 65.3365 19C60.8565 19 57.2085 22.648 57.2085 27.064C57.2085 31.544 60.8565 35.192 65.3365 35.192Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M99.388 34.744C101.692 34.744 103.548 36.6 103.548 38.84C103.548 41.144 101.692 43 99.388 43H97.916C91.068 43 85.5 37.432 85.5 30.584V4.984C85.5 2.68 87.356 0.824005 89.66 0.824005C91.9 0.824005 93.756 2.68 93.756 4.984V11H99.9C101.884 11 103.42 12.6 103.42 14.52C103.42 16.44 101.884 18.04 99.9 18.04H93.756V30.584C93.756 32.888 95.612 34.744 97.916 34.744H99.388Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M120.277 43.512C111.253 43.512 103.893 36.152 103.893 27.128C103.893 18.104 111.253 10.744 120.277 10.744C123.925 10.744 127.381 11.896 130.261 14.136C132.053 15.544 132.437 18.104 131.029 19.96C129.621 21.752 126.997 22.072 125.205 20.728C123.797 19.576 122.069 19 120.277 19C115.797 19 112.149 22.648 112.149 27.128C112.149 31.608 115.797 35.256 120.277 35.256C122.069 35.256 123.797 34.68 125.205 33.592C126.997 32.184 129.621 32.504 130.965 34.36C132.373 36.152 132.053 38.776 130.197 40.12C127.317 42.36 123.925 43.512 120.277 43.512Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M148.769 10.552C156.513 10.552 162.785 16.888 162.785 24.632V38.84C162.785 41.144 160.929 43 158.625 43C156.321 43 154.465 41.144 154.465 38.84V24.632C154.465 21.496 151.905 18.936 148.769 18.936C145.633 18.936 143.073 21.496 143.073 24.632V38.84C143.073 41.144 141.217 43 138.913 43C136.609 43 134.753 41.144 134.753 38.84V4.53601C134.753 2.23201 136.609 0.376007 138.913 0.376007C141.217 0.376007 143.073 2.23201 143.073 4.53601V11.768C144.865 11 146.785 10.552 148.769 10.552Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M178.987 43.512C171.307 43.512 165.035 37.24 165.035 29.56V19.16C165.035 16.856 166.891 15 169.131 15C171.435 15 173.291 16.856 173.291 19.16V29.56C173.291 32.696 175.851 35.256 178.987 35.256C182.123 35.256 184.683 32.696 184.683 29.56V15.16C184.683 12.856 186.539 11 188.779 11C191.083 11 192.939 12.856 192.939 15.16V29.56C192.939 37.24 186.667 43.512 178.987 43.512Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M224.994 10.936C227.234 10.936 229.026 12.728 229.026 14.968V40.632C229.026 52.024 217.25 59.64 206.69 54.84C204.706 53.88 203.81 51.576 204.77 49.528C205.73 47.48 208.098 46.648 210.082 47.608C215.01 49.784 220.13 46.712 220.898 41.784C218.402 43.32 215.394 44.216 212.258 44.216C202.978 44.216 195.49 36.728 195.49 27.448C195.49 18.232 202.978 10.68 212.258 10.68C215.586 10.68 218.722 11.704 221.282 13.368C221.922 11.96 223.33 10.936 224.994 10.936ZM212.258 35.64C216.802 35.64 220.45 31.992 220.45 27.448C220.45 22.904 216.802 19.256 212.258 19.256C207.714 19.256 204.066 22.904 204.066 27.448C204.066 31.992 207.714 35.64 212.258 35.64Z"
                                        fill="currentColor"
                                    />
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
                                            stroke-linecap="round"
                                            stroke-width="1.75"
                                            stroke-linejoin="round"
                                            class="w-5 h-5"
                                        ></svg>
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

                                <li className="block lg:hidden">
                                    <a
                                        href="/login"
                                        className="bg-primary-500 rounded-full border-transparent text-white dark:text-gray-200 hover:text-white hover:bg-primary-500 transition-all inline-flex items-center w-10 h-10 flex items-center justify-center text-sm group"
                                    >
                                        <Sprite className="w-5 h-5" />
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
                <div className="max-w-lg mx-auto w-full px-4 py-8">
                    <div className="text-center">
                        <h1 className="block text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white">
                            Create an Account
                        </h1>
                    </div>
                    <div className="mt-8">
                        <form onSubmit={handleSubmit}>
                            {/* Username */}
                            <div className="mb-5">
                                <label
                                    className="block text-sm font-medium text-gray-600 mb-3 dark:text-gray-300 dark:font-normal rtl:text-right"
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    className="block w-full border-gray-200 rounded-md text-sm px-5 py-3.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400 placeholder-gray-400/70 shadow-sm dark:focus:ring-primary-500 dark:focus:border-primary-500 block mt-1 w-full"
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Username"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.username}
                                    </p>
                                )}
                            </div>
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
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            {/* Password */}
                            <div className="mb-5">
                                <label
                                    className="block text-sm font-medium text-gray-600 mb-3 dark:text-gray-300 dark:font-normal rtl:text-right"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    className="block w-full border-gray-200 rounded-md text-sm px-5 py-3.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400 placeholder-gray-400/70 shadow-sm dark:focus:ring-primary-500 dark:focus:border-primary-500 block mt-1 w-full"
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Password"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                    Password strength: {passwordStrength()}
                                </p>
                            </div>
                            {/* Confirm Password */}
                            <div className="mb-5">
                                <label
                                    className="block text-sm font-medium text-gray-600 mb-3 dark:text-gray-300 dark:font-normal rtl:text-right"
                                    htmlFor="password_confirmation"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    className="block w-full border-gray-200 rounded-md text-sm px-5 py-3.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400 placeholder-gray-400/70 shadow-sm dark:focus:ring-primary-500 dark:focus:border-primary-500 block mt-1 w-full"
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm Password"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                            {/* Submit Button */}
                            <div className="mb-5">
                                <button
                                    className="inline-flex whitespace-nowrap gap-x-3 items-center justify-center px-6 py-3.5 text-sm rounded-md font-[450] disabled:opacity-50 disabled:pointer-events-none transition border border-transparent text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:hover:bg-violet-500/70 dark:focus:ring-offset-gray-800 w-full"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Sign up"}
                                </button>
                            </div>
                        </form>
                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-8 text-center">
                            <span>Already have an account?</span>
                            <a
                                href="/login"
                                className="hover:underline font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                            >
                                Sign in
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
                            class="text-gray-700 dark:text-white"
                            viewBox="0 0 230 57"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M46.04 11.256C48.216 12.088 49.112 14.52 48.28 16.632L38.488 40.44C37.784 42.168 36.504 43 34.712 43C32.92 43 31.64 42.04 30.936 40.44L24.408 24.76L17.944 40.44C17.24 42.168 15.896 43 14.104 43C12.312 43 11.032 42.168 10.328 40.44L0.600007 16.632C-0.231993 14.52 0.664007 12.152 2.84001 11.256C4.88801 10.424 7.32001 11.448 8.15201 13.496L14.808 29.752L21.208 14.456C21.784 13.112 23.064 12.28 24.408 12.28C25.816 12.28 27.096 13.112 27.672 14.456L34.008 29.752L40.664 13.496C41.56 11.448 43.928 10.424 46.04 11.256Z"
                                fill="currentColor"
                            />
                            <path
                                d="M77.6885 11C79.8645 11 81.6565 12.728 81.6565 14.84V39.16C81.6565 41.272 79.8645 43 77.6885 43C76.1525 43 74.8085 42.104 74.1685 40.76C71.6085 42.488 68.5365 43.448 65.2085 43.448C56.1845 43.448 48.9525 36.088 48.9525 27.064C48.9525 18.104 56.1845 10.744 65.2085 10.744C68.4725 10.744 71.5445 11.704 74.1045 13.368C74.6805 11.96 76.0885 11 77.6885 11ZM65.3365 35.192C69.8165 35.192 73.4645 31.544 73.4645 27.064C73.4645 22.648 69.8165 19 65.3365 19C60.8565 19 57.2085 22.648 57.2085 27.064C57.2085 31.544 60.8565 35.192 65.3365 35.192Z"
                                fill="currentColor"
                            />
                            <path
                                d="M99.388 34.744C101.692 34.744 103.548 36.6 103.548 38.84C103.548 41.144 101.692 43 99.388 43H97.916C91.068 43 85.5 37.432 85.5 30.584V4.984C85.5 2.68 87.356 0.824005 89.66 0.824005C91.9 0.824005 93.756 2.68 93.756 4.984V11H99.9C101.884 11 103.42 12.6 103.42 14.52C103.42 16.44 101.884 18.04 99.9 18.04H93.756V30.584C93.756 32.888 95.612 34.744 97.916 34.744H99.388Z"
                                fill="currentColor"
                            />
                            <path
                                d="M120.277 43.512C111.253 43.512 103.893 36.152 103.893 27.128C103.893 18.104 111.253 10.744 120.277 10.744C123.925 10.744 127.381 11.896 130.261 14.136C132.053 15.544 132.437 18.104 131.029 19.96C129.621 21.752 126.997 22.072 125.205 20.728C123.797 19.576 122.069 19 120.277 19C115.797 19 112.149 22.648 112.149 27.128C112.149 31.608 115.797 35.256 120.277 35.256C122.069 35.256 123.797 34.68 125.205 33.592C126.997 32.184 129.621 32.504 130.965 34.36C132.373 36.152 132.053 38.776 130.197 40.12C127.317 42.36 123.925 43.512 120.277 43.512Z"
                                fill="currentColor"
                            />
                            <path
                                d="M148.769 10.552C156.513 10.552 162.785 16.888 162.785 24.632V38.84C162.785 41.144 160.929 43 158.625 43C156.321 43 154.465 41.144 154.465 38.84V24.632C154.465 21.496 151.905 18.936 148.769 18.936C145.633 18.936 143.073 21.496 143.073 24.632V38.84C143.073 41.144 141.217 43 138.913 43C136.609 43 134.753 41.144 134.753 38.84V4.53601C134.753 2.23201 136.609 0.376007 138.913 0.376007C141.217 0.376007 143.073 2.23201 143.073 4.53601V11.768C144.865 11 146.785 10.552 148.769 10.552Z"
                                fill="currentColor"
                            />
                            <path
                                d="M178.987 43.512C171.307 43.512 165.035 37.24 165.035 29.56V19.16C165.035 16.856 166.891 15 169.131 15C171.435 15 173.291 16.856 173.291 19.16V29.56C173.291 32.696 175.851 35.256 178.987 35.256C182.123 35.256 184.683 32.696 184.683 29.56V15.16C184.683 12.856 186.539 11 188.779 11C191.083 11 192.939 12.856 192.939 15.16V29.56C192.939 37.24 186.667 43.512 178.987 43.512Z"
                                fill="currentColor"
                            />
                            <path
                                d="M224.994 10.936C227.234 10.936 229.026 12.728 229.026 14.968V40.632C229.026 52.024 217.25 59.64 206.69 54.84C204.706 53.88 203.81 51.576 204.77 49.528C205.73 47.48 208.098 46.648 210.082 47.608C215.01 49.784 220.13 46.712 220.898 41.784C218.402 43.32 215.394 44.216 212.258 44.216C202.978 44.216 195.49 36.728 195.49 27.448C195.49 18.232 202.978 10.68 212.258 10.68C215.586 10.68 218.722 11.704 221.282 13.368C221.922 11.96 223.33 10.936 224.994 10.936ZM212.258 35.64C216.802 35.64 220.45 31.992 220.45 27.448C220.45 22.904 216.802 19.256 212.258 19.256C207.714 19.256 204.066 22.904 204.066 27.448C204.066 31.992 207.714 35.64 212.258 35.64Z"
                                fill="currentColor"
                            />
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

export default Register;
