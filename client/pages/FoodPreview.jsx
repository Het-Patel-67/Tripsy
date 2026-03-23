import React from 'react'
import { IoMdArrowRoundForward } from "react-icons/io";

function FoodPreview() {
    return (
        <div>
            <h4 className="text-lg font-medium text-[#1F2937] mb-4">
                Popular Restaurants
            </h4>

            <ul className="space-y-3 text-sm text-gray-600">
                
                <li className="flex items-center gap-3">
                    <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316]" />
                    <span>Sunset Diner - Coastal Cuisine</span>
                </li>
                <li className="flex items-center gap-3">
                    <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316]" />
                    <span>Mountain Bistro - Farm to Table</span>
                </li>
                <li className="flex items-center gap-3">
                    <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316]" />
                    <span>City Lights Café - International Flavors</span>
                </li>
                <li className="flex items-center gap-3">
                    <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316]" />
                    <span>Beachside Grill - Seafood Specials</span>
                </li>
                <li className="flex items-center gap-3">
                    <IoMdArrowRoundForward className="h-4 w-4 text-[#F97316]" />
                    <span>Heritage Eatery - Traditional Dishes</span>
                </li>
                
            </ul>
        </div>

    )
}

export default FoodPreview