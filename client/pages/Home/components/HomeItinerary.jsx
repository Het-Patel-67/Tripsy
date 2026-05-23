import React, { useState } from "react"
import ItineraryCard from "./ItineraryCard";
import { useNavigate } from "react-router-dom";

export function HomeItinerary() {
    const navigate = useNavigate();

    const homeItineraries = [
        {
            id: 1,
            title: "Explore Gujarat",
            duration: "10 Days",
            highlights: ["Ahmedabad", "Kutchh", "Saputara", "Junagadh"],
            image: "/assets/places/gujarat.webp",
            destination: "Gujarat",
            days: 10,
            categories: ["Culture", "Historical", "Tourist"],
        },
        {
            id: 2,
            title: "Explore Kerala",
            duration: "10 Days",
            highlights: ["Kochi", "Munnar", "Wayanad", "Alleppey"],
            image: "/assets/places/kerala.avif",
            destination: "Kerala",
            days: 10,
            categories: ["Culture", "Historical", "Tourist"],
        },
        {
            id: 3,
            title: "Jammu Kashmir",
            duration: "10 Days",
            highlights: ["Srinagar", "Pahalgam", "Gulmarg", "Sonamarg"],
            image: "/assets/places/Jammu.webp",
            destination: "Jammu and Kashmir",
            days: 10,
            categories: ["Adventure", "Nature", "Mountain"],
        },
    ]
    const handleItineraryClick = (item) => {
        navigate('/plan-trip', {
            state: {
                city: item.destination,
                days: item.days,
                selectedCategories: item.categories,
            },
        })
    }
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {homeItineraries.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleItineraryClick(item)}
                        className="cursor-pointer"
                    >
                        <ItineraryCard {...item} />
                    </div>
                ))}
            </div>
        </>
    )
}


