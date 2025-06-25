import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import {
  getExpertise,
  deleteExpertise,
  updateExpertise,
} from "../services/expertiseController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { toast } from "sonner";

const ExpertiseList = () => {
  const [expertise, setExpertise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    expertise_id: "",
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
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    // {
    //   key: "type",
    //   label: "Type",
    //   render: (row) => (
    //     <div className="text-sm text-gray-500">{row.type || "-"}</div>
    //   ),
    // },
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
            title="Edit Expertise"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
            title="Delete Expertise"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const fetchExpertise = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getExpertise(token, page, pagination.perPage);
      console.log("API Response:", response);
      const expertiseData = response.data?.data || response.data || [];
      setExpertise(expertiseData);
      // console.log("Expertise data:", expertiseData);
      setPagination({
        currentPage: response.data?.current_page || response.current_page || 1,
        lastPage: response.data?.last_page || response.last_page || 1,
        total: response.data?.total || response.total || 0,
        perPage: response.data?.per_page || response.per_page || 10,
      });
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch expertise list");
      setExpertise([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertise(1);
  }, [token]);

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= pagination.lastPage &&
      newPage !== pagination.currentPage
    ) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      fetchExpertise(newPage);
    }
  };

  const handleEditClick = (expertise) => {
    setSelectedExpertise(expertise);
    setEditFormData({
      name: expertise.name,
      expertise_id: expertise.id,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Updating expertise with:", {
        id: editFormData.expertise_id,
        data: { name: editFormData.name },
        token,
      });
      const response = await updateExpertise(
        editFormData.expertise_id,
        { name: editFormData.name },
        token
      );
      console.log("Update response:", response);
      setIsEditModalOpen(false);
      fetchExpertise(pagination.currentPage); // Refresh the current page
      toast.success("Expertise updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update expertise");
      setError(err.message || "Failed to update expertise");
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

  const handleDeleteClick = async (expertise) => {
    if (
      window.confirm(
        `Are you sure you want to delete the expertise "${expertise.name}"? This action cannot be undone.`
      )
    ) {
      try {
        setLoading(true);
        await deleteExpertise(expertise.id, token);
        toast.success("Expertise deleted successfully");
        fetchExpertise(pagination.currentPage);
      } catch (err) {
        toast.error(err.message || "Failed to delete expertise");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            pagination.currentPage === i
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
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            title="Expertise Management"
            subtitle="Expertise List"
            columns={columns}
            data={expertise}
            loading={loading}
            error={error}
          />
          {!error && expertise.length === 0 && pagination.total === 0 && (
            <div className="text-center py-8 text-gray-500">
              No expertise found. Create your first expertise to get started.
            </div>
          )}
          {!error && pagination.lastPage > 1 && renderPagination()}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-xl transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Expertise
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              ></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise Name
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

export default ExpertiseList;
