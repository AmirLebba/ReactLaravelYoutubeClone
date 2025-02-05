import React, { useEffect, useRef } from "react";

const Sidebar = ({ sidebarToggle, compactToggle, onClose }) => {
    const sidebarRef = useRef(null);

    // Handle click outside the sidebar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose(); // Close the sidebar
            }
        };

        // Attach the event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <aside
            ref={sidebarRef}
            className={`fixed shrink-0 top-16 max-h-[calc(100vh-theme(space.16))] min-h-[calc(100vh-theme(space.16))] bottom-0 group left-0 bg-white lg:flex lg:right-auto lg:bottom-0 dark:scrollbar-y flex flex-col z-40 dark:bg-gray-950 w-full lg:w-64 transition-all duration-200 ease-out rtl:left-auto rtl:right-0 ${
                sidebarToggle ? "translate-x-0" : "-translate-x-full"
            } ${compactToggle ? "lg:!w-auto group" : ""}`}
        >
            <div className="flex flex-col overflow-y-auto scrollbar-y h-full px-2 lg:px-4 scrollbar scrollbar-thumb-gray-100 dark:scrollbar-thumb-white/10 scrollbar-thin scrollbar-track-transparent">
                {/* Navigation Links */}
                {[
                    { href: "/browse", icon: "browse", text: "Browse" },
                    { href: "/trending", icon: "trending", text: "Trending" },
                    { href: "/top-imdb", icon: "top", text: "Top IMDb" },
                    { href: "/movies", icon: "movie", text: "Movies" },
                    { href: "/tv-shows", icon: "tv", text: "TV Shows" },
                    {
                        href: "/live-broadcasts",
                        icon: "broadcast",
                        text: "Live broadcasts",
                    },
                ].map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className="px-3 gap-x-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50/70 hover:border-primary-500 dark:hover:text-gray-100 dark:hover:bg-gray-900 transition rounded-lg flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            strokeLinecap="round"
                            strokeWidth="1.75"
                            strokeLinejoin="round"
                            className="w-[22px] h-[22px] !w-6 !h-6"
                            stroke="currentColor"
                        >
                            <use
                                xlinkHref={`http://127.0.0.1:8080/static/sprite/sprite.svg#${link.icon}`}
                            />
                        </svg>
                        <div
                            className={`tracking-tighter whitespace-nowrap flex-1 line-clamp-1 ${
                                compactToggle ? "lg:hidden" : "block"
                            }`}
                        >
                            {link.text}
                        </div>
                    </a>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-900/70 mx-2 my-6"></div>

                {/* Additional Links */}
                {[
                    { href: "/request", icon: "refresh", text: "Request" },
                    {
                        href: "/collections",
                        icon: "collection",
                        text: "Collections",
                    },
                    { href: "/peoples", icon: "people", text: "Peoples" },
                    { href: "/blog", icon: "blog", text: "Blog" },
                ].map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className="px-3 gap-x-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50/70 hover:border-primary-500 dark:hover:text-gray-100 dark:hover:bg-gray-900 transition rounded-lg flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            strokeLinecap="round"
                            strokeWidth="1.75"
                            strokeLinejoin="round"
                            className="w-[22px] h-[22px] !w-6 !h-6"
                            stroke="currentColor"
                        >
                            <use
                                xlinkHref={`http://127.0.0.1:8080/static/sprite/sprite.svg#${link.icon}`}
                            />
                        </svg>
                        <div
                            className={`tracking-tighter whitespace-nowrap flex-1 line-clamp-1 ${
                                compactToggle ? "lg:hidden" : "block"
                            }`}
                        >
                            {link.text}
                        </div>
                    </a>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
