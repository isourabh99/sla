import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingEngineers,
  getApprovedEngineers,
  updateEngineerStatus,
} from "../services/engineersController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { FiEye } from "react-icons/fi";
import { toast } from "sonner";

const EngineersList = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    links: [],
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  const columns = [
    {
      key: "sno",
      label: "S.No.",
      render: (row, index) => (
        <div className="text-sm font-medium text-gray-500">
          {(pagination.current_page - 1) * pagination.per_page + index + 1}
        </div>
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
      key: "profile_picture",
      label: "Profile",
      render: (row) => (
        <div className="flex items-center">
          <img
            src={
              row.profile_picture ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(row.name || "User") +
                "&background=random"
            }
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
          <div className="text-sm text-gray-900">{row.address || null}</div>
          <div className="text-sm text-gray-500">
            {[row.city, row.state, row.country].filter(Boolean).join(", ")}
          </div>
        </div>
      ),
    },
  
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
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
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/engineers/${row.id}`);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
          >
            <FiEye className="w-3.5 h-3.5" />
          </button>
          {activeTab === "pending" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(row.id, "approved");
              }}
              className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 text-sm"
            >
              Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  const fetchEngineers = async (page = 1) => {
    try {
      setLoading(true);
      const data =
        activeTab === "pending"
          ? await getPendingEngineers(token, page)
          : await getApprovedEngineers(token, page);

      if (data.status && data.data) {
        setEngineers(data.data.data);
        setPagination({
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
          links: data.data.links,
        });
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch engineers list");
      setEngineers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers(1);
  }, [token, activeTab]);

  const handleStatusUpdate = async (engineerId, status) => {
    try {
      await updateEngineerStatus(token, engineerId, status);
      toast.success("Engineer status updated successfully");
      fetchEngineers(pagination.current_page); // Refresh current page
    } catch (err) {
      toast.error(err.message || "Failed to update engineer status");
    }
  };

  const handlePageChange = (page) => {
    fetchEngineers(page);
  };

  const handleRowClick = (row) => {
    if (row && row.id) {
      navigate(`/engineers/${row.id}`);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.last_page; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            pagination.current_page === i
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between m-4">
        <div className="text-sm text-gray-700">
          Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
          {Math.min(
            pagination.current_page * pagination.per_page,
            pagination.total
          )}{" "}
          of {pagination.total} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex space-x-6 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab("approved")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "approved"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Approved Engineers
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Pending Engineers
        </button>
      </div>

      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <>
          <DataTable
            title="Engineers Management"
            subtitle={`${
              activeTab === "pending" ? "Pending" : "Approved"
            } Engineers List`}
            columns={columns}
            data={engineers}
            loading={loading}
            error={error}
            onRowClick={handleRowClick}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
          {!error && engineers.length > 0 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default EngineersList;
