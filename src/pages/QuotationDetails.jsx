import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getQuotationDetails,
  assignStaff,
  assignEngineer,
  assignPartner,
  getOffersByQuotation,
  updateOfferStatus,
  approveQuotationStatus,
} from "../services/quotationController";
import { getStaffs } from "../services/staffController";
import { getApprovedEngineers } from "../services/engineersController";
import { getPartners } from "../services/partnersController";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import DataTable from "../components/DataTable";
import {
  FiArrowLeft,
  FiUser,
  FiTool,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiUserPlus,
  FiPrinter,
  FiCheck,
} from "react-icons/fi";
import { toast } from "sonner";
import slalogo from "../assets/sla-logo.png";
const QuotationDetails = () => {
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [updatingOfferStatus, setUpdatingOfferStatus] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [engineerList, setEngineerList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [offers, setOffers] = useState([]);
  const [customerAddress, setCustomerAddress] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [approving, setApproving] = useState(false);
  const { quotationId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (quotationId) {
      fetchQuotationDetails();
      fetchStaffList();
      fetchEngineerList();
      fetchPartnerList();
      fetchOffers();
    }
  }, [quotationId, token]);

  // Fetch address when quotation is loaded and has lat/lng
  useEffect(() => {
    const fetchAddress = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setCustomerAddress(data.display_name);
        } else {
          setCustomerAddress("");
        }
      } catch (err) {
        setCustomerAddress("");
      }
    };
    if (
      quotation &&
      quotation.customer &&
      quotation.customer.latitude &&
      quotation.customer.longitude
    ) {
      fetchAddress(quotation.customer.latitude, quotation.customer.longitude);
    }
  }, [quotation]);

  // Fetch service address when quotation is loaded and has lat/lng
  useEffect(() => {
    const fetchServiceAddress = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setServiceAddress(data.display_name);
        } else {
          setServiceAddress("");
        }
      } catch (err) {
        setServiceAddress("");
      }
    };
    if (quotation && quotation.latitude && quotation.longitude) {
      fetchServiceAddress(quotation.latitude, quotation.longitude);
    }
  }, [quotation]);

  const fetchQuotationDetails = async () => {
    try {
      setLoading(true);
      const response = await getQuotationDetails(token, quotationId);
      if (response && response.status && response.data) {
        console.log(response.data);
        setQuotation(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching quotation:", err);
      setError(err.message || "Failed to fetch quotation details");
      toast.error(err.message || "Failed to fetch quotation details");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await getStaffs(token);
      if (response && response.data) {
        setStaffList(response.data);
      }
    } catch (err) {
      console.error("Error fetching staff list:", err);
      toast.error(err.message || "Failed to fetch staff list");
    }
  };

  const fetchEngineerList = async () => {
    try {
      const response = await getApprovedEngineers(token, 1, quotationId);
      if (response && response.status && response.data) {
        setEngineerList(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching engineer list:", err);
      toast.error(err.message || "Failed to fetch engineer list");
    }
  };

  const fetchPartnerList = async () => {
    try {
      const response = await getPartners(token, 1, quotationId);
      // console.log(response.data);
      if (response && response.status && response.data) {
        setPartnerList(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching partner list:", err);
      toast.error(err.message || "Failed to fetch partner list");
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await getOffersByQuotation(token, quotationId);
      if (response && response.status && response.data) {
        // console.log(response.data);
        setOffers(response.data);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      toast.error(err.message || "Failed to fetch offers");
    }
  };

  const handleAssignStaff = async () => {
    try {
      setAssigning(true);
      await assignStaff(token, quotationId, selectedStaff);
      toast.success("Staff assigned successfully");
      fetchQuotationDetails(); // Refresh the quotation details
    } catch (error) {
      toast.error(error.message || "Failed to assign staff");
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignEngineer = async () => {
    try {
      setAssigning(true);
      await assignEngineer(token, quotationId, selectedEngineer);
      toast.success("Engineer assigned successfully");
      fetchQuotationDetails();
    } catch (error) {
      toast.error(error.message || "Failed to assign engineer");
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignPartner = async () => {
    try {
      setAssigning(true);
      await assignPartner(token, quotationId, selectedPartner);
      toast.success("Partner assigned successfully");
      fetchQuotationDetails();
    } catch (error) {
      toast.error(error.message || "Failed to assign partner");
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateOfferStatus = async (offerId, newStatus) => {
    try {
      setUpdatingOfferStatus(true);
      await updateOfferStatus(token, offerId, newStatus);
      toast.success(`Offer status updated to ${newStatus} successfully`);
      fetchOffers(); // Refresh the offers list
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to update offer status");
    } finally {
      setUpdatingOfferStatus(false);
    }
  };

  const handleApproveQuotation = async () => {
    try {
      setApproving(true);
      await approveQuotationStatus(token, quotationId);
      toast.success("Quotation approved successfully");
      fetchQuotationDetails();
    } catch (error) {
      toast.error(error.message || "Failed to approve quotation");
    } finally {
      setApproving(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("quotation-details");
    const originalContents = document.body.innerHTML;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation Details</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { padding: 20px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for images to load
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (loading) {
    return <Loader size="large" fullScreen />;
  }

  if (error || !quotation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {error || "Quotation not found"}
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-500">
            Quotation Details
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FiPrinter className="" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
            <FiArrowLeft className="mr-2" />
            Back to Quotations
          </button>
        </div>
      </div>

      <div id="quotation-details" className="bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={slalogo} alt="SLA Logo" className="h-8 w-auto" />
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold text-gray-900">
                    Quotation #{quotation.id}
                  </h1>
                  {quotation.serial_number && (
                    <span className="text-sm text-gray-500">
                      (SN: {quotation.serial_number})
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-0.5">
                  {new Date(quotation.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2" />
                Customer Information
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium capitalize ${
                      quotation.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : quotation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-emerald-100 text-gray-800"
                    }`}
                  >
                    {quotation.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {quotation.customer?.name} {quotation.customer?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">
                    {quotation.customer?.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">
                    {quotation.customer?.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Address:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {customerAddress
                      ? customerAddress
                      : quotation.customer?.latitude &&
                        quotation.customer?.longitude
                      ? `${quotation.customer.latitude}, ${quotation.customer.longitude}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTool className="mr-2" />
                Service Information
              </h2>
              <div className="space-y-2">
                {quotation.quotation_type && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Quotation Type:
                    </span>
                    <span className="font-medium text-gray-900 capitalize">
                      {quotation.quotation_type}
                    </span>
                  </div>
                )}
                {quotation.service_category && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Service Category:
                    </span>
                    <span className="font-medium text-gray-900 capitalize">
                      {quotation.service_category}
                    </span>
                  </div>
                )}
                {quotation.service_type && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Service Type:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {quotation.service_type}
                    </span>
                  </div>
                )}
                {quotation.support_type && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Support Type:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {quotation.support_type}
                    </span>
                  </div>
                )}
                {quotation.slatype && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">SLA Type:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {quotation.slatype.name}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Description:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {quotation.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Address:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {serviceAddress
                      ? serviceAddress
                      : quotation.latitude && quotation.longitude
                      ? `${quotation.latitude}, ${quotation.longitude}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Models Table */}
            <div className="bg-gray-50 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Models
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/models")}
                    className="flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Go to Models
                  </button>
                </div>
              </div>
              <DataTable
                title=""
                columns={[
                  {
                    key: "name",
                    label: "Model Name",
                    render: (model) => model.name,
                  },
                  {
                    key: "quantity",
                    label: "Quantity",
                    render: (model) => parseInt(model.quantity) || 0,
                  },
                  {
                    key: "price",
                    label: "Unit Price",
                    render: (model) =>
                      `$${parseFloat(model.price || 0).toLocaleString()}`,
                  },
                  {
                    key: "total",
                    label: "Total Price",
                    render: (model) => {
                      const unitPrice = parseFloat(model.price) || 0;
                      const quantity = parseInt(model.quantity) || 0;
                      const totalPrice = unitPrice * quantity;
                      return (
                        <span className="font-medium text-emerald-700">
                          ${totalPrice.toLocaleString()}
                        </span>
                      );
                    },
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (model) => {
                      const status = model.status;
                      return (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {status === 1 ? "Approved" : "Pending"}
                        </span>
                      );
                    },
                  },
                ]}
                data={
                  Array.isArray(quotation.models)
                    ? quotation.models
                    : (() => {
                        try {
                          return JSON.parse(quotation.models);
                        } catch {
                          return [];
                        }
                      })()
                }
                loading={false}
                searchable={false}
                className=""
              />
            </div>

            {/* Spare Parts Table */}
            <div className="bg-gray-50 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Spare Parts
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/spare-parts")}
                    className="flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Go to Spare Parts
                  </button>
                </div>
              </div>
              <DataTable
                title=""
                columns={[
                  {
                    key: "spare_part",
                    label: "Part Name",
                    render: (part) => part.name || "N/A",
                  },
                  {
                    key: "quantity",
                    label: "Quantity",
                    render: (part) => part.quantity,
                  },
                  {
                    key: "unit_price",
                    label: "Unit Price",
                    render: (part) =>
                      `$${parseFloat(part.unit_price || 0).toLocaleString()}`,
                  },
                  {
                    key: "total_price",
                    label: "Total Price",
                    render: (part) =>
                      `$${parseFloat(part.total_price || 0).toLocaleString()}`,
                  },
                ]}
                data={quotation.spare_parts || []}
                loading={false}
                searchable={false}
                className=""
              />
            </div>

            {/* Team Assignment */}
            <div className="bg-gray-50 rounded-lg p-4 no-print">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="mr-2" />
                Team Assignment
              </h2>
              <div className="space-y-4">
                {/* Staff Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Staff
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Staff</option>
                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} {staff.last_name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignStaff}
                      disabled={!selectedStaff || assigning}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <FiUserPlus className="mr-2" />
                      Assign
                    </button>
                  </div>
                </div>

                {/* Engineer Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Engineer
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedEngineer}
                      onChange={(e) => setSelectedEngineer(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Engineer</option>
                      {engineerList.map((engineer) => (
                        <option key={engineer.id} value={engineer.id}>
                          {engineer.name} {engineer.last_name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignEngineer}
                      disabled={!selectedEngineer || assigning}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <FiUserPlus className="mr-2" />
                      Assign
                    </button>
                  </div>
                </div>

                {/* Partner Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Partner
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedPartner}
                      onChange={(e) => setSelectedPartner(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Partner</option>
                      {partnerList.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name} {partner.last_name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignPartner}
                      disabled={!selectedPartner || assigning}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <FiUserPlus className="mr-2" />
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Team Information */}
            <div className="bg-gray-50 rounded-lg p-4 no-print">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="mr-2" />
                Assigned Team
              </h2>
              <div className="space-y-4">
                {quotation.staff && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Staff
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900">
                        {quotation.staff.name} {quotation.staff.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">
                        {quotation.staff.email}
                      </span>
                    </div>
                  </div>
                )}

                {quotation.engineer && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Engineer
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900">
                        {quotation.engineer.name} {quotation.engineer.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">
                        {quotation.engineer.email}
                      </span>
                    </div>
                  </div>
                )}

                {quotation.partner && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Partner
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900">
                        {quotation.partner.name} {quotation.partner.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">
                        {quotation.partner.email}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Offers Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiDollarSign className="mr-2" />
                Negotiation Offers
              </h2>
              {offers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Staff
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th> */}
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Note
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {offers.map((offer) => (
                        <tr key={offer.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <div className="flex items-center">
                              {offer.staff.profile_picture && (
                                <img
                                  src={offer.staff.profile_picture}
                                  alt={offer.staff.name}
                                  className="h-8 w-8 rounded-full mr-2"
                                />
                              )}
                              <div>
                                <div className="font-medium">
                                  {offer.staff.name} {offer.staff.last_name}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {offer.staff.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            ${parseFloat(offer.offered_amount).toLocaleString()}
                          </td>
                          {/* <td className="px-4 py-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                offer.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : offer.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {offer.status}
                            </span>
                          </td> */}
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {offer.note}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex gap-2">
                              {offer.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateOfferStatus(
                                        offer.id,
                                        "approved"
                                      )
                                    }
                                    disabled={updatingOfferStatus}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {updatingOfferStatus
                                      ? "Updating..."
                                      : "Approve"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateOfferStatus(
                                        offer.id,
                                        "rejected"
                                      )
                                    }
                                    disabled={updatingOfferStatus}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {updatingOfferStatus
                                      ? "Updating..."
                                      : "Reject"}
                                  </button>
                                </>
                              )}
                              {offer.status === "approved" && (
                                <span className="text-xs text-green-600 font-medium">
                                  ✓ Approved
                                </span>
                              )}
                              {offer.status === "rejected" && (
                                <span className="text-xs text-red-600 font-medium">
                                  ✗ Rejected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No offers have been made yet.
                </div>
              )}
            </div>
            {/* Quotation Info Section at the end, styled like other sections */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                  Pricing Breakdown
                </h2>
              </div>

              <div className="p-4">
                {quotation.service_category &&
                  quotation.service_Category_type_price &&
                  parseFloat(quotation.service_Category_type_price) > 0 && (
                    <div className="flex justify-between items-center py-2 px-3 bg-orange-50 rounded-md mb-2">
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            Service Category
                          </span>
                          <p className="text-xs text-gray-500 font-semibold">
                            {quotation.service_category}{" "}
                            {quotation.service_Category_type_price}$ ×{" "}
                            {quotation.estimated_Working_days || 1} days
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-orange-700">
                        +$
                        {(
                          parseFloat(quotation.service_Category_type_price) *
                          parseFloat(quotation.estimated_Working_days || 1)
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                {/* Base Amount */}
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Base Amount
                      </span>
                      <p className="text-xs text-gray-600">
                        <span className="text-xs text-gray-500 font-semibold">
                          Inclusive of service category charge and equipment
                          cost
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    ${parseFloat(quotation.estimated_amount).toLocaleString()}
                  </span>
                </div>

                {/* Additional Services - Compact */}
                {(quotation.service_category ||
                  quotation.service_type ||
                  quotation.support_type ||
                  quotation.slatype) && (
                  <div className="mt-3 space-y-2">
                    {/* Service Type */}
                    {quotation.service_type &&
                      quotation.service_type_price &&
                      parseFloat(quotation.service_type_price) > 0 && (
                        <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              Service Type
                            </p>
                            <p className="text-xs text-gray-500 font-semibold ml-2">
                              {`(${quotation.service_type})`}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-blue-700">
                            +$
                            {parseFloat(
                              quotation.service_type_price
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                    {/* Support Type */}
                    {quotation.support_type &&
                      quotation.support_type_price &&
                      parseFloat(quotation.support_type_price) > 0 && (
                        <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              Support Type
                            </p>
                            <p className="text-xs text-gray-500 font-semibold ml-2">
                              {`(${quotation.support_type})`}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-green-700">
                            +$
                            {parseFloat(
                              quotation.support_type_price
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                    {/* SLA Percentage */}
                    {quotation.slatype?.percentage &&
                      parseFloat(quotation.slatype.percentage) > 0 && (
                        <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium text-gray-900">
                              SLA Percentage
                            </span>
                            <p className="text-xs text-gray-500 font-semibold ml-2">
                              {`(${quotation.slatype.percentage}%)`}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-purple-700">
                            $
                            {(
                              quotation.estimated_amount *
                              (quotation.slatype.percentage / 100)
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                    {/* Country Tax */}
                    {(() => {
                      const baseAmount = parseFloat(
                        quotation.estimated_amount || 0
                      );
                      const servicePrice = parseFloat(
                        quotation.service_type_price || 0
                      );
                      const supportPrice = parseFloat(
                        quotation.support_type_price || 0
                      );
                      const slaAmount =
                        baseAmount *
                        (parseFloat(quotation.slatype?.percentage || 0) / 100);
                      const countryTaxRate =
                        parseFloat(quotation.country_percentage || 0) / 100;

                      let taxableAmount = 0;

                      if (quotation.quotation_type === "maintenance") {
                        taxableAmount =
                          (baseAmount +
                            servicePrice +
                            supportPrice +
                            slaAmount) *
                          countryTaxRate;
                      } else if (
                        quotation.quotation_type === "software_cloud"
                      ) {
                        taxableAmount = baseAmount * countryTaxRate;
                      } else if (
                        quotation.quotation_type === "professional_service"
                      ) {
                        taxableAmount = countryTaxRate;
                      }

                      // Show country tax section if country exists, even if percentage is 0
                      return quotation.country ? (
                        <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                            <div>
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                Country tax
                              </span>
                              <p className="text-xs text-gray-500 font-semibold">
                                {quotation.country} (
                                {quotation.country_percentage}%)
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-red-700">
                            ${taxableAmount.toLocaleString()}
                          </span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Total Calculation - Compact */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      ${parseFloat(quotation.final_amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Section - Compact */}
                <div className="mt-3 flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    {quotation.approved_status === 1 ? (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Approved
                        </span>
                      </div>
                    ) : quotation.approved_status === 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⏳ Pending
                          </span>
                        </div>
                        <button
                          onClick={handleApproveQuotation}
                          disabled={approving}
                          className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                          title="Approve Quotation"
                        >
                          {approving ? (
                            <span>...</span>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                              Approve
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          ? Unknown
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;
