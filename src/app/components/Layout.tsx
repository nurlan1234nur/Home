import { Outlet, useLocation, Link } from "react-router";
import { useState, useEffect } from "react";
import { Home, Calendar, MessageCircle, User, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../services/api";

export function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.getConversations()
      .then((convs) => {
        const total = convs.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0);
        setUnreadCount(total);
      })
      .catch(() => {});
  }, [user, location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white pb-16 md:pb-0">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center space-x-8">
          <h1 className="font-bold text-xl">HomeDuty</h1>
          <div className="flex space-x-6">
            <Link
              to="/dashboard"
              className={`hover:text-blue-400 transition-colors ${
                isActive("/dashboard") ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/calendar"
              className={`hover:text-blue-400 transition-colors ${
                isActive("/calendar") ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Calendar
            </Link>
            <Link
              to="/messages"
              className={`hover:text-blue-400 transition-colors ${
                isActive("/messages") ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Messages
            </Link>
            <Link
              to="/profile"
              className={`hover:text-blue-400 transition-colors ${
                isActive("/profile") ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
        <Link to="/settings" className="text-gray-300 hover:text-blue-400">
          <Settings className="w-5 h-5" />
        </Link>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0b1220] border-t border-white/10 pb-safe">
        <div className="grid grid-cols-4 h-16">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center space-y-1 ${
              isActive("/dashboard") ? "text-blue-400" : "text-gray-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/calendar"
            className={`flex flex-col items-center justify-center space-y-1 ${
              isActive("/calendar") ? "text-blue-400" : "text-gray-400"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Calendar</span>
          </Link>
          <Link
            to="/messages"
            className={`flex flex-col items-center justify-center space-y-1 relative ${
              isActive("/messages") ? "text-blue-400" : "text-gray-400"
            }`}
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <span className="text-xs">Messages</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center space-y-1 ${
              isActive("/profile") ? "text-blue-400" : "text-gray-400"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
