import { useState, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import * as api from "../services/api";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { Spinner } from "../components/Spinner";
import { Edit2, Settings, Upload } from "lucide-react";

const DEFAULT_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Coco",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buddy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy",
];

export function Profile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("File must be under 5MB", "error");
      return;
    }
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function handleConfirmAvatar(src: string) {
    setIsUploadingAvatar(true);
    try {
      await api.updateAvatar(src);
      updateUser({ avatar: src });
      setIsAvatarModalOpen(false);
      setAvatarPreview(null);
      showToast("Avatar updated", "success");
    } catch {
      showToast("Failed to update avatar", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleUpdateNickname() {
    setIsUpdatingNickname(true);
    try {
      await api.updateNickname(nickname);
      updateUser({ nickname });
      setIsEditingNickname(false);
      showToast("Nickname updated", "success");
    } catch (error) {
      showToast("Failed to update nickname", "error");
    } finally {
      setIsUpdatingNickname(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      showToast("Password changed successfully", "success");
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Link to="/settings" className="text-gray-400 hover:text-white">
          <Settings className="w-6 h-6" />
        </Link>
      </div>

      {/* Avatar Section */}
      <Card>
        <h2 className="font-semibold mb-4">Avatar</h2>
        <div className="flex items-center space-x-6">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <Button variant="secondary" onClick={() => setIsAvatarModalOpen(true)}>
              Change Photo
            </Button>
            <p className="text-sm text-gray-400 mt-2">Upload a custom photo or choose a default avatar</p>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => { setIsAvatarModalOpen(false); setAvatarPreview(null); }}
        title="Change Avatar"
      >
        <div className="space-y-5">
          {/* Upload custom */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Upload custom photo</p>
            <input
              ref={avatarFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileChange}
            />
            {avatarPreview ? (
              <div className="space-y-3">
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-blue-500"
                />
                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleConfirmAvatar(avatarPreview)}
                    isLoading={isUploadingAvatar}
                  >
                    Use This Photo
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => { setAvatarPreview(null); if (avatarFileRef.current) avatarFileRef.current.value = ""; }}
                    disabled={isUploadingAvatar}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => avatarFileRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-dashed border-white/20 rounded-lg hover:border-blue-400 hover:bg-blue-500/5 transition-colors text-gray-400 hover:text-white"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">Click to upload (max 5MB)</span>
              </button>
            )}
          </div>

          {/* Default avatars grid */}
          {!avatarPreview && (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Choose a default avatar</p>
              {isUploadingAvatar ? (
                <div className="flex justify-center py-4"><Spinner /></div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {DEFAULT_AVATARS.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => handleConfirmAvatar(src)}
                      className={`rounded-full overflow-hidden border-2 transition-colors hover:border-blue-400 ${
                        user.avatar === src ? "border-blue-500" : "border-transparent"
                      }`}
                    >
                      <img src={src} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Info Section */}
      <Card>
        <h2 className="font-semibold mb-4">Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <p className="text-white">{user.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nickname</label>
            {isEditingNickname ? (
              <div className="flex space-x-2">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter nickname"
                />
                <Button onClick={handleUpdateNickname} isLoading={isUpdatingNickname}>
                  Save
                </Button>
                <Button variant="secondary" onClick={() => setIsEditingNickname(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <p className="text-white">{user.nickname || "Not set"}</p>
                <button
                  onClick={() => setIsEditingNickname(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <p className="text-white">{user.email}</p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <button
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          className="font-semibold mb-4 flex items-center justify-between w-full"
        >
          <span>Change Password</span>
          <span className="text-gray-400">{isChangingPassword ? "−" : "+"}</span>
        </button>

        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordError}
              required
            />
            <Button type="submit" isLoading={isUpdatingPassword}>
              Update Password
            </Button>
          </form>
        )}
      </Card>

      {/* Connected Services */}
      <Card>
        <h2 className="font-semibold mb-4">Connected Services</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Telegram</p>
              <p className="text-sm text-gray-400">Not linked</p>
            </div>
            <Link to="/settings/telegram">
              <Button variant="secondary">Link</Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-400">Disabled</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}
