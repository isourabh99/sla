import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const ErrorDisplay = ({
  title = "Oops! Something went wrong",
  message = "We couldn't load your data. Please try again.",
  onRetry,
  icon: Icon = FaExclamationTriangle,
  iconColor = "text-red-500",
  iconBgColor = "bg-red-100",
  buttonColor = "from-red-400 to-red-500",
  buttonHoverColor = "from-red-500 to-red-600",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className={`p-4 ${iconBgColor} rounded-full relative`}>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Icon className={`w-10 h-10 ${iconColor}`} />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          {message}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className={`w-full px-6 py-3 bg-gradient-to-r ${buttonColor} text-white rounded-xl 
            hover:${buttonHoverColor} transition-all duration-300 shadow-md hover:shadow-lg
            font-medium text-sm tracking-wide`}
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ErrorDisplay;
