import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/Card";
import { Bell, Send, RefreshCw, Users, ChevronRight, LogOut } from "lucide-react";
import { Button } from "../components/Button";

export function Settings() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-3">
        <Link to="/settings/notifications">
          <Card className="hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-gray-400">Configure push notification preferences</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>

        <Link to="/settings/telegram">
          <Card className="hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Telegram</h3>
                  <p className="text-sm text-gray-400">Link your Telegram account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>

        {user?.role === "admin" && (
          <>
            <Link to="/settings/rotations">
              <Card className="hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Rotations</h3>
                      <p className="text-sm text-gray-400">Configure duty rotation schedules</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>

            <Link to="/settings/members">
              <Card className="hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Members</h3>
                      <p className="text-sm text-gray-400">Manage household members</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          </>
        )}
      </div>

      <Card>
        <Button onClick={handleLogout} variant="danger" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </Card>
    </div>
  );
}
