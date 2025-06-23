import React, { useState, useEffect } from "react";
import {
  getSupplierSpareParts,
  getCustomerSpareParts,
  updateCustomerSparePart,
} from "../services/sparepartsController";
import { getBrandsForModel } from "../services/modelController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import defaultSpare from "../assets/defaultspare.jpg";
import defaultDp from "../assets/defaultdp2.jpg";
import { toast } from "sonner";
import { FiEdit2 } from "react-icons/fi";

const SpareParts = () => {
  const [activeTab, setActiveTab] = useState("supplier");
  const [supplierSpareParts, setSupplierSpareParts] = useState([]);
  const [customerSpareParts, setCustomerSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSparePart, setEditingSparePart] = useState(null);
  const [editFormData, setEditFormData] = useState({
    description: "",
    price: "",
    brand_id: "",
  });
  const [updating, setUpdating] = useState(false);
  const [brands, setBrands] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchSpareParts();
    fetchBrands();
  }, [token, activeTab]);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      let response;

      if (activeTab === "supplier") {
        response = await getSupplierSpareParts(token);
      } else {
        response = await getCustomerSpareParts(token);
      }

      let sparePartsData = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        sparePartsData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        sparePartsData = response.data;
      } else if (response && Array.isArray(response)) {
        sparePartsData = response;
      }

      if (activeTab === "supplier") {
        setSupplierSpareParts(sparePartsData);
      } else {
        setCustomerSpareParts(sparePartsData);
      }

      setError(null);
    } catch (err) {
      setError(err.message || `Failed to fetch ${activeTab} spare parts`);
      if (activeTab === "supplier") {
        setSupplierSpareParts([]);
      } else {
        setCustomerSpareParts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrandsForModel(token);
      setBrands(response.data || []);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    }
  };

  const handleEdit = (sparePart) => {
    setEditingSparePart(sparePart);
    setEditFormData({
      description: sparePart.description || "",
      price: sparePart.price || "",
      brand_id: sparePart.brand?.id || "",
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (
      !editFormData.description ||
      !editFormData.price ||
      !editFormData.brand_id
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setUpdating(true);
    try {
      await updateCustomerSparePart(token, editingSparePart.id, editFormData);
      toast.success("Spare part updated successfully");
      setEditModalOpen(false);
      setEditingSparePart(null);
      setEditFormData({ description: "", price: "", brand_id: "" });
      // Refresh the data
      fetchSpareParts();
    } catch (err) {
      toast.error(err.message || "Failed to update spare part");
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditingSparePart(null);
    setEditFormData({ description: "", price: "", brand_id: "" });
    setError(null);
  };

  const columns = [
    {
      key: "sno",
      label: "S.No.",
      render: (row, index) => (
        <span className="text-gray-600 font-medium">{index + 1}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row) => <span className="text-gray-700">{row.description}</span>,
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <span className="text-blue-600 font-semibold">₹{row.price}</span>
      ),
    },
    {
      key: "brand",
      label: "Brand",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <img
            src={row.brand?.image}
            alt={row.brand?.name}
            className="h-8 w-8 object-cover rounded-full border"
            onError={(e) => (e.target.src = defaultSpare)}
          />
          <span>{row.brand?.name}</span>
        </div>
      ),
    },
    {
      key: "user",
      label: activeTab === "supplier" ? "Supplier" : "Customer",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <img
            src={
              row.supplier?.profile_picture ||
              row.customer?.profile_picture ||
              defaultDp
            }
            alt={row.supplier?.name || row.customer?.name}
            className="h-8 w-8 object-cover rounded-full border"
            onError={(e) => (e.target.src = defaultDp)}
          />
          <div>
            <div className="font-medium">
              {row.supplier?.name || row.customer?.name}
            </div>
            <div className="text-xs text-gray-500">
              {row.supplier?.email || row.customer?.email}
            </div>
          </div>
        </div>
      ),
    },
    // Only show actions column for customer spare parts
    ...(activeTab === "customer"
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const currentData =
    activeTab === "supplier" ? supplierSpareParts : customerSpareParts;

  return (
    <div className="">
      <div className="flex space-x-6 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab("supplier")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "supplier"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Available Spare Parts
        </button>
        <button
          onClick={() => setActiveTab("customer")}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === "customer"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Spare Parts reqested by Customers
        </button>
      </div>

      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <DataTable
          title="Spare Parts Management"
          subtitle={`${
            activeTab === "supplier" ? "Supplier" : "Customer"
          } Spare Parts List`}
          columns={columns}
          data={currentData}
          loading={loading}
          error={error}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Spare Part</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={editFormData.brand_id}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      brand_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update"}
              </button>
              <button
                onClick={handleCloseEdit}
                disabled={updating}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpareParts;
