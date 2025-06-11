import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = "medium", fullScreen = false }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  const containerClasses = fullScreen
    ? "p-4 bg-gray-50 min-h-screen flex items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
        <div
          className="absolute inset-0 rounded-full border-r-4 border-emerald-500 animate-spin"
          style={{ animationDelay: "-0.5s" }}
        ></div>
      </motion.div>
    </div>
  );
};

export default Loader;
