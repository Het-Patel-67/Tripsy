import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  generateItinerary,
  getHotelRecommendations,
} from "../../src/services/apiService.js";
import API from "../../src/services/apiService.js";
import HotelSection from "./Hotel.jsx";
import ViewPlace from "./components/ViewPlace.jsx";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

// VITE
const minimalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');

  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }

  .hero-glow::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(217,119,6,0.18) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(14,165,233,0.12) 0%, transparent 40%);
    pointer-events: none;
  }

  .pill-check {
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.15s, transform 0.15s;
    font-size: 11px;
  }
  .pill-is-active .pill-check {
    opacity: 1;
    transform: scale(1);
  }

  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }
  .animate-pulse-dot { animation: pulseDot 1.2s ease-in-out infinite; }

  @keyframes highlightPop {
    0%   { box-shadow: 0 0 0 0 rgba(217,119,6,0.5); }
    60%  { box-shadow: 0 0 0 8px rgba(217,119,6,0); }
    100% { box-shadow: none; }
  }
  .prefill-highlight {
    animation: highlightPop 0.8s ease-out forwards;
  }

  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #f0ece8 25%, #e8e2dc 50%, #f0ece8 75%);
    background-size: 600px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 8px;
  }
`;

const CAT_ICONS = {
  Tourist: "🏛️",
  Nature: "🌲",
  Adventure: "🧗‍♂️",
  Historical: "🏰",
  Spiritual: "🛕",
  Culture: "🎭",
  Wildlife: "🦁",
  Beach: "🏖️",
  Mountain: "⛰️",
  Entertainment: "🎡",
};

const categories = [
  "Tourist", "Nature", "Adventure", "Historical", "Spiritual",
  "Culture", "Wildlife", "Beach", "Mountain", "Entertainment",
];

function ItinerarySkeleton({ days = 3 }) {
  return (
    <div className="mb-5 mt-10">
      <div className="mb-5 flex flex-wrap items-baseline gap-3">
        <div className="skeleton h-7 w-36 rounded-lg" />
        <div className="skeleton h-4 w-48 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: days }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
            <div className="skeleton h-44 w-full rounded-none" />
            <div className="p-4 space-y-4">
              {["Morning", "Afternoon", "Evening"].map((slot) => (
                <div key={slot}>
                  <div className="skeleton mb-2 h-3 w-20 rounded" />
                  {Array.from({ length: i === 0 ? 2 : 1 }).map((_, j) => (
                    <div key={j} className="skeleton mb-1.5 h-9 w-full rounded-xl" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SuccessPopup({ message, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(28,25,23,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="pop-in font-dm w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"
        style={{ border: "1px solid #E7DDD0" }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{ background: "rgba(217,119,6,0.1)", border: "1.5px solid rgba(217,119,6,0.25)" }}
        >
          {message.title === "Error" ? "✕" : "✓"}
        </div>
        <h3 className="font-playfair mb-2 text-xl font-bold text-[#1C1917]">
          {message.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-stone-500">
          {message.body}
        </p>
        <button
          onClick={onClose}
          className="w-full cursor-pointer rounded-xl bg-linear-to-br from-amber-600 to-amber-700 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(217,119,6,0.35)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(217,119,6,0.45)]"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function Trip() {
  const location = useLocation();
  const navigate = useNavigate();

  const prefillCity = location.state?.city ?? "";
  const prefillDays = location.state?.days ?? 3;
  const prefillCategories = location.state?.selectedCategories ?? [];

  const [city, setCity] = useState(prefillCity);
  const [days, setDays] = useState(prefillDays);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [itinerary, setItinerary] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [budget, setBudget] = useState("medium");
  const [selectedItems, setSelectedItems] = useState(prefillCategories);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popMsg, setPopMsg] = useState({ title: "", body: "" });
  const [justPrefilled, setJustPrefilled] = useState(prefillCity !== "");

  useEffect(() => {
    if (location.state?.city !== undefined) setCity(location.state.city);
    if (location.state?.days !== undefined) setDays(location.state.days);
    if (location.state?.selectedCategories !== undefined) setSelectedItems(location.state.selectedCategories);
    if (location.state?.city) setJustPrefilled(true);
    window.history.replaceState({}, document.title);
  }, [location.state]);

  useEffect(() => {
    if (justPrefilled) {
      const t = setTimeout(() => setJustPrefilled(false), 900);
      return () => clearTimeout(t);
    }
  }, [justPrefilled]);

  const getEndDate = (start, duration) => {
    const [year, month, day] = start.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + Math.max(1, Number(duration) || 1) - 1);
    return date.toISOString().slice(0, 10);
  };

  const endDate = getEndDate(startDate, days);

  const toggleSelection = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handlePopupClose = () => setIsOpen(false);

  // ── BUG 1 FIX: proxy image URL uses env variable, not hardcoded localhost ──
  // In production localhost:8000 doesn't exist on the user's machine.
  // VITE_API_URL is set to "" in production (same-origin) or the dev server URL.
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const proxyImg = (url) =>
    url ? `${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}` : "";

  const handleGenerate = async () => {
    if (!city.trim()) {
      // BUG 10 FIX: use SuccessPopup instead of alert()
      setPopMsg({ title: "Error", body: "Please enter a destination." });
      setIsOpen(true);
      return;
    }
    const trimmedCity = city.trim();
    setLoadingItinerary(true);
    setItinerary(null);
    setHotels([]);

    try {
      const res = await generateItinerary({
        city: trimmedCity,
        days: Number(days),
        budget,
        startDate,
        preferences: selectedItems,
      });

      const formatted = res.data.itinerary.map((day) => {

        const slots = { Morning: [], Afternoon: [], Evening: [] };
        day.places.forEach((place) => {
          if (slots[place.time]) slots[place.time].push({ ...place });
        });
        return { ...day, slots };
      });

      setItinerary(formatted);
      
      setLoadingItinerary(false);

      setLoadingHotels(true);
      try {
        // getHotelRecommendations returns the hotels array directly (res.data.hotels
        // is unwrapped inside apiService.js) — no further destructuring needed.
        // stateName is pulled from the itinerary response and falls back to ""
        // so the hotel controller's location filter always receives a string.
        const stateName =
          res.data.itinerary[0]?.places?.[0]?.stateName ?? "";

        const fetchedHotels = await getHotelRecommendations(
          res.data.itinerary,
          budget,
          trimmedCity,
          stateName
        );

        setHotels(fetchedHotels || []);
      } catch (err) {
        console.error("Hotel fetch error:", err);
      } finally {
        setLoadingHotels(false);
      }

    } catch (err) {
      console.error(err);
      setLoadingItinerary(false);
      setPopMsg({
        title: "Error",
        body: "Please Enter Correct City/State of India",
      });
      setIsOpen(true);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const [, srcDay, srcSlot] = source.droppableId.split("-");
    const [, destDay, destSlot] = destination.droppableId.split("-");

    const sourceDayIndex = Number(srcDay);
    const destDayIndex = Number(destDay);

    const updated = itinerary.map((day) => ({
      ...day,
      slots: {
        Morning: [...day.slots.Morning],
        Afternoon: [...day.slots.Afternoon],
        Evening: [...day.slots.Evening],
      },
      places: [...day.places],
    }));

    const sourceItems = updated[sourceDayIndex].slots[srcSlot];
    const destItems = updated[destDayIndex].slots[destSlot];

    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.time = destSlot;
    destItems.splice(destination.index, 0, movedItem);

    const rebuildPlaces = (day) => [
      ...day.slots.Morning,
      ...day.slots.Afternoon,
      ...day.slots.Evening,
    ];

    updated[sourceDayIndex].places = rebuildPlaces(updated[sourceDayIndex]);
    if (sourceDayIndex !== destDayIndex) {
      updated[destDayIndex].places = rebuildPlaces(updated[destDayIndex]);
    }

    setItinerary(updated);
  };

  const handleSave = async () => {
    try {
      // Send the raw itinerary shape the backend expects.
      // The `formatted` state has extra `slots` keys added for the drag-and-drop
      // UI — strip those so the save payload matches the backend schema.
      const rawItinerary = itinerary.map(({ slots, ...rest }) => rest);

      await API.post("/api/itinerary/save", {
        cityName: city.trim(),
        stateName: itinerary[0]?.places?.[0]?.stateName || "",
        days: Number(days),
        startDate,
        itinerary: rawItinerary,
      });
      setPopMsg({ title: "Itinerary Saved! 🗂️", body: "Your itinerary has been saved successfully." });
      setIsOpen(true);
    } catch (err) {
      setPopMsg({
        title: "Error",
        body: "Failed to save itinerary. Please try again.",
      });
      setIsOpen(true);
    }
  };

  return (
    <>
      <style>{minimalStyles}</style>
      {isOpen && <SuccessPopup message={popMsg} onClose={handlePopupClose} />}
      <div className="font-dm min-h-screen bg-orange-50/40 text-[#1C1917]">

        {/* ── Hero banner ── */}
        <div
          className="hero-glow relative overflow-hidden px-8 pt-18 pb-12"
          style={{ background: "linear-gradient(135deg, #1C1917 0%, #292524 60%, #1C3557 100%)" }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-80 w-80 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute right-10 top-10 h-52 w-52 rounded-full border border-amber-500/10" />
          <div className="relative z-10 max-w-2xl">
            <span className="mb-4 inline-block rounded-full border border-amber-400/35 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
              Trip Planner
            </span>
            <h1 className="font-playfair mb-3 text-4xl font-bold leading-tight text-white md:text-5xl">
              Plan Your{" "}
              <em className="italic text-amber-400">Perfect</em>
              <br />
              Journey
            </h1>
            <p className="max-w-md text-[15px] text-white/55">
              Craft a personalised day-by-day itinerary in seconds — powered by TRIPSY.
            </p>
          </div>
        </div>

        {/* ── Form card ── */}
        <div className="mx-auto max-w-6xl mt-10 px-5 py-5 border-[#E7DDD0] rounded-2xl bg-[#FFFCF9]">
          <div className="rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-8 shadow-[0_4px_24px_rgba(28,25,23,0.07)]">

            {prefillCity && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                <span>✨</span>
                <span>
                  We've pre-filled your destination
                  {prefillCategories.length > 0 && " and interests"} — adjust
                  anything below and hit <strong>Generate</strong>.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">

              {/* Destination */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  Destination
                </label>
                <div className={`flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.12)] ${justPrefilled ? "prefill-highlight" : ""}`}>
                  <span className="shrink-0 text-base">📍</span>
                  <input
                    type="text"
                    placeholder="Enter City/State name only"
                    value={city}
                    onChange={(e) => setCity(e.target.value.trimStart())}
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#1C1917] outline-none placeholder:text-stone-300"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  Duration
                </label>
                <div className="flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.12)]">
                  <span className="shrink-0 text-base">🗓️</span>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    min="1"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#1C1917] outline-none"
                  />
                  <span className="shrink-0 text-xs text-stone-400">days</span>
                </div>
              </div>

              {/* Start Date */}
              <div className="lg:col-span-3">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  Start Date
                </label>
                <div className="flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.12)]">
                  <span className="shrink-0 text-base">📅</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#1C1917] outline-none"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="lg:col-span-3">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  Budget
                </label>
                <div className="flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.12)]">
                  <span className="shrink-0 text-base">💰</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-sm text-[#1C1917] outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <span className="shrink-0 text-xs text-stone-300">▾</span>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E7DDD0]" />
              <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                Interests
              </span>
              <div className="h-px flex-1 bg-[#E7DDD0]" />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = selectedItems.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleSelection(cat)}
                    className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] transition-all duration-150 ${isActive
                      ? "pill-is-active border-amber-500 bg-amber-500/10 font-semibold text-amber-600"
                      : "border-[#E7DDD0] bg-white font-medium text-stone-400 hover:border-amber-400 hover:text-amber-600"
                      }`}
                  >
                    <span className="text-sm">{CAT_ICONS[cat]}</span>
                    {cat}
                    <span className="pill-check text-amber-600">✓</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={loadingItinerary}
                className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-amber-600 px-9 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(217,119,6,0.35)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(217,119,6,0.45)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loadingItinerary ? (
                  <>
                    <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-white" />
                    Generating…
                  </>
                ) : (
                  "Generate Itinerary"
                )}
              </button>
            </div>
          </div>

          {loadingItinerary && <ItinerarySkeleton days={Number(days) || 3} />}

          {itinerary && (
            <>
              <div className="mb-5 mt-10 flex flex-wrap items-baseline gap-3">
                <h2 className="font-playfair text-2xl font-bold text-[#1C1917]">
                  Your Itinerary
                </h2>
                <span className="text-sm text-stone-400">
                  {city} · {days} days · {startDate} → {endDate}
                </span>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {itinerary.map((day, dayIndex) => (
                    <div
                      key={day.day}
                      className="overflow-hidden rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] shadow-[0_2px_12px_rgba(28,25,23,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(28,25,23,0.1)]"
                    >
                      <div className="relative h-45 overflow-hidden">
                        <img
                          src={proxyImg(day.places[0]?.image)}
                          alt=""
                          onError={(e) => {
                            const fallback = day.places[0]?.images?.[1];
                            e.target.src = fallback
                              ? proxyImg(fallback)
                              : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800";
                          }}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-3">
                          <div className="font-playfair text-sm font-semibold text-white">Day {day.day}</div>
                          <div className="text-[11px] text-white/65">{day.date}</div>
                        </div>
                      </div>

                      <div className="p-4">
                        {["Morning", "Afternoon", "Evening"].map((slot) => {
                          const filtered = day.places.filter((p) => p.time === slot);
                          const slotEmoji = slot === "Morning" ? "🌅" : slot === "Afternoon" ? "☀️" : "🌇";

                          return (
                            <div key={slot} className="mb-3.5">
                              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                                <span>{slotEmoji}</span>
                                {slot}
                              </div>

                              <Droppable droppableId={`day-${dayIndex}-${slot}`}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-6 rounded-lg transition-colors duration-150 ${snapshot.isDraggingOver ? "bg-amber-50" : ""}`}
                                  >
                                    {filtered.map((p, i) => (
                                      <Draggable
                                        key={`${day.day}-${p.name}-${i}`}
                                        draggableId={`${day.day}-${p.name}-${i}`}
                                        index={i}
                                      >
                                        {(dragProvided) => (
                                          <div
                                            ref={dragProvided.innerRef}
                                            {...dragProvided.draggableProps}
                                            {...dragProvided.dragHandleProps}
                                            className="mb-1.5 flex cursor-grab items-center justify-between rounded-xl border border-[#E7DDD0] bg-white px-3 py-2 transition-all duration-150 hover:border-amber-300 hover:shadow-[0_2px_8px_rgba(217,119,6,0.1)] active:cursor-grabbing"
                                          >
                                            <div className="flex items-center gap-2 text-sm font-medium text-[#1C1917]">
                                              <span className="text-xs text-stone-200">⠿</span>
                                              {p.name}
                                            </div>
                                            <button
                                              onClick={() => setSelectedPlace(p)}
                                              className="cursor-pointer rounded-md border-none bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 transition-colors duration-150 hover:bg-sky-100"
                                            >
                                              View
                                            </button>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {filtered.length === 0 && (
                                      <div className="py-1 text-center text-xs text-stone-200">Drop here</div>
                                    )}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          );
                        })}

                        {day.places.length === 0 && (
                          <p className="py-2 text-center text-sm text-stone-300">No places planned</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DragDropContext>

              <div className="mt-7 flex justify-center">
                <button
                  onClick={handleSave}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-br from-sky-700 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(3,105,161,0.3)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(3,105,161,0.4)] active:translate-y-0"
                >
                  Save Itinerary
                </button>
              </div>
            </>
          )}

          <ViewPlace selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} proxyImg={proxyImg} />

          {loadingHotels && (
            <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-5 text-sm text-stone-400">
              <div className="animate-pulse-dot h-2 w-2 rounded-full bg-amber-500" />
              Finding the best hotels for you…
            </div>
          )}

          {hotels.length > 0 && (
            <div className="mt-5">
              <HotelSection hotels={hotels} />
            </div>
          )}
          
        </div>
      </div>
    </>
  );
}

export default Trip;