import React, { useState } from "react";
import { createBrand } from "../services/brandController";
import { toast } from "sonner";
import { FiUpload, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const BrandIllustration = () => (
  <svg
    width="180"
    height="180"
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-4"
  >
    <circle cx="90" cy="90" r="90" fill="#E6F4FF" />
    <rect x="55" y="60" width="70" height="60" rx="12" fill="#387DB2" />
    <rect x="70" y="75" width="40" height="10" rx="5" fill="#fff" />
    <rect x="70" y="95" width="40" height="10" rx="5" fill="#fff" />
    <circle cx="90" cy="120" r="6" fill="#fff" />
    <rect x="80" y="110" width="20" height="8" rx="4" fill="#387DB2" />
  </svg>
);

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
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="w-full bg-white flex flex-col md:flex-row-reverse overflow-hidden">
        {/* Left Illustration & Info */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-[#E6F4FF] to-white w-1/2 p-4">
          <BrandIllustration />
          <h2 className="text-lg font-semibold text-[#387DB2] mb-2">
            Add New Brand
          </h2>
          <p className="text-gray-500 text-sm text-center">
            Brands help you organize your products and suppliers efficiently.
            <br />
            <span className="font-medium text-[#387DB2]">Tip:</span> Use a clear
            logo and a unique brand name.
          </p>
        </div>
        {/* Right Form */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
            <h1 className="text-xl font-semibold text-gray-500">
              Brand Management <span className="text-base">• Create Brand</span>
            </h1>
          </div>
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
              className={`w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Brand"}
            </button>
          </form>
          {/* Tips/Info Box */}
          <div className="mt-8 bg-[#F0F6FA] border-l-4 border-[#387DB2] p-4 rounded-lg">
            <h3 className="font-semibold text-[#387DB2] mb-1 text-sm">
              Why add brands?
            </h3>
            <ul className="text-gray-600 text-xs list-disc pl-4 space-y-1">
              <li>Organize your products and suppliers by brand.</li>
              <li>Quickly identify and manage brand-specific data.</li>
              <li>Enhance your business identity and recognition.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBrand;
