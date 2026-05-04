import { createContext, useContext, useState, ReactNode } from "react";
import type { LoginResponseDTO } from "../types";

interface AuthState {
  token: string | null;
  nome: string | null;
  email: string | null;
  role: string | null;
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  login: (response: LoginResponseDTO) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "authState";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored
        ? JSON.parse(stored)
        : { token: null, nome: null, email: null, role: null };
    } catch {
      return { token: null, nome: null, email: null, role: null };
    }
  });

  const isAuthenticated = !!state.token;

  const login = (response: LoginResponseDTO) => {
    const newState: AuthState = {
      token: response.Token,
      nome: response.Nome,
      email: response.Email,
      role: response.Role,
    };
    setState(newState);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newState));
    // keep "token" key for the axios request interceptor
    localStorage.setItem("token", response.Token);
  };

  const logout = () => {
    setState({ token: null, nome: null, email: null, role: null });
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ ...state, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
