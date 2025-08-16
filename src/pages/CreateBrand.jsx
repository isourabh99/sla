import React, { useState } from "react";
// Remove createBrand and image upload imports
import { toast } from "sonner";
// Remove FiUpload, FiX imports
import { useAuth } from "../context/AuthContext";
import { createSLA } from "../services/brandController";

// Remove BrandIllustration component

const CreateSLAType = () => {
  const [slaTypeName, setSlaTypeName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Remove handleFileChange, removeImage, and image/preview state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slaTypeName.trim()) {
      toast.error("Please enter an SLA type name");
      return;
    }
    if (
      percentage === "" ||
      isNaN(percentage) 
      // percentage < 0 ||
      // percentage > 100
    ) {
      toast.error("Please enter a valid percentage (0-100)");
      return;
    }
    setLoading(true);
    try {
      await createSLA({ name: slaTypeName, percentage }, token);
      toast.success("SLA Type created successfully!");
      setSlaTypeName("");
      setPercentage("");
    } catch (error) {
      toast.error(error.message || "Failed to create SLA Type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="w-full bg-white flex flex-col md:flex-row-reverse overflow-hidden">
        {/* Left Info */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-[#E6F4FF] to-white w-1/2 p-4">
          {/* You can add an illustration or icon here if desired */}
          <h2 className="text-lg font-semibold text-[#387DB2] mb-2">
            Add New SLA Type
          </h2>
          <p className="text-gray-500 text-sm text-center">
            SLA Types help you define service level agreements with a name and a
            percentage value.
            <br />
            <span className="font-medium text-[#387DB2]">Tip:</span> Use a clear
            name and a valid percentage (0-100).
          </p>
        </div>
        {/* Right Form */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
            <h1 className="text-xl font-semibold text-gray-500">
              SLA Type Management{" "}
              <span className="text-base">• Create SLA Type</span>
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SLA Type Name Input */}
            <div>
              <label
                htmlFor="slaTypeName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                SLA Type Name
              </label>
              <input
                type="text"
                id="slaTypeName"
                value={slaTypeName}
                onChange={(e) => setSlaTypeName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SLA type name"
              />
            </div>
            {/* Percentage Input */}
            <div>
              <label
                htmlFor="percentage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Percentage
              </label>
              <input
                type="number"
                id="percentage"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter percentage (0-100)"
            
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create SLA Type"}
            </button>
          </form>
          {/* Tips/Info Box */}
          <div className="mt-8 bg-[#F0F6FA] border-l-4 border-[#387DB2] p-4 rounded-lg">
            <h3 className="font-semibold text-[#387DB2] mb-1 text-sm">
              Why add SLA Types?
            </h3>
            <ul className="text-gray-600 text-xs list-disc pl-4 space-y-1">
              <li>
                Define different service level agreements for your business.
              </li>
              <li>Quickly identify and manage SLA-specific data.</li>
              <li>Enhance your business process and compliance.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSLAType;
