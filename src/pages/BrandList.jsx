import React, { useState, useEffect } from "react";
import { getBrands, deleteBrand } from "../services/brandController";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Loader from "../components/Loader";
import { toast } from "sonner";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [perPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBrands = async (page, search) => {
    try {
      setLoading(true);
      const response = await getBrands(token, page, perPage, search);
      setBrands(response.data.data);
      setTotalPages(response.data.last_page);
      setCurrentPage(response.data.current_page);
      setError(null);
    } catch (err) {
      setError("Failed to fetch brands. Please try again.");
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchBrands(1, searchQuery);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteBrand = async (brandId) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand(token, brandId);
        toast.success("Brand deleted successfully");
        // Refresh the brands list
        fetchBrands(currentPage, debouncedSearchQuery);
      } catch (err) {
        toast.error(err.message || "Failed to delete brand");
      }
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  return (
    <div className="p-4 bg-gray-50 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Brand Management <span className="text-base">• Brand List</span>
        </h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/brands/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium  transition-all duration-300"
        >
          <FaPlus className="w-4 h-4" />
          Add New Brand
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-1/3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands..."
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="relative h-40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Brand+Image";
                }}
              />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {brand.name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium">
                      ID: {brand.id}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Created At{" "}
                      {new Date(brand.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => navigate(`/brands/${brand.id}`)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                    title="Edit Brand"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                    title="Delete Brand"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            {renderPagination()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
