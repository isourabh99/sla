import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
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
          <div className="font-medium text-gray-900 capitalize">
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
          {row.service_category && (
            <div className="font-medium text-gray-900">
              {row.service_category}
            </div>
          )}
          {row.quotation_type && (
            <div className="text-sm text-gray-500 capitalize">
              Type: {row.quotation_type}
            </div>
          )}
          {row.support_type && (
            <div className="text-sm text-gray-500 capitalize">
              Support: {row.support_type}
            </div>
          )}
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
          <div className="font-semibold text-emerald-500">
            $ Estimated: {parseFloat(row.estimated_amount).toLocaleString()}
          </div>
          {row.final_amount && (
            <div className="text-sm text-gray-500 font-semibold">
              Final: $ {parseFloat(row.final_amount).toLocaleString()}
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

      // If searching, fetch all pages and combine results
      if (debouncedSearchTerm) {
        const firstPage = await getQuotations(token, 1, debouncedSearchTerm);
        if (firstPage.status && firstPage.data) {
          const firstData = firstPage.data.data || [];
          const lastPage = firstPage.data.last_page || 1;

          if (lastPage > 1) {
            const pagePromises = [];
            for (let p = 2; p <= lastPage; p++) {
              pagePromises.push(getQuotations(token, p, debouncedSearchTerm));
            }
            const restResponses = await Promise.all(pagePromises);
            const restData = restResponses.flatMap(
              (res) => res.data?.data || []
            );
            const allData = [...firstData, ...restData];
            setQuotations(allData);
            setPagination({
              current_page: 1,
              last_page: 1,
              per_page: allData.length,
              total: allData.length,
              links: [],
            });
          } else {
            setQuotations(firstData);
            setPagination({
              current_page: 1,
              last_page: 1,
              per_page: firstData.length,
              total: firstData.length,
              links: [],
            });
          }
        }
      } else {
        // Normal paginated fetch when no search term
        const response = await getQuotations(token, page, "");
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
    fetchQuotations(1);
  }, [token]);

  // Refetch on debounced search changes
  useEffect(() => {
    fetchQuotations(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handlePageChange = (page) => {
    fetchQuotations(page);
  };

  const handleViewClick = (quotation) => {
    if (quotation && quotation.id) {
      navigate(`/quotations/${quotation.id}`);
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
    const lastPage = pagination.last_page || 1;
    const current = pagination.current_page || 1;

    const createPageButton = (i) => (
      <button
        key={`p-${i}`}
        onClick={() => handlePageChange(i)}
        className={`px-3 py-1 rounded ${
          current === i
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {i}
      </button>
    );

    const pageButtons = [];
    if (lastPage <= 4) {
      for (let i = 1; i <= lastPage; i++) {
        pageButtons.push(createPageButton(i));
      }
    } else {
      const pagesToShow = [1, 2, lastPage - 1, lastPage]
        .filter(
          (v, idx, arr) => v >= 1 && v <= lastPage && arr.indexOf(v) === idx
        )
        .sort((a, b) => a - b);

      for (let idx = 0; idx < pagesToShow.length; idx++) {
        const p = pagesToShow[idx];
        pageButtons.push(createPageButton(p));
        if (idx < pagesToShow.length - 1) {
          const nextP = pagesToShow[idx + 1];
          if (nextP !== p + 1) {
            pageButtons.push(
              <span key={`e-${p}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }
        }
      }
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
            onClick={() => handlePageChange(current - 1)}
            disabled={current === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pageButtons}
          <button
            onClick={() => handlePageChange(current + 1)}
            disabled={current === lastPage}
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
            subtitle={
              debouncedSearchTerm
                ? `Search results for "${debouncedSearchTerm}" (${quotations.length})`
                : "Quotation List"
            }
            columns={columns}
            data={quotations}
            loading={loading}
            error={error}
            onRowClick={handleViewClick}
            searchable={true}
            searchPlaceholder="Search quotations..."
            externalSearchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
          {!error &&
            quotations.length > 0 &&
            !debouncedSearchTerm &&
            renderPagination()}
        </>
      )}
    </div>
  );
};

export default Quotations;
