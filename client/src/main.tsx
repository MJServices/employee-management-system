import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/Home/Home";
import Logincomponent from "./components/Login/Logincomponent";
import Dashbard from "./components/Dashboard/Dashbard";
import SignUpComponent from "./components/Create/createSignup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Logincomponent/>,
      },
      {
        path: "/dashboard",
        element: <Dashbard/>,
      },
      {
        path: "/create",
        element: <SignUpComponent/>
      },
      {
        path: "/home",
       element: <Home/>,
      }
    ]
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}/> 
  </StrictMode>
);
