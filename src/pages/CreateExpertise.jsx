import React, { useState } from "react";
import { createExpertise } from "../services/expertiseController";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const ExpertiseIllustration = () => (
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
  </svg>
);

const CreateExpertise = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter expertise name");
      return;
    }
    if (!type.trim()) {
      toast.error("Please select expertise type");
      return;
    }

    setLoading(true);
    try {
      const expertiseData = {
        name: name,
        type: type,
      };
      await createExpertise(expertiseData, token);
      toast.success("Expertise created successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      // Reset form
      setName("");
      setType("");
    } catch (error) {
      toast.error(error.message || "Failed to create expertise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50 min-h-[calc(100vh-64px)] ">
      <div className="w-full  bg-white  flex flex-col md:flex-row-reverse overflow-hidden">
        {/* Left Illustration & Info */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-[#E6F4FF] to-white w-1/2 p-4">
          <ExpertiseIllustration />
          <h2 className="text-lg font-semibold text-[#387DB2] mb-2">
            Add New Expertise
          </h2>
          <p className="text-gray-500 text-sm text-center">
            Expertise helps you categorize your staff and assign the right
            people to the right tasks. <br />
            <span className="font-medium text-[#387DB2]">Tip:</span> Use clear
            and descriptive names for expertise.
          </p>
        </div>
        {/* Right Form */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
            <h1 className="text-xl font-semibold text-gray-500">
              Staff Management{" "}
              <span className="text-base">• Create Expertise</span>
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expertise Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expertise Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter expertise name"
              />
            </div>

            {/* Expertise Type Select */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expertise Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select type</option>
                <option value="engineers">Engineers</option>
                <option value="technicians">Technicians</option>
                <option value="specialists">Specialists</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-100 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              ) : null}
              {loading ? "Creating..." : "Create Expertise"}
            </button>
            {/* Success Checkmark */}
            {showSuccess && (
              <div className="flex justify-center mt-2">
                <span className="text-3xl animate-bounce">✅</span>
              </div>
            )}
          </form>
          {/* Tips/Info Box */}
          <div className="mt-8 bg-[#F0F6FA] border-l-4 border-[#387DB2] p-4 rounded-lg">
            <h3 className="font-semibold text-[#387DB2] mb-1 text-sm">
              Why add expertise?
            </h3>
            <ul className="text-gray-600 text-xs list-disc pl-4 space-y-1">
              <li>Organize your staff by their skills and roles.</li>
              <li>Assign the right people to the right jobs easily.</li>
              <li>Improve efficiency in staff management.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExpertise;
