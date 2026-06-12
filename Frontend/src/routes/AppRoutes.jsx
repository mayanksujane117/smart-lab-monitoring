import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import AssistantDashboard from "../pages/AssistantDashboard";
import SuperAdmin from "../pages/SuperAdmin";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import Users from "../pages/Users";
import LabDetails from "../pages/LabDetails";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {

  return (

    <Routes>

      {/* PUBLIC ROUTES */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* SUPER ADMIN */}

      <Route
        path="/super-admin"
        element={
          <ProtectedRoute
            roles={[
              "Super Admin"
            ]}
          >
            <SuperAdmin />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            roles={[
              "Admin"
            ]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN + LAB ASSISTANT */}

      <Route
        path="/assistant"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Lab Assistant"
            ]}
          >
            <AssistantDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lab/:labName"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Lab Assistant"
            ]}
          >
            <LabDetails />
          </ProtectedRoute>
        }
      />

      {/* USERS */}

      <Route
        path="/users"
        element={
          <ProtectedRoute
            roles={[
              "Admin"
            ]}
          >
            <Users />
          </ProtectedRoute>
        }
      />

      {/* INVALID ROUTE */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>

  );

}

export default AppRoutes;