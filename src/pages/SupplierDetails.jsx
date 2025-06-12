import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSupplierDetails } from "../services/suppliersController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { FiMapPin, FiPhone, FiMail, FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";

const SupplierDetails = () => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (supplierId) {
      fetchSupplierDetails();
    }
  }, [supplierId, token]);

  const fetchSupplierDetails = async () => {
    try {
      setLoading(true);
      const response = await getSupplierDetails(token, supplierId);
      console.log("API Response:", response);
      if (response && response.status && response.data) {
        setSupplier(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching supplier:", err);
      setError(err.message || "Failed to fetch supplier details");
      toast.error(err.message || "Failed to fetch supplier details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  if (error || !supplier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {error || "Supplier not found"}
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-white shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="relative h-30 bg-gray-200">
          <button
            onClick={() => navigate("/suppliers")}
            className="absolute top-4 right-4 p-1.5 rounded-md bg-white/80 hover:bg-white shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900 backdrop-blur-sm"
            title="Back to Suppliers"
          >
            <FiArrowLeft className="w-4 h-4" />
          </button>
          <div className="absolute top-6 left-3">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                src={
                  supplier?.profile_picture ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(supplier?.name || "User") +
                    "&background=random&size=150"
                }
                alt={supplier?.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="p-10 px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {supplier?.name} {supplier?.last_name}
                </h1>
                <div className="mt-1 flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      supplier?.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {supplier?.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {supplier?.user_type || "N/A"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since{" "}
                    {new Date(supplier?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{supplier?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{supplier?.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {[supplier?.city, supplier?.state, supplier?.country]
                      .filter(Boolean)
                      .join(", ") || "No address provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Location Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Latitude: {supplier?.latitude || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Longitude: {supplier?.longitude || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Brands Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Associated Brands
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {supplier?.brand && supplier.brand.length > 0 ? (
                supplier.brand.map((brand) => (
                  <div
                    key={brand.id}
                    className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3"
                  >
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-white">
                      <img
                        src={
                          brand.image ||
                          "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(brand.name || "Brand") +
                            "&background=random&size=50"
                        }
                        alt={brand.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Added on{" "}
                        {new Date(brand.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">
                  No brands associated
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
