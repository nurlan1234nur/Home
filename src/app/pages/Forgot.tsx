import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import * as api from "../services/api";

export function Forgot() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.forgotPassword(email);
      setIsSuccess(true);
    } catch {
      setIsSuccess(true); // Always show success to not leak emails
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Check Your Inbox</h1>
          <p className="text-gray-400 mt-2">We've sent a password reset link to {email}</p>
        </div>
        <Link to="/login" className="block text-blue-400 hover:text-blue-300">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
        <p className="text-gray-400 mt-2">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-gray-400 text-sm">
        <Link to="/login" className="text-blue-400 hover:text-blue-300">
          Back to login
        </Link>
      </p>
    </div>
  );
}
