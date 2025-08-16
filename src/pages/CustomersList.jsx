import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "../services/customerController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { FiEye } from "react-icons/fi";
import { toast } from "sonner";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  const columns = [
    {
      key: "sno",
      label: "S.No.",
      render: (row, index) => (
        <div className="text-sm font-medium text-gray-500">
          {(pagination.currentPage - 1) * pagination.perPage + index + 1}
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
          <div className="text-sm text-gray-500">{row.phone || "N/A"}</div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <div>
          <div className="text-sm text-gray-900">{row.address || "N/A"}</div>
          <div className="text-sm text-gray-500">
            {[row.city, row.state, row.country].filter(Boolean).join(", ") ||
              "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(row.created_at).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(row.created_at).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
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
              handleViewCustomer(row);
            }}
            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getCustomers(token, page);

      if (data.status && data.data) {
        setCustomers(data.data.data);
        setPagination({
          currentPage: data.data.current_page,
          lastPage: data.data.last_page,
          perPage: data.data.per_page,
          total: data.data.total,
        });
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch customers list");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [token]);

  const handleViewCustomer = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchCustomers(newPage);
    }
  };

  const handleRowClick = (row) => {
    if (row && row.id) {
      navigate(`/customers/${row.id}`);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.lastPage,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            i === pagination.currentPage
              ? "bg-blue-600 text-white"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing{" "}
            <span className="font-medium">
              {(pagination.currentPage - 1) * pagination.perPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                pagination.currentPage * pagination.perPage,
                pagination.total
              )}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-colors"
          >
            Previous
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 py-2 text-sm text-gray-500">...</span>
              )}
            </>
          )}
          {pages}
          {endPage < pagination.lastPage && (
            <>
              {endPage < pagination.lastPage - 1 && (
                <span className="px-2 py-2 text-sm text-gray-500">...</span>
              )}
              <button
                onClick={() => handlePageChange(pagination.lastPage)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {pagination.lastPage}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <div>
          <DataTable
            title="Customer Management"
            subtitle="Customers List"
            columns={columns}
            data={customers}
            loading={loading}
            error={error}
            onRowClick={handleRowClick}
          />
          {!error && customers.length > 0 && renderPagination()}
        </div>
      )}
    </div>
  );
};

export default CustomersList;
