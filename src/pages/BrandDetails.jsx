import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSLAById, updateSLA } from "../services/brandController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "sonner";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { FiUpload, FiX } from "react-icons/fi";

const BrandDetails = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [brandDetails, setBrandDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    slatype_id: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchBrandDetails = async () => {
    try {
      setLoading(true);
      const response = await getBrandById(token, brandId);
      setBrandDetails(response.data);
      setFormData({
        name: response.data.name,
        slatype_id: brandId,
        image: null,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandDetails();
  }, [brandId, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      // Check file type
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: files,
      }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a brand name");
      return;
    }

    setUpdateLoading(true);
    try {
      const updateData = [
        { key: "name", value: formData.name, type: "text" },
        { key: "slatype_id", value: formData.slatype_id, type: "text" },
      ];

      if (formData.image) {
        updateData.push({
          key: "image",
          type: "file",
          value: [formData.image[0]],
        });
      }

      await updateSLA(updateData, token);
      await fetchBrandDetails();
      setIsEditing(false);
      toast.success("Brand updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update brand");
    } finally {
      setUpdateLoading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setPreviewImage(null);
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!brandDetails) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600">Brand not found</p>
        </div>
      </div>
    );
  }

  // Custom UI for brand details
  return (
    <div className="p-4 bg-gray-50 ">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-500">Brand Details</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full max-w-xl mx-auto">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">ID:</span>
            <span className="ml-2 text-lg text-gray-900">
              {brandDetails.id}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <span className="ml-2 text-lg text-gray-900">
              {brandDetails.name}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Percentage:
            </span>
            <span className="ml-2 text-lg text-gray-900">
              {brandDetails.percentage}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="ml-2 text-lg text-gray-900">
              {brandDetails.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Created At:
            </span>
            <span className="ml-2 text-lg text-gray-900">
              {new Date(brandDetails.created_at).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Updated At:
            </span>
            <span className="ml-2 text-lg text-gray-900">
              {new Date(brandDetails.updated_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetails;
