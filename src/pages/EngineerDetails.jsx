import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEngineerDetails } from "../services/engineersController";
import { getBrandById } from "../services/brandController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowLeft,
  FiEdit2,
} from "react-icons/fi";
import { toast } from "sonner";

const EngineerDetails = () => {
  const [engineer, setEngineer] = useState(null);
  const [brandDetails, setBrandDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realLocation, setRealLocation] = useState("");
  const { engineerId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (engineerId) {
      fetchEngineerDetails();
    }
  }, [engineerId, token]);

  // Fetch real location when engineer is loaded and has coordinates
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

    if (engineer && engineer.latitude && engineer.longitude) {
      fetchRealLocation(engineer.latitude, engineer.longitude);
    }
  }, [engineer]);

  const fetchEngineerDetails = async () => {
    try {
      setLoading(true);
      const response = await getEngineerDetails(token, engineerId);
      // console.log("API Response:", response);
      if (response && response.status && response.data) {
        setEngineer(response.data);
        // If brand_id exists, fetch brand details
        if (response.data.brand_id) {
          try {
            const brandResponse = await getBrandById(
              token,
              response.data.brand_id
            );
            if (brandResponse && brandResponse.data) {
              setBrandDetails(brandResponse.data);
            }
          } catch (brandErr) {
            console.error("Error fetching brand details:", brandErr);
            toast.error("Failed to fetch brand details");
          }
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching engineer:", err);
      setError(err.message || "Failed to fetch engineer details");
      toast.error(err.message || "Failed to fetch engineer details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  if (error || !engineer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {error || "Engineer not found"}
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
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => navigate(`/engineers/${engineerId}/edit`)}
              className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900 backdrop-blur-sm"
              title="Edit Engineer"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/engineers")}
              className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900 backdrop-blur-sm"
              title="Back to Engineers"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute top-6 left-3">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                src={
                  engineer?.profile_picture ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(engineer?.name || "User") +
                    "&background=random&size=150"
                }
                alt={engineer?.name}
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
                  {engineer?.name} {engineer?.last_name}
                </h1>
                <div className="mt-1 flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      engineer?.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {engineer?.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {engineer?.user_type || "N/A"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since{" "}
                    {new Date(engineer?.created_at).toLocaleDateString()}
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
                  <span className="text-gray-600">{engineer?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{engineer?.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {[engineer?.city, engineer?.state, engineer?.country]
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
                  <p className="text-gray-600">{engineer?.address || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="text-gray-600">
                    {realLocation ||
                      (engineer?.latitude && engineer?.longitude
                        ? "Loading location..."
                        : "No location coordinates available")}
                  </p>
                  {engineer?.latitude && engineer?.longitude && (
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${engineer.latitude},${engineer.longitude}`;
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

          {/* Associated Brands */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Associated Brands
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {engineer?.brand && engineer.brand.length > 0 ? (
                engineer.brand.map((brand) => (
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

          {/* Expertise */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Areas of Expertise
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {engineer?.expertises && engineer.expertises.length > 0 ? (
                engineer.expertises.map((expertise) => (
                  <div key={expertise.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">
                      {expertise.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Added on{" "}
                      {new Date(expertise.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">
                  No expertise areas defined
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerDetails;
