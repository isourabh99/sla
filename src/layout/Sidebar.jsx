import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUserPlus,
  FaSignOutAlt,
  FaUsers,
  FaUser,
  FaChevronDown,
  FaTag,
  FaPlus,
  FaList,
  FaGraduationCap,
  FaBook,
  FaTags,
  FaDesktop,
  FaCog,
  FaFileInvoiceDollar,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RiMenu2Fill, RiCloseFill } from "react-icons/ri";
import logo from "../assets/sla-logo.png";

const menuItems = [
  { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
  { icon: <FaUser />, label: "Suppliers", path: "/suppliers" },
  { icon: <FaCog />, label: "Spare Parts", path: "/spare-parts" },
  { icon: <FaUser />, label: "Partners", path: "/partners" },
  { icon: <FaGraduationCap />, label: "Engineers", path: "/engineers" },
  { icon: <FaFileInvoiceDollar />, label: "Quotations", path: "/quotations" },
  {
    icon: <FaQuestionCircle />,
    label: "Contact Queries",
    path: "/contact-queries",
  },
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

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);

  const sidebarVariants = {
    open: {
      width: "260px",
    },
    closed: {
      width: "60px",
    },
  };

  return (
    <motion.div
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#387DB2] to-[#3D356E] text-white  z-50 flex flex-col `}
      style={{ overflow: "hidden" }}
    >
      {/* Logo and Menu Icon */}
      {isOpen ? (
        <div className="flex items-center justify-between py-1  border-b border-white/10">
          <img src={logo} alt="logo" className="w-30 brightness-0 invert" />
          <button onClick={toggleSidebar} className="  mx-2">
            <RiCloseFill size={26} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4  border-b border-white/10">
          <button onClick={toggleSidebar}>
            <RiMenu2Fill size={25} />
          </button>
        </div>
      )}
      <div className="flex flex-col h-full">
        {/* Navigation Menu */}
        <nav className="flex-1 p-3 overflow-y-auto ">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded-lg 
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
              </li>
            ))}
            {/* Staff Management Dropdown */}
            <li>
              <div className="space-y-1">
                <button
                  onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
                  className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg 
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
                    <motion.div animate={{ rotate: isStaffMenuOpen ? 180 : 0 }}>
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
                      className="overflow-hidden"
                    >
                      <ul className="space-y-0.5">
                        {staffMenuItems.map((item, index) => (
                          <li key={index} className="relative">
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
                              className={`flex items-center gap-2 p-1.5 pl-6 rounded-lg 
                                ${
                                  location.pathname === item.path
                                    ? "text-white"
                                    : "text-[#d2d5dc] hover:text-white"
                                }
                              `}
                            >
                              <span className="text-lg">{item.icon}</span>
                              {isOpen && (
                                <span className="font-medium">
                                  {item.label}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
            {/* Brands Management Dropdown */}
            <li>
              <div className="space-y-1">
                <button
                  onClick={() => setIsBrandsMenuOpen(!isBrandsMenuOpen)}
                  className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg 
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
                      className="overflow-hidden"
                    >
                      <ul className="space-y-0.5">
                        {brandsMenuItems.map((item, index) => (
                          <li key={index} className="relative">
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
                              className={`flex items-center gap-2 p-1.5 pl-6 rounded-lg 
                                ${
                                  location.pathname === item.path
                                    ? "text-white"
                                    : "text-[#d2d5dc] hover:text-white"
                                }
                              `}
                            >
                              <span className="text-lg">{item.icon}</span>
                              {isOpen && (
                                <span className="font-medium">
                                  {item.label}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
            {/* Business Settings */}
            <div className="">
              <li>
                <Link
                  to="/business-settings"
                  className={`flex items-center gap-2 p-2 rounded-lg 
                    ${
                      location.pathname === "/business-settings"
                        ? "text-white"
                        : "text-[#d2d5dc] hover:text-white"
                    }
                  `}
                >
                  <span className="text-xl">
                    <FaCog />
                  </span>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium"
                      >
                        Business Settings
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            </div>
          </ul>
        </nav>
        {/* Bottom Section */}
        <div className="p-2 border-t border-white/10">
          <div className="space-y-1">
            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 p-2 rounded-lg text-[#d2d5dc] hover:text-white "
            >
              <FaSignOutAlt className="text-xl" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
