import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Notifications from "../pages/Notifications";
import { useState } from "react";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <div className="relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleNotifications={toggleNotifications}
        />
      </div>
      {/* Left Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Right Notifications Sidebar */}
      <div className="fixed top-0 right-0 z-50">
        <Notifications
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
      {/* Main Content (scrollable) */}
      <div
        className={`overflow-y-auto bg-gray-50 mt-8 relative z-10 ${
          isSidebarOpen ? "md:ml-[230px]" : "ml-[30px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
