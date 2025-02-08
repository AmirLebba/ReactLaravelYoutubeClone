import React, { useState, useRef } from "react";

const SearchButton = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Function to handle opening search and focusing input
    const openSearch = () => {
        setSearchOpen(true);
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    };

    return (
        <>
            {/* Search Button */}
            <div className=" lg:block max-w-sm xl:max-w-xl w-full absolute left-1/2 -translate-x-1/2">
                <button
                    type="button"
                    className="hidden sm:flex items-center w-full text-left space-x-5 px-6 py-3.5 bg-gray-100 hover:bg-gray-200/50 rounded-full text-gray-400 dark:bg-gray-800/70 dark:hover:bg-gray-900 transition-all duration-300 text-sm dark:text-gray-300/40"
                    onClick={openSearch}
                    aria-controls="search-modal"
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
                            strokeWidth="1.5"
                        >
                            <path d="M19.803 14.803A7.5 7.5 0 1 1 9.197 4.197a7.5 7.5 0 0 1 10.606 10.606" />
                            <path d="M17.328 12.328a4 4 0 1 1-5.656-5.656a4 4 0 0 1 5.656 5.656M11 15.97c-2.732.774-3.515 3.516-5.414 5.415a2.1 2.1 0 1 1-2.97-2.971c1.898-1.899 4.64-2.682 5.413-5.414" />
                        </g>
                    </svg>
                    <span className="flex-auto">Search ..</span>
                    <span className="font-sans text-xs whitespace-nowrap opacity-70 block rtl:hidden">
                        Ctrl + Q
                    </span>
                </button>
            </div>

            {/* Search Modal */}
            {searchOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-950/30 backdrop-blur-sm z-50 transition-opacity"
                        onClick={() => setSearchOpen(false)}
                    ></div>

                    {/* Modal */}
                    <div
                        id="search-modal"
                        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
                    >
                        <div className="bg-white overflow-auto max-w-3xl w-full max-h-full rounded-xl px-2 py-1">
                            <div className="relative">
                                <label
                                    htmlFor="modal-search"
                                    className="sr-only"
                                >
                                    Search
                                </label>
                                <input
                                    id="modal-search"
                                    ref={searchInputRef}
                                    className="w-full border-0 focus:ring-transparent bg-transparent placeholder-gray-400/50 text-sm appearance-none py-3 pl-14 pr-4"
                                    type="search"
                                    placeholder="Search .."
                                />
                                <button
                                    className="absolute inset-0 right-auto group"
                                    type="submit"
                                    aria-label="Search"
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
                                            strokeWidth="1.5"
                                        >
                                            <path d="M19.803 14.803A7.5 7.5 0 1 1 9.197 4.197a7.5 7.5 0 0 1 10.606 10.606" />
                                            <path d="M17.328 12.328a4 4 0 1 1-5.656-5.656a4 4 0 0 1 5.656 5.656M11 15.97c-2.732.774-3.515 3.516-5.414 5.415a2.1 2.1 0 1 1-2.97-2.971c1.898-1.899 4.64-2.682 5.413-5.414" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default SearchButton;
