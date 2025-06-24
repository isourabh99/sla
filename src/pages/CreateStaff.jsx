import React, { useState } from "react";
import { createStaff } from "../services/staffController";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";
import defaultDp from "../assets/deafultdp.jpg";
import { useAuth } from "../context/AuthContext";
import countries from "../utils/countries";
import countryStates from "../utils/states";
import stateCities from "../utils/cities";

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

const CreateStaff = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
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
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    password_confirmation: false,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [manualCityEntry, setManualCityEntry] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setFormData((prev) => ({ ...prev, country, state: "", city: "" }));
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setFormData((prev) => ({ ...prev, state, city: "" }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData((prev) => ({ ...prev, city }));
    setManualCityEntry(city === "Other");
  };

  const validate = () => {
    const newErrors = {};
    // Email validation
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    // Phone validation (10 digits, India)
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Validation Error", {
        description: Object.values(newErrors).join("\n"),
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await createStaff(formData, token);
      toast.success("Staff created successfully!", {
        description: "The new staff member has been added to the system.",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error("Failed to create staff", {
        description: err.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Staff Management <span className="text-base">• Create Staff</span>
        </h1>
      </div>

      <div className="flex gap-6 md:flex-row flex-col">
        {/* Profile Picture Card */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 group">
                <img
                  src={previewImage || defaultDp}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    document.getElementById("profile-picture").click()
                  }
                >
                  <FaCamera className="text-white text-2xl" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="profile-picture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-gray-500">
                Click to upload profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Staff Information Form */}
        <div className="flex-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Staff Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  icon={FaUser}
                  label="Full Name"
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
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="relative">
                    <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                      <FaHome className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="1"
                        className="w-full bg-transparent border-none focus:outline-none text-gray-700 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGlobe className="text-gray-400" />
                    </div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      required
                      disabled={
                        !formData.country || !countryStates[formData.country]
                      }
                    >
                      <option value="">
                        {formData.country
                          ? "Select State"
                          : "Select Country First"}
                      </option>
                      {formData.country &&
                        countryStates[formData.country] &&
                        countryStates[formData.country].map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      required
                      disabled={!formData.state || !stateCities[formData.state]}
                    >
                      <option value="">
                        {formData.state ? "Select City" : "Select State First"}
                      </option>
                      {formData.state &&
                        stateCities[formData.state] &&
                        stateCities[formData.state].map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {manualCityEntry && (
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter City"
                      value={formData.city === "Other" ? "" : formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full mt-2 pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  )}
                </div>
              </div>
              {/* Password Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  icon={FaLock}
                  label="Password"
                  type={showPasswords.password ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="relative">
                  <InputField
                    icon={FaLock}
                    label="Confirm Password"
                    type={
                      showPasswords.password_confirmation ? "text" : "password"
                    }
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility("password_confirmation")
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    style={{ top: "2.5rem" }}
                  >
                    {showPasswords.password_confirmation ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaUser className="text-lg" />
                      <span>Create Staff</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaff;
