import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "../components/Card";
import { useToast } from "../components/Toast";

export function SettingsNotifications() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    dutyReminders: true,
    newMessages: true,
    photoComments: false,
    dailySummary: true,
  });

  function handleToggle(key: keyof typeof settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast("Notification preference updated", "success");
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link to="/settings" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Push Notification Preferences</h2>
        <div className="space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {key === "dutyReminders" && "Duty Reminders"}
                  {key === "newMessages" && "New Messages"}
                  {key === "photoComments" && "Photo Comments"}
                  {key === "dailySummary" && "Daily Summary"}
                </p>
                <p className="text-sm text-gray-400">
                  {key === "dutyReminders" && "Get notified about upcoming duties"}
                  {key === "newMessages" && "Get notified when someone messages you"}
                  {key === "photoComments" && "Get notified about comments on your photos"}
                  {key === "dailySummary" && "Receive a daily activity summary"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleToggle(key as keyof typeof settings)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
