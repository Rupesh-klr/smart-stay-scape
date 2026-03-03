import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "admin" | "user" | null;

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  role: UserRole;
}

interface AuthContextType extends AuthState {
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    username: null,
    role: null,
  });

  const login = useCallback((username: string) => {
    const trimmed = username.trim().toLowerCase();
    const role: UserRole = trimmed === "admin" ? "admin" : "user";
    setAuth({
      isLoggedIn: true,
      username: trimmed === "admin" ? "Admin" : username.trim(),
      role,
    });
  }, []);

  const logout = useCallback(() => {
    setAuth({ isLoggedIn: false, username: null, role: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
