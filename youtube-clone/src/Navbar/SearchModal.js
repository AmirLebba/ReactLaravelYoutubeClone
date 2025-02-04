import React from "react";

const SearchModal = ({ searchOpen, setSearchOpen }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-gray-950/30 backdrop-blur-sm z-50 transition-opacity"
        style={{ display: searchOpen ? "block" : "none" }}
        onClick={() => setSearchOpen(false)}
      ></div>
      <div
        id="search-modal"
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        style={{ display: searchOpen ? "flex" : "none" }}
      >
        <div className="bg-white overflow-auto max-w-3xl w-full max-h-full rounded-xl px-2 py-1">
          <div className="relative">
            <label htmlFor="modal-search" className="sr-only">Search</label>
            <input
              id="modal-search"
              className="w-full border-0 focus:ring-transparent bg-transparent placeholder-gray-400/50 text-sm appearance-none py-3 pl-14 pr-4"
              type="search"
              placeholder="Search .."
            />
            <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-4 mr-4" viewBox="0 0 24 24">
                <use xlinkHref="/static/sprite/sprite.svg#search" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
