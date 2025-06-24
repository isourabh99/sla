import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBell, FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { getAdminProfile } from "../services/adminController";
import { getNotifications } from "../services/notificationsController";
import logo from "../assets/sla-logo.png";
import { toast } from "sonner";
import notifee from "../assets/notifee.mp3";

const Header = ({ isSidebarOpen, toggleSidebar, toggleNotifications }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { token, logout, isAdmin } = useAuth();
  const profileRef = useRef(null);
  const prevUnreadRef = useRef(unreadNotifications);
  const audioRef = useRef(null);
  const lastPlayedNotificationId = useRef(null);

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
    const fetchNotifications = async () => {
      try {
        if (token && isAdmin()) {
          const data = await getNotifications(token);
          const notificationsArr = Array.isArray(data.data.notifications)
            ? data.data.notifications
            : Array.isArray(data.data)
            ? data.data
            : [];
          setNotifications(notificationsArr);
          const unreadCount = notificationsArr.filter(
            (notification) => !notification.is_read
          ).length;
          setUnreadNotifications(unreadCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
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

  useEffect(() => {
    // Find latest unread notification
    const latestUnread = notifications
      ? notifications
          .filter((n) => !n.is_read)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      : null;

    if (latestUnread && lastPlayedNotificationId.current !== latestUnread.id) {
      toast("You have a new notification!");
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      lastPlayedNotificationId.current = latestUnread.id;
    }
  }, [notifications]);

  return (
    <header className="bg-gradient-to-r from-[#387DB2] to-[#3D356E]  text-white p-2">
      <audio ref={audioRef} src={notifee} preload="auto" />
      <div className="flex justify-between items-center">
        <div />
        <div className="flex items-center gap-4">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={toggleNotifications}
            className="relative text-lg p-2 rounded cursor-pointer hover:bg-white/10 "
          >
            <FaBell />
            {unreadNotifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </div>
            )}
          </motion.div>
          <div className="relative" ref={profileRef}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-lg p-1 rounded cursor-pointer hover:bg-white/10 "
            >
              {profileData?.profile_picture ? (
                <img
                  src={profileData.profile_picture}
                  alt="Profile"
                  className="w-8 h-8 rounded object-cover"
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
                      onClick={toggleNotifications}
                      className="w-full px-5 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <FaBell className="text-[#387DB2] text-lg" />
                      <span className="font-medium">Notifications</span>
                      {unreadNotifications > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {unreadNotifications > 99
                            ? "99+"
                            : unreadNotifications}
                        </span>
                      )}
                    </button>
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
