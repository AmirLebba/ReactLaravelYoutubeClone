import React from "react";

const Sidebar = ({ sidebarToggle }) => {
    return (
        <aside
            className={`fixed shrink-0 top-16 bottom-0 bg-white dark:bg-gray-950 flex flex-col z-40 transition-all duration-200 ease-out
                ${
                    sidebarToggle
                        ? "w-60 translate-x-0"
                        : "w-0 -translate-x-full"
                }
            `}
        >
            <div className="flex flex-col overflow-y-auto h-full px-2 lg:px-4 scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-white/10">
                <a
                    href="/"
                    className="px-3 gap-x-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50/70 dark:hover:text-gray-100 dark:hover:bg-gray-900 transition rounded-lg flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            fill-opacity="0"
                            d="M5 8.5l7 -5.5l7 5.5v12.5h-4v-8l-1 -1h-4l-1 1v8h-4v-12.5Z"
                        >
                            <animate
                                fill="freeze"
                                attributeName="fill-opacity"
                                begin="1.1s"
                                dur="0.15s"
                                values="0;0.3"
                            />
                        </path>
                        <g
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                        >
                            <path
                                stroke-dasharray="16"
                                stroke-dashoffset="16"
                                d="M4.5 21.5h15"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    dur="0.2s"
                                    values="16;0"
                                />
                            </path>
                            <path
                                stroke-dasharray="16"
                                stroke-dashoffset="16"
                                d="M4.5 21.5v-13.5M19.5 21.5v-13.5"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    begin="0.2s"
                                    dur="0.2s"
                                    values="16;0"
                                />
                            </path>
                            <path
                                stroke-dasharray="28"
                                stroke-dashoffset="28"
                                d="M2 10l10 -8l10 8"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    begin="0.4s"
                                    dur="0.4s"
                                    values="28;0"
                                />
                            </path>
                            <path
                                stroke-dasharray="24"
                                stroke-dashoffset="24"
                                d="M9.5 21.5v-9h5v9"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    begin="0.7s"
                                    dur="0.4s"
                                    values="24;0"
                                />
                            </path>
                        </g>
                    </svg>
                    <div className="tracking-tighter whitespace-nowrap flex-1">
                        Home
                    </div>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
