import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSupplierDetails } from "../services/suppliersController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { FiMapPin, FiPhone, FiMail, FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";
import defaultSparePartImg from "../assets/defaultspare.jpg";

const SupplierDetails = () => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realLocation, setRealLocation] = useState("");
  const { supplierId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (supplierId) {
      fetchSupplierDetails();
    }
  }, [supplierId, token]);

  // Fetch real location when supplier is loaded and has coordinates
  useEffect(() => {
    const fetchRealLocation = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setRealLocation(data.display_name);
        } else {
          setRealLocation("");
        }
      } catch (err) {
        console.error("Error fetching real location:", err);
        setRealLocation("");
      }
    };

    if (supplier && supplier.latitude && supplier.longitude) {
      fetchRealLocation(supplier.latitude, supplier.longitude);
    }
  }, [supplier]);

  const fetchSupplierDetails = async () => {
    try {
      setLoading(true);
      const response = await getSupplierDetails(token, supplierId);
      // console.log("API Response:", response);
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
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
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
            {supplier?.description && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="text-gray-600">{supplier?.description}</p>
              </div>
            )}
            {/* Location Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Location Details
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="text-gray-600">{supplier?.address || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="text-gray-600">
                    {realLocation ||
                      (supplier?.latitude && supplier?.longitude
                        ? "Loading location..."
                        : "No location coordinates available")}
                  </p>
                  {supplier?.latitude && supplier?.longitude && (
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${supplier.latitude},${supplier.longitude}`;
                        window.open(url, "_blank");
                      }}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <FiMapPin className="w-3 h-3 mr-1" />
                      See on Google Maps
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Brands Section */}
          {/* <div className="mt-8">
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
          </div> */}

          {/* Spare Parts Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Spare Parts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {supplier?.spare_parts && supplier.spare_parts.length > 0 ? (
                supplier.spare_parts.map((part, idx) => {
                  // Cycle through pastel bg colors
                  const bgColors = [
                    "bg-pink-50",
                    "bg-blue-50",
                    "bg-green-50",
                    "bg-yellow-50",
                    "bg-purple-50",
                  ];
                  const cardBg = bgColors[idx % bgColors.length];
                  return (
                    <div
                      key={part.id}
                      className={`${cardBg} rounded-xl p-5 flex flex-col items-start space-y-3 shadow transition-transform duration-200 border border-gray-200 hover:scale-105 hover:shadow-lg`}
                    >
                      <div className="flex items-center space-x-3 mb-3 w-full">
                        {/* Brand Image */}
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-white border">
                          <img
                            src={part.brand?.image || defaultSparePartImg}
                            alt={part.brand?.name || "Brand"}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultSparePartImg;
                            }}
                          />
                        </div>
                        {/* Spare Part Image */}
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-white border">
                          <img
                            src={part.image || defaultSparePartImg}
                            alt={part.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultSparePartImg;
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {part.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Brand:</span>{" "}
                          {part.brand?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Description:</span>{" "}
                          {part.description || "No description"}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Price:</span>{" "}
                          {part.price ? `₹${part.price}` : "N/A"}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Added on{" "}
                          {new Date(part.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 col-span-full">
                  No spare parts available
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
