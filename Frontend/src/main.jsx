import React from "react";

import ReactDOM from "react-dom/client";

import {

  BrowserRouter,
  Routes,
  Route,

} from "react-router-dom";

import "./index.css";

import App from "./App";

import Login from "./pages/Login";

import Register from "./pages/Register";

import ForgotPassword from "./pages/ForgotPassword";

ReactDOM.createRoot(

  document.getElementById("root")

).render(

  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        {/* DASHBOARD */}

        <Route

          path="/"

          element={<App />}

        />

        {/* LOGIN */}

        <Route

          path="/login"

          element={<Login />}

        />

        {/* REGISTER */}

        <Route

          path="/register"

          element={<Register />}

        />

        {/* FORGOT PASSWORD */}

        <Route

          path="/forgot-password"

          element={

            <ForgotPassword />

          }

        />

      </Routes>

    </BrowserRouter>

  </React.StrictMode>

);