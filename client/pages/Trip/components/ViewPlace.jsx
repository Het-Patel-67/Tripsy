import { useState } from "react";

export default function ViewPlace({ selectedPlace, setSelectedPlace, proxyImg }) {
    return (
        <>
            {
                selectedPlace && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setSelectedPlace(null)}
                        ></div>

                        <div className="relative bg-white w-[95%] md:w-150 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-fadeIn">

                            <button
                                onClick={() => setSelectedPlace(null)}
                                className="absolute top-4 right-4 bg-white/90 hover:bg-red-100 w-10 h-10 rounded-full shadow-md text-xl"
                            >
                                ✕
                            </button>

                            <div className="relative h-75">

                                <img
                                    src={
                                        proxyImg(selectedPlace.image) ||
                                        proxyImg(selectedPlace.images?.[0])
                                    }
                                    alt={selectedPlace.name}
                                    loading="lazy"
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {

                                        
                                        e.currentTarget.onerror = null;

                                        // try original serp image
                                        if (
                                            selectedPlace.images?.[0] &&
                                            e.currentTarget.src !== selectedPlace.images[0]
                                        ) {
                                            e.currentTarget.src =
                                                proxyImg(selectedPlace.images[0]);

                                            return;
                                        }

                                       
                                    }}
                                />
                                <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h2 className="text-3xl font-bold">
                                        {selectedPlace.name}
                                    </h2>

                                    <p className="text-sm opacity-90 mt-1">
                                        {selectedPlace.category}
                                    </p>
                                </div>

                            </div>

                            <div className="p-6">

                                <div className="flex items-center gap-3 mb-5">

                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                        ⭐ {selectedPlace.rating || "4.5"}
                                    </div>

                                    <div className="text-gray-500 text-sm">
                                        Highly rated destination
                                    </div>

                                </div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedPlace.types?.map((type, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">
                                        About this place
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed">
                                        {selectedPlace.description ||
                                            "No description available"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">

                                    <h3 className="text-lg font-semibold mb-3">
                                        Visitor Review
                                    </h3>

                                    <p className="text-gray-600 italic leading-relaxed">
                                        “{selectedPlace.user_review || "Amazing place to visit."}”
                                    </p>

                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
