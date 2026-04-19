import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

export function SettingsTelegram() {
  const isLinked = false;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link to="/settings" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Telegram Integration</h1>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Connection Status</h2>
            <Badge variant={isLinked ? "success" : "info"}>
              {isLinked ? "Linked ✅" : "Not Linked"}
            </Badge>
          </div>

          {!isLinked ? (
            <>
              <p className="text-gray-400">
                Link your Telegram account to receive notifications and updates directly in Telegram.
              </p>

              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p className="font-medium">How to link:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-400">
                  <li>Click the "Link Telegram" button below</li>
                  <li>You'll be redirected to Telegram</li>
                  <li>Start a chat with our bot</li>
                  <li>Send the verification code shown</li>
                </ol>
              </div>

              <Button className="w-full">Link Telegram Account</Button>
            </>
          ) : (
            <>
              <p className="text-gray-400">
                Your Telegram account is successfully linked. You'll receive notifications for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                <li>Duty reminders</li>
                <li>New messages from household members</li>
                <li>Activity updates</li>
              </ul>
              <Button variant="danger" className="w-full">Unlink Account</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
