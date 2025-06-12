import React, { useState } from "react";
import { createExpertise } from "../services/expertiseController";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const CreateExpertise = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

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
    <div className="p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">
          Staff Management{" "}
          <span className="text-base">• Create Expertise</span>
        </h1>
      </div>
      <div className="w-2xl">
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
            className={`w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300`}
          >
            {loading ? "Creating..." : "Create Expertise"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExpertise;
