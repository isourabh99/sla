import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getPartnerDetails,
  updatePartner,
} from "../services/partnersController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaGlobe,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "sonner";

const InputField = ({ icon: Icon, type = "text", label, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent">
        <Icon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
        <input
          type={type}
          className="w-full bg-transparent border-none focus:outline-none text-gray-700"
          {...props}
        />
      </div>
    </div>
  </div>
);

const EditPartner = () => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    address: "",
    partner_id: "",
    password: "",
    password_confirmation: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { partnerId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    password_confirmation: false,
  });

  useEffect(() => {
    if (partnerId) {
      fetchPartnerDetails();
    }
  }, [partnerId, token]);

  const fetchPartnerDetails = async () => {
    try {
      setLoading(true);
      const response = await getPartnerDetails(token, partnerId);
      if (response && response.status && response.data) {
        setPartner(response.data);
        setFormData({
          name: response.data.name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          city: response.data.city || "",
          state: response.data.state || "",
          country: response.data.country || "",
          address: response.data.address || "",
          partner_id: partnerId,
          password: "",
          password_confirmation: "",
        });
        setPreviewImage(response.data.profile_picture);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create FormData object
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "password" || key === "password_confirmation") {
          // Only append password fields if they are not empty
          if (value) {
            formDataToSend.append(key, value);
          }
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append profile picture if changed
      if (profilePicture) {
        formDataToSend.append("profile_picture", profilePicture);
      }

      const response = await updatePartner(token, formDataToSend);
      if (response.status) {
        toast.success("Partner details updated successfully");
        navigate(`/partners/${partnerId}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      // Display validation errors in a more user-friendly way
      if (err.message.startsWith("Validation failed:")) {
        const errorMessages = err.message.split("\n").slice(1); // Remove the "Validation failed:" line
        errorMessages.forEach((message) => {
          const [field, error] = message.split(": ");
          toast.error(`${field}: ${error}`);
        });
      } else {
        toast.error(err.message || "Failed to update partner details");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
    <div className="p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Partner Management{" "}
          <span className="text-base">
            • Update your profile {partner.name}
          </span>
        </h1>
        <Link
          to={`/partners/${partnerId}`}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-gray-100 overflow-hidden bg-white ">
              <img
                src={
                  previewImage ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(partner?.name || "User") +
                    "&background=random&size=150"
                }
                alt={partner?.name}
                className="h-full w-full object-cover "
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Profile Picture
            </h3>
            <p className="text-sm text-gray-500">
              Click to change profile picture
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            icon={FaUser}
            label="First Name"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            required
          />
          <InputField
            icon={FaUser}
            label="Last Name"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleInputChange}
            required
          />
          <InputField
            icon={FaEnvelope}
            label="Email"
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            required
          />
          <InputField
            icon={FaPhone}
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              New Password (Optional)
            </label>
            <div className="relative">
              <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                <FaLock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type={showPasswords?.password ? "text" : "password"}
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords?.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                <FaLock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type={
                    showPasswords?.password_confirmation ? "text" : "password"
                  }
                  name="password_confirmation"
                  value={formData.password_confirmation || ""}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                />
                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("password_confirmation")
                  }
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords?.password_confirmation ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            icon={FaMapMarkerAlt}
            label="City"
            name="city"
            value={formData.city || ""}
            onChange={handleInputChange}
            required
          />
          <InputField
            icon={FaMapMarkerAlt}
            label="State"
            name="state"
            value={formData.state || ""}
            onChange={handleInputChange}
            required
          />
          <InputField
            icon={FaGlobe}
            label="Country"
            name="country"
            value={formData.country || ""}
            onChange={handleInputChange}
            required
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="relative">
              <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                <FaHome className="h-5 w-5 text-gray-400 mr-2" />
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  rows="1"
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700 resize-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded flex items-center gap-2"
            disabled={loading}
          >
            <FiSave className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPartner;
