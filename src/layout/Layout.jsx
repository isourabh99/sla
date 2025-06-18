import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-20">
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      {/* Main Content (scrollable) */}
      <div
        className={`overflow-y-auto bg-gray-50 mt-8 relative z-10 ${
          isSidebarOpen ? "ml-[260px]" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
