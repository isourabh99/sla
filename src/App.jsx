import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateStaff from "./pages/CreateStaff";
import StaffList from "./pages/StaffList";
import StaffDetails from "./pages/StaffDetails";
import Layout from "./layout/Layout";
import { Toaster } from "sonner";
import CreateBrand from "./pages/CreateBrand";
import BrandList from "./pages/BrandList";
import BrandDetails from "./pages/BrandDetails";
import CreateModel from "./pages/CreateModel";
import ModelList from "./pages/ModelList";
import CreateExpertise from "./pages/CreateExpertise";
import ExpertiseList from "./pages/ExpertiseList";
import SuppliersList from "./pages/SuppliersList";
import SupplierDetails from "./pages/SupplierDetails";
import EngineersList from "./pages/EngineersList";
import EngineerDetails from "./pages/EngineerDetails";
import EditEngineer from "./pages/EditEngineer";
import PartnersList from "./pages/PartnersList";
import PartnerDetails from "./pages/PartnerDetails";
import EditPartner from "./pages/EditPartner";
import BusinessSettings from "./pages/BusinessSettings";
import Quotations from "./pages/Quotations";
import QuotationDetails from "./pages/QuotationDetails";
import SpareParts from "./pages/SpareParts";
import ContactQueries from "./pages/ContactQueries";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Staff Management Routes */}
        <Route
          path="/staff/create"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <CreateStaff />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <StaffList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/:staffId"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <StaffDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/create"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <CreateBrand />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <BrandList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/:brandId"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <BrandDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/models/create"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <CreateModel />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/models"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <ModelList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expertise/create"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <CreateExpertise />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expertise"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <ExpertiseList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <SuppliersList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers/:supplierId"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <SupplierDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineers"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <EngineersList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineers/:engineerId"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <EngineerDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineers/:engineerId/edit"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <EditEngineer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <PartnersList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners/:partnerId"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <PartnerDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners/:partnerId/edit"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <EditPartner />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Business Settings Route */}
        <Route
          path="/business-settings"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <BusinessSettings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Quotations Routes */}
        <Route
          path="/quotations"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <Quotations />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quotations/:quotationId"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <QuotationDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Spare Parts Route */}
        <Route
          path="/spare-parts"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <SpareParts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-queries"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <ContactQueries />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Notifications Route */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard for any other route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
