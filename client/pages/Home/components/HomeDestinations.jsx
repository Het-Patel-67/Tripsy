import React,{ useState} from "react";
import { useNavigate } from "react-router-dom";

export function HomeDestinations() {
    const navigate = useNavigate();
    const homeDestinations = [
      { name: "Ladakh",             image: "/assets/places/ladakh2.jpg"      },
      { name: "Jammu and Kashmir",  image: "/assets/places/jammu.jfif"       },
      { name: "Goa",                image: "/assets/places/goa.webp"         },
      { name: "Rajasthan",          image: "/assets/places/rajasthan.avif"   },
      { name: "Kerala",             image: "/assets/places/kerala.avif"      },
      { name: "Ahmedabad",          image: "/assets/places/ahmedabad.jpg"    },
      { name: "Maharashtra",        image: "/assets/places/maharashtra.jpg"  },
      { name: "Dwarka",             image: "/assets/places/dwarka.jpg"       },
    ]
    const handleDestinationClick = (placeName) => {
    navigate('/plan-trip', { state: { city: placeName } })
  }
  return (
    <div className="flex gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-4">
              {homeDestinations.map((place) => (
                <div
                key={place.name}
                onClick={()=>handleDestinationClick(place.name)}
                  className="group relative min-w-60 sm:min-w-75 h-70 sm:h-80 overflow-hidden shadow-md transition hover:shadow-md rounded-md"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
    
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.455a1 1 0 00-.364 1.118l1.286 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.455a1 1 0 00-1.176 0l-3.39 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                    </svg>
                    <span className="font-dm text-white font-medium text-sm">4.8</span>
                  </div>
    
                  <div className="absolute bottom-4">
                    <div className="font-playfair px-4 py-1.5 text-xl font-bold text-white">
                      {place.name}
                    </div>
                  </div>
    
                  <button
                    onClick={() => handleDestinationClick(place.name)}
                    className="font-dm absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition bg-[#F97316] text-white text-sm px-4 py-2 rounded-full cursor-pointer"
                  >
                    Visit →
                  </button>
                </div>
              ))}
            </div>
  )}