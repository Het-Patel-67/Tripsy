export const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const getEndDate = (startIso, days) => {
  if (!startIso) return "—";
  const d = new Date(startIso);
  d.setDate(d.getDate() + Math.max(1, Number(days) || 1) - 1);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const totalPlaces = (plan) =>
  Array.isArray(plan)
    ? plan.reduce((sum, day) => sum + (day.places?.length || 0), 0)
    : 0;

export const coverImage = (plan) => {
  if (!Array.isArray(plan)) return null;
  for (const day of plan) {
    for (const place of day.places || []) {
      if (place.image)       return place.image;
      if (place.images?.[0]) return place.images[0];
    }
  }
  return null;
};

export const allCategories = (plan) => {
  const cats = new Set();
  if (!Array.isArray(plan)) return [];
  plan.forEach((day) =>
    (day.places || []).forEach((p) => { if (p.category) cats.add(p.category); })
  );
  return [...cats].slice(0, 3);
};

export const CAT_COLORS = {
  nature:        { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  historical:    { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200"   },
  spiritual:     { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200"  },
  adventure:     { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200"  },
  culture:       { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-200"    },
  beach:         { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200"     },
  mountain:      { bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-200"   },
  wildlife:      { bg: "bg-lime-50",    text: "text-lime-700",    border: "border-lime-200"    },
  entertainment: { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200"    },
  tourist:       { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"    },
};

export const catStyle = (cat) =>
  CAT_COLORS[cat?.toLowerCase()] || {
    bg: "bg-stone-50", text: "text-stone-600", border: "border-stone-200",
  };