import React from "react";

const GuideButton = () => {
  return (
    <div
      id="guide-button"
      toggleable="true"
      className="style-scope ytd-masthead"
      role="button"
      aria-label="Guide"
    >
      <button
        id="button"
        className="style-scope yt-icon-button"
        aria-label="Guide"
        aria-pressed="false"
      >
        <div
          id="guide-icon"
          className="style-scope ytd-masthead"
          role="img"
          aria-hidden="true"
        >
          <div style={{ width: "100%", height: "100%", display: "block", fill: "currentColor" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style={{ pointerEvents: "none", display: "inherit", width: "100%", height: "100%" }}
            >
              <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
            </svg>
          </div>
        </div>
      </button>
      <div
        id="interaction"
        className="circular style-scope yt-icon-button"
      >
        <div className="stroke style-scope yt-interaction"></div>
        <div className="fill style-scope yt-interaction"></div>
      </div>
    </div>
  );
};

export default GuideButton;
