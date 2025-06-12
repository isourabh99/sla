import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUserPlus,
  FaSignOutAlt,
  FaUsers,
  FaChevronDown,
  FaTag,
  FaPlus,
  FaList,
  FaGraduationCap,
  FaBook,
  FaTags,
  FaDesktop,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
];

const staffMenuItems = [
  { icon: <FaUserPlus />, label: "Create Staff", path: "/staff/create" },
  { icon: <FaUsers />, label: "Show Staffs", path: "/staff" },
  {
    icon: <FaGraduationCap />,
    label: "Create Expertise",
    path: "/expertise/create",
  },
  { icon: <FaBook />, label: "Show Expertise", path: "/expertise" },
];

const brandsMenuItems = [
  { icon: <FaPlus />, label: "Create Brand", path: "/brands/create" },
  { icon: <FaTags />, label: "Show Brands", path: "/brands" },
  { icon: <FaDesktop />, label: "Create Model", path: "/models/create" },
  { icon: <FaList />, label: "Show Models", path: "/models" },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);

  const sidebarVariants = {
    open: {
      width: "260px",
    },
    closed: {
      width: "0px",
    },
  };

  const menuItemVariants = {
    open: {
      opacity: 1,
      x: 0,
    },
    closed: {
      opacity: 0,
      x: -20,
    },
  };

  return (
    <motion.div
      initial="open"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={`
        bg-gradient-to-b from-[#387DB2] to-[#3D356E] text-white shadow-lg z-30 
        h-screen
        transition-all duration-300
        w-0
        md:w-[250px] md:relative md:z-0
        ${isOpen ? "w-[250px]" : "w-0"}
        ${isOpen ? "block" : "hidden"}
      `}
      style={{ overflow: "hidden" }}
    >
      <div className="flex flex-col h-full">
        {/* Navigation Menu */}
        <nav className="flex-1 p-2 overflow-y-auto mt-16">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <motion.li key={index} variants={menuItemVariants}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200
                    ${
                      location.pathname === item.path
                        ? "text-white"
                        : "text-[#d2d5dc] hover:text-white"
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.li>
            ))}

            {/* Staff Management Dropdown */}
            <motion.li variants={menuItemVariants}>
              <div className="space-y-1">
                <button
                  onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
                  className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg transition-all duration-200
                    ${
                      location.pathname.startsWith("/staff")
                        ? "text-white"
                        : "text-[#d2d5dc] hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      <FaUsers />
                    </span>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-medium"
                        >
                          Staff Management
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {isOpen && (
                    <motion.div
                      animate={{ rotate: isStaffMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown />
                    </motion.div>
                  )}
                </button>

                <AnimatePresence>
                  {isStaffMenuOpen && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-0.5">
                        {staffMenuItems.map((item, index) => (
                          <motion.li key={index} className="relative">
                            <div
                              className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/20`}
                            ></div>
                            <div
                              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                                location.pathname === item.path
                                  ? "bg-white"
                                  : "bg-white/40"
                              }`}
                            ></div>
                            <Link
                              to={item.path}
                              className={`flex items-center gap-2 p-1.5 pl-6 rounded-lg transition-all duration-200
                                ${
                                  location.pathname === item.path
                                    ? "text-white"
                                    : "text-[#d2d5dc] hover:text-white"
                                }
                              `}
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>

            {/* Brands Management Dropdown */}
            <motion.li variants={menuItemVariants}>
              <div className="space-y-1">
                <button
                  onClick={() => setIsBrandsMenuOpen(!isBrandsMenuOpen)}
                  className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg transition-all duration-200
                    ${
                      location.pathname.startsWith("/brands")
                        ? "text-white"
                        : "text-[#d2d5dc] hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      <FaTag />
                    </span>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-medium"
                        >
                          Brands Management
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {isOpen && (
                    <motion.div
                      animate={{ rotate: isBrandsMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown />
                    </motion.div>
                  )}
                </button>

                <AnimatePresence>
                  {isBrandsMenuOpen && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-0.5">
                        {brandsMenuItems.map((item, index) => (
                          <motion.li key={index} className="relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/20"></div>
                            <div
                              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                                location.pathname === item.path
                                  ? "bg-white"
                                  : "bg-white/40"
                              }`}
                            ></div>
                            <Link
                              to={item.path}
                              className={`flex items-center gap-2 p-1.5 pl-6 rounded-lg transition-all duration-200
                                ${
                                  location.pathname === item.path
                                    ? "text-white"
                                    : "text-[#d2d5dc] hover:text-white"
                                }
                              `}
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-2 border-t border-white/10">
          <div className="space-y-1">
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center gap-2 p-2 rounded-lg text-[#d2d5dc] hover:text-white transition-all duration-200"
            >
              <FaSignOutAlt className="text-xl" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
