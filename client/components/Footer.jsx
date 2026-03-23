import React from 'react'

function Footer() {
    return (
        <>
        <div className="mx-5 sm:mx-12 bg-gray-500 h-0.5 mt-20"></div>
        <footer className="bg-orange-50/40 text-slate-700 ">
            <div className="max-w-7xl mx-10 px-6 py-7">
                <div className=" flex flex-col gap-5 sm:flex-row sm:justify-around sm:gap-10 justify-center items-center sm:items-start">
                    <div className="max-w-xs text-center sm:text-left">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Tripsy
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 ">
                            Travel smarter, spend calmer.<span className='hidden sm:block'>
                            Plan journeys and track expenses without clutter.
                            </span>
                        </p>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                            Explore
                        </h3>
                        <ul className="mt-4 space-y-1 text-sm">
                            <li>
                                <a href="/plan" className="hover:text-orange-500 transition">
                                    Plan a Trip
                                </a>
                            </li>
                            <li>
                                <a href="/destinations" className="hover:text-orange-500 transition">
                                    Destinations
                                </a>
                            </li>
                            <li>
                                <a href="/expenses" className="hover:text-orange-500 transition">
                                    Expense Tracker
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center sm:text-left">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                            Support
                        </h3>
                        <ul className="mt-4 space-y-1 text-sm">
                            <li>
                                <a href="/privacy" className="hover:text-orange-500 transition">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="hover:text-orange-500 transition">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="hover:text-orange-500 transition">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                
                {/* Bottom */}
                <div className="mt-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Tripsy. All rights reserved.
                </div>
            </div>
        </footer>
        </>
    )
}

export default Footer