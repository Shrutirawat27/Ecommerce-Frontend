import React from "react";

const Loader = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "min-h-[200px]"
      }`}
    >
      <div className="relative w-12 h-12">
        <div className="absolute w-12 h-12 border-4 border-gray-300 rounded-full"></div>
        <div className="absolute w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
