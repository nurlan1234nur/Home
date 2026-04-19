import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AuthLayout } from "./components/AuthLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Forgot } from "./pages/Forgot";
import { Reset } from "./pages/Reset";
import { Dashboard } from "./pages/Dashboard";
import { Calendar } from "./pages/Calendar";
import { DayDetail } from "./pages/DayDetail";
import { Messages } from "./pages/Messages";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { SettingsNotifications } from "./pages/SettingsNotifications";
import { SettingsTelegram } from "./pages/SettingsTelegram";
import { SettingsRotations } from "./pages/SettingsRotations";
import { SettingsMembers } from "./pages/SettingsMembers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot", element: <Forgot /> },
      { path: "reset", element: <Reset /> },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "calendar", element: <Calendar /> },
      { path: "day/:date", element: <DayDetail /> },
      { path: "messages", element: <Messages /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
      { path: "settings/notifications", element: <SettingsNotifications /> },
      { path: "settings/telegram", element: <SettingsTelegram /> },
      { path: "settings/rotations", element: <SettingsRotations /> },
      { path: "settings/members", element: <SettingsMembers /> },
      { index: true, element: <Dashboard /> },
    ],
  },
]);
