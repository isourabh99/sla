import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiEdit2, FiX, FiUploadCloud, FiDownload } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import {
  getModels,
  updateModel,
  getBrandsForModel,
  deleteModel,
  importModels,
  getPendingModels,
  updateModelStatus,
} from "../services/modelController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { toast } from "sonner";

const ModelList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [models, setModels] = useState([]);
  const [pendingModels, setPendingModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingError, setPendingError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 2000);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    model_id: "",
  });
  const [statusUpdateFormData, setStatusUpdateFormData] = useState({
    model_id: "",
    status: 1,
    price: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  });
  const [pendingPagination, setPendingPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  });
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("approved");

  const getApprovedColumns = () => [
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
      key: "name",
      label: "Model Name",
      render: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <div className="text-sm font-bold text-emerald-600">
          $ {parseInt(row.price).toLocaleString()}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
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
        <div className="flex items-center space-x-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
            title="Edit Model"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
            title="Delete Model"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const getPendingColumns = () => [
    {
      key: "sno",
      label: "S.No.",
      render: (row, index) => (
        <div className="text-sm font-medium text-gray-500">
          {(pendingPagination.currentPage - 1) * pendingPagination.perPage +
            index +
            1}
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
      key: "name",
      label: "Model Name",
      render: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <div className="text-sm font-bold text-emerald-600">
          $ {parseInt(row.price).toLocaleString()}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
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
        <div className="flex items-center space-x-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdateClick(row);
            }}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-transparent text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-all duration-200 shadow-sm"
            title="Approve Model"
          >
            Approve
          </button>
        </div>
      ),
    },
  ];

  const fetchModels = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getModels(token, page, debouncedSearchTerm);
      setModels(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      });
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch models list");
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingModels = async (page = 1) => {
    try {
      setPendingLoading(true);
      const response = await getPendingModels(token, page, debouncedSearchTerm);
      setPendingModels(response.data.data);
      setPendingPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      });
      setPendingError(null);
    } catch (err) {
      setPendingError(err.message || "Failed to fetch pending models list");
      setPendingModels([]);
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrandsForModel(token);
      setBrands(response.data);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    }
  };

  useEffect(() => {
    fetchModels();
    fetchPendingModels();
    fetchBrands();
  }, [token]);

  // Debounce handled by useDebounce

  // Handle debounced search changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchParams.get("search")) {
      // Reset to page 1 when search changes
      fetchModels(1);
      fetchPendingModels(1);
    }
  }, [debouncedSearchTerm]);

  //   const handleRowClick = (row) => {
  //     if (row && row.id) {
  //       navigate(`/models/${row.id}`);
  //     }
  //   };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchModels(newPage);
    }
  };

  const handlePendingPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pendingPagination.lastPage) {
      fetchPendingModels(newPage);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "pending" && pendingModels.length === 0) {
      fetchPendingModels();
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    setSearchParams(newSearchParams);
  };

  const handleEditClick = (model) => {
    setSelectedModel(model);
    setEditFormData({
      name: model.name,
      price: model.price,
      model_id: model.id,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateModel(editFormData, token);
      setIsEditModalOpen(false);
      fetchModels(pagination.currentPage); // Refresh the current page
      toast.success("Model updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update model");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setStatusUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusUpdateClick = (model) => {
    setSelectedModel(model);
    setStatusUpdateFormData({
      model_id: model.id,
      status: 1,
      price: model.price,
    });
    setIsStatusUpdateModalOpen(true);
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateModelStatus(statusUpdateFormData, token);
      setIsStatusUpdateModalOpen(false);
      toast.success("Model status updated successfully");
      // Refresh both approved and pending models
      fetchModels(pagination.currentPage);
      fetchPendingModels(pendingPagination.currentPage);
    } catch (err) {
      toast.error(err.message || "Failed to update model status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (model) => {
    if (
      window.confirm(
        `Are you sure you want to delete the model "${model.name}"? This action cannot be undone.`
      )
    ) {
      try {
        setLoading(true);
        await deleteModel(model.id, token);
        toast.success("Model deleted successfully");
        fetchModels(pagination.currentPage);
      } catch (err) {
        toast.error(err.message || "Failed to delete model");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
    setImportFile(null);
  };

  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error("Please select a file to import.");
      return;
    }
    try {
      setImportLoading(true);
      await importModels(importFile, token);
      toast.success("Models imported successfully!");
      setIsImportModalOpen(false);
      fetchModels(pagination.currentPage); // Refresh the current page
    } catch (err) {
      toast.error(err.message || "Failed to import models.");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImportFile(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
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

  const renderPendingPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pendingPagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pendingPagination.lastPage,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePendingPageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            pendingPagination.currentPage === i
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
          Showing{" "}
          {(pendingPagination.currentPage - 1) * pendingPagination.perPage + 1}{" "}
          to{" "}
          {Math.min(
            pendingPagination.currentPage * pendingPagination.perPage,
            pendingPagination.total
          )}{" "}
          of {pendingPagination.total} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              handlePendingPageChange(pendingPagination.currentPage - 1)
            }
            disabled={pendingPagination.currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-colors"
          >
            Previous
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePendingPageChange(1)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}
          {pages}
          {endPage < pendingPagination.lastPage && (
            <>
              {endPage < pendingPagination.lastPage - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() =>
                  handlePendingPageChange(pendingPagination.lastPage)
                }
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {pendingPagination.lastPage}
              </button>
            </>
          )}
          <button
            onClick={() =>
              handlePendingPageChange(pendingPagination.currentPage + 1)
            }
            disabled={
              pendingPagination.currentPage === pendingPagination.lastPage
            }
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
      {/* Tab Bar */}
      <div className="flex space-x-6 border-b border-gray-200 pb-1">
        <button
          onClick={() => handleTabChange("approved")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "approved"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Approved Models
        </button>
        <button
          onClick={() => handleTabChange("pending")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Pending Models
        </button>
      </div>

      {/* Import Section for Approved Models Tab */}
      {activeTab === "approved" && (
        <div className="flex justify-between items-center py-4 px-6 bg-gray-50 border-b border-gray-200 ">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Approved Models
            </h3>
            <p className="text-sm text-gray-500">
              Bulk import models using Excel
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() =>
                window.open("/src/assets/modelssample.xlsx", "_blank")
              }
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              <FiDownload className="w-3.5 h-3.5 mr-1.5" />
              Sample
            </button>
            <button
              onClick={handleImportClick}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-transparent text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <FiUploadCloud className="w-3.5 h-3.5 mr-1.5" /> Import
            </button>
          </div>
        </div>
      )}

      {/* Header Section for Pending Models Tab */}
      {activeTab === "pending" && (
        <div className="flex justify-between items-center py-4 px-6 bg-gray-50 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Pending Models
            </h3>
            <p className="text-sm text-gray-500">Models awaiting approval</p>
          </div>
        </div>
      )}

      {/* Main Content by Tab */}
      {activeTab === "approved" &&
        (loading ? (
          <Loader size="large" fullScreen />
        ) : (
          <div>
            <DataTable
              title="Model Management"
              subtitle={
                debouncedSearchTerm
                  ? `Search results for "${debouncedSearchTerm}"`
                  : "Model List"
              }
              columns={getApprovedColumns()}
              data={models}
              loading={loading}
              error={error}
              searchable={true}
              searchPlaceholder="Search models..."
              externalSearchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
            {!error && models.length > 0 && renderPagination()}
          </div>
        ))}
      {activeTab === "pending" &&
        (pendingLoading ? (
          <Loader size="large" fullScreen />
        ) : (
          <div>
            <DataTable
              title="Pending Models"
              subtitle={
                debouncedSearchTerm
                  ? `Search results for "${debouncedSearchTerm}"`
                  : "Pending Models List"
              }
              columns={getPendingColumns()}
              data={pendingModels}
              loading={pendingLoading}
              error={pendingError}
              searchable={true}
              searchPlaceholder="Search pending models..."
              externalSearchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
            {!pendingError &&
              pendingModels.length > 0 &&
              renderPendingPagination()}
          </div>
        ))}

      {/* Import Modal (only for Approved Models tab) */}
      {isImportModalOpen && activeTab === "approved" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <FiUploadCloud className="w-7 h-7 text-blue-500" /> Import
                Models
              </h2>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4 text-gray-600 text-sm flex flex-col gap-2">
              <p>
                Upload an Excel file (.xlsx or .xls) to import multiple models
                at once.
              </p>
              <button
                type="button"
                onClick={() =>
                  window.open("/src/assets/modelssample.xlsx", "_blank")
                }
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors w-max"
              >
                <FiDownload className="w-4 h-4" /> Download Sample
              </button>
            </div>
            <form onSubmit={handleImportSubmit} className="space-y-6">
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-8 px-4 transition-all cursor-pointer w-full ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById("import-file").click()}
                style={{ minHeight: 140 }}
              >
                <FiUploadCloud className="w-10 h-10 text-blue-400 mb-2" />
                <span className="text-blue-700 font-medium">
                  Drag & Drop file here or click to select
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Excel only (.xlsx, .xls)
                </span>
                <input
                  id="import-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportFileChange}
                  className="hidden"
                  required
                />
                {importFile && (
                  <div className="mt-3 text-green-700 text-sm font-semibold">
                    Selected: {importFile.name}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={importLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  disabled={importLoading}
                >
                  {importLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Importing...
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="w-4 h-4" /> Import
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-xl transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Model
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStatusUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-xl transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Approve Model
              </h2>
              <button
                onClick={() => setIsStatusUpdateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleStatusUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  value={selectedModel?.name || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={statusUpdateFormData.price || ""}
                  onChange={handleStatusUpdateInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsStatusUpdateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Approve Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelList;
