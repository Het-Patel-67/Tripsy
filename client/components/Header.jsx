import React, { useState } from 'react'
import { IoHome } from "react-icons/io5";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { LiaHotelSolid } from "react-icons/lia";
import { BiLogIn } from "react-icons/bi";
import { Link } from 'react-router-dom';

function Header() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("Home");
    const menuItems = ["Home", "Plan a Trip", "Manage Expenses", "Hotels", "Login"];
    return (
        <>
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md bg-white/60 shadow-lg rounded-md border border-white/20 ">
                <div className="hidden md:flex w-[85vw] max-w-6xl items-center justify-between px-6 py-2">
                    <h2 className="text-[#1F2937] font-semibold">Tripsy</h2>
                    <ul className="ml-10 flex items-baseline space-x-6">
                        <li className="menu-item">
                            <Link to="/" className="menu-link">Home</Link>
                            <div className="glow-underline"></div>
                        </li>
                        <li className="menu-item">
                            <Link to="/Plan-trip" className="menu-link">Plan a trip</Link>
                            <div className="glow-underline"></div>
                        </li>
                        <li className="menu-item">
                            <Link to="/Expense-tracker" className="menu-link">Expense Tracker</Link>
                            <div className="glow-underline"></div>
                        </li>
                        <li className="menu-item">
                            <Link to="/Hotels" className="menu-link">Hotels</Link>
                            <div className="glow-underline"></div>
                        </li>
                        <li className="menu-item">
                            <Link to="../Login" className="menu-link">Login</Link>
                            <div className="glow-underline"></div>
                        </li>
                    </ul>
                </div>
            </nav>
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] backdrop-blur-md bg-white/70 rounded-2xl px-4 py-1.5 flex justify-between items-center sm:hidden">
                <h2 className="font-semibold text-[#1F2937]">Tripsy</h2>
                <button onClick={() => setOpen(!open)}>☰</button>
            </nav>
            <div
                className={` fixed top-15 left-1/2 -translate-x-1/2 z-90 w-[92%] bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl transition-all duration-300 ease-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} `}
            >
                <ul className="flex flex-col p-4 gap-2">
                    {menuItems.map(item => {
                        let to;
                        if (item === "Home") to = "/";
                        else if (item === "Plan a Trip") to = "/Plan-trip";
                        else if (item === "Expense Tracker") to = "/Expense-tracker";
                        else if (item === "Hotels") to = "/Hotels";
                        else if (item === "Login") to = "../Login";
                        return (
                            <li
                                key={item}
                                onClick={() => {
                                    setActive(item);
                                    setOpen(false);
                                }}
                                className={`px-4 py-2 rounded-xl cursor-pointer transition${active === item ? "bg-orange-50 text-[#F97316]": "text-[#1F2937] hover:bg-black/5" } shadow-[0_0_0_2px_rgba(249,115,22,0.15)]}`}
                            >
                                <Link to={to} className="flex items-center">
                                    {item === "Home" && <IoHome className="inline-block align-middle mr-2 h-5 w-5" />}
                                    {item === "Plan a Trip" && <RiCalendarScheduleLine className="inline-block align-middle mr-2 h-5 w-5" />}
                                    {item === "Expense Tracker" && <RiMoneyRupeeCircleLine className="inline-block align-middle mr-2 h-5 w-5" />}
                                    {item === "Hotels" && <LiaHotelSolid className="inline-block align-middle mr-2 h-5 w-5" />}
                                    {item === "Login" && <BiLogIn className="inline-block align-middle mr-2 h-5 w-5" />}
                                    {item}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    )
}

export default Header