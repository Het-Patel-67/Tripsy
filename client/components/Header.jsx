import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { MdOutlineEditCalendar } from "react-icons/md";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { LuListTodo } from "react-icons/lu";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useAuth } from '../src/context/Authcontext';
import { SuccessPopup } from '../pages/Trip/Trip';
function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);   // mobile menu
    const [dropdown, setDropdown] = useState(false); // desktop avatar dropdown
    const [active, setActive] = useState("Home");
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [popMsg, setPopMsg] = useState({ title: "", body: "" });
    const handleClose = () => {
        setIsOpen(false);
    };
    // Close avatar dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        setDropdown(false);
        setOpen(false);
        await logout();
        setPopMsg({ title: "Logged Out", body: "You have been successfully logged out." });
        setIsOpen(true);
        navigate("/");
    };

    // First letter of username for avatar
    const initials = user?.username?.charAt(0).toUpperCase() ?? "?";

    const navLinks = [
        { label: "Home", to: "/", icon: <IoHome className="inline-block mr-2 h-5 w-5" /> },
        { label: "Plan a Trip", to: "/plan-trip", icon: <MdOutlineEditCalendar className="inline-block mr-2 h-5 w-5" /> },
        { label: "Expense Tracker", to: "/expense-tracker", icon: <MdOutlineAccountBalanceWallet className="inline-block mr-2 h-5 w-5" /> },
        { label: "My Itineraries", to: "/my-itineraries", icon: <LuListTodo className="inline-block mr-2 h-5 w-5" /> },
    ];

    return (
        <>
            {isOpen && (
                <SuccessPopup
                    message={popMsg}
                    onClose={handleClose}
                />
            )}
            {/* ── DESKTOP NAV ───────────────────────────────────────────────────── */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md bg-white/60 shadow-lg rounded-md border border-white/20">
                <div className="hidden md:flex w-[85vw] max-w-6xl items-center justify-between px-6 py-2">
                    <h2 className="text-[#1F2937] font-semibold">Tripsy</h2>

                    <ul className="ml-10 flex items-center space-x-6">
                        {navLinks.map(({ label, to }) => (
                            <li key={label} className="menu-item">
                                <Link to={to} className="menu-link">{label}</Link>
                                <div className="glow-underline" />
                            </li>
                        ))}

                        {/* ── Auth item: Login link OR avatar dropdown ── */}
                        <li className="relative" ref={dropdownRef}>
                            {!user ? (
                                // Not logged in → show Login link exactly as before
                                <div className="menu-item">
                                    <Link to="/auth" className="menu-link">Login</Link>
                                    <div className="glow-underline" />
                                </div>
                            ) : (
                                // Logged in → avatar button
                                <>
                                    <button
                                        onClick={() => setDropdown((v) => !v)}
                                        className="flex items-center gap-2 cursor-pointer group"
                                    >
                                        {/* Avatar circle */}
                                        <span className="w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md group-hover:bg-orange-600 transition-colors">
                                            {initials}
                                        </span>
                                        {/* Subtle chevron */}
                                        <span className={`text-[#1F2937] text-xs transition-transform ${dropdown ? "rotate-180" : ""}`}>▾</span>
                                    </button>

                                    {/* Dropdown */}
                                    {dropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-white/30 backdrop-blur-md overflow-hidden z-50">
                                            {/* User info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-xs text-gray-400">Signed in as</p>
                                                <p className="text-sm font-semibold text-[#1F2937] truncate">{user.username}</p>
                                            </div>
                                            {/* Logout */}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                <BiLogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>

            {/* ── MOBILE TOP BAR ────────────────────────────────────────────────── */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] backdrop-blur-md bg-white/70 rounded-2xl px-4 py-1.5 flex justify-between items-center sm:hidden">
                <h2 className="font-semibold text-[#1F2937]">Tripsy</h2>

                <div className="flex items-center gap-3">
                    {/* Show avatar on mobile bar too when logged in */}
                    {user && (
                        <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                            {initials}
                        </span>
                    )}
                    <button onClick={() => setOpen(!open)} className="text-lg">☰</button>
                </div>
            </nav>

            {/* ── MOBILE DROPDOWN MENU ──────────────────────────────────────────── */}
            <div
                className={`fixed top-15 left-1/2 -translate-x-1/2 z-90 w-[92%] bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl transition-all duration-300 ease-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <ul className="flex flex-col p-4 gap-2">
                    {/* Regular nav links */}
                    {navLinks.map(({ label, to, icon }) => (
                        <li
                            key={label}
                            onClick={() => { setActive(label); setOpen(false); }}
                            className={`px-4 py-2 rounded-xl cursor-pointer transition ${active === label
                                    ? "bg-orange-50 text-[#F97316]"
                                    : "text-[#1F2937] hover:bg-black/5"
                                } shadow-[0_0_0_2px_rgba(249,115,22,0.15)]`}
                        >
                            <Link to={to} className="flex items-center">
                                {icon}
                                {label}
                            </Link>
                        </li>
                    ))}

                    {/* Auth item at bottom of mobile menu */}
                    {!user ? (
                        // Not logged in → Login link
                        <li
                            onClick={() => { setActive("Login"); setOpen(false); }}
                            className={`px-4 py-2 rounded-xl cursor-pointer transition ${active === "Login"
                                    ? "bg-orange-50 text-[#F97316]"
                                    : "text-[#1F2937] hover:bg-black/5"
                                } shadow-[0_0_0_2px_rgba(249,115,22,0.15)]`}
                        >
                            <Link to="/auth" className="flex items-center">
                                <BiLogIn className="inline-block mr-2 h-5 w-5" />
                                Login
                            </Link>
                        </li>
                    ) : (
                        // Logged in → user info + logout button
                        <>
                            {/* User info row */}
                            <li className="px-4 py-2 rounded-xl bg-orange-50 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                                        {initials}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400">Signed in as</p>
                                        <p className="text-sm font-semibold text-[#1F2937] truncate">{user.username}</p>
                                    </div>
                                </div>
                            </li>

                            {/* Logout row */}
                            <li
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-50 transition shadow-[0_0_0_2px_rgba(239,68,68,0.15)]"
                            >
                                <BiLogOut className="h-5 w-5" />
                                Logout
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
}

export default Header;