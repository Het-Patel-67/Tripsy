import { createContext, useContext, useEffect, useState, useCallback } from "react";
import API from "../services/apiService.js"; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(null);
  // "checking" = true while /me is in-flight (prevents flash of login page)
  const [checking, setChecking] = useState(true);

  // Called once on app mount — restores session silently from httpOnly cookie
  useEffect(() => {
    API.get("/api/users/me")
      .then((res) => setUser(res.data?.data ?? null))
      .catch(() => setUser(null))          // 401 = not logged in
      .finally(() => setChecking(false));
  }, []);

  // Called by Auth.jsx after successful login response
  const login = useCallback((userData) => setUser(userData), []);

  // Called by navbar logout button
  const logout = useCallback(async () => {
    try {
      await API.post("/api/users/logout");
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}