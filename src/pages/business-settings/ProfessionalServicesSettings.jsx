import React from "react";
import { motion } from "framer-motion";

const ProfessionalServicesSettings = ({
  settings,
  handleChange,
  onSubmit,
  saving,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Professional Services Setting
      </h2>

      {/* SLA Commission Field with Save Button */}
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
        </div>
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            onClick={onSubmit}
            disabled={saving}
            className="w-full md:w-auto px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-[#2d6a99] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalServicesSettings;
