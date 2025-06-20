import React, { useState, useEffect } from "react";
import { getAllSparePartDetails } from "../services/sparepartsController";
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import defaultSpare from "../assets/defaultspare.jpg";
import defaultDp from "../assets/defaultdp2.jpg";
const SpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        setLoading(true);
        const response = await getAllSparePartDetails(token);
        if (response && response.status && response.data) {
          setSpareParts(response.data);
        } else {
          setSpareParts([]);
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch spare parts");
        setSpareParts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSpareParts();
  }, [token]);

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={row.image || defaultSpare}
          alt={row.name}
          className="h-12 w-12 object-cover rounded"
        />
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
      key: "supplier",
      label: "Supplier",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <img
            src={row.supplier?.profile_picture || defaultDp}
            alt={row.supplier?.name}
            className="h-8 w-8 object-cover rounded-full border"
            onError={(e) => (e.target.src = defaultDp)}
          />
          <div>
            <div className="font-medium">{row.supplier?.name}</div>
            <div className="text-xs text-gray-500">{row.supplier?.email}</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      {loading ? (
        <Loader size="large" fullScreen />
      ) : (
        <DataTable
          title="Spare Parts Management"
          subtitle="Spare Parts List"
          columns={columns}
          data={spareParts}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default SpareParts;
