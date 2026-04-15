import React from 'react'
import ItineraryCard from './components/ItineraryCard'
import ItineraryTimeline from './components/ItineraryTimeline'
import HotelPreview from './components/HotelPreview'
import FoodPreview from './components/FoodPreview'
import ExpenseChart from '../ExpenseTracker/ExpenseChart'

function Home() {
  const destinations = [
    {
      name: "Paris, France",
      image: "/assets/paris.jpg",
    },
    {
      name: "Tokyo, Japan",
      image: "/assets/tokyo.avif",
    },
    {
      name: "New York, USA",
      image: "/assets/newyork.jpg",
    },
    {
      name: "Sydney, Australia",
      image: "/assets/sydney.jpg",
    },
    {
      name: "Rome, Italy",
      image: "/assets/rome.jpg",
    },
    {
      name: "Cape Town, SA",
      image: "/assets/capetown.webp",
    },
    {
      name: "Rio de Janeiro,Brazil",
      image: "/assets/riodejaneiro.jpg",
    },
    {
      name: "Mumbai, India",
      image: "/assets/mumbai.jpg",
    }
  ]

  const categories = [
    {
      title: "Adventure",
      subtitle: "Thrilling experiences",
      icon: "🧗‍♂️"
    }
    ,
    {
      title: "Relaxation",
      subtitle: "Peaceful retreats",
      icon: "🏖️"
    },
    {
      title: "Cultural",
      subtitle: "Heritage sites",
      icon: "🏛️"
    },
    {
      title: "Nature",
      subtitle: "Scenic landscapes",
      icon: "🌲"
    },
    {
      title: "Family",
      subtitle: "Kid-friendly spots",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Romantic",
      subtitle: "Couple getaways",
      icon: "❤️"
    }
  ]

  const itineraries = [
    {
      id: 1,
      title: "Explore the Wonders of Italy",
      duration: "7 Days",
      highlights: ["Rome", "Florence", "Venice", "Tuscany"],
      image: "/assets/italy_itinerary.jpg"
    },
    {
      id: 2,
      title: "Discover Japan's Rich Culture",
      duration: "10 Days",
      highlights: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
      image: "/assets/japan_itinerary.jpg"
    },
    {
      id: 3,
      title: "Himalayan Adventure",
      duration: "12 Days",
      highlights: ["Kathmandu", "Pokhara", "Annapurna Base Camp", "Chitwan National Park"],
      image: "/assets/Himalayan_itinerary.webp"
    }
  ]
  const expenses = [
    { name: "Hotel", amount: 3000 },
    { name: "Food", amount: 2200 },
    { name: "Transport", amount: 1500 },
    { name: "Others", amount: 700 }
  ]
  return (
    <>
      <div className="relative h-[50vh] sm:h-[75vh] overflow-hidden ">
        <img
          src="/assets/Gemini_Generated_Image_oazelooazelooaze.png"
          className="absolute inset-0 h-[50vh] w-full object-fill sm:h-[75vh]"
          alt=""
        />
        <div className="absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/50 via-black/30 to-transparent"></div>

        <div className="relative z-10 h-full flex items-center sm:items-center pt-10">
          <div className=" ml-5 mr-5 sm:ml-20 max-w-xl text-center sm:text-left ">
            <h1 className="text-3xl sm:text-6xl sm:font-extrabold text-white">
              Welcome to Tripsy
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-white/90 leading-relaxed">
              Your ultimate travel companion for planning trips, tracking expenses,
              and finding the best hotels.
            </p>

            <button className="mt-4 sm:mt-8 px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-[#F97316] text-white font-medium shadow-lg cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </div>
      <section className="mt-10 px-6 sm:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">
            Top Destinations
          </h2>
          <button className="text-medium text-[#F97316] hover:underline cursor-pointer">
            View all
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-4">
          {destinations.map((place) => (
            <div
              className=" group relative min-w-60 sm:min-w-75 h-70 sm:h-80 overflow-hidden shadow-md transition hover:shadow-md rounded-md"  key={place.name}
            >
              <img
                src={place.image}
                alt={place.name}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Dark gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
              {/* {Ratings of the place glassbox} */}
              <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.455a1 1 0 00-.364 1.118l1.286 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.455a1 1 0 00-1.176 0l-3.39 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                </svg>
                <span className="text-white font-medium text-sm">4.8</span>
              </div>
              {/* Glass place name */}
              <div className="absolute bottom-4 ">
                <div className="px-4 py-1.5 text-xl font-bold text-[rgb(255,255,255)]">
                  {place.name}
                </div>
              </div>

              {/* CTA Reveal */}
              <button
                className="absolute bottom-4 right-4  opacity-0 group-hover:opacity-100  translate-y-2 group-hover:translate-y-0 transition bg-[#F97316] text-white text-sm px-4 py-2 rounded-full cursor-pointer"
              >
                Visit →
              </button>
            </div>

          ))}
        </div>
      </section>

      <section className="mt-10 px-6 sm:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">
            Explore by Category
          </h2>
          <button className="text-medium text-[#F97316] hover:underline cursor-pointer">
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pb-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-md shadow-md hover:shadow-md transition cursor-pointer"
            >
              <div className="text-5xl">{category.icon}</div>
              <h3 className="text-lg font-semibold text-[#1F2937] hover:text-[#F97316] transition">
                {category.title}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                {category.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="sm:hidden mt-12 py-4 mx-6 border-l-2 rounded-sm border-t-2 sm:mx-20 border-gray-400 px-6 sm:px-10 shadow-xs">
        <h3 className="text-lg font-semibold text-slate-900">
          Manage Your Trip Expenses
        </h3>

        <p className="text-sm text-slate-600 mt-2 max-w-[90%]">
          Manage your Trip expenses from hotel bookings to food and transport, keep your travel spending organised.
        </p>

        <button className="mt-3 text-sm font-medium text-orange-500">
          Open Expense Tracker →
        </button>
        <section className="mt-6 px-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Expense Overview
          </h4>

          <div className="space-y-4">

            {/* Hotel */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Hotel</span>
                <span>₹12,000</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-orange-400 rounded-full"></div>
              </div>
            </div>

            {/* Food */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Food</span>
                <span>₹5,000</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full">
                <div className="h-full w-[35%] bg-orange-300 rounded-full"></div>
              </div>
            </div>

            {/* Transport */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Transport</span>
                <span>₹3,000</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full">
                <div className="h-full w-[25%] bg-orange-200 rounded-full"></div>
              </div>
            </div>

          </div>
        </section>

      </section>

      <section className="hidden lg:block mt-10 px-20">
        <div className=" bg-white/60 backdrop-blur-xl border border-white/30 rounded-md p-8 shadow-lg">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-8">
            <ItineraryTimeline />
            <HotelPreview />
            <FoodPreview />
          </div>
        </div>
      </section>


      <section className="mt-10 px-6 sm:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">
            Itineraries
          </h2>
          <button className="text-medium text-[#F97316] hover:underline cursor-pointer">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {itineraries.map(item => (
            <ItineraryCard key={item.id} {...item} />
          ))}
        </div>
      </section>
      <section className="mt-24 px-20 hidden lg:block">
        <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-md p-8 shadow-md grid grid-cols-3 gap-8">

          {/* Left: Summary */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6">
              Expense Tracker
            </h3>

            <p className="text-lg text-gray-600 mt-2 ">
              Manage your Trip expenses from hotel bookings to food and transport, keep your travel spending organised.
            </p>
            <button className="mt-3 text-sm font-medium text-orange-500 cursor-pointer">
              Open Expense Tracker →
            </button>
            <div className="space-y-4 mt-8">
              {expenses.map(item => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-[#1F2937]">₹{item.amount}</span>
                </div>
              ))}

              <div className="border-t pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#F97316]">₹7,400</span>
              </div>
            </div>
          </div>

          {/* Right: Chart Preview */}
          <div className="mt-10">
            <ExpenseChart />
          </div>
        </div>
      </section>

    </>

  )
}

export default Home