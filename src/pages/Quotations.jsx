import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getQuotations } from "../services/quotationController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import { FiEye } from "react-icons/fi";
import { toast } from "sonner";

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
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
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.customer?.name} {row.customer?.last_name}
          </div>
          <div className="text-sm text-gray-500">{row.customer?.email}</div>
          <div className="text-sm text-gray-500">{row.customer?.phone}</div>
        </div>
      ),
    },
    {
      key: "service_details",
      label: "Service Details",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.service_category}
          </div>
          <div className="text-sm text-gray-500">
            Type: {row.quotation_type}
          </div>
          <div className="text-sm text-gray-500">
            Support: {row.support_type}
          </div>
        </div>
      ),
    },
    {
      key: "device_details",
      label: "Device Details",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.brand?.name} {row.model?.name}
          </div>
          <div className="text-sm text-gray-500">S/N: {row.serial_number}</div>
          <div className="text-sm text-gray-500">Qty: {row.quantity}</div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            ₹{parseFloat(row.estimated_amount).toLocaleString()}
          </div>
          {row.final_amount && (
            <div className="text-sm text-gray-500">
              Final: ₹{parseFloat(row.final_amount).toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : row.status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
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
              handleViewClick(row);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
            title="View Details"
          >
            <FiEye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const fetchQuotations = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getQuotations(token);
      if (response.status && response.data) {
        setQuotations(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          links: response.data.links,
        });
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch quotations list");
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [token]);

  const handlePageChange = (page) => {
    fetchQuotations(page);
  };

  const handleViewClick = (quotation) => {
    if (quotation && quotation.id) {
      navigate(`/quotations/${quotation.id}`);
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
     

      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <>
          <DataTable
            title="Quotation Management"
            subtitle="Quotation List"
            columns={columns}
            data={quotations}
            loading={loading}
            error={error}
            onRowClick={handleViewClick}
          />
          {!error && quotations.length > 0 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default Quotations;
