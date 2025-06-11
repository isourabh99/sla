import React, { useState } from "react";
import { createBrand } from "../services/brandController";
import { toast } from "sonner";
import { FiUpload, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
const CreateBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    try {
      const brandData = {
        name: brandName,
        image: image,
      };
      await createBrand(brandData, token);
      toast.success("Brand created successfully!");
      // Reset form
      setBrandName("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.message || "Failed to create brand");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="p-4 bg-gray-50 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Brand Management <span className="text-base">• Create Brand</span>
        </h1>
      </div>
      <div className="w-2xl ">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter brand name"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Logo
            </label>
            {!preview ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-blue-500 hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
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
                  src={preview}
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
            disabled={loading}
            className={`w-full  gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium  transition-all duration-300`}
          >
            {loading ? "Creating..." : "Create Brand"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;
