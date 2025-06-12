import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = "medium", fullScreen = false }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  const containerClasses = fullScreen
    ? "w-full p-4 bg-gray-50 min-h-[80vh] flex items-center justify-center"
    : "w-full flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* Outer ring with gradient */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 opacity-50"></div>

        {/* Animated gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-emerald-500 animate-spin"></div>

        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Center dot */}
        <div className="absolute inset-[30%] rounded-full bg-white shadow-lg"></div>
      </motion.div>
    </div>
  );
};

export default Loader;
