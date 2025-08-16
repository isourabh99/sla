import React, { useState, useEffect } from "react";
import { getSLA, deleteSLA, updateSLA } from "../services/brandController";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Loader from "../components/Loader";
import DataTable from "../components/DataTable";
import { toast } from "sonner";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSLA, setSelectedSLA] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    percentage: "",
    slatype_id: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBrands = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await getSLA(token, page, pagination.perPage, search);
      setBrands(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch brands. Please try again.");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(pagination.currentPage, debouncedSearchQuery);
    // eslint-disable-next-line
  }, [pagination.currentPage, debouncedSearchQuery]);

  const handleDeleteSLA = async (slatype_id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        setLoading(true);
        await deleteSLA(token, slatype_id);
        toast.success("Brand deleted successfully");
        fetchBrands(pagination.currentPage, debouncedSearchQuery);
      } catch (err) {
        toast.error(err.message || "Failed to delete brand");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (sla) => {
    setSelectedSLA(sla);
    setEditFormData({
      name: sla.name ? String(sla.name) : "",
      percentage:
        sla.percentage !== undefined && sla.percentage !== null
          ? String(sla.percentage)
          : "",
      slatype_id: sla.id,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      // Prepare data as array for updateSLA
      const formArr = [
        { key: "slatype_id", value: editFormData.slatype_id },
        { key: "name", value: editFormData.name },
        { key: "percentage", value: editFormData.percentage },
      ];
      await updateSLA(formArr, token);
      toast.success("SLA Type updated successfully");
      setIsEditModalOpen(false);
      fetchBrands(pagination.currentPage, debouncedSearchQuery);
    } catch (err) {
      toast.error(err.message || "Failed to update SLA Type");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // DataTable columns
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
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      key: "percentage",
      label: "Percentage",
      render: (row) => (
        <div className="text-sm font-bold text-emerald-600">
          {row.percentage}%
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status === 1 ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (row) => (
        <div className="text-sm text-gray-500">
          {new Date(row.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      render: (row) => (
        <div className="text-sm text-gray-500">
          {new Date(row.updated_at).toLocaleDateString()}
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
            title="Edit SLA Type"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSLA(row.id);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
            title="Delete SLA Type"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Pagination UI
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
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 mt-4">
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
    <div className="p-4 bg-gray-50 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          SLA Type Management{" "}
          <span className="text-base">• SLA Types List</span>
        </h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/brands/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium  transition-all duration-300 text-sm"
        >
          <FaPlus className="" />
          Add New SLA Type
        </Link>
        <div className="w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sla types..."
            className="w-full py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <>
          <DataTable
            title="SLA Type Management"
            subtitle="SLA Types List"
            columns={columns}
            data={brands}
            loading={false}
            error={error}
            searchable={false}
          />
          {pagination.lastPage > 1 && renderPagination()}
        </>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-xl transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit SLA Type
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
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={editFormData.percentage || ""}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
