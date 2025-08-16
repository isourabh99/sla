import React, { useState } from "react";
import DataTable from "../../components/DataTable";

const CountrySettings = ({ countries, onAdd, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", percentage: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => {
    setForm({ name: "", percentage: "" });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onAdd({
      name: form.name,
      percentage: parseFloat(form.percentage) || 0,
    });
    setSubmitting(false);
    if (success) {
      setShowModal(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <button
          type="button"
          className="px-4 py-2 bg-[#387DB2] text-white rounded-lg hover:bg-[#2d6a99] transition-colors duration-200"
          onClick={handleOpen}
        >
          Add Country
        </button>
      </div>
      <div className="bg-white rounded-lg">
        <DataTable
          title="Countries"
          columns={[
            { key: "name", label: "Country Name" },
            {
              key: "percentage",
              label: "Percentage",
              render: (row) => `${row.percentage}%`,
            },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <>
                  <button
                    type="button"
                    className="mr-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    Delete
                  </button>
                </>
              ),
            },
          ]}
          data={countries}
          searchable={true}
        />
      </div>
      {/* Modal for Add Country */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Country</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Country Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter country name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={form.percentage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter percentage"
                  // min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#387DB2] text-white rounded hover:bg-[#2d6a99]"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySettings;
