import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationsController";
import { getSparePartById } from "../services/sparepartsController";
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
  FiEye,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { span } from "framer-motion/client";

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

const getNotificationId = (n) => String(n.notification_id || n.id);

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
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("all"); // all, quotation_created, spare_part_added
  const [showSparePartModal, setShowSparePartModal] = useState(false);
  const [sparePartData, setSparePartData] = useState(null);
  const [loadingSparePart, setLoadingSparePart] = useState(false);

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

      // Track new notifications without showing toast
      const newToShow = notifications.filter(
        (n) =>
          !n.is_read &&
          !shownNotificationIdsRef.current.includes(n.notification_id || n.id)
      );
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
    setMarkingReadId(String(notificationId));
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

  const handleViewSparePart = async (sparePartId) => {
    try {
      setLoadingSparePart(true);
      const data = await getSparePartById(token, sparePartId);
      setSparePartData(data);
      setShowSparePartModal(true);
    } catch (err) {
      toast.error("Failed to fetch spare part details");
      console.error("Failed to fetch spare part details:", err);
    } finally {
      setLoadingSparePart(false);
    }
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
    .filter((notification) => {
      if (typeFilter === "all") return true;
      return notification.type === typeFilter;
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
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    style={{ minWidth: 160 }}
                  >
                    <option value="all">All types</option>
                    <option value="quotation_created">Quotation Created</option>
                    <option value="spare_part_added">Spare Part Added</option>
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
                  {filteredNotifications.map((notification, index) => {
                    // Parse description for quotation_id, spare_part_id and from_user
                    let descObj = {};
                    try {
                      descObj =
                        typeof notification.description === "string"
                          ? JSON.parse(notification.description)
                          : notification.description || {};
                    } catch (e) {
                      descObj = {};
                    }
                    const fromUser = notification.from_user || {};
                    const quotationId = descObj.quotation_id;
                    const sparePartId = descObj.spare_part_id;
                    return (
                      <div
                        key={
                          notification.notification_id ||
                          notification.id ||
                          `notification-${index}`
                        }
                        className={`rounded-lg p-3 transition-all duration-200 hover:shadow-md ${
                          !notification.is_read ? "ring-2 ring-blue-200" : ""
                        } ${getNotificationColor(notification.type, index)}`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                  {(() => {
                                    let desc = notification.description;
                                    if (typeof desc === "string") {
                                      try {
                                        const parsed = JSON.parse(desc);
                                        if (parsed && parsed.message)
                                          return parsed.message;
                                      } catch (e) {
                                        // Not JSON, fallback
                                      }
                                    } else if (desc && desc.message) {
                                      return desc.message;
                                    }
                                    return desc || "Notification";
                                  })()}
                                </h3>
                              </div>
                              {/* Profile Picture on top right */}
                              {fromUser && (
                                <div className="flex-shrink-0 ml-2 relative">
                                  {fromUser.profile_picture ? (
                                    <div className="relative">
                                      <img
                                        src={`https://slabackend.carnate.in/public/${fromUser.profile_picture}`}
                                        alt="Profile"
                                        className="w-6 h-6 rounded-full object-cover border border-gray-500"
                                      />
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                                        {fromUser.name?.[0] || "?"}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* User Info with Quote Icon */}
                            {fromUser && (
                              <div className="flex items-center space-x-2 mb-2 ">
                                {/* <div className="min-w-0 flex-1">
                                  <div className="font-medium text-gray-800 text-xs truncate">
                                    {fromUser.name} {fromUser.last_name}
                                  </div>
                                  <div className="text-gray-500 text-xs truncate">
                                    {fromUser.email}
                                  </div>
                                </div> */}
                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2">
                                  {/* Quote Icon and ID */}
                                  {quotationId && (
                                    <span
                                      className="flex items-center space-x-1 text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors duration-150"
                                      onClick={() =>
                                        navigate(`/quotations/${quotationId}`)
                                      }
                                      title="View Quote"
                                    >
                                      View Quote {quotationId}
                                    </span>
                                  )}
                                  {/* Spare Part Icon and ID */}
                                  {sparePartId &&
                                    notification.type ===
                                      "spare_part_added" && (
                                      <span
                                        className="flex items-center space-x-1 text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded cursor-pointer hover:bg-green-200 transition-colors duration-150"
                                        onClick={() =>
                                          navigate(`/spare-parts`)
                                        }
                                        title="View Spare Part"
                                      >
                                        View Spare Part {sparePartId}
                                      </span>
                                    )}
                                  {/* Mark as Read Button */}
                                  {!notification.is_read && (
                                    <button
                                      onClick={() =>
                                        handleMarkAsRead(
                                          getNotificationId(notification)
                                        )
                                      }
                                      className={`px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-all duration-200 flex items-center space-x-1.5 ${
                                        markingReadId ===
                                        getNotificationId(notification)
                                          ? "opacity-60 cursor-not-allowed"
                                          : "hover:shadow-sm"
                                      }`}
                                      title="Mark as read"
                                      disabled={
                                        markingReadId ===
                                        getNotificationId(notification)
                                      }
                                    >
                                      {markingReadId ===
                                      getNotificationId(notification) ? (
                                        <span className="text-xs text-gray-500">
                                          Marking as read...
                                        </span>
                                      ) : (
                                        <>
                                          <FiCheck className="w-3.5 h-3.5" />
                                          <span>Mark as read</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {notification.created_at && (
                          <div className="text-xs text-gray-500 text-right">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
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

          {/* Spare Part Modal */}
          <AnimatePresence>
            {showSparePartModal && (
              <React.Fragment>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSparePartModal(false)}
                  className="fixed inset-0 bg-black/50 z-60"
                />

                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-70 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Spare Part Details
                      </h3>
                      <button
                        onClick={() => setShowSparePartModal(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {loadingSparePart ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader size="medium" />
                        </div>
                      ) : sparePartData ? (
                        <div className="space-y-4">
                          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            {JSON.stringify(sparePartData, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">
                            No spare part data available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            )}
          </AnimatePresence>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default Notifications;
