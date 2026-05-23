import React from 'react'
import { IoMdArrowRoundForward } from "react-icons/io";

function ItineraryTimeline() {
  const days = [
    {
      title: "Day 1: Arrival and Beach Relaxation",
      desc:  "Arrive in Goa, check into your beachside resort, and unwind with a relaxing afternoon on the sandy shores of Baga Beach."
    },
    {
      title: "Day 2: Water Sports and Local Cuisine",
      desc:  "Experience thrilling water sports like jet skiing and parasailing in the morning, followed by a culinary tour of local Goan dishes in the evening."
    },
    {
      title: "Day 3: Cultural Exploration and Sunset Cruise",
      desc:  "Visit the historic churches of Old Goa and explore Panaji's Latin Quarter, then enjoy a serene sunset cruise on the Mandovi River."
    }
  ]

  return (
    <div>
      {/* Playfair Display for the section title */}
      <h3 className="font-playfair text-xl font-bold text-[#1F2937] mb-6">
        Goa Beach Escape
      </h3>

      <div className="relative pl-6 space-y-6">
        <div className="absolute left-1 top-0 bottom-0 w-px bg-gray-200" />

        {days.map((day) => (
          <div key={day.title} className="relative">
            <IoMdArrowRoundForward className="absolute -left-1.5 top-1.5 h-3 w-3 text-[#F97316]" />
            {/* DM Sans for day title — semibold so it still stands out */}
            <h4 className="font-dm font-semibold px-3 text-[#1F2937]">
              {day.title}
            </h4>
            {/* DM Sans for description */}
            <p className="font-dm text-sm text-gray-500 px-3">
              {day.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ItineraryTimeline