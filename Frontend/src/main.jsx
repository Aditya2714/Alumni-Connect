import React from "react";
import ReactDOM from "react-dom/client";
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
import Announcements from "./Components/SendMail.jsx";
import BulkUpload from "./Components/BulkUpload.jsx";
import AdminApprovals from "./Components/AdminApprovals.jsx";
import AdminReports from "./Components/AdminReports.jsx";
import AdminMentorship from "./Components/AdminMentorship.jsx";
import ManageAlumni from "./Components/ManageAlumni.jsx";
import SearchPeople from "./Components/SearchPeople.jsx";
import Mentorship from "./Components/Meeting.jsx";
import Feedback from "./Components/Feedback.jsx";
import Profile from "./Components/Profile.jsx";
import Recommendations from "./Components/Recommendations.jsx";
import {
  AlumniStories,
  CareerReferrals,
  Connections,
  Contributions,
  DiscussionForum,
  RecognitionWall,
  ResourceLibrary,
} from "./Components/AlumniFeatures.jsx";
import { getLoggedIn, getUserData } from "./services/authService.js";

function RequireAuth({ children }) {
  const loggedIn = getLoggedIn();
  return loggedIn ? children : <Navigate to="/login" replace />;
}

function RequireAdminTool({ children }) {
  const loggedIn = getLoggedIn();
  const user = getUserData();

  if (!loggedIn) return <Navigate to="/login" replace />;
  return ["admin", "college"].includes(user?.role) ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
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
        path: "profile",
        element: (
          <RequireAuth>
            <Profile />
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
        path: "/announcements",
        element: (
          <RequireAuth>
            <Announcements />
          </RequireAuth>
        ),
      },
      {
        path: "/send-mail",
        element: <Navigate to="/announcements" replace />,
      },
      {
        path: "/bulk-upload",
        element: (
          <RequireAdminTool>
            <BulkUpload />
          </RequireAdminTool>
        ),
      },
      {
        path: "/approvals",
        element: (
          <RequireAdminTool>
            <AdminApprovals />
          </RequireAdminTool>
        ),
      },
      {
        path: "/reports",
        element: (
          <RequireAdminTool>
            <AdminReports />
          </RequireAdminTool>
        ),
      },
      {
        path: "/admin-mentorship",
        element: (
          <RequireAdminTool>
            <AdminMentorship />
          </RequireAdminTool>
        ),
      },
      {
        path: "/manage-alumni",
        element: (
          <RequireAdminTool>
            <ManageAlumni />
          </RequireAdminTool>
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
        path: "/alumni-directory",
        element: (
          <RequireAuth>
            <SearchPeople />
          </RequireAuth>
        ),
      },
      {
        path: "/connections",
        element: (
          <RequireAuth>
            <Connections />
          </RequireAuth>
        ),
      },
      {
        path: "/career-referrals",
        element: (
          <RequireAuth>
            <CareerReferrals />
          </RequireAuth>
        ),
      },
      {
        path: "/alumni-stories",
        element: (
          <RequireAuth>
            <AlumniStories />
          </RequireAuth>
        ),
      },
      {
        path: "/forum",
        element: (
          <RequireAuth>
            <DiscussionForum />
          </RequireAuth>
        ),
      },
      {
        path: "/resources",
        element: (
          <RequireAuth>
            <ResourceLibrary />
          </RequireAuth>
        ),
      },
      {
        path: "/contributions",
        element: (
          <RequireAuth>
            <Contributions />
          </RequireAuth>
        ),
      },
      {
        path: "/recognition",
        element: (
          <RequireAuth>
            <RecognitionWall />
          </RequireAuth>
        ),
      },
      {
        path: "/mentorship",
        element: (
          <RequireAuth>
            <Mentorship />
          </RequireAuth>
        ),
      },
      {
        path: "/meeting",
        element: <Navigate to="/mentorship" replace />,
      },
      {
        path: "/feedback",
        element: (
          <RequireAuth>
            <Feedback />
          </RequireAuth>
        ),
      },
      {
        path: "/recommendations",
        element: (
          <RequireAuth>
            <Recommendations />
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
