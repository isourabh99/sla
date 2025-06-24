import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationsController";
import Loader from "../components/Loader";
import ErrorDisplay from "../components/ErrorDisplay";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiClock,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Background colors array for different notification styles
const bgColors = [
  "border-l-blue-500 bg-blue-50 hover:bg-blue-100",
  "border-l-green-500 bg-green-50 hover:bg-green-100",
  "border-l-purple-500 bg-purple-50 hover:bg-purple-100",
  "border-l-pink-500 bg-pink-50 hover:bg-pink-100",
  "border-l-indigo-500 bg-indigo-50 hover:bg-indigo-100",
  "border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100",
  "border-l-red-500 bg-red-50 hover:bg-red-100",
  "border-l-teal-500 bg-teal-50 hover:bg-teal-100",
  "border-l-orange-500 bg-orange-50 hover:bg-orange-100",
  "border-l-cyan-500 bg-cyan-50 hover:bg-cyan-100",
];

const Notifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  const shownNotificationIdsRef = useRef([]);
  const [markingReadId, setMarkingReadId] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications(token);
      // Robustly extract notifications array
      let notifications = [];
      if (Array.isArray(data.data.notifications)) {
        notifications = data.data.notifications;
        console.log(notifications);
      } else if (data && Array.isArray(data.data)) {
        notifications = data.data;
      } else if (data && data.data && Array.isArray(data.data.notification)) {
        notifications = data.data.notification;
      }
      setNotifications(notifications);
      setError(null);

      // Show Sonner toast for new unread notifications
      const newToShow = notifications.filter(
        (n) =>
          !n.is_read &&
          !shownNotificationIdsRef.current.includes(n.notification_id || n.id)
      );
      newToShow.forEach((n) => {
        toast(
          n.description ||
            n.message ||
            n.title ||
            "You have a new notification!"
        );
      });
      if (newToShow.length > 0) {
        shownNotificationIdsRef.current = [
          ...shownNotificationIdsRef.current,
          ...newToShow.map((n) => n.notification_id || n.id),
        ];
      }
    } catch (err) {
      setError(err.message || "Failed to fetch notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isOpen, token]);

  const handleMarkAsRead = async (notificationId) => {
    setMarkingReadId(notificationId);
    const markingToastId = toast.loading("Marking as read...");
    try {
      await markNotificationAsRead(notificationId, token);
      await fetchNotifications();
      toast.success("Notification marked as read", { id: markingToastId });
    } catch (err) {
      toast.error("Failed to mark as read", { id: markingToastId });
      console.error("Failed to mark notification as read:", err);
    } finally {
      setMarkingReadId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
      case "warning":
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <FiInfo className="w-5 h-5 text-blue-500" />;
      default:
        // Check if it's a spare part notification
        if (type?.includes("spare") || type?.includes("part")) {
          return <FiCheckCircle className="w-5 h-5 text-green-500" />;
        }
        return <FiBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type, index = 0) => {
    // Use the bgColors array with modulo to cycle through colors
    return bgColors[index % bgColors.length];
  };

  const getColorByIndex = (index) => {
    return bgColors[index % bgColors.length];
  };

  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "unread") return !notification.is_read;
      if (filter === "read") return notification.is_read;
      return true;
    })
    .filter(
      (notification) =>
        notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        notification.spare_part_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key="notifications-sidebar">
          {/* Backdrop */}
          <motion.div
            key="notifications-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          />

          {/* Notifications Sidebar */}
          <motion.div
            key="notifications-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-100 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiBell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-600">{unreadCount} unread</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="space-y-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FiFilter className="text-gray-400 w-4 h-4" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All notifications</option>
                    <option value="unread">Unread only</option>
                    <option value="read">Read only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div
                  key="loading"
                  className="flex items-center justify-center h-full"
                >
                  <Loader size="medium" />
                </div>
              ) : error ? (
                <div key="error" className="p-4">
                  <ErrorDisplay message={error} onRetry={fetchNotifications} />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div key="empty" className="p-8 text-center">
                  <FiBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications found
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {searchTerm || filter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You're all caught up! Check back later for new notifications."}
                  </p>
                </div>
              ) : (
                <div key="notifications-list" className="p-4 space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <div
                      key={
                        notification.notification_id ||
                        notification.id ||
                        `notification-${index}`
                      }
                      className={`rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                        !notification.is_read ? "" : ""
                      } ${getNotificationColor(notification.type, index)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2 text-sm leading-relaxed">
                            {notification.description ||
                              notification.message ||
                              (notification.spare_part_name &&
                                `Spare part "${notification.spare_part_name}" has been added.`) ||
                              notification.title}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <FiClock className="w-3 h-3" />
                              <span>
                                {notification.created_at
                                  ? new Date(
                                      notification.created_at
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {notification.spare_part_id && (
                                <span className="text-blue-600 font-medium">
                                  ID: {notification.spare_part_id}
                                </span>
                              )}
                              {!notification.is_read && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(
                                      notification.notification_id ||
                                        notification.id
                                    )
                                  }
                                  className={`p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200 flex items-center justify-center ${
                                    markingReadId ===
                                    (notification.notification_id ||
                                      notification.id)
                                      ? "opacity-60 cursor-not-allowed"
                                      : ""
                                  }`}
                                  title="Mark as read"
                                  disabled={
                                    markingReadId ===
                                    (notification.notification_id ||
                                      notification.id)
                                  }
                                >
                                  {markingReadId ===
                                  (notification.notification_id ||
                                    notification.id) ? (
                                    <svg
                                      className="animate-spin h-3 w-3 text-green-600"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                      ></path>
                                    </svg>
                                  ) : (
                                    <FiCheck className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {filteredNotifications.length} notification
                    {filteredNotifications.length !== 1 ? "s" : ""} shown
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default Notifications;
