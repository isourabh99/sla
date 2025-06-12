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
import Suppliers from "./pages/Suppliers";
import SupplierDetails from "./pages/SupplierDetails";

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
                <Suppliers />
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
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
