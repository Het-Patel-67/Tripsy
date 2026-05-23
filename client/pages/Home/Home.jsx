import React from 'react'
import { useNavigate } from 'react-router-dom'
import ItineraryCard from './components/ItineraryCard'
import ItineraryTimeline from './components/ItineraryTimeline'
import HotelPreview from './components/HotelPreview'
import FoodPreview from './components/FoodPreview'
import ExpenseChart from '../ExpenseTracker/components/ExpenseChart'
import { HomeItinerary } from './components/HomeItinerary'
import { HomeCategories } from './components/HomeCategories'
import { HomeDestinations } from './components/HomeDestinations'

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }
`

function Home() {
  const navigate = useNavigate()

  const expenses = [
    { name: "Hotel",     amount: 3000 },
    { name: "Food",      amount: 2200 },
    { name: "Transport", amount: 1500 },
    { name: "Others",    amount: 700  },
  ]

  const navigateExpense = () => {
    navigate('/expense-tracker')
  }
// HomeCategories
  return (
    <>
      <style>{fontStyles}</style>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative h-[50vh] sm:h-[75vh] overflow-hidden">
        <img
          src="/assets/Gemini_Generated_Image_oazelooazelooaze.png"
          className="absolute inset-0 h-[50vh] w-full object-fill sm:h-[75vh]"
          alt=""
        />
        <div className="absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/50 via-black/30 to-transparent" />

        <div className="relative z-10 h-full flex items-center sm:items-center pt-10">
          <div className="ml-5 mr-5 sm:ml-20 max-w-xl text-center sm:text-left">
            {/* ↓ Playfair Display for the hero headline */}
            <h1 className="font-playfair text-3xl sm:text-6xl sm:font-bold text-white">
              Welcome to Tripsy
            </h1>
            {/* ↓ DM Sans for body copy */}
            <p className="font-dm mt-4 text-sm sm:text-lg text-white/90 leading-relaxed">
              Your ultimate travel companion for planning trips, tracking expenses,
              and finding the best hotels.
            </p>
            <button
              onClick={() => navigate('/plan-trip')}
              className="font-dm mt-4 sm:mt-8 px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-[#F97316] text-white font-medium shadow-lg cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* ── Top Destinations ──────────────────────────────────────── */}
      <section className="mt-10 px-6 sm:px-20">
        <div className="flex items-center justify-between mb-6">
          {/* ↓ Playfair Display for section headings */}
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1F2937]">
            Top Destinations
          </h2>
        </div>

        <HomeDestinations />
      </section>

      {/* ── Explore by Category ───────────────────────────────────── */}
      <section className="mt-10 px-6 sm:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1F2937]">
            Explore by Category
          </h2>
        </div>
        <HomeCategories />
      </section>

      {/* ── Mobile Expense section ────────────────────────────────── */}
      <section className="sm:hidden mt-12 py-4 mx-6 border-l-2 rounded-sm border-t-2 sm:mx-20 border-gray-400 px-6 sm:px-10 shadow-xs">
        <h3 className="font-playfair text-lg font-bold text-slate-900">
          Manage Your Trip Expenses
        </h3>
        <p className="font-dm text-sm text-slate-600 mt-2 max-w-[90%]">
          Manage your Trip expenses from hotel bookings to food and transport, keep your travel spending organised.
        </p>
        <button className="font-dm mt-3 text-sm font-medium text-orange-500" onClick={navigateExpense}>
          Open Expense Tracker →
        </button>
        <section className="mt-6 px-4">
          <h4 className="font-dm text-sm font-semibold text-slate-700 mb-3">Expense Overview</h4>
          <div className="space-y-4">
            <div>
              <div className="font-dm flex justify-between text-xs text-slate-600 mb-1"><span>Hotel</span><span>₹12,000</span></div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-[65%] bg-orange-400 rounded-full" /></div>
            </div>
            <div>
              <div className="font-dm flex justify-between text-xs text-slate-600 mb-1"><span>Food</span><span>₹5,000</span></div>
              <div className="h-2 bg-slate-200 rounded-full"><div className="h-full w-[35%] bg-orange-300 rounded-full" /></div>
            </div>
            <div>
              <div className="font-dm flex justify-between text-xs text-slate-600 mb-1"><span>Transport</span><span>₹3,000</span></div>
              <div className="h-2 bg-slate-200 rounded-full"><div className="h-full w-[25%] bg-orange-200 rounded-full" /></div>
            </div>
          </div>
        </section>
      </section>

      {/* ── Desktop preview strip ─────────────────────────────────── */}
      <section className="hidden lg:block mt-10 px-20">
        <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-md p-8 shadow-lg">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-8">
            <ItineraryTimeline />
            <HotelPreview />
            <FoodPreview />
          </div>
        </div>
      </section>

      <section className="mt-10 px-6 sm:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1F2937]">
            Itineraries
          </h2>
        </div>
        <HomeItinerary />
      </section>

      <section className="mt-24 px-20 hidden lg:block">
        <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-md p-8 shadow-md grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937] mb-6">Expense Tracker</h3>
            <p className="font-dm text-lg text-gray-600 mt-2">
              Manage your Trip expenses from hotel bookings to food and transport, keep your travel spending organised.
            </p>
            <button className="font-dm mt-3 text-sm font-medium text-orange-500 cursor-pointer" onClick={navigateExpense}>
              Open Expense Tracker →
            </button>
            <div className="space-y-4 mt-8">
              {expenses.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="font-dm text-gray-600">{item.name}</span>
                  <span className="font-dm font-semibold text-[#1F2937]">₹{item.amount}</span>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span className="font-dm">Total</span>
                <span className="font-dm text-[#F97316]">₹7,400</span>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="space-y-4">
              <div>
                <div className="font-dm flex justify-between text-xs text-slate-600 mb-1"><span>Hotel</span><span>₹12,000</span></div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-[65%] bg-orange-400 rounded-full" /></div>
              </div>
              <div>
                <div className="font-dm flex justify-between text-xs text-slate-600 mb-1"><span>Food</span><span>₹5,000</span></div>
                <div className="h-2 bg-slate-200 rounded-full"><div className="h-full w-[35%] bg-orange-300 rounded-full" /></div>
              </div>
              <div>
                <div className="font-dm flex justify-between text-xs text-slate-600 mb-1"><span>Transport</span><span>₹3,000</span></div>
                <div className="h-2 bg-slate-200 rounded-full"><div className="h-full w-[25%] bg-orange-200 rounded-full" /></div>
              </div>
              <div>
                <div className="font-dm flex justify-between text-xs text-slate-600 mb-1"><span>Others</span><span>₹700</span></div>
                <div className="h-2 bg-slate-200 rounded-full"><div className="h-full w-[15%] bg-orange-100 rounded-full" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home