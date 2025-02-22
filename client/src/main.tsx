import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/Home/Home.tsx";
import Logincomponent from "./components/Login/Logincomponent.tsx";
import AdminDashboard from "./components/Dashboard/Dashbard.tsx";
import SignUpComponent from "./components/Create/createSignup.tsx";
import ProgressPage from "./components/Progress/ProgressPage.tsx";
import DashboardLayout from "./components/Dashboard/DashboardLayout.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Logincomponent />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout>,
          <AdminDashboard />
        </DashboardLayout>,
      },
      {
        path: "/progress",
        element: <DashboardLayout>
          <ProgressPage />
        </DashboardLayout>,
      },
      {
        path: "/create",
        element: <SignUpComponent />
      },
      {
        path: "/home",
        element: <Home />,
      }
    ]
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} /> 
  </StrictMode>
);