import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartnerDetails } from "../services/partnersController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowLeft,
  FiEdit2,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "sonner";

const PartnerDetails = () => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { partnerId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (partnerId) {
      fetchPartnerDetails();
    }
  }, [partnerId, token]);

  const fetchPartnerDetails = async () => {
    try {
      setLoading(true);
      const response = await getPartnerDetails(token, partnerId);
      console.log("API Response:", response);
      if (response && response.status && response.data) {
        setPartner(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching partner:", err);
      setError(err.message || "Failed to fetch partner details");
      toast.error(err.message || "Failed to fetch partner details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  if (error || !partner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {error || "Partner not found"}
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
              onClick={() => navigate(`/partners/${partnerId}/edit`)}
              className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900 backdrop-blur-sm"
              title="Edit Partner"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/partners")}
              className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900 backdrop-blur-sm"
              title="Back to Partners"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute top-6 left-3">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                src={
                  partner?.profile_picture ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(partner?.name || "User") +
                    "&background=random&size=150"
                }
                alt={partner?.name}
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
                  {partner?.name} {partner?.last_name}
                </h1>
                <div className="mt-1 flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      partner?.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {partner?.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {partner?.user_type || "N/A"}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-1" />
                    Member since{" "}
                    {new Date(partner?.created_at).toLocaleDateString()}
                  </div>
                  {partner?.email_verified_at && (
                    <div className="flex items-center text-sm text-green-600">
                      <FiCheckCircle className="mr-1" />
                      Email Verified
                    </div>
                  )}
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
                  <span className="text-gray-600">{partner?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{partner?.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {[partner?.city, partner?.state, partner?.country]
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
                  <p className="text-gray-600">{partner?.address || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Coordinates</span>
                  <p className="text-gray-600">
                    {partner?.latitude && partner?.longitude
                      ? `${partner.latitude}, ${partner.longitude}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Brands */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Associated Brands
            </h2>
            {partner?.brand && partner.brand.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {partner.brand.map((brand) => (
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
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No brands associated</p>
            )}
          </div>

          {/* Expertise */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Areas of Expertise
            </h2>
            {partner?.expertises && partner.expertises.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {partner.expertises.map((expertise) => (
                  <div key={expertise.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">
                      {expertise.name}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No expertise</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetails;
