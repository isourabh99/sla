import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBrandById, updateBrand } from "../services/brandController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "sonner";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { FiUpload, FiX } from "react-icons/fi";

const BrandDetails = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [brandDetails, setBrandDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    brand_id: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchBrandDetails = async () => {
    try {
      setLoading(true);
      const response = await getBrandById(token, brandId);
      setBrandDetails(response.data);
      setFormData({
        name: response.data.name,
        brand_id: brandId,
        image: null,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandDetails();
  }, [brandId, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      // Check file type
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: files,
      }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a brand name");
      return;
    }

    setUpdateLoading(true);
    try {
      const updateData = [
        { key: "name", value: formData.name, type: "text" },
        { key: "brand_id", value: formData.brand_id, type: "text" },
      ];

      if (formData.image) {
        updateData.push({
          key: "image",
          type: "file",
          value: [formData.image[0]],
        });
      }

      await updateBrand(updateData, token);
      await fetchBrandDetails();
      setIsEditing(false);
      toast.success("Brand updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update brand");
    } finally {
      setUpdateLoading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setPreviewImage(null);
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

  if (!brandDetails) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600">Brand not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Brand Management{" "}
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
            {isEditing ? "Cancel Edit" : "Edit Brand"}
          </button>
          <button
            onClick={() => navigate("/brands")}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FaArrowLeft />
            Back to List
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-2xl">
            {/* Brand Name Input */}
            <div>
              <label
                htmlFor="brandName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brand Name
              </label>
              <input
                type="text"
                id="brandName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter brand name"
                required
              />
            </div>

            {/* Image Upload Area */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Logo
              </label>
              {!previewImage ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-blue-500 hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    id="fileInput"
                    name="image"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to select an image
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={updateLoading}
              className={`mt-6 w-full  gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium  transition-all duration-300
               `}
            >
              {updateLoading ? "Updating..." : "Update Brand"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-2xl">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-center">
              <img
                src={brandDetails.image || "https://via.placeholder.com/150"}
                alt="Brand"
                className="h-32 w-32 rounded-lg object-cover border-4 border-gray-100"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Brand Name
                </h3>
                <p className="mt-1 text-lg text-gray-900">
                  {brandDetails.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDetails;
