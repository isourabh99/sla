import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiX } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import {
  getModels,
  updateModel,
  getBrandsForModel,
  deleteModel,
} from "../services/modelController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { toast } from "sonner";

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    brand_id: "",
    model_id: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
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
      key: "brand",
      label: "Brand",
      render: (row) => (
        <div className="font-medium text-gray-900">
          {row.brand?.name || "-"}
        </div>
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
        <div className="text-sm text-gray-900">
          ₹{parseInt(row.price).toLocaleString()}
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

  const fetchModels = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getModels(token, page);
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
    fetchBrands();
  }, [token]);

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

  const handleEditClick = (model) => {
    setSelectedModel(model);
    setEditFormData({
      name: model.name,
      price: model.price,
      brand_id: model.brand_id,
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
    <>
      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <div>
          <DataTable
            title="Model Management"
            subtitle="Model List"
            columns={columns}
            data={models}
            loading={loading}
            error={error}
            // onRowClick={handleRowClick}
          />
          {!error && models.length > 0 && renderPagination()}
        </div>
      )}

      {/* Edit Modal */}
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
                <FiX className="w-4 h-4" />
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
                  value={editFormData.name}
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
                  value={editFormData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  name="brand_id"
                  value={editFormData.brand_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
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
    </>
  );
};

export default ModelList;
