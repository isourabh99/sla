import React from "react";

const ProfessionalServicesSettings = ({ settings, handleChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Professional Services Setting
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  );
};

export default ProfessionalServicesSettings;
