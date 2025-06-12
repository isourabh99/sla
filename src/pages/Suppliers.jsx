import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingSuppliers,
  getApprovedSuppliers,
  updateSupplierStatus,
} from "../services/suppliersController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { FiEye } from "react-icons/fi";
import { toast } from "sonner";

const Suppliers = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [suppliers, setSuppliers] = useState([]);
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
          <div className="text-sm text-gray-900">
            {row.address || null}
          </div>
          <div className="text-sm text-gray-500">
            {[row.city, row.state, row.country].filter(Boolean).join(", ")}
          </div>
        </div>
      ),
    },
    {
      key: "brands",
      label: "Brands",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.brand && row.brand.length > 0 ? (
            row.brand.map((brand) => (
              <span
                key={brand.id}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
              >
                {brand.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No brands</span>
          )}
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
              navigate(`/suppliers/${row.id}`);
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

  const fetchSuppliers = async (page = 1) => {
    try {
      setLoading(true);
      const data =
        activeTab === "pending"
          ? await getPendingSuppliers(token, page)
          : await getApprovedSuppliers(token, page);

      if (data.status && data.data) {
        setSuppliers(data.data.data);
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
      setError(err.message || "Failed to fetch suppliers list");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(1);
  }, [token, activeTab]);

  const handleStatusUpdate = async (supplierId, status) => {
    try {
      await updateSupplierStatus(token, supplierId, status);
      toast.success("Supplier status updated successfully");
      fetchSuppliers(pagination.current_page); // Refresh current page
    } catch (err) {
      toast.error(err.message || "Failed to update supplier status");
    }
  };

  const handlePageChange = (page) => {
    fetchSuppliers(page);
  };

  const handleRowClick = (row) => {
    if (row && row.id) {
      navigate(`/suppliers/${row.id}`);
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
          className={`relative px-6 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === "pending"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Suppliers
          {activeTab === "pending" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-200 ease-in-out" />
          )}
        </button>
        <button
          className={`relative px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === "approved"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved Suppliers
          {activeTab === "approved" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-200 ease-in-out" />
          )}
        </button>
      </div>

      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <>
          <DataTable
            title="Supplier Management"
            subtitle={`${
              activeTab === "pending" ? "Pending" : "Approved"
            } Suppliers List`}
            columns={columns}
            data={suppliers}
            loading={loading}
            error={error}
            onRowClick={handleRowClick}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
          {!error && suppliers.length > 0 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default Suppliers;
