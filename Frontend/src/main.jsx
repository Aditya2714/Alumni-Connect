import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store";
import store from "./store/store";
import Register from "./pages/Register.jsx";
import Layout from "./Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Home from "./Components/Home.jsx";
import Event from "./Components/Event.jsx";
import Jobs from "./Components/Jobs.jsx";
import Newsletter from "./Components/NewsLetter.jsx";
import SendMail from "./Components/SendMail.jsx";
import BulkUpload from "./Components/BulkUpload.jsx";
import SearchPeople from "./Components/SearchPeople.jsx";
import Meeting from "./Components/Meeting.jsx";
import Feedback from "./Components/Feedback.jsx";
import { getLoggedIn } from "./services/authService.js";

function RequireAuth({ children }) {
  const loggedIn = getLoggedIn();
  return loggedIn ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },

      {
        path: "events",
        element: (
          <RequireAuth>
            <Event />
          </RequireAuth>
        ),
      },
      {
        path: "/jobs",
        element: (
          <RequireAuth>
            <Jobs />
          </RequireAuth>
        ),
      },
      {
        path: "/newsletter",
        element: (
          <RequireAuth>
            <Newsletter />
          </RequireAuth>
        ),
      },
      {
        path: "/send-mail",
        element: (
          <RequireAuth>
            <SendMail />
          </RequireAuth>
        ),
      },
      {
        path: "/bulk-upload",
        element: (
          <RequireAuth>
            <BulkUpload />
          </RequireAuth>
        ),
      },
      {
        path: "/search-people",
        element: (
          <RequireAuth>
            <SearchPeople />
          </RequireAuth>
        ),
      },
      {
        path: "/meeting",
        element: (
          <RequireAuth>
            <Meeting />
          </RequireAuth>
        ),
      },
      {
        path: "/feedback",
        element: (
          <RequireAuth>
            <Feedback />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/*",
    element: <Navigate to="/login" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
