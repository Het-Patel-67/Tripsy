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
            { icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(70,146,221,1)"><path d="M7 3V1H9V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V9H20V5H17V7H15V5H9V7H7V5H4V19H10V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7ZM17 12C14.7909 12 13 13.7909 13 16C13 18.2091 14.7909 20 17 20C19.2091 20 21 18.2091 21 16C21 13.7909 19.2091 12 17 12ZM11 16C11 12.6863 13.6863 10 17 10C20.3137 10 23 12.6863 23 16C23 19.3137 20.3137 22 17 22C13.6863 22 11 19.3137 11 16ZM16 13V16.4142L18.2929 18.7071L19.7071 17.2929L18 15.5858V13H16Z"></path></svg>`, value: item.days, label: "Days" },
            { icon: `<svg width="34px" height="34px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M513.2 56.6c-164 0-296.9 131-296.9 292.6 0 50.2 12.8 97.4 35.4 138.6 37.7 69 166.6 266.1 228.3 359.6 29.8 27.9 59 6.4 66.5 0 61.3-93.3 189.3-289.6 227.3-357.6 23.3-41.7 36.5-89.7 36.5-140.6-0.2-161.6-133.1-292.6-297.1-292.6z m214.2 413.6c-36.1 61-163.5 264.3-202.7 326.8-8.2 2.9-15.9 2.5-23 0-38.9-62.3-165.5-264.9-201.8-325.2-21.7-36.1-34.2-78.2-34.2-123.1 0-134 110.8-242.7 247.4-242.7s247.4 108.6 247.4 242.7c0.1 44.3-12 85.8-33.1 121.5z" fill="#EF6D64"></path><path d="M513.2 477.7c-70.8 0-128.4-57.6-128.4-128.4s57.6-128.4 128.4-128.4 128.4 57.6 128.4 128.4S584 477.7 513.2 477.7z m0-208.7c-44.3 0-80.3 36-80.3 80.3s36 80.3 80.3 80.3 80.3-36 80.3-80.3-36-80.3-80.3-80.3zM511.9 969.6c-163.4 0-286.6-59.6-286.6-138.7 0-46.1 42.4-87.2 116.4-112.7 11.5-4 24.1 2.1 28 13.6 4 11.5-2.1 24.1-13.6 28-53.5 18.5-86.7 45.7-86.7 71.1 0 44.7 99.6 94.6 242.5 94.6s242.5-49.9 242.5-94.6c0-25.4-33.3-52.6-86.8-71.1-11.5-4-17.6-16.5-13.6-28 4-11.5 16.5-17.6 28-13.6 74 25.5 116.5 66.7 116.5 112.8 0 78.9-123.2 138.6-286.6 138.6z" fill="#EF6D64"></path></g></svg>`, value: totalPlaces(item.plan), label: "Places" },
            {
              icon: `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="rgba(100,205,138,1)">
        <path d="M21 21H13V6C13 4.34315 14.3431 3 16 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21ZM11 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H8C9.65685 3 11 4.34315 11 6V21ZM11 21H13V23H11V21Z" />
      </svg>`, value: item.plan?.length || 0, label: "Plan Days"
            },
          ].map((s) => (
            <div key={s.label} className="flex flex-1 items-center justify-center gap-2 py-3">
              <span className="text-sm">{s.icon.startsWith("<svg") ? (
                <span className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: s.icon }} />
              ) : (
                s.icon
              )}</span>
              <div>
                <div className="text-sm font-bold text-[#1C1917]">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-stone-400">{s.label}</div>
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
                    slot === "Morning" ? <svg
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
                    </svg> : slot === "Afternoon" ? <svg
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
                    </svg> : <svg
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
                    </svg>;

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