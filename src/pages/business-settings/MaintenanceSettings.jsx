import React from "react";

const MaintenanceSettings = ({ settings, handleChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Maintenance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Server Price
          </label>
          <input
            type="number"
            name="server"
            value={settings.server || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter server price"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Networking Price
          </label>
          <input
            type="number"
            name="networking"
            value={settings.networking || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter networking price"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Storage Price
          </label>
          <input
            type="number"
            name="storage"
            value={settings.storage || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter storage price"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Onsite Price
          </label>
          <input
            type="number"
            name="onsite"
            value={settings.onsite || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter onsite price"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remote Price
          </label>
          <input
            type="number"
            name="remote"
            value={settings.remote || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
            placeholder="Enter remote price"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSettings;
