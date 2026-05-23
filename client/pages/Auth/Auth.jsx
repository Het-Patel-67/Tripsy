import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../src/services/apiService.js";
import { useAuth } from "../../src/context/Authcontext.jsx";
import { SuccessPopup } from "../Trip/Trip.jsx";

/* ── Fonts + animations ──────────────────────────────────────────────── */
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }

  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.85) translateY(12px); }
    100% { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  .pop-in { animation: popIn 0.25s ease both; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.45s ease both; }
`

export default function Auth() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();

  // Where to go after login — defaults to "/" if user came here directly
  const from = location.state?.from || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen,  setIsOpen]  = useState(false);
  const [popMsg,  setPopMsg]  = useState({ title: "", body: "" });

  const [form, setForm] = useState({
    username:        "",
    emailOrUsername: "",
    email:           "",
    password:        "",
    mobile:          "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+=\[\]{}|;:'",.<>\/?`])(?!.*\s).{8,}$/;

    if (!form.password) return "Password is required";
    if (!strongPassword.test(form.password))
      return "Password must be 8+ chars with uppercase, lowercase, number & special character";

    if (!isLogin) {
      if (!form.username || !form.email || !form.mobile) return "All fields are required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email format";
      if (!/^\d{10}$/.test(form.mobile))                   return "Invalid mobile number (10 digits)";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);

      if (isLogin) {
        const payload = { password: form.password };
        if (form.emailOrUsername.includes("@")) payload.email    = form.emailOrUsername;
        else                                    payload.username = form.emailOrUsername;

        const res = await API.post("/api/users/login", payload);

        // Pass both the user object AND the token to AuthContext.
        // AuthContext.login() saves the token to localStorage so the
        // Axios interceptor can attach it to all future requests.
        const { user, accessToken } = res.data?.data;
        login(user, accessToken);

        setPopMsg({
          title: "Welcome back! 👋",
          body:  "You've logged in successfully. Taking you to your dashboard…",
        });
        setIsOpen(true);

      } else {
        await API.post("/api/users/register", {
          username: form.username,
          email:    form.email,
          password: form.password,
          mobile:   form.mobile,
        });

        setPopMsg({
          title: "Account Created! 🎉",
          body:  "Your account has been created. Please log in to continue.",
        });
        setIsOpen(true);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setIsOpen(false);
    if (isLogin) {
      // Go back to where the user came from (e.g. /trip if they were redirected)
      navigate(from, { replace: true });
    } else {
      // Switch to login tab after successful registration
      setIsLogin(true);
      setForm({ username: "", emailOrUsername: "", email: "", password: "", mobile: "" });
    }
  };

  const inputCls =
    "font-dm w-full px-4 py-3 text-sm border border-[#E7DDD0] rounded-xl bg-white outline-none transition-all focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.12)] placeholder:text-stone-300 text-[#1C1917]";

  return (
    <>
      <style>{fontStyles}</style>

      {isOpen && <SuccessPopup message={popMsg} onClose={handlePopupClose} />}

      <div className="font-dm min-h-screen flex flex-col md:flex-row bg-[#F5EFE6]">

        {/* ── LEFT: Form panel ────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-between px-6 py-8 sm:px-10 md:max-w-lg md:px-12 lg:px-16">

          {/* Branding */}
          <div className="fade-up mb-8">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-playfair text-2xl font-bold text-[#1C1917]">Tripsy</h1>
            </div>
            <p className="font-dm text-sm text-stone-400 tracking-wide">
              Plan your trip, explore the world!
            </p>
          </div>

          {/* Form card */}
          <div className="fade-up flex-1 flex flex-col justify-center">
            <div className="rounded-2xl border border-[#E7DDD0] bg-white p-7 shadow-[0_4px_24px_rgba(28,25,23,0.07)] sm:p-8">

              {/* Login / Register toggle tabs */}
              <div className="mb-5 flex rounded-xl border border-[#E7DDD0] bg-[#F5EFE6] p-1">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(""); }}
                  className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-semibold transition-all ${
                    isLogin ? "bg-white text-[#1C1917] shadow-sm" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(""); }}
                  className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-semibold transition-all ${
                    !isLogin ? "bg-white text-[#1C1917] shadow-sm" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  Register
                </button>
              </div>

              <div className="mb-6">
                <h2 className="font-playfair text-2xl font-bold text-[#1C1917] sm:text-3xl">
                  {isLogin ? "Welcome back" : "Create Account"}
                </h2>
                <p className="font-dm mt-1 text-sm text-stone-400">
                  {isLogin ? "Login to continue your journey" : "Register to start planning trips"}
                </p>
              </div>

              {/* Fields */}
              <form onSubmit={handleSubmit} className="space-y-3">

                {!isLogin && (
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Username</label>
                    <input type="text" name="username" placeholder="e.g. het_patel"
                      value={form.username} onChange={handleChange} className={inputCls} />
                  </div>
                )}

                {isLogin && (
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Email or Username</label>
                    <input type="text" name="emailOrUsername" placeholder="you@email.com or username"
                      value={form.emailOrUsername} onChange={handleChange} className={inputCls} />
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Email</label>
                    <input type="text" name="email" placeholder="you@email.com"
                      value={form.email} onChange={handleChange} className={inputCls} />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Password</label>
                  <input type="password" name="password" placeholder="Name@1234"
                    value={form.password} onChange={handleChange} className={inputCls} />
                </div>

                {!isLogin && (
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Mobile Number</label>
                    <input type="text" name="mobile" placeholder="10-digit number"
                      value={form.mobile} onChange={handleChange} className={inputCls} />
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                    <span className="mt-0.5 text-sm text-red-500 shrink-0">⚠</span>
                    <p className="font-dm text-sm text-red-600 leading-relaxed">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="font-dm mt-1 w-full cursor-pointer rounded-xl bg-linear-to-br from-amber-600 to-amber-700 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(217,119,6,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(217,119,6,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Please wait…" : isLogin ? "Login →" : "Create Account →"}
                </button>
              </form>

              <p
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="font-dm mt-4 text-center text-sm text-stone-400 cursor-pointer hover:text-amber-600 transition-colors"
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </p>
            </div>
          </div>

          <p className="font-dm mt-6 text-center text-[11px] text-stone-300">
            © {new Date().getFullYear()} Tripsy · All rights reserved
          </p>
        </div>

        {/* ── RIGHT: Background image panel ───────────────────────── */}
        <div
          className="hidden md:block md:flex-1 relative overflow-hidden"
          style={{
            backgroundImage:    "url('/assets/auth_page.png')",
            backgroundSize:     "cover",
            backgroundPosition: "right",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(245,239,230,0.15) 0%, rgba(0,0,0,0.35) 100%)" }}
          />
          <div className="relative z-10 flex h-full flex-col justify-end p-4 lg:p-14">
            <div
              className="absolute top-15 lg:top-33 xl:top-52 rounded-2xl p-4 md:p-8 max-w-sm"
              style={{
                background:    "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                border:        "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <p className="font-playfair mb-3 text-lg font-bold italic text-black leading-snug">
                "The world is a book, and those who do not travel read only one page."
              </p>
              <p className="font-dm text-sm text-black/60">— Saint Augustine</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}