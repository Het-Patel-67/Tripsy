import React from 'react'
import { IoMdArrowRoundForward } from "react-icons/io";

function FoodPreview() {
  return (
    <div>
      {/* Playfair Display for section heading */}
      <h4 className="font-playfair text-lg font-bold text-[#1F2937] mb-4">
        Popular Restaurants
      </h4>

      {/* DM Sans for all list items */}
      <ul className="font-dm space-y-3 text-sm text-gray-600">
        <li className="flex items-center gap-3">
          <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316] shrink-0" />
          <span>Sunset Diner - Coastal Cuisine</span>
        </li>
        <li className="flex items-center gap-3">
          <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316] shrink-0" />
          <span>Mountain Bistro - Farm to Table</span>
        </li>
        <li className="flex items-center gap-3">
          <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316] shrink-0" />
          <span>City Lights Café - International Flavors</span>
        </li>
        <li className="flex items-center gap-3">
          <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316] shrink-0" />
          <span>Beachside Grill - Seafood Specials</span>
        </li>
        <li className="flex items-center gap-3">
          <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316] shrink-0" />
          <span>Heritage Eatery - Traditional Dishes</span>
        </li>
      </ul>
    </div>
  )
}

export default FoodPreview