import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingEngineers,
  getApprovedEngineers,
  updateEngineerStatus,
  importEngineersExcel,
} from "../services/engineersController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { FiEye, FiUpload, FiDownload } from "react-icons/fi";
import { toast } from "sonner";

const EngineersList = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef(null);
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
          currentPage: data.data.current_page,
          lastPage: data.data.last_page,
          perPage: data.data.per_page,
          total: data.data.total,
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

  // Debug useEffect
  useEffect(() => {
    console.log("EngineersList component mounted");
    console.log("File input ref:", fileInputRef.current);
    console.log("Token available:", !!token);
  }, []);

  const handleStatusUpdate = async (engineerId, status) => {
    try {
      await updateEngineerStatus(token, engineerId, status);
      toast.success("Engineer status updated successfully");
      fetchEngineers(pagination.currentPage); // Refresh current page
    } catch (err) {
      toast.error(err.message || "Failed to update engineer status");
    }
  };

  const handleImportEngineers = async (event) => {
    const file = event.target.files[0];
    console.log("File selected:", file);

    if (!file) {
      console.log("No file selected");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    console.log("File type:", file.type);
    console.log("File size:", file.size);
    console.log("File name:", file.name);
    console.log("Allowed types:", allowedTypes);

    // Check both MIME type and file extension
    const fileExtension = file.name.toLowerCase().split(".").pop();
    const isValidMimeType = allowedTypes.includes(file.type);
    const isValidExtension = ["xlsx", "xls", "csv"].includes(fileExtension);

    console.log("File extension:", fileExtension);
    console.log("Is valid MIME type:", isValidMimeType);
    console.log("Is valid extension:", isValidExtension);

    if (!isValidMimeType && !isValidExtension) {
      console.log("Invalid file type");
      toast.error(
        "Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file"
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large");
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setImporting(true);
      console.log("Creating FormData...");
      const formData = new FormData();
      formData.append("excel_file", file);

      console.log("FormData created, calling API...");
      console.log("Token available:", !!token);

      const result = await importEngineersExcel(token, formData);
      console.log("API response:", result);

      toast.success("Engineers imported successfully");
      fetchEngineers(1); // Refresh the list
    } catch (err) {
      console.error("Import error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(err.message || "Failed to import engineers");
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportButtonClick = () => {
    console.log("Import button clicked");
    console.log("File input ref:", fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is null");
    }
  };

  const handleDownloadSample = () => {
    try {
      // Create a link element
      const link = document.createElement("a");
      link.href = "/src/assets/sample.xlsx";
      link.download = "sample.xlsx";
      link.style.display = "none";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Sample file downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download sample file");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchEngineers(newPage);
    }
  };

  const handleRowClick = (row) => {
    if (row && row.id) {
      navigate(`/engineers/${row.id}`);
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

      {/* Import Section */}
      {activeTab === "approved" && (
        <div className="flex justify-between items-center py-4 px-6 bg-gray-50 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Approved Engineers
            </h3>
            <p className="text-sm text-gray-500">
              Manage and import engineer data
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportEngineers}
              className="hidden"
              disabled={importing}
            />
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              <FiDownload className="w-3.5 h-3.5 mr-1.5" />
              Sample
            </button>
            <button
              onClick={handleImportButtonClick}
              disabled={importing}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-transparent text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5"></div>
                  Importing...
                </>
              ) : (
                <>
                  <FiUpload className="w-3.5 h-3.5 mr-1.5" />
                  Import
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={engineers}
            loading={loading}
            error={error}
            onRowClick={handleRowClick}
          />
          {!error && engineers.length > 0 && renderPagination()}
        </div>
      )}
    </div>
  );
};

export default EngineersList;
