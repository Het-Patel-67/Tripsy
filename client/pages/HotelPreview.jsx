import React from 'react'

function HotelPreview() {
    const hotels =[
    {
      name: "Sea View Resort",
      image: "/hotel1.webp",
        price: 4500
    },
    {
      name: "Mountain Inn",
        image: "/hotel2.webp",
        price: 3800
    },
    {   
        name: "City Lights Hotel",
        image: "/hotel3.webp",
        price: 5200
    }
    ]
  return (
   <div>
  <h4 className="text-lg font-medium text-[#1F2937] mb-4">
    Recommended Hotels
  </h4>

  <div className="space-y-4">
    {hotels.map(hotel => (
      <div className="flex items-center gap-3" key={hotel.name}>
        <img src={hotel.image} className=" h-20 w-20 rounded-md object-cover" />
        <div>
          <p className="text-sm font-medium text-[#1F2937]">
            {hotel.name}
          </p>
          <p className="text-xs text-gray-500">
            ₹{hotel.price}/night
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

  )
}

export default HotelPreview