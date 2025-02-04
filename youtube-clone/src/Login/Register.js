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
        <form onSubmit={handleSubmit} >
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
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
    );
};

export default Register;
