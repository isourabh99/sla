import React from "react";

const ProfessionalServicesSettings = ({ settings, handleChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Professional Services Setting
      </h2>

      {/* SLA Commission Field */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SLA Commission (%)
          </label>
          <input
            type="number"
            name="sla_commission"
            value={settings.sla_commission || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter SLA commission percentage"
            min="0"
            max="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: This percentage will be used to calculate commission for spare
            parts pricing
          </p>
        </div>

        {/* Models per Day Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Models per Day
          </label>
          <input
            type="number"
            name="rack_stack_models_per_day"
            value={settings.rack_stack_models_per_day || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter models per day for engineers"
            min="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: Number of models an engineer can work on per day (API
            implementation pending)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalServicesSettings;
