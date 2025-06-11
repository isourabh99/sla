import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaUsers,
  FaUserCog,
  FaHandshake,
  FaTruck,
  FaChartLine,
} from "react-icons/fa";

// Custom Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1" style={{ color }}>
          {value}
        </p>
      </div>
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ text, time }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-gray-700">{text}</span>
    <span className="text-sm text-gray-500">{time}</span>
  </div>
);

// Action Button Component
const ActionButton = ({ text, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-lg transition-colors w-full text-left font-medium`}
    style={{
      backgroundColor: `${color}15`,
      color: color,
    }}
  >
    {text}
  </button>
);

const Dashboard = () => {
  return (
    <div className="p-4 bg-gray-100 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">Dashboard</h1>
      </div>

      {/* Orders and Quotations */}
      <h2 className="text-xl font-semibold mb-6 text-gray-500">
       Orders and Quotations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Orders"
          value="156"
          icon={FaShoppingCart}
          color="#1890ff"
        />
        <StatCard
          title="Total Quotations"
          value="89"
          icon={FaFileInvoiceDollar}
          color="#722ed1"
        />
        <StatCard
          title="Total Profit"
          value="$45,280"
          icon={FaChartLine}
          color="#3f8600"
        />
      </div>

      {/* User Statistics */}
      <h2 className="text-xl font-semibold mb-6 text-gray-500">
        User Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Customers"
          value="2,450"
          icon={FaUsers}
          color="#cf1322"
        />
        <StatCard
          title="Total Engineers"
          value="45"
          icon={FaUserCog}
          color="#08979c"
        />
        <StatCard
          title="Total Partners"
          value="28"
          icon={FaHandshake}
          color="#d4380d"
        />
        <StatCard
          title="Total Suppliers"
          value="67"
          icon={FaTruck}
          color="#531dab"
        />
      </div>

      {/* Additional Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Recent Activity
          </h2>
          <div className="space-y-1">
            <ActivityItem
              text="New customer registration"
              time="2 minutes ago"
            />
            <ActivityItem text="Order #12345 completed" time="1 hour ago" />
            <ActivityItem text="New quotation created" time="3 hours ago" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <ActionButton
              text="Create New Order"
              color="#1890ff"
              onClick={() => console.log("Create order clicked")}
            />
            <ActionButton
              text="Create Quotation"
              color="#722ed1"
              onClick={() => console.log("Create quotation clicked")}
            />
            <ActionButton
              text="Add New User"
              color="#3f8600"
              onClick={() => console.log("Add user clicked")}
            />
            <ActionButton
              text="View Reports"
              color="#cf1322"
              onClick={() => console.log("View reports clicked")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
