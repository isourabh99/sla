import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBell, FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { getAdminProfile } from "../services/adminController";
import logo from "../assets/sla-logo.png";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { token, logout, isAdmin } = useAuth();
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token && isAdmin()) {
          const response = await getAdminProfile(token);
          if (response) {
            setProfileData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token, isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-[#387DB2] to-[#3D356E] p-2 text-white">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center gap-24">
          <div className="flex flex-col">
            <motion.div className="flex items-center justify-center">
              <img src={logo} alt="logo" className="w-32 brightness-0 invert" />
            </motion.div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/10 "
          >
            {isSidebarOpen ? (
              <IoCloseOutline size={20} />
            ) : (
              <RiMenu2Fill size={20} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-lg p-2 rounded-full cursor-pointer hover:bg-white/10 "
          >
            <FaBell />
          </motion.div>
          <div className="relative" ref={profileRef}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-lg p-2 rounded-full cursor-pointer hover:bg-white/10 "
            >
              {profileData?.profile_picture ? (
                <img
                  src={profileData.profile_picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUser />
              )}
            </motion.div>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-3 z-50 border border-gray-100"
                >
                  <div className="px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      {profileData?.profile_picture ? (
                        <img
                          src={profileData.profile_picture}
                          alt="Profile"
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-[#387DB2]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#387DB2] to-[#3D356E] flex items-center justify-center">
                          <FaUser className="text-white" size={28} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {profileData?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {profileData?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="w-full px-5 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <FaUserCircle className="text-[#387DB2] text-lg" />
                      <span className="font-medium">View Profile</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full px-5 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
