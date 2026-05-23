import { createContext, useContext, useEffect, useState, useCallback } from "react";
import API from "../services/apiService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // "checking" = true while /me is in-flight (prevents flash of login page)
    const [checking, setChecking] = useState(true);

    // Called once on app mount — restores session from localStorage token.
    // Critically, /me is only fired if a token actually exists.
    // This eliminates the spurious 401 on first load for logged-out users.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            // No token → user is definitely not logged in, skip the network call.
            setChecking(false);
            return;
        }

        API.get("/api/users/me")
            .then((res) => setUser(res.data?.data ?? null))
            .catch(() => {
                // Token expired or invalid — clean it up silently.
                localStorage.removeItem("token");
                setUser(null);
            })
            .finally(() => setChecking(false));
    }, []);

    // Called by Auth.jsx after a successful login response.
    // Saves the token to localStorage so the interceptor picks it up.
    const login = useCallback((userData, accessToken) => {
        localStorage.setItem("token", accessToken);
        setUser(userData);
    }, []);

    // Called by the navbar logout button.
    // Clears token from localStorage and wipes user state.
    const logout = useCallback(async () => {
        try {
            await API.post("/api/users/logout");
        } finally {
            localStorage.removeItem("token");
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