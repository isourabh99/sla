import React, { useState, useEffect } from "react";
import { createModel, getBrandsForModel } from "../services/modelController";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const CreateModel = () => {
  const [modelData, setModelData] = useState({
    name: "",
    price: "",
    brand_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await getBrandsForModel(token);
        setBrands(response.data || []);
    //   console.log(response.data);
    } catch (error) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoadingBrands(false);
    }
  };

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
    if (!modelData.brand_id) {
      toast.error("Please select a brand");
      return;
    }

    setLoading(true);
    try {
      await createModel(modelData, token);
      toast.success("Model created successfully!");
      // Reset form
      setModelData({
        name: "",
        price: "",
        brand_id: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to create model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Model Management <span className="text-base">• Create Model</span>
        </h1>
      </div>
      <div className="w-2xl">
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

          {/* Brand Selection */}
          <div>
            <label
              htmlFor="brand_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Brand
            </label>
            <select
              id="brand_id"
              name="brand_id"
              value={modelData.brand_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loadingBrands}
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300`}
          >
            {loading ? "Creating..." : "Create Model"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModel;
