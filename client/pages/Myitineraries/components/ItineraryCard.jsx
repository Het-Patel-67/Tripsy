import { useState, Fragment } from "react";
import API from "../../../src/services/apiService";
import { SuccessPopup } from "../../Trip/Trip";

import { formatDate, getEndDate, totalPlaces, coverImage, allCategories, catStyle } from "../../../src/utils/Itineraryhelper.js";

const API_BASE = import.meta.env.VITE_API_URL || "";
const proxyImg = (url) =>
  url ? `${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}` : "";

export default function ItineraryCard({ item, index, onView }) {
  const [imgError,  setImgError]  = useState(false);
  const [popMsg,    setPopMsg]    = useState({ title: "", body: "" });
  const [isOpen,    setIsOpen]    = useState(false);

  const cover   = coverImage(item.plan);
  const cats    = allCategories(item.plan);
  const places  = totalPlaces(item.plan);
  const delay   = `fade-up-${Math.min(index + 1, 6)}`;

  const removeItinerary = async (id) => {
    try {
      await API.delete(`/api/itinerary/delete/${id}`);
      setPopMsg({ title: "Itinerary Removed", body: "The itinerary has been successfully removed." });
      setIsOpen(true);
    } catch {
      setPopMsg({ title: "Error", body: "Failed to remove the itinerary." });
      setIsOpen(true);
    }
  };

  return (
    <>
      {isOpen && (
        <SuccessPopup message={popMsg} onClose={() => setIsOpen(false)} />
      )}

      <div
        className={`card-hover fade-up ${delay} overflow-hidden rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] shadow-[0_2px_12px_rgba(28,25,23,0.06)]`}
      >
        {/* ── Cover image ── */}
        <div
          className="relative h-44 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #0f2033)" }}
        >
          {cover && !imgError ? (
            <img
              src={proxyImg(cover)}
              alt={item.cityName}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl opacity-30">🏙️</span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Days badge */}
          <div
            className="absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
            style={{ background: "rgba(217,119,6,0.85)", backdropFilter: "blur(6px)" }}
          >
            {item.days} {item.days === 1 ? "Day" : "Days"}
          </div>

          {/* City name */}
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="font-playfair text-lg font-bold leading-tight text-white drop-shadow">
              {item.cityName}
            </h2>
            {item.stateName && item.stateName !== item.cityName && (
              <p className="mt-0.5 text-[11px] text-white/60">{item.stateName}</p>
            )}
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="p-4">

          {/* Date range */}
          <div className="mb-3 flex items-center gap-1.5 text-xs text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(70,146,221,1)"><path d="M7 3V1H9V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V9H20V5H17V7H15V5H9V7H7V5H4V19H10V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7ZM17 12C14.7909 12 13 13.7909 13 16C13 18.2091 14.7909 20 17 20C19.2091 20 21 18.2091 21 16C21 13.7909 19.2091 12 17 12ZM11 16C11 12.6863 13.6863 10 17 10C20.3137 10 23 12.6863 23 16C23 19.3137 20.3137 22 17 22C13.6863 22 11 19.3137 11 16ZM16 13V16.4142L18.2929 18.7071L19.7071 17.2929L18 15.5858V13H16Z"></path></svg>
            <span>{formatDate(item.startDate)}</span>
            <span className="text-stone-500"> to </span>
            <span>{getEndDate(item.startDate, item.days)}</span>
          </div>

          {/* Stats row */}
          <div className="mb-4 flex items-center gap-4 border-y border-[#E7DDD0] py-3">
            {[
              { value: item.days,             label: "Days"      },
              { value: places,                label: "Places"    },
              { value: item.plan?.length || 0, label: "Plan Days" },
            ].map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 && <div key={`div-${i}`} className="h-6 w-px bg-[#E7DDD0]" />}
                <div key={s.label} className="flex flex-1 flex-col items-center">
                  <span className="text-base font-bold text-[#1C1917]">{s.value}</span>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400">{s.label}</span>
                </div>
              </Fragment>
            ))}
          </div>

          {/* Category pills */}
          {cats.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {cats.map((cat) => {
                const s = catStyle(cat);
                return (
                  <span
                    key={cat}
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${s.bg} ${s.text} ${s.border}`}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          )}

          {/* Day-by-day mini preview */}
          <div className="mb-4 space-y-1.5">
            {(item.plan || []).slice(0, 2).map((day) => (
              <div key={day.day} className="flex items-start gap-2 rounded-lg bg-stone-50 px-3 py-2">
                <span className="mt-0.5 shrink-0 text-md font-bold text-amber-600">
                  Day {day.day}
                </span>
                <span className="truncate text-sm leading-relaxed text-stone-500">
                  {(day.places || []).map((p) => p.name).join(" · ") || "No places"}
                </span>
              </div>
            ))}
            {(item.plan || []).length > 2 && (
              <p className="pl-3 text-sm text-stone-400">
                +{item.plan.length - 2} more day{item.plan.length - 2 > 1 ? "s" : ""}…
              </p>
            )}
          </div>

          {/* Saved date */}
          <p className="mb-4 text-sm text-stone-400">
            Saved on {formatDate(item.createdAt)}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onView(item)}
              className="flex-1 cursor-pointer rounded-xl bg-linear-to-br from-amber-600 to-amber-700 py-2.5 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(217,119,6,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(217,119,6,0.4)]"
            >
              View Trip
            </button>
            <button
              onClick={() => removeItinerary(item._id)}
              className="cursor-pointer rounded-xl border border-[#E7DDD0] bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              title="Delete itinerary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(124,115,115,1)"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}