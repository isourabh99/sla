import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStaffById, updateStaff } from "../services/staffController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "sonner";
import {
  FaUser,
  FaMapMarkerAlt,
  FaGlobe,
  FaLock,
  FaCamera,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaEdit,
} from "react-icons/fa";

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

const StaffDetails = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [staffDetails, setStaffDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    password: "",
    password_confirmation: "",
    profile_picture: null,
    staff_id: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    password_confirmation: false,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      const response = await getStaffById(staffId, token);
      const { latitude, longitude, ...staffData } = response.data;
      setStaffDetails(response.data);
      setFormData({
        ...staffData,
        staff_id: staffId,
        password: "",
        password_confirmation: "",
        profile_picture: null,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetails();
  }, [staffId, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files,
      }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await updateStaff(formData, token);
      await fetchStaffDetails();
      setIsEditing(false);
      toast.success("Staff updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update staff");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!staffDetails) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600">Staff not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Staff Management{" "}
          <span className="text-base">• Edit {formData.name}</span>
        </h1>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded   flex items-center gap-2"
          >
            <FaEdit />
            {isEditing ? "Cancel Edit" : "Edit Staff"}
          </button>
          <button
            onClick={() => navigate("/staff")}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                icon={FaUser}
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaEnvelope}
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaPhone}
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaHome}
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaMapMarkerAlt}
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaMapMarkerAlt}
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaGlobe}
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <img
                    src={
                      previewImage ||
                      staffDetails.profile_picture ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-100"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                    <FaCamera />
                    <input
                      type="file"
                      name="profile_picture"
                      onChange={handleChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                      <FaLock className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type={showPasswords.password ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                        placeholder="Leave blank to keep current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("password")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.password ? <FaEyeSlash /> : <FaEye />}
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
                          showPasswords.password_confirmation
                            ? "text"
                            : "password"
                        }
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("password_confirmation")
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.password_confirmation ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={updateLoading}
                className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded   flex items-center gap-2"
              >
                {updateLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Staff"
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <img
                src={
                  staffDetails.profile_picture ||
                  "https://via.placeholder.com/150"
                }
                alt={staffDetails.name}
                className="h-32 w-32 rounded-full object-cover border-4 border-gray-100"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {staffDetails.name} {staffDetails.last_name}
                </h2>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {staffDetails.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {staffDetails.phone}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Role:</span>{" "}
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {staffDetails.user_type}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        staffDetails.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {staffDetails.status || "Pending"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {staffDetails.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {staffDetails.phone}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Account Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Brand ID:</span>{" "}
                    {staffDetails.brand_id ? `#${staffDetails.brand_id}` : "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Joined Date:</span>{" "}
                    {new Date(staffDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Address Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {staffDetails.address}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span>{" "}
                    {[
                      staffDetails.city,
                      staffDetails.state,
                      staffDetails.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDetails;
