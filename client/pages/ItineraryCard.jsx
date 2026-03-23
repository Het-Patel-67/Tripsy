import React from 'react'

function ItineraryCard({ title, duration, highlights, image }) {

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-md p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-md mb-4" />
      <div className="flex flex-col items-start mb-4">
       
          <h3 className="text-lg font-semibold text-[#1F2937]">{title}</h3>
          <p className="text-sm text-gray-500">{duration}</p>

      </div>
      <ul className="space-y-2 text-sm text-gray-600 mb-4">
        {highlights.map((highlight, index) => (
          <li key={index}>• {highlight}</li>
        ))}
      </ul>
      <div className="w-full text-center">
      <button className="py-2 px-3 bg-[#F97316] text-white rounded-md shadow-lg hover:bg-orange-500 transition cursor-pointer">
        View Details
      </button>
      </div>
    </div>
  )
}
export default ItineraryCard