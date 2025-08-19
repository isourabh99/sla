import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  getPendingPartners,
  getPartners,
  updatePartnerStatus,
} from "../services/partnersController";

import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { FiEye } from "react-icons/fi";
import { toast } from "sonner";

const PartnersList = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [partners, setPartners] = useState([]);
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 2000);

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
      key: "description",
      label: "Description",
      render: (row) => (
        <div>
          <div className="text-sm text-gray-900 text-ellipsis overflow-hidden  max-w-[100px]">
            {row.description || "N/A  "}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
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
              navigate(`/partners/${row.id}`);
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
          {activeTab === "approved" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(row.id, "pending");
              }}
              className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors duration-200 text-sm"
            >
              Set to Pending
            </button>
          )}
        </div>
      ),
    },
  ];

  const fetchPartners = async (page = 1) => {
    try {
      setLoading(true);
      const data =
        activeTab === "pending"
          ? await getPendingPartners(token, page, debouncedSearchTerm)
          : await getPartners(token, page, undefined, debouncedSearchTerm);

      if (data.status && data.data) {
        setPartners(data.data.data);
        setPagination({
          currentPage: data.data.current_page,
          lastPage: data.data.last_page,
          perPage: data.data.per_page,
          total: data.data.total,
        });
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch partners list");
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners(1);
  }, [token, activeTab]);

  // Refetch on debounced search changes
  useEffect(() => {
    fetchPartners(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleStatusUpdate = async (partnerId, status) => {
    try {
      await updatePartnerStatus(token, partnerId, status);
      toast.success("Partner status updated successfully");
      fetchPartners(pagination.currentPage); // Refresh current page
    } catch (err) {
      toast.error(err.message || "Failed to update partner status");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchPartners(newPage);
    }
  };

  const handleRowClick = (row) => {
    if (row && row.id) {
      navigate(`/partners/${row.id}`);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    setSearchParams(newSearchParams);
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
            pagination.currentPage === i
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to{" "}
          {Math.min(
            pagination.currentPage * pagination.perPage,
            pagination.total
          )}{" "}
          of {pagination.total} entries
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
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}
          {pages}
          {endPage < pagination.lastPage && (
            <>
              {endPage < pagination.lastPage - 1 && (
                <span className="px-2 text-gray-500">...</span>
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
      <div className="flex space-x-6 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab("approved")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "approved"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Approved Partners
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Pending Partners
        </button>
      </div>

      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <div>
          <DataTable
            title="Partners Management"
            subtitle={`${
              activeTab === "pending" ? "Pending" : "Approved"
            } Partners List`}
            columns={columns}
            data={partners}
            loading={loading}
            error={error}
            onRowClick={handleRowClick}
            searchable={true}
            searchPlaceholder={`Search ${activeTab} partners...`}
            externalSearchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
          {!error && partners.length > 0 && renderPagination()}
        </div>
      )}
    </div>
  );
};

export default PartnersList;
