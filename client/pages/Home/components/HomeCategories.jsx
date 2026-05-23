import React, { userState } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomeCategories() {
    const navigate = useNavigate()
    const homeCategories = [
        { title: "Adventure", subtitle: "Thrilling experiences", image: "/assets/default/hiking.png" },
        { title: "Entertainment", subtitle: "Fun activities", image: "/assets/default/fair.png" },
        { title: "Beach", subtitle: "Tropical paradises", image: "/assets/default/beach.png" },
        { title: "Nature", subtitle: "Scenic landscapes", image: "/assets/default/national-park.png" },
        { title: "Wildlife", subtitle: "Animal encounters", image: "/assets/default/deer.png" },
        { title: "Mountain", subtitle: "Peak experiences", image: "/assets/default/mountain.png" },
    ]
    const handleCategoryClick = (categoryTitle) => {
        navigate('/plan-trip', { state: { selectedCategories: [categoryTitle] } })
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pb-4">
            {homeCategories.map((category) => (
                <div
                    key={category.title}
                    onClick={() => handleCategoryClick(category.title)}
                    className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-md shadow-md hover:shadow-md transition cursor-pointer"
                >
                    <img src={category.image} alt={category.title} className="h-16 w-16 object-contain" />

                    <h3 className="font-playfair text-lg font-bold text-[#1F2937] hover:text-[#F97316] transition">
                        {category.title}
                    </h3>

                    <p className="font-dm text-sm text-gray-500 text-center">
                        {category.subtitle}
                    </p>
                </div>
            ))}
        </div>
    )
}
