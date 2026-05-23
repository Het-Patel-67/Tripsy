import { useEffect } from "react";
import { formatDate, getEndDate, totalPlaces, coverImage, allCategories, catStyle } from "../../../src/utils/Itineraryhelper.js";

const API_BASE = import.meta.env.VITE_API_URL || "";
const proxyImg = (url) =>
  url ? `${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}` : "";

export default function ItineraryModal({ item, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item) return null;

  const cover = coverImage(item.plan);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      style={{ background: "rgba(28,25,23,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-h-[92vh] flex-col overflow-hidden rounded-t-3xl bg-[#FFFCF9] shadow-2xl sm:max-w-2xl sm:rounded-2xl"
        style={{ border: "1px solid #E7DDD0" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Hero image header ── */}
        <div
          className="relative h-44 shrink-0 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #0f2033)" }}
        >
          {cover && (
            <img
              src={proxyImg(cover)}
              alt={item.cityName}
              className="h-full w-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          >
            ✕
          </button>

          <div className="absolute bottom-0 left-0 p-5">
            <h2 className="font-playfair text-2xl font-bold text-white">{item.cityName}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/60">
              {item.stateName && item.stateName !== item.cityName && (
                <span>{item.stateName}</span>
              )}
              <span>📅 {formatDate(item.startDate)} → {getEndDate(item.startDate, item.days)}</span>
              <span
                className="rounded-full px-2.5 py-0.5 font-semibold text-white"
                style={{ background: "rgba(217,119,6,0.85)" }}
              >
                {item.days} {item.days === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="flex shrink-0 items-center divide-x divide-[#E7DDD0] border-b border-[#E7DDD0] bg-[#FFFCF9]">
          {[
            { icon: "🗓️", value: item.days,                 label: "Days"      },
            { icon: "📍", value: totalPlaces(item.plan),    label: "Places"    },
            { icon: "🗺️", value: item.plan?.length || 0,   label: "Plan Days" },
          ].map((s) => (
            <div key={s.label} className="flex flex-1 items-center justify-center gap-2 py-3">
              <span className="text-sm">{s.icon}</span>
              <div>
                <div className="text-sm font-bold text-[#1C1917]">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-stone-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Scrollable day-by-day plan ── */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {(item.plan || []).map((day) => (
            <div
              key={day.day}
              className="overflow-hidden rounded-2xl border border-[#E7DDD0] bg-white"
            >
              {/* Day header */}
              <div className="flex items-center gap-3 border-b border-[#E7DDD0] bg-[#F5EFE6] px-4 py-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #D97706, #B45309)" }}
                >
                  {day.day}
                </div>
                <div>
                  <div className="font-playfair text-sm font-bold text-[#1C1917]">
                    Day {day.day}
                  </div>
                  <div className="text-[11px] text-stone-400">{day.date}</div>
                </div>
                <div className="ml-auto text-[11px] text-stone-400">
                  {day.places?.length || 0} place{day.places?.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Time slots */}
              <div className="divide-y divide-[#F5EFE6]">
                {["Morning", "Afternoon", "Evening"].map((slot) => {
                  const slotPlaces = (day.places || []).filter((p) => p.time === slot);
                  if (!slotPlaces.length) return null;
                  const slotEmoji =
                    slot === "Morning" ? "🌅" : slot === "Afternoon" ? "☀️" : "🌇";

                  return (
                    <div key={slot} className="px-4 py-3">
                      <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                        <span>{slotEmoji}</span> {slot}
                      </div>

                      <div className="space-y-2.5">
                        {slotPlaces.map((place, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-[#E7DDD0] bg-[#FFFCF9] p-3"
                          >
                            {/* Thumbnail */}
                            {(place.image || place.images?.[0]) && (
                              <img
                                src={proxyImg(place.image || place.images?.[0])}
                                alt={place.name}
                                className="h-14 w-14 shrink-0 rounded-lg object-cover"
                                loading="lazy"
                              />
                            )}

                            <div className="min-w-0 flex-1">
                              {/* Name + rating */}
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold leading-tight text-[#1C1917]">
                                  {place.name}
                                </p>
                                {place.rating && (
                                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                    ⭐ {place.rating}
                                  </span>
                                )}
                              </div>

                              {/* Category pill */}
                              {place.category && (
                                <span
                                  className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${catStyle(place.category).bg} ${catStyle(place.category).text} ${catStyle(place.category).border}`}
                                >
                                  {place.category}
                                </span>
                              )}

                              {/* Description */}
                              {place.description && (
                                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-stone-400">
                                  {place.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Modal footer ── */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#E7DDD0] bg-[#FFFCF9] px-5 py-4">
          <p className="text-[11px] text-stone-400">
            Saved {formatDate(item.createdAt)}
          </p>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#E7DDD0] bg-white px-5 py-2 text-sm font-semibold text-stone-500 transition-all hover:border-stone-300 hover:bg-stone-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}