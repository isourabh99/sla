import React, { useState, useEffect } from "react";
import { createModel, getBrandsForModel } from "../services/modelController";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const ModelIllustration = () => (
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
    <rect x="100" y="110" width="10" height="8" rx="4" fill="#E6F4FF" />
  </svg>
);

const CreateModel = () => {
  const [modelData, setModelData] = useState({
    name: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Removed useEffect and fetchBrands as brands are no longer needed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModelData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelData.name.trim()) {
      toast.error("Please enter a model name");
      return;
    }
    if (!modelData.price) {
      toast.error("Please enter a price");
      return;
    }
    // Removed brand_id validation

    setLoading(true);
    try {
      await createModel(modelData, token);
      toast.success("Model created successfully!");
      // Reset form
      setModelData({
        name: "",
        price: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to create model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="w-full bg-white flex flex-col md:flex-row-reverse overflow-hidden">
        {/* Left Illustration & Info */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-[#E6F4FF] to-white w-1/2 p-4">
          <ModelIllustration />
          <h2 className="text-lg font-semibold text-[#387DB2] mb-2">
            Add New Model
          </h2>
          <p className="text-gray-500 text-sm text-center">
            Models help you organize your products under each brand.
            <br />
            <span className="font-medium text-[#387DB2]">Tip:</span> Use clear
            and descriptive names for models.
          </p>
        </div>
        {/* Right Form */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
            <h1 className="text-xl font-semibold text-gray-500">
              Model Management <span className="text-base">• Create Model</span>
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Model Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={modelData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter model name"
              />
            </div>

            {/* Price Input */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={modelData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter price"
              />
            </div>

            {/* Removed Brand Selection Dropdown */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300${
                loading ? " opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Model"}
            </button>
          </form>
          {/* Tips/Info Box */}
          <div className="mt-8 bg-[#F0F6FA] border-l-4 border-[#387DB2] p-4 rounded-lg">
            <h3 className="font-semibold text-[#387DB2] mb-1 text-sm">
              Why add models?
            </h3>
            <ul className="text-gray-600 text-xs list-disc pl-4 space-y-1">
              <li>Organize your products under each brand.</li>
              <li>Quickly identify and manage model-specific data.</li>
              <li>Enhance your catalog and product management.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModel;
