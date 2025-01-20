import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

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
        <div className="register-container">
            <h2 className="register-title">Register</h2>
            {message && <p className="register-message">{message}</p>}
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className={errors.username ? "input-error" : ""}
                    />
                    {errors.username && (
                        <p className="error">{errors.username}</p>
                    )}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={errors.password ? "input-error" : ""}
                    />
                    {errors.password && (
                        <p className="error">{errors.password}</p>
                    )}
                    <p>Password strength: {passwordStrength()}</p>
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                        className={
                            errors.password_confirmation ? "input-error" : ""
                        }
                    />
                    {errors.password_confirmation && (
                        <p className="error">{errors.password_confirmation}</p>
                    )}
                </div>
                <button
                    className="register-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;
