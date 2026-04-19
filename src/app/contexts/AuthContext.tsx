import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import * as api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  nickname?: string;
  avatar?: string;
  role: "admin" | "member";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, inviteCode: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const userData = await api.login(email, password);
    setUser(userData);
  }

  async function signup(name: string, email: string, password: string, inviteCode: string) {
    const userData = await api.signup(name, email, password, inviteCode);
    setUser(userData);
  }

  async function logout() {
    await api.logout().catch(() => {});
    setUser(null);
  }

  function updateUser(updates: Partial<User>) {
    if (user) {
      setUser({ ...user, ...updates });
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
