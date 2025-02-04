import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./Login.module.scss"; // Import your CSS file

const LoginRegisterHandler = ({ defaultView = "login" }) => {
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(defaultView === "login");
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleForm = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setShowLogin(!showLogin);
                setIsAnimating(false);
            }, 300); // Match the duration of the CSS transition
        }
    };

    useEffect(() => {
        if (location.pathname === "/login") {
            setShowLogin(true);
        } else if (location.pathname === "/register") {
            setShowLogin(false);
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen dark:bg-gray-950 flex flex-col relative">
            {/* Header */}
            <header className="w-full z-40 bg-white dark:bg-gray-950 xl:dark:bg-gray-950/80 backdrop-blur-lg sticky top-0 !bg-transparent dark:!bg-transparent">
                <div className="px-6 lg:px-8">
                    <div className="flex items-center relative h-16">
                        {/* Logo */}
                        <div className="shrink-0 lg:ml-0 flex items-center gap-x-5"></div>
                        {/* Navigation */}
                        <nav className="flex ml-auto rtl:mr-auto rtl:ml-0 lg:w-96">
                            <ul className="flex grow justify-end flex-wrap items-center text-sm gap-x-6 lg:gap-x-7">
                                <li className="block lg:hidden">
                                    <button
                                        type="button"
                                        className="w-5 h-5 flex items-center text-gray-500 dark:text-gray-400 dark:hover:text-primary-500 hover:text-primary-500 justify-center hover:text-primary-500 transition duration-150 rounded-full"
                                    ></button>
                                </li>
                                <li className="hidden lg:block"></li>
                                <li className="hidden lg:block"></li>
                                <li className="block lg:hidden"></li>
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
                            {showLogin ? "Welcome Back" : "Create an Account"}
                        </h1>
                    </div>
                    <div className="mt-6">
                        {/* Form with Animation */}
                        <div className={`form-container ${isAnimating ? (showLogin ? "form-exit" : "form-enter") : ""}`}>
                            {showLogin ? <Login /> : <Register />}
                        </div>

                        <div className="text-sm text-gray-400 dark:text-gray-500 text-center">
                            <span>
                                {showLogin
                                    ? "Don't have an account?"
                                    : "Already have an account?"}
                            </span>
                            <button
                                onClick={toggleForm}
                                className="ml-2 hover:underline font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                            >
                                {showLogin ? "Register" : "Sign in"}
                            </button>
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
                    <ul className="text-center">
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

export default LoginRegisterHandler;
