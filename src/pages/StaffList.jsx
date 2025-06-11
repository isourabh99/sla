import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStaffs } from "../services/staffController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const columns = [
    {
      key: "sno",
      label: "S.No.",
      render: (row, index) => (
        <div className="text-sm font-medium text-gray-500">{index + 1}</div>
      ),
    },
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <div className="text-sm font-mono text-gray-500">#{row.id}</div>
      ),
    },
    {
      key: "brand_id",
      label: "Brand ID",
      render: (row) => (
        <div className="text-sm font-mono text-gray-500">
          {row.brand_id ? `#${row.brand_id}` : "-"}
        </div>
      ),
    },
    {
      key: "profile_picture",
      label: "Profile",
      render: (row) => (
        <div className="flex items-center">
          <img
            src={row.profile_picture || "https://via.placeholder.com/40"}
            alt={row.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          {row.last_name && (
            <div className="text-sm text-gray-500">{row.last_name}</div>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      render: (row) => (
        <div>
          <div className="text-sm text-gray-900">{row.email}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <div>
          <div className="text-sm text-gray-900">{row.address}</div>
          <div className="text-sm text-gray-500">
            {[row.city, row.state, row.country].filter(Boolean).join(", ")}
          </div>
        </div>
      ),
    },
    {
      key: "user_type",
      label: "Role",
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {row.user_type}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status || "Pending"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row) => (
        <div className="text-sm text-gray-500">
          {new Date(row.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/staff/${row.id}`);
            }}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await getStaffs(token);
        setStaff(data.data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch staff list");
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [token]);

  const handleRowClick = (row) => {
    if (row && row.id) {
      navigate(`/staff/${row.id}`);
    }
  };

  return (
    <>
      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <DataTable
          title="Staff Management"
          subtitle="Staff List"
          columns={columns}
          data={staff}
          loading={loading}
          error={error}
          onRowClick={handleRowClick}
        />
      )}
    </>
  );
};

export default StaffList;
