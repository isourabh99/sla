import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  getBusinessSettings,
  updateBusinessSettings,
} from "../services/businessSettingsController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import BusinessInfoSettings from "./business-settings/BusinessInfoSettings";
import MaintenanceSettings from "./business-settings/MaintenanceSettings";
import ProfessionalServicesSettings from "./business-settings/ProfessionalServicesSettings";
import ProfessionalServicesList from "./business-settings/ProfessionalServicesList";
import SoftwareCloudSettings from "./business-settings/SoftwareCloudSettings";
import TermsConditionsSettings from "./business-settings/TermsConditionsSettings";
import {
  getSoftwareCloudServices,
  addSoftwareCloudService,
  updateSoftwareCloudService,
  deleteSoftwareCloudService,
} from "../services/softwareCloudServiceController";
import {
  getProfessionalServices,
  addProfessionalService,
  updateProfessionalService,
  deleteProfessionalService,
} from "../services/professionalServiceController";
import { getTerms, storeTerms } from "../services/termsController";

const TABS = {
  BUSINESS_INFO: "Business Info",
  MAINTENANCE: "Maintenance",
  PROFESSIONAL_SERVICES: "Professional Services",
  SOFTWARE_CLOUD: "Software & Cloud Services",
  TERMS_CONDITIONS: "Terms & Conditions",
};

const BusinessSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    server: "",
    networking: "",
    storage: "",
    onsite: "",
    remote: "",
    sla_commission: "",
  });
  const [activeTab, setActiveTab] = useState(TABS.BUSINESS_INFO);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: 2,
    price: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deletingService, setDeletingService] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [termsContent, setTermsContent] = useState("");

  // Professional Services state
  const [professionalServices, setProfessionalServices] = useState([]);
  const [editingProfessionalService, setEditingProfessionalService] =
    useState(null);
  const [editProfessionalForm, setEditProfessionalForm] = useState({
    name: "",
    price: "",
  });
  const [editProfessionalSubmitting, setEditProfessionalSubmitting] =
    useState(false);
  const [deletingProfessionalService, setDeletingProfessionalService] =
    useState(null);
  const [deleteProfessionalSubmitting, setDeleteProfessionalSubmitting] =
    useState(false);

  useEffect(() => {
    fetchSettings();
    fetchServices();
    fetchProfessionalServices();
    fetchTerms();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await getBusinessSettings(token);
      if (response.status) {
        setSettings(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await getSoftwareCloudServices(token);
      if (response.status) {
        setServices(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch software/cloud services");
    }
  };

  const fetchProfessionalServices = async () => {
    try {
      const response = await getProfessionalServices(token);
      if (response.status) {
        setProfessionalServices(response.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch professional services");
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await getTerms(token);
      if (response.status) {
        setTermsContent(response.data?.content || "");
      }
    } catch (error) {
      toast.error("Failed to fetch terms and conditions");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await updateBusinessSettings(token, settings);
      if (response.status) {
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async (serviceData) => {
    console.log("Sending serviceData to API:", serviceData);
    try {
      const response = await addSoftwareCloudService(serviceData, token);
      console.log("API response:", response);
      if (response.status) {
        toast.success("Service added successfully");
        fetchServices();
        return true;
      } else {
        toast.error(response.message || "Failed to add service");
        return false;
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to add service");
      return false;
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setEditForm({
      name: service.name,
      category: service.category,
      price: service.price,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const response = await updateSoftwareCloudService(
        editingService.id,
        {
          name: editForm.name,
          category: Number(editForm.category),
          price: parseFloat(editForm.price) || 0,
        },
        token
      );
      if (response.status) {
        toast.success("Service updated successfully");
        setEditingService(null);
        fetchServices();
      } else {
        toast.error(response.message || "Failed to update service");
      }
    } catch (error) {
      toast.error("Failed to update service");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleEditModalClose = () => {
    setEditingService(null);
  };

  const handleDeleteService = (service) => {
    setDeletingService(service);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    setDeleteSubmitting(true);
    try {
      const response = await deleteSoftwareCloudService(
        deletingService.id,
        {
          name: deletingService.name,
          category: deletingService.category,
          price: deletingService.price,
        },
        token
      );
      if (response.status) {
        toast.success("Service deleted successfully");
        setDeletingService(null);
        fetchServices();
      } else {
        toast.error(response.message || "Failed to delete service");
      }
    } catch (error) {
      toast.error("Failed to delete service");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleDeleteModalClose = () => {
    setDeletingService(null);
  };

  const handleTermsChange = (e) => {
    const { name, value } = e.target;
    if (name === "terms_content") {
      setTermsContent(value);
    }
  };

  const handleTermsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await storeTerms(token, termsContent);
      if (response.status) {
        toast.success("Terms and conditions updated successfully");
      } else {
        toast.error(
          response.message || "Failed to update terms and conditions"
        );
      }
    } catch (error) {
      toast.error("Failed to update terms and conditions");
    } finally {
      setSaving(false);
    }
  };

  // Professional Services handlers
  const handleAddProfessionalService = async (serviceData) => {
    try {
      const response = await addProfessionalService(serviceData, token);
      if (response.status) {
        toast.success("Professional service added successfully");
        fetchProfessionalServices();
        return true;
      } else {
        toast.error(response.message || "Failed to add professional service");
        return false;
      }
    } catch (error) {
      toast.error("Failed to add professional service");
      return false;
    }
  };

  const handleEditProfessionalService = (service) => {
    setEditingProfessionalService(service);
    setEditProfessionalForm({
      name: service.name,
      price: service.price.toString(),
    });
  };

  const handleEditProfessionalFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfessionalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProfessionalFormSubmit = async (e) => {
    e.preventDefault();
    setEditProfessionalSubmitting(true);
    try {
      const response = await updateProfessionalService(
        editingProfessionalService.id,
        {
          name: editProfessionalForm.name,
          price: parseFloat(editProfessionalForm.price) || 0,
        },
        token
      );
      if (response.status) {
        toast.success("Professional service updated successfully");
        setEditingProfessionalService(null);
        fetchProfessionalServices();
      } else {
        toast.error(
          response.message || "Failed to update professional service"
        );
      }
    } catch (error) {
      toast.error("Failed to update professional service");
    } finally {
      setEditProfessionalSubmitting(false);
    }
  };

  const handleEditProfessionalModalClose = () => {
    setEditingProfessionalService(null);
  };

  const handleDeleteProfessionalService = (service) => {
    setDeletingProfessionalService(service);
  };

  const handleDeleteProfessionalConfirm = async () => {
    if (!deletingProfessionalService) return;
    setDeleteProfessionalSubmitting(true);
    try {
      const response = await deleteProfessionalService(
        deletingProfessionalService.id,
        token
      );
      if (response.status) {
        toast.success("Professional service deleted successfully");
        setDeletingProfessionalService(null);
        fetchProfessionalServices();
      } else {
        toast.error(
          response.message || "Failed to delete professional service"
        );
      }
    } catch (error) {
      toast.error("Failed to delete professional service");
    } finally {
      setDeleteProfessionalSubmitting(false);
    }
  };

  const handleDeleteProfessionalModalClose = () => {
    setDeletingProfessionalService(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.BUSINESS_INFO:
        return (
          <BusinessInfoSettings
            settings={settings}
            handleChange={handleChange}
          />
        );
      case TABS.MAINTENANCE:
        return (
          <MaintenanceSettings
            settings={settings}
            handleChange={handleChange}
          />
        );
      case TABS.PROFESSIONAL_SERVICES:
        return (
          <ProfessionalServicesSettings
            settings={settings}
            handleChange={handleChange}
          />
        );
      case TABS.SOFTWARE_CLOUD:
        return (
          <SoftwareCloudSettings
            services={services}
            onAdd={handleAddService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        );
      case TABS.TERMS_CONDITIONS:
        return (
          <TermsConditionsSettings
            termsContent={termsContent}
            handleChange={handleTermsChange}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] p-2 md:p-4">
      <div className="w-full bg-white rounded-xl shadow p-2 md:p-8 ">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
          <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
          <h1 className="text-base md:text-xl font-semibold text-gray-500">
            Settings{" "}
            <span className="text-xs md:text-base">• Business Setting</span>
          </h1>
        </div>

        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <nav
            className="-mb-px flex flex-nowrap space-x-4 md:space-x-6"
            aria-label="Tabs"
          >
            {Object.values(TABS).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`$${
                  activeTab === tab
                    ? "border-[#387DB2] text-[#387DB2]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-3 px-2 md:px-4 border-b-2 font-medium text-sm transition-all`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === TABS.BUSINESS_INFO || activeTab === TABS.MAINTENANCE ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderContent()}
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-6 py-2 bg-[#387DB2] text-white rounded-lg hover:bg-[#2d6a99] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
        ) : activeTab === TABS.PROFESSIONAL_SERVICES ? (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <ProfessionalServicesSettings
                settings={settings}
                handleChange={handleChange}
                onSubmit={handleSubmit}
                saving={saving}
              />
            </form>
            <ProfessionalServicesList
              services={professionalServices}
              onAdd={handleAddProfessionalService}
              onEdit={handleEditProfessionalService}
              onDelete={handleDeleteProfessionalService}
            />
          </div>
        ) : activeTab === TABS.TERMS_CONDITIONS ? (
          <form onSubmit={handleTermsSubmit} className="space-y-4">
            {renderContent()}
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-6 py-2 bg-[#387DB2] text-white rounded-lg hover:bg-[#2d6a99] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
        ) : (
          renderContent()
        )}
      </div>

      {editingService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
            <form onSubmit={handleEditFormSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
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
                  value={editForm.category}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value={1}>Database</option>
                  <option value={2}>Application</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full sm:w-auto"
                  onClick={handleEditModalClose}
                  disabled={editSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#387DB2] text-white rounded hover:bg-[#2d6a99] w-full sm:w-auto"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete Service</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{deletingService.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full sm:w-auto"
                onClick={handleDeleteModalClose}
                disabled={deleteSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                onClick={handleDeleteConfirm}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Services Edit Modal */}
      {editingProfessionalService && (
        <div className="fixed inset-2 flex items-center justify-center bg-black/50 bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Edit Professional Service
            </h3>
            <form
              onSubmit={handleEditProfessionalFormSubmit}
              className="space-y-4"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editProfessionalForm.name}
                  onChange={handleEditProfessionalFormChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editProfessionalForm.price}
                  onChange={handleEditProfessionalFormChange}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full sm:w-auto"
                  onClick={handleEditProfessionalModalClose}
                  disabled={editProfessionalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#387DB2] text-white rounded hover:bg-[#2d6a99] w-full sm:w-auto"
                  disabled={editProfessionalSubmitting}
                >
                  {editProfessionalSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professional Services Delete Modal */}
      {deletingProfessionalService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Delete Professional Service
            </h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                {deletingProfessionalService.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full sm:w-auto"
                onClick={handleDeleteProfessionalModalClose}
                disabled={deleteProfessionalSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                onClick={handleDeleteProfessionalConfirm}
                disabled={deleteProfessionalSubmitting}
              >
                {deleteProfessionalSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSettings;
