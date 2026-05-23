import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";
 
export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();
 
  // While /me is still in-flight, show nothing (prevents redirect flash)
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[#c8c0a8] text-sm font-light tracking-wide">Checking session…</p>
        </div>
      </div>
    );
  }
 
  // Not logged in → send to /auth, remember where they wanted to go
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
 
  return children;
}