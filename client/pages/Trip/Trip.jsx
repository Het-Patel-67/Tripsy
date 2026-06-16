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
        <div className="mx-auto max-w-6xl mt-10 px-5 md:py-5 border-[#E7DDD0] rounded-2xl bg-[#FFFCF9]">
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
                  <svg width="34px" height="34px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M513.2 56.6c-164 0-296.9 131-296.9 292.6 0 50.2 12.8 97.4 35.4 138.6 37.7 69 166.6 266.1 228.3 359.6 29.8 27.9 59 6.4 66.5 0 61.3-93.3 189.3-289.6 227.3-357.6 23.3-41.7 36.5-89.7 36.5-140.6-0.2-161.6-133.1-292.6-297.1-292.6z m214.2 413.6c-36.1 61-163.5 264.3-202.7 326.8-8.2 2.9-15.9 2.5-23 0-38.9-62.3-165.5-264.9-201.8-325.2-21.7-36.1-34.2-78.2-34.2-123.1 0-134 110.8-242.7 247.4-242.7s247.4 108.6 247.4 242.7c0.1 44.3-12 85.8-33.1 121.5z" fill="#EF6D64"></path><path d="M513.2 477.7c-70.8 0-128.4-57.6-128.4-128.4s57.6-128.4 128.4-128.4 128.4 57.6 128.4 128.4S584 477.7 513.2 477.7z m0-208.7c-44.3 0-80.3 36-80.3 80.3s36 80.3 80.3 80.3 80.3-36 80.3-80.3-36-80.3-80.3-80.3zM511.9 969.6c-163.4 0-286.6-59.6-286.6-138.7 0-46.1 42.4-87.2 116.4-112.7 11.5-4 24.1 2.1 28 13.6 4 11.5-2.1 24.1-13.6 28-53.5 18.5-86.7 45.7-86.7 71.1 0 44.7 99.6 94.6 242.5 94.6s242.5-49.9 242.5-94.6c0-25.4-33.3-52.6-86.8-71.1-11.5-4-17.6-16.5-13.6-28 4-11.5 16.5-17.6 28-13.6 74 25.5 116.5 66.7 116.5 112.8 0 78.9-123.2 138.6-286.6 138.6z" fill="#EF6D64"></path></g></svg>
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
                  <svg
                    viewBox="0 0 24 24"
                    id="month-left"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 flat-line"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                      <path
                        id="secondary"
                        d="M3,9v6H9v6H20a1,1,0,0,0,1-1V9Z"
                        style={{ fill: '#2ca9bc', strokeWidth: 0.744 }}
                      />
                      <path
                        id="primary"
                        d="M4,4H20a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H9L3,15V5A1,1,0,0,1,4,4ZM3,15l6,6V15ZM3,5V9H21V5a1,1,0,0,0-1-1H4A1,1,0,0,0,3,5ZM7,3V5m5-2V5m5-2V5"
                        style={{ fill: 'none', stroke: '#000000', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 0.744 }}
                      />
                    </g>
                  </svg>

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
                  <svg
                    viewBox="0 0 512 512"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    fill="#000000"
                    className="h-6 w-6 shrink-0"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                      <path style={{ fill: '#FFDB6C' }} d="M392.943,121.165h-66.722c-3.875-16.598-10.484-32.089-19.324-45.367h86.047 c18.639,0,33.748-15.109,33.748-33.748S411.582,8.301,392.943,8.301H119.056c-18.639,0-33.748,15.109-33.748,33.748 s15.109,33.748,33.748,33.748h64.511c31.52,0,58.785,18.811,71.491,45.367H119.056c-18.639,0-33.748,15.109-33.748,33.748 s15.109,33.748,33.748,33.748h136.1c-12.662,26.556-39.986,45.367-71.59,45.367h-64.511c-18.639,0-33.748,14.556-33.748,33.195 c0,9.821,4.199,18.384,10.896,24.551l181.389,200.37c6.662,7.364,15.832,11.04,25.037,11.04c8.073,0,16.173-2.913,22.63-8.756 c13.822-12.505,14.891-33.864,2.387-47.685L194.887,300.535c64.217-4.966,116.982-52.123,131.387-111.875h66.669 c18.639,0,33.749-15.109,33.749-33.748S411.582,121.165,392.943,121.165z" />
                      <g>
                        <path style={{ fill: '#FFB04C' }} d="M405.668,18.935c-0.066,18.704-15.73,33.627-34.435,33.627h-57.16 c-12.164,0-20.36,12.326-15.778,23.594c1.268,3.12,2.434,6.306,3.492,9.549c2.365,7.25,9.029,12.224,16.654,12.224h0.266 c-3.301-7.862-7.257-15.291-11.81-22.13h85.335c18.444,0,34.02-14.501,34.45-32.941c0.347-14.888-8.948-27.652-22.079-32.486 C405.308,13.107,405.679,15.976,405.668,18.935z" />
                        <path style={{ fill: '#FFB04C' }} d="M119.056,75.798h64.511c17.575,0,33.823,5.852,46.965,15.631 c-13.81-23.071-39.11-38.867-67.988-38.867H98.032c-4.099,0-8.026-0.731-11.66-2.07C90.121,65.045,103.332,75.798,119.056,75.798z" />
                        <path style={{ fill: '#FFB04C' }} d="M404.603,123.235c0.705,2.735,1.074,5.606,1.064,8.563c-0.066,18.704-15.73,33.627-34.435,33.627 h-50.331c-8.901,0-16.838,5.607-19.803,14.001c-18.718,52.984-68.125,93.303-127.236,97.874l21.093,23.23 c64.185-4.995,116.918-52.138,131.317-111.868h65.958c18.444,0,34.02-14.501,34.45-32.941 C427.03,140.833,417.734,128.069,404.603,123.235z" />
                        <path style={{ fill: '#FFB04C' }} d="M307.825,424.915c11.214,13.829,9.773,34.19-3.588,46.277c-6.458,5.842-14.557,8.756-22.63,8.756 c-9.205,0-18.376-3.675-25.037-11.04l21.024,23.237c6.662,7.364,15.832,11.04,25.037,11.04c8.073,0,16.173-2.913,22.63-8.756 c13.823-12.505,14.891-33.864,2.387-47.685L307.825,424.915z" />
                        <path style={{ fill: '#FFB04C' }} d="M217.503,188.462c8.656-8.355,2.574-23.036-9.457-23.036H98.032c-4.099,0-8.026-0.731-11.66-2.07 c3.748,14.554,16.961,25.307,32.684,25.307h98.239C217.365,188.595,217.433,188.529,217.503,188.462z" />
                      </g>
                      <path d="M392.943,112.864H332.66c-2.808-10.057-6.617-19.767-11.273-28.769h71.557c23.185,0,42.047-18.863,42.047-42.047 S416.129,0,392.944,0H119.056C95.871,0,77.009,18.863,77.009,42.047s18.863,42.047,42.047,42.047h64.511 c22.431,0,43.529,10.96,56.822,28.769H119.056c-23.185,0-42.047,18.863-42.047,42.047s18.863,42.047,42.047,42.047h121.447 c-13.279,17.809-34.419,28.769-56.936,28.769h-64.511c-23.185,0-42.047,18.739-42.047,41.771c0,11.666,4.714,22.49,13.281,30.523 l181.148,200.173c7.937,8.773,19.305,13.806,31.191,13.806c10.427,0,20.441-3.865,28.198-10.884 c8.329-7.535,13.225-17.863,13.786-29.082c0.561-11.221-3.279-21.986-10.818-30.321L211.667,306.963 c44.675-8.307,83.878-36.25,106.933-76.969c2.258-3.988,0.855-9.052-3.133-11.311c-3.988-2.257-9.052-0.855-11.311,3.133 c-23.07,40.742-64.156,67.178-109.909,70.716c-3.158,0.245-5.901,2.264-7.072,5.206s-0.564,6.294,1.562,8.641l132.753,146.475 c4.561,5.041,6.885,11.557,6.545,18.35c-0.34,6.792-3.303,13.044-8.345,17.605c-4.7,4.252-10.76,6.594-17.062,6.594 c-7.204,0-14.087-3.041-18.884-8.343L102.357,286.619c-0.169-0.187-0.346-0.366-0.531-0.537c-5.3-4.88-8.219-11.48-8.219-18.584 c0-13.88,11.417-25.173,25.45-25.173h64.511c33.529,0,64.57-19.664,79.081-50.094c1.226-2.57,1.047-5.591-0.472-8 c-1.52-2.409-4.17-3.869-7.019-3.869h-136.1c-14.033,0-25.45-11.416-25.45-25.45c0-14.034,11.417-25.45,25.45-25.45h136.002 c2.85,0,5.502-1.463,7.021-3.875c1.52-2.412,1.695-5.434,0.465-8.006c-14.557-30.426-45.558-50.085-78.978-50.085h-64.511 c-14.033,0-25.45-11.416-25.45-25.45s11.417-25.45,25.45-25.45h273.887c14.033,0,25.45,11.416,25.45,25.45 s-11.417,25.45-25.45,25.45h-86.046c-3.06,0-5.871,1.683-7.315,4.381c-1.445,2.698-1.288,5.971,0.407,8.517 c8.255,12.398,14.531,27.148,18.151,42.655c0.876,3.755,4.225,6.412,8.082,6.412h66.721c14.033,0,25.45,11.416,25.45,25.45 c0,14.034-11.417,25.45-25.45,25.45h-66.97c-4.583,0-8.299,3.715-8.299,8.299c0,4.584,3.716,8.299,8.299,8.299h66.97 c23.185,0,42.047-18.863,42.047-42.047S416.128,112.864,392.943,112.864z" />
                    </g>
                  </svg>

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
                          const slotEmoji = slot === "Morning" ? <svg
                            viewBox="0 0 512.088 512.088"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            xmlSpace="preserve"
                            fill="#000000"
                            className="h-6 w-6 shrink-0"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                              <g transform="translate(-1)">
                                <g>
                                  <path style={{ fill: '#F29C1F' }} d="M239.407,189.837c-4.873,0-8.828-3.955-8.828-8.828v-52.966c0-4.873,3.955-8.828,8.828-8.828 c4.873,0,8.828,3.955,8.828,8.828v52.966C248.234,185.882,244.279,189.837,239.407,189.837" />
                                  <path style={{ fill: '#F29C1F' }} d="M124.648,304.596H71.682c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828h52.966 c4.873,0,8.828,3.955,8.828,8.828C133.476,300.641,129.521,304.596,124.648,304.596" />
                                  <path style={{ fill: '#F29C1F' }} d="M407.131,304.596h-52.966c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828 h52.966c4.873,0,8.828,3.955,8.828,8.828C415.958,300.641,412.004,304.596,407.131,304.596" />
                                  <path style={{ fill: '#F29C1F' }} d="M451.269,304.596h-8.828c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828h8.828 c4.873,0,8.828,3.955,8.828,8.828C460.096,300.641,456.142,304.596,451.269,304.596" />
                                  <path style={{ fill: '#F29C1F' }} d="M36.372,304.596h-8.828c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828h8.828 c4.873,0,8.828,3.955,8.828,8.828C45.2,300.641,41.245,304.596,36.372,304.596" />
                                  <path style={{ fill: '#F29C1F' }} d="M320.553,223.449c-2.26,0-4.52-0.865-6.241-2.586c-3.452-3.452-3.452-9.031,0-12.482l24.973-24.973 c3.443-3.443,9.031-3.443,12.482,0c3.443,3.452,3.443,9.039,0,12.482l-24.973,24.973 C325.073,222.584,322.813,223.449,320.553,223.449" />
                                  <path style={{ fill: '#F29C1F' }} d="M371.82,172.182c-2.26,0-4.52-0.865-6.241-2.586c-3.452-3.452-3.452-9.031,0-12.482l17.655-17.655 c3.452-3.452,9.031-3.452,12.482,0c3.452,3.452,3.452,9.031,0,12.482l-17.655,17.655 C376.34,171.317,374.08,172.182,371.82,172.182" />
                                  <path style={{ fill: '#F29C1F' }} d="M158.26,223.449c-2.26,0-4.52-0.865-6.241-2.586l-24.973-24.973c-3.443-3.443-3.443-9.031,0-12.482 c3.452-3.443,9.039-3.443,12.482,0l24.973,24.973c3.452,3.452,3.452,9.031,0,12.482C162.78,222.584,160.52,223.449,158.26,223.449 " />
                                  <path style={{ fill: '#F29C1F' }} d="M106.993,172.182c-2.26,0-4.52-0.865-6.241-2.586L83.097,151.94c-3.452-3.452-3.452-9.031,0-12.482 c3.452-3.452,9.031-3.452,12.482,0l17.655,17.655c3.452,3.452,3.452,9.031,0,12.482 C111.513,171.317,109.253,172.182,106.993,172.182" />
                                  <path style={{ fill: '#F29C1F' }} d="M239.407,101.561c-4.873,0-8.828-3.955-8.828-8.828v-8.828c0-4.873,3.955-8.828,8.828-8.828 c4.873,0,8.828,3.955,8.828,8.828v8.828C248.234,97.607,244.279,101.561,239.407,101.561" />
                                </g>
                                <path style={{ fill: '#F0C419' }} d="M239.407,181.01c-63.382,0-114.759,51.377-114.759,114.759c0,15.078,3.054,29.387,8.351,42.558 c22.563-5.579,46.239-6.223,69.367-1.024c7.98,1.792,11.591,8.121,19.385,11.432c1.395-1.059,7.133-5.95,8.554-7.044 c35.054-26.959,79.651-39.636,122.995-32.406c0.521-4.44,0.865-8.934,0.865-13.515C354.165,232.386,302.789,181.01,239.407,181.01" />
                                <path style={{ fill: '#358E4C' }} d="M106.993,410.527c0,0,17.514,11.564,117.575-64.468c-7.283-3.319-16.04-7.371-22.201-8.757 c-45.798-10.293-93.758,2.251-130.957,30.87C41.377,391.274,18.443,408.964,1,419.354h105.993V410.527z" />
                                <path style={{ fill: '#4FBA6F' }} d="M106.993,410.527c0,0,18.123,12.076,123.313-68.838c37.199-28.619,85.16-41.163,130.957-30.87 c26.633,5.985,53.433,19.421,72.351,46.742c29.564,42.699,59.118,67.866,79.475,79.448H106.993V410.527z" />
                                <g>
                                  <path style={{ fill: '#358E4C' }} d="M336.51,348.734h-17.655c-4.873,0-8.828-3.955-8.828-8.828s3.955-8.828,8.828-8.828h17.655 c4.873,0,8.828,3.955,8.828,8.828S341.383,348.734,336.51,348.734" />
                                  <path style={{ fill: '#358E4C' }} d="M292.372,375.217h-17.655c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828 h17.655c4.873,0,8.828,3.955,8.828,8.828C301.2,371.262,297.245,375.217,292.372,375.217" />
                                  <path style={{ fill: '#358E4C' }} d="M380.648,375.217h-17.655c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828 h17.655c4.873,0,8.828,3.955,8.828,8.828C389.476,371.262,385.521,375.217,380.648,375.217" />
                                  <path style={{ fill: '#358E4C' }} d="M424.786,401.699h-17.655c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828 h17.655c4.873,0,8.828,3.955,8.828,8.828C433.614,397.745,429.659,401.699,424.786,401.699" />
                                  <path style={{ fill: '#358E4C' }} d="M336.51,401.699h-17.655c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828h17.655 c4.873,0,8.828,3.955,8.828,8.828C345.338,397.745,341.383,401.699,336.51,401.699" />
                                  <path style={{ fill: '#358E4C' }} d="M248.234,401.699h-17.655c-4.873,0-8.828-3.955-8.828-8.828c0-4.873,3.955-8.828,8.828-8.828 h17.655c4.873,0,8.828,3.955,8.828,8.828C257.062,397.745,253.107,401.699,248.234,401.699" />
                                </g>
                              </g>
                            </g>
                          </svg>
                            : slot === "Afternoon" ? <svg
                              viewBox="0 0 36 36"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              ariaHidden="true"
                              role="img"
                              preserveAspectRatio="xMidYMid meet"
                              fill="#000000"
                              className="h-6 w-6 shrink-0 iconify iconify--twemoji"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                              <g id="SVGRepo_iconCarrier">
                                <path fill="#FFAC33" d="M16 2s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2V2zm18 14s2 0 2 2s-2 2-2 2h-2s-2 0-2-2s2-2 2-2h2zM4 16s2 0 2 2s-2 2-2 2H2s-2 0-2-2s2-2 2-2h2zm5.121-8.707s1.414 1.414 0 2.828s-2.828 0-2.828 0L4.878 8.708s-1.414-1.414 0-2.829c1.415-1.414 2.829 0 2.829 0l1.414 1.414zm21 21s1.414 1.414 0 2.828s-2.828 0-2.828 0l-1.414-1.414s-1.414-1.414 0-2.828s2.828 0 2.828 0l1.414 1.414zm-.413-18.172s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zm-21 21s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zM16 32s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2v-2z"></path>
                                <circle fill="#FFAC33" cx="18" cy="18" r="10"></circle>
                              </g>
                            </svg>
                              : <svg
                                viewBox="0 0 512 512"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                xmlSpace="preserve"
                                fill="#000000"
                                className="h-6 w-6 shrink-0"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                <g id="SVGRepo_iconCarrier">
                                  <rect y="297.796" style={{ fill: '#31C0D8' }} width="512" height="203.755" />
                                  <path style={{ fill: '#FFD248' }} d="M360.49,297.796H151.51c0-57.673,46.811-104.49,104.49-104.49 C313.673,193.306,360.49,240.123,360.49,297.796z" />
                                  <g>
                                    <rect x="245.551" y="120.163" style={{ fill: '#231F20' }} width="20.898" height="47.02" />
                                    <rect x="381.388" y="235.102" style={{ fill: '#231F20' }} width="47.02" height="20.898" />
                                    <rect x="83.592" y="235.102" style={{ fill: '#231F20' }} width="47.02" height="20.898" />
                                    <rect x="339.584" y="160.695" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 468.2407 559.6754)" style={{ fill: '#231F20' }} width="20.898" height="44.335" />
                                    <rect x="134.561" y="172.407" transform="matrix(0.7071 0.7071 -0.7071 0.7071 175.2034 -57.2664)" style={{ fill: '#231F20' }} width="44.335" height="20.898" />
                                    <path style={{ fill: '#231F20' }} d="M370.459,287.347c-5.298-58.498-54.604-104.49-114.459-104.49s-109.162,45.992-114.459,104.49H0 v20.898h512v-20.898H370.459z M256,203.755c48.322,0,88.243,36.638,93.457,83.592H162.543 C167.757,240.393,207.678,203.755,256,203.755z" />
                                    <path style={{ fill: '#231F20' }} d="M274.662,374.902c9.095-4.931,16.95-9.188,33.583-9.188v-20.898 c-21.931,0-33.413,6.222-43.541,11.712c-9.094,4.93-16.947,9.186-33.572,9.186c-16.638,0-24.488-4.26-33.578-9.194 c-10.108-5.486-21.566-11.704-43.432-11.704c-21.927,0-33.407,6.222-43.536,11.711c-9.094,4.93-16.948,9.187-33.577,9.187 c-16.562,0-24.394-4.251-33.463-9.173C33.421,351.045,21.943,344.816,0,344.816v20.898c16.638,0,24.488,4.26,33.578,9.194 c10.108,5.486,21.566,11.704,43.432,11.704c21.927,0,33.407-6.222,43.535-11.711c9.095-4.93,16.948-9.187,33.577-9.187 c16.562,0,24.394,4.251,33.463,9.173c10.126,5.496,21.603,11.725,43.547,11.725C253.057,386.612,264.535,380.391,274.662,374.902z" />
                                    <path style={{ fill: '#231F20' }} d="M434.888,444.082c-16.642,0-24.492-4.261-33.584-9.195c-10.107-5.486-21.564-11.703-43.426-11.703 c-21.931,0-33.413,6.222-43.541,11.712c-9.094,4.93-16.947,9.186-33.572,9.186c-16.562,0-24.394-4.251-33.463-9.173 c-10.126-5.496-21.604-11.725-43.547-11.725v20.898c16.638,0,24.488,4.26,33.578,9.194c10.108,5.486,21.565,11.704,43.432,11.704 c21.923,0,33.402-6.221,43.529-11.71 Club.095-4.931,16.95-9.188,33.583-9.188c16.558,0,24.39,4.251,33.459,9.172 c10.126,5.496,21.605,11.726,43.552,11.726c21.923,0,33.402-6.221,43.529-11.71c9.095-4.931,16.949-9.188,33.582-9.188v-20.898 c-21.931,0-33.413,6.222-43.541,11.712C459.365,439.826,451.512,444.082,434.888,444.082z" />
                                    <path style={{ fill: '#231F20' }} d="M397.061,386.612c17.765,0,27.255-6.902,34.881-12.448c6.746-4.905,11.619-8.45,22.589-8.45v-20.898 c-17.765,0-27.255,6.902-34.881,12.448c-6.746,4.905-11.619,8.45-22.589,8.45c-10.969,0-15.843-3.545-22.589-8.45 c-7.626-5.546-17.115-12.448-34.881-12.448v20.898c10.969,0,15.843,3.545,22.589,8.45 C369.806,379.711,379.296,386.612,397.061,386.612z" />
                                    <path style={{ fill: '#231F20' }} d="M114.939,444.082c-10.969,0-15.844-3.545-22.589-8.45c-7.626-5.546-17.115-12.448-34.881-12.448 v20.898c10.969,0,15.844,3.545,22.589,8.45c7.626,5.546,17.115,12.448,34.881,12.448s27.255-6.902,34.881-12.448 c6.745-4.905,11.619-8.45,22.589-8.45v-20.898c-17.765,0-27.255,6.902-34.881,12.448 C130.783,440.536,125.908,444.082,114.939,444.082z" />
                                    <path style={{ fill: '#231F20' }} d="M370.939,31.347c5.762,0,10.449,4.687,10.449,10.449h20.898c0-5.762,4.687-10.449,10.449-10.449 s10.449,4.687,10.449,10.449h20.898c0-17.285-14.062-31.347-31.347-31.347c-8.023,0-15.349,3.032-20.898,8.008 c-5.549-4.976-12.875-8.008-20.898-8.008c-17.285,0-31.347,14.062-31.347,31.347h20.898 C360.49,36.034,365.177,31.347,370.939,31.347z" />
                                    <path style={{ fill: '#231F20' }} d="M245.551,73.143c5.762,0,10.449,4.687,10.449,10.449h20.898c0-5.762,4.687-10.449,10.449-10.449 s10.449,4.687,10.449,10.449h20.898c0-17.285-14.062-31.347-31.347-31.347c-8.023,0-15.349,3.032-20.898,8.008 c-5.551-4.976-12.875-8.008-20.898-8.008c-17.285,0-31.347,14.062-31.347,31.347h20.898 C235.102,77.83,239.789,73.143,245.551,73.143z" />
                                    <path style={{ fill: '#231F20' }} d="M88.816,52.245c5.762,0,10.449,4.687,10.449,10.449h20.898c0-5.762,4.687-10.449,10.449-10.449 c5.762,0,10.449,4.687,10.449,10.449h20.898c0-17.285-14.062-31.347-31.347-31.347c-8.023,0-15.349,3.032-20.898,8.008 c-5.55-4.976-12.875-8.008-20.898-8.008c-17.285,0-31.347,14.062-31.347,31.347h20.898C78.367,56.932,83.055,52.245,88.816,52.245z" />
                                  </g>
                                </g>
                              </svg>
                            ;

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