import React, { useEffect, useState, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaUserShield,
  FaUserEdit,
  FaCamera,
  FaSpinner,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  getAdminProfile,
  updateProfile,
  changePassword,
} from "../services/adminController";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../components/Loader";
import ErrorDisplay from "../components/ErrorDisplay";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile_picture: null,
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const { token, isAdmin } = useAuth();
  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    password: false,
    confirm_password: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token && isAdmin()) {
          const response = await getAdminProfile(token);
          if (response) {
            setProfileData(response.data);
            setFormData({
              name: response.data.name || "",
              email: response.data.email || "",
              profile_picture: null,
            });
            setPreviewImage(response.data.profile_picture);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.profile_picture) {
        formDataToSend.append("profile_picture", formData.profile_picture);
      }

      const response = await updateProfile(token, formDataToSend);
      setProfileData(response.data);
      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved and are now live.",
      });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile", {
        description: error.message || "Please try again later.",
        duration: 3000,
        position: "top-right",
        richColors: true,
        closeButton: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordData.password !== passwordData.confirm_password) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setUpdating(true);
    try {
      await changePassword(
        token,
        passwordData.current_password,
        passwordData.password
      );
      toast.success("Password updated successfully!", {
        description: "Your password has been changed.",
      });
      setIsChangingPassword(false);
      setPasswordData({
        current_password: "",
        password: "",
        confirm_password: "",
      });
    } catch (error) {
      toast.error("Failed to update password", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return <Loader fullScreen size="large" />;
  }

  if (!profileData) {
    return (
      <ErrorDisplay
        title="Oops! Something went wrong"
        message="We couldn't load your profile data. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 group">
                <img
                  src={previewImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera className="text-white text-2xl" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {profileData.name}
              </h2>
              <p className="text-gray-600 capitalize">
                {profileData.user_type}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="md:text-xl font-semibold mb-4 text-gray-800 flex items-center justify-between">
              Profile Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 mb-2">
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="w-full sm:w-auto text-center px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-[#387DB2] hover:bg-[#285c8c] text-white rounded-lg shadow mb-2 sm:mb-0 flex items-center justify-center gap-2 transition-colors"
              >
                <FaLock className="text-lg" />
                <span className="text-xs sm:text-sm">
                  {isChangingPassword ? "Cancel" : "Change Password"}
                </span>
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto text-center px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-[#2dd4bf] hover:bg-[#14b8a6] text-white rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
              >
                <FaUserEdit className="text-lg" />
                <span className="text-xs sm:text-sm">
                  {isEditing ? "Cancel" : "Edit Profile"}
                </span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isChangingPassword ? (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPasswords.current_password ? "text" : "password"
                          }
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("current_password")
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPasswords.current_password ? (
                            <FaEyeSlash className="w-5 h-5" />
                          ) : (
                            <FaEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.password ? "text" : "password"}
                          name="password"
                          value={passwordData.password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("password")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPasswords.password ? (
                            <FaEyeSlash className="w-5 h-5" />
                          ) : (
                            <FaEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPasswords.confirm_password ? "text" : "password"
                          }
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("confirm_password")
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPasswords.confirm_password ? (
                            <FaEyeSlash className="w-5 h-5" />
                          ) : (
                            <FaEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm">{passwordError}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded   flex items-center gap-2"
                    >
                      {updating ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : isEditing ? (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded   flex items-center gap-2"
                    >
                      {updating ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-50">
                      <FaUser className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{profileData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-50">
                      <FaEnvelope className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-50">
                      <FaUserShield className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User Type</p>
                      <p className="font-medium capitalize">
                        {profileData.user_type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-orange-50">
                      <FaCalendarAlt className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {formatDate(profileData.created_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Additional Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {profileData.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {profileData.address || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">
                    {profileData.city || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">
                    {profileData.country || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
