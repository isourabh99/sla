import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../services/customerController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { FiMapPin, FiPhone, FiMail, FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realLocation, setRealLocation] = useState("");
  const { customerId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId, token]);

  // Fetch real location when customer is loaded and has coordinates
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

    if (customer && customer.latitude && customer.longitude) {
      fetchRealLocation(customer.latitude, customer.longitude);
    }
  }, [customer]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await getCustomerById(token, customerId);
      // console.log("API Response:", response);
      if (response && response.status && response.data) {
        setCustomer(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching customer:", err);
      setError(err.message || "Failed to fetch customer details");
      toast.error(err.message || "Failed to fetch customer details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  if (error || !customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {error || "Customer not found"}
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
            onClick={() => navigate("/customers")}
            className="absolute top-4 right-4 p-1.5 rounded-md bg-white/80 hover:bg-white shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900 backdrop-blur-sm"
            title="Back to Customers"
          >
            <FiArrowLeft className="w-4 h-4" />
          </button>
          <div className="absolute top-6 left-3">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                src={
                  customer?.profile_picture ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(customer?.name || "User") +
                    "&background=random&size=150"
                }
                alt={customer?.name}
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
                  {customer?.name} {customer?.last_name}
                </h1>
                <div className="mt-1 flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      customer?.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : customer?.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {customer?.status || "Active"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {customer?.user_type || "Customer"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since{" "}
                    {new Date(customer?.created_at).toLocaleDateString()}
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
                  <span className="text-gray-600">{customer?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {customer?.phone || "No phone number provided"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {[customer?.city, customer?.state, customer?.country]
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
                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="text-gray-600">{customer?.address || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="text-gray-600">
                    {realLocation ||
                      (customer?.latitude && customer?.longitude
                        ? "Loading location..."
                        : "No location coordinates available")}
                  </p>
                  {customer?.latitude && customer?.longitude && (
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`;
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

          {/* Account Information */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Account Status
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Email Verified
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        customer?.email_verified_at
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {customer?.email_verified_at ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">FCM Token</span>
                    <span className="text-sm text-gray-600">
                      {customer?.fcm_token ? "Available" : "Not available"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Brand ID</span>
                    <span className="text-sm text-gray-600">
                      {customer?.brand_id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Account Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">User ID</span>
                    <span className="text-sm font-mono text-gray-600">
                      #{customer?.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-600">
                      {new Date(customer?.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-600">
                      {new Date(customer?.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
