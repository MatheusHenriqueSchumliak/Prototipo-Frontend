import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LoginResponseDTO } from "../types.ts";

// Representa os dados do usuário armazenados após o login
export interface AuthUser {
  nome: string;
  email: string;
  role: string;
}

// login recebe o objeto LoginResponseDTO completo
interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;           //dados do usuário acessíveis globalmente
  login: (response: LoginResponseDTO) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("authUser");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        // dados corrompidos no localStorage — limpa tudo
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  // login(response) salva token + dados do usuário
  const login = (response: LoginResponseDTO) => {
    localStorage.setItem("token", response.Token);

    const authUser: AuthUser = {
      nome: response.Nome,
      email: response.Email,
      role: response.Role,
    };
    localStorage.setItem("authUser", JSON.stringify(authUser));

    setUser(authUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser"); // limpa também os dados do usuário
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("O useAuth deve ser usado dentro do AuthProvider.");
  }
  return context;
};