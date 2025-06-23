import React, { useState } from "react";
import DataTable from "../../components/DataTable";

const CATEGORY_OPTIONS = [
  { value: 1, label: "Database" },
  { value: 2, label: "Application" },
];

const SoftwareCloudSettings = ({ services, onAdd, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: 2,
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => {
    setForm({ name: "", category: 2, price: "" });
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
      category: Number(form.category),
      price: parseFloat(form.price) || 0,
    });
    setSubmitting(false);
    if (success) {
      setShowModal(false);
    }
  };

  return (
    <div className="mb-8">
      {/* <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Software & Cloud Services
      </h2> */}
      <div className="mb-4">
        <button
          type="button"
          className="px-4 py-2 bg-[#387DB2] text-white rounded-lg hover:bg-[#2d6a99] transition-colors duration-200"
          onClick={handleOpen}
        >
          Add Service
        </button>
      </div>
      <div className="bg-white rounded-lg">
        <DataTable
          title="Software & Cloud Services"
          columns={[
            { key: "name", label: "Name" },
            {
              key: "category",
              label: "Category",
              render: (row) =>
                CATEGORY_OPTIONS.find((c) => c.value === row.category)?.label ||
                row.category,
            },
            { key: "price", label: "Price" },
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
          data={services}
          searchable={true}
        />
      </div>
      {/* Modal for Add Service */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Service</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
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

export default SoftwareCloudSettings;
