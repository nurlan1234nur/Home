import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AlertError } from "../components/AlertError";
import * as api from "../services/api";

export function Reset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isTokenInvalid = !token;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword(token!, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  if (isTokenInvalid) {
    return (
      <div className="space-y-6 text-center">
        <AlertError message="Invalid or expired reset token" />
        <Link to="/forgot" className="block text-blue-400 hover:text-blue-300">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">Enter your new password</p>
      </div>

      {error && <AlertError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="New Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <Input
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
