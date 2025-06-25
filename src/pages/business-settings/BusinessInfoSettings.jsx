import React from "react";

const BusinessInfoSettings = ({ settings, handleChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Business Info
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            name="business_name"
            value={settings.business_name || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter business name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Email
          </label>
          <input
            type="email"
            name="business_email"
            value={settings.business_email || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter business email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Phone
          </label>
          <input
            type="tel"
            name="business_phone"
            value={settings.business_phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter business phone"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address
          </label>
          <input
            type="tel"
            name="address"
            value={settings.address || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter business address"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoSettings;
