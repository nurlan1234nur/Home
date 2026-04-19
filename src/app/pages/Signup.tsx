import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AlertError } from "../components/AlertError";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(name, email, password, inviteCode);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Join your household</p>
      </div>

      {error && <AlertError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
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
          type="text"
          label="Invite Code"
          placeholder="HOME2024"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Sign Up
        </Button>
      </form>

      <p className="text-center text-gray-400 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:text-blue-300">
          Sign in
        </Link>
      </p>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
        <p>Use invite code: <span className="font-medium">HOME2024</span></p>
      </div>
    </div>
  );
}
