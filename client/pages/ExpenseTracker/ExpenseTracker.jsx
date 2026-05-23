import { useState, useEffect, useMemo } from "react";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import ExpenseChart from "./components/ExpenseChart.jsx";
import API from "../../src/services/apiService.js";
import { SuccessPopup } from "../Trip/Trip.jsx";
import SplitTab from "./components/SplitTab.jsx";

/* ── Minimal styles ──────────────────────────────────────────────────── */
const minimalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .fade-up  { animation: fadeUp 0.4s ease both; }
  .delay-1  { animation-delay:0.06s; }
  .delay-2  { animation-delay:0.13s; }
  .delay-3  { animation-delay:0.20s; }

  @keyframes shimmer {
    0%   { background-position:-600px 0; }
    100% { background-position: 600px 0; }
  }
  .skeleton {
    background:linear-gradient(90deg,#ede8e0 25%,#f5f0e8 50%,#ede8e0 75%);
    background-size:600px 100%;
    animation:shimmer 1.4s infinite;
    border-radius:8px;
  }
  .card-hover { transition:transform 0.18s ease,box-shadow 0.18s ease; }
  .card-hover:hover { transform:translateY(-3px); box-shadow:0 10px 30px rgba(28,25,23,0.11); }
`;


/* ── Constants ───────────────────────────────────────────────────────── */
const CATEGORIES = ["food", "transport", "hotel", "activities", "shopping", "other"];

const CATEGORY_META = {
  food: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  transport: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  hotel: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  activities: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  shopping: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  other: { bg: "bg-stone-50", text: "text-stone-600", border: "border-stone-200" },
};

const IDEAL = { food: 0.35, transport: 0.25, hotel: 0.30, activities: 0.10, shopping: 0.15 };
const TIPS = {
  food: "Food expenses are higher than average. Try local thalis or skip one restaurant meal.",
  transport: "Transport costs are adding up. Walk short distances or use shared autos.",
  hotel: "Hotel spending is high. Consider negotiating longer stays or simpler rooms.",
  activities: "Activities budget is stretched. Look for free local events or combo tickets.",
  shopping: "Shopping expenses are significant. Review receipts for unnecessary purchases.",
  other: "Other expenses are significant. Review receipts for unnecessary purchases.",
};

/* ── Helpers ─────────────────────────────────────────────────────────── */
const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const catMeta = (c) => CATEGORY_META[c] || CATEGORY_META.other;

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E7DDD0] bg-[#FFFCF9] px-3 py-2 shadow-lg text-md">
      <p className="font-semibold text-[#1C1917]">{label}</p>
      <p className="font-bold text-amber-600">{fmt(payload[0].value)}</p>
    </div>
  );
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-4">
      <div className="skeleton h-11 w-11 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-1/3" />
        <div className="skeleton h-3 w-1/4" />
      </div>
      <div className="skeleton h-5 w-16" />
    </div>
  );
}


// Quick split
export default function ExpenseTracker({ tripId = null }) {

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [form, setForm] = useState({
    title: "", amount: "", category: "food",
    date: new Date().toISOString().slice(0, 10),
    splitType: "equal",
    participants: [{ name: "", share: "" }],
    paidBy: { name: "" },
  });
  // share: parseFloat(p.share) || 0,
  const [splitPerson, setSplitPerson] = useState("");
  const [splitAmount, setSplitAmount] = useState("");
  const [splitDir, setSplitDir] = useState("receive");
  const [isOpen, setIsOpen] = useState(false);
  const [popMsg, setPopMsg] = useState({ title: "", body: "" });
  const handlePopupClose = () => {
    setIsOpen(false);
  };
  /* ── Fetch ── */
  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (tripId) params.tripId = tripId;
      if (filterCat !== "All") params.category = filterCat;
      const res = await API.get("/api/expenses", { params });
      setExpenses(res.data.data.expenses);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(1); }, [tripId, filterCat]);

  /* ── Derived ── */
  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const topCategory = [...categoryData].sort((a, b) => b.value - a.value)[0]?.name || "—";

  const recommendations = useMemo(() => {
    if (!totalSpent) return ["Add some expenses to get personalised tips "];
    const recs = [];
    categoryData.forEach(({ name, value }) => {
      if (IDEAL[name] && value / totalSpent > IDEAL[name] + 0.1 && TIPS[name]) recs.push(TIPS[name]);
    });
    return recs.length ? recs : ["Your spending looks well balanced. Keep enjoying the trip "];
  }, [categoryData, totalSpent]);

  /* ── Form helpers ── */
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addParticipant = () => setForm((f) => ({ ...f, participants: [...f.participants, { name: "", share: "" }] }));
  const removeParticipant = (i) => setForm((f) => ({ ...f, participants: f.participants.filter((_, idx) => idx !== i) }));
  const setParticipant = (i, k, v) =>
    setForm((f) => { const p = [...f.participants]; p[i] = { ...p[i], [k]: v }; return { ...f, participants: p }; });

  const resetForm = () => setForm({
    title: "", amount: "", category: "food",
    date: new Date().toISOString().slice(0, 10),
    splitType: "equal", participants: [{ name: "", share: "" }], paidBy: { name: "" },
  });

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.amount) return;
    setSubmitting(true);
    try {
      const payload = {
        ...(tripId ? { tripId } : {}),
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        splitType: form.splitType,
        paidBy: { name: form.paidBy.name },
        participants: form.participants
          .filter((p) => p.name.trim())
          .map((p) => ({ name: p.name, share: parseFloat(p.share) || 0,})),
      };
      if (editingId) {
        await API.put(`/api/expenses/edit/${editingId}`, payload);
        setEditingId(null);
      } else {
        await API.post("/api/expenses", payload);
      }
      resetForm();
      fetchExpenses(1);
      setPopMsg({ title: "Expense Saved", body: "The expense has been saved successfully." });
      setIsOpen(true);
    } catch (err) {
      console.error(err);
      setPopMsg({ title: "Error", body: "Failed to save expense." });
      setIsOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await API.delete(`/api/expenses/delete/${id}`);

      // BUG 6 FIX: fall back to previous page if we just deleted the last
      // item on the current page
      const isLastItemOnPage = expenses.length === 1 && pagination.page > 1;
      const targetPage = isLastItemOnPage ? pagination.page - 1 : pagination.page;

      fetchExpenses(targetPage);
      setPopMsg({ title: "Expense Deleted", body: "The expense has been removed successfully." });
      setIsOpen(true);
    } catch (err) {
      console.error(err);
      setPopMsg({ title: "Error", body: "Failed to delete expense." });
      setIsOpen(true);
    }
  };

  /* ── Edit ── */
  const startEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      splitType: exp.splitType || "equal",
      paidBy: { name: exp.paidBy?.name || "" },
      participants: exp.participants?.length
        ? exp.participants.map((p) => ({
          name: p.name || "",
          share: String(p.share ?? ""),
        }))
        : [{ name: "", share: "" }],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <>
      <style>{minimalStyles}</style>
      {isOpen && <SuccessPopup message={popMsg} onClose={handlePopupClose} />}
      <div className="font-dm  min-h-screen bg-[#F5EFE6] text-[#1C1917]">

        <div
          className="relative overflow-hidden px-8 pt-18 pb-10"
          style={{ background: "linear-gradient(135deg,#1C1917 0%,#292524 60%,#1C3557 100%)" }}
        >
          <div className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.025)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025)1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 15% 50%,rgba(217,119,6,0.15)0%,transparent 50%),radial-gradient(ellipse at 85% 20%,rgba(14,165,233,0.1)0%,transparent 40%)" }}
          />
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute right-12 top-12 h-44 w-44 rounded-full border border-amber-500/10" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-2 flex items-center gap-2 text-sm">
              <a href="/trip" className="text-white/35 hover:text-white/60 transition-colors">Home</a>
              <span className="text-white/20">/</span>
              <span className="text-amber-400/80">Expense Tracker</span>
            </div>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="mb-3 inline-block rounded-full border border-amber-400/35 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                  ✦ Trip Expenses
                </span>
                <h1 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                  Expense <em className="italic text-amber-400">Tracker</em>
                </h1>
                <p className="mt-2 text-md text-white/45">Track, split and understand your trip spending.</p>
              </div>

              {!loading && (
                <div className="flex gap-6">
                  {[
                    { value: fmt(totalSpent), label: "Total Spent" },
                    { value: expenses.length, label: "Expenses" },
                    { value: topCategory, label: "Top Category" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="font-playfair text-xl font-bold text-amber-400">{s.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Main ──────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-5 py-8 pb-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ── LEFT: Form ────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="fade-up sticky top-6 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-6 shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
                <h2 className="font-playfair mb-5 text-lg font-bold text-[#1C1917]">
                  {editingId ? " Edit Expense" : " Add Expense"}
                </h2>

                {/* Title */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Description</label>
                  <div className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.1)]">
                    <input type="text" placeholder="e.g. Dinner at Dal Lake" value={form.title}
                      onChange={(e) => setField("title", e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-md text-[#1C1917] outline-none placeholder:text-stone-300" />
                  </div>
                </div>

                {/* Amount + Date */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Amount</label>
                    <div className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.1)]">
                      <span className="text-stone-300 text-md shrink-0">₹</span>
                      <input type="number" placeholder="0" value={form.amount}
                        onChange={(e) => setField("amount", e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-md text-[#1C1917] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Date</label>
                    <div className="flex h-11 items-center gap-1 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-2.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.1)]">
                      <input type="date" value={form.date}
                        onChange={(e) => setField("date", e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-sm text-[#1C1917] outline-none" />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => {
                      const m = catMeta(c);
                      const active = form.category === c;
                      return (
                        <button key={c} onClick={() => setField("category", c)}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all ${active ? `${m.bg} ${m.text} ${m.border} font-semibold shadow-sm`
                            : "border-[#E7DDD0] bg-white text-stone-400 hover:border-stone-300"}`}>

                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Paid by */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Paid By</label>
                  <div className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.1)]">

                    <input type="text" placeholder="Person name"
                      value={form.paidBy.name}
                      onChange={(e) => setForm((f) => ({ ...f, paidBy: { name: e.target.value } }))}
                      className="min-w-0 flex-1 bg-transparent text-md text-[#1C1917] outline-none placeholder:text-stone-300" />
                  </div>
                </div>

                {/* Split type */}
                <div className="mb-4">
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-stone-400">Split Type</label>
                  <div className="flex gap-2">
                    {["equal", "exact"].map((t) => (
                      <button key={t} onClick={() => setField("splitType", t)}
                        className={`flex-1 cursor-pointer rounded-xl border py-2 text-sm font-semibold capitalize transition-all ${form.splitType === t ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-[#E7DDD0] bg-white text-stone-400 hover:border-stone-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Participants</label>
                    <button onClick={addParticipant}
                      className="cursor-pointer text-[11px] font-semibold text-amber-600 hover:text-amber-700">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {form.participants.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="flex h-10 flex-1 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-3 transition-all focus-within:border-amber-500">
                          <input type="text" placeholder="Name" value={p.name}
                            onChange={(e) => setParticipant(i, "name", e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-md text-[#1C1917] outline-none placeholder:text-stone-300" />
                        </div>
                        {form.splitType === "exact" && (
                          <div className="flex h-10 w-20 items-center gap-1 rounded-xl border-[1.5px] border-[#E7DDD0] bg-white px-2.5 transition-all focus-within:border-amber-500">
                            <span className="text-sm text-stone-300">₹</span>
                            <input type="number" placeholder="0" value={p.share}
                              onChange={(e) => setParticipant(i, "share", e.target.value)}
                              className="min-w-0 flex-1 bg-transparent text-sm text-[#1C1917] outline-none" />
                          </div>
                        )}
                        {form.participants.length > 1 && (
                          <button onClick={() => removeParticipant(i)}
                            className="cursor-pointer rounded-xl border border-[#E7DDD0] bg-white px-2.5 text-sm text-stone-300 hover:border-red-200 hover:bg-red-50 hover:text-red-400 transition-all">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 cursor-pointer rounded-xl bg-linear-to-br from-amber-600 to-amber-700 py-3 text-md font-semibold text-white shadow-[0_4px_14px_rgba(217,119,6,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(217,119,6,0.4)] disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? "Saving…" : editingId ? "Update Expense" : "✦ Add Expense"}
                  </button>
                  {editingId && (
                    <button onClick={() => { setEditingId(null); resetForm(); }}
                      className="cursor-pointer rounded-xl border border-[#E7DDD0] bg-white px-4 text-md font-semibold text-stone-500 hover:bg-stone-50 transition-all">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Tabs ───────────────────────────────────────── */}
            <div className="lg:col-span-2">

              {/* Tab bar */}
              <div className="fade-up delay-1 mb-5 flex items-center gap-1 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-1.5 shadow-[0_2px_8px_rgba(28,25,23,0.05)]">
                {[
                  { id: "list", label: "💳 Expenses" },
                  { id: "charts", label: "📊 Analytics" },
                  { id: "split", label: "🤝 Split" },
                ].map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex-1 cursor-pointer rounded-xl py-2.5 text-md font-semibold transition-all ${activeTab === t.id
                      ? "bg-linear-to-br from-amber-600 to-amber-700 text-white shadow-[0_2px_8px_rgba(217,119,6,0.3)]"
                      : "text-stone-400 hover:text-stone-600"}`}>
                    {t.label}
                  </button>
                ))}
              </div>


              {activeTab === "list" && (
                <div className="fade-up delay-2">

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {["All", ...CATEGORIES].map((c) => {
                      const m = c !== "All" ? catMeta(c) : null;
                      const active = filterCat === c;
                      return (
                        <button key={c} onClick={() => setFilterCat(c)}
                          className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-all ${active && m ? `${m.bg} ${m.text} ${m.border} font-semibold`
                            : active ? "border-amber-500 bg-amber-50 text-amber-700 font-semibold"
                              : "border-[#E7DDD0] bg-white text-stone-400 hover:border-stone-300"}`}>
                          {c}
                        </button>
                      );
                    })}
                    <span className="ml-auto text-sm text-stone-400">
                      {pagination.total} expense{pagination.total !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : expenses.length === 0 ? (
                      <div className="flex flex-col items-center py-16 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
                          style={{ background: "rgba(217,119,6,0.08)", border: "1.5px dashed rgba(217,119,6,0.3)" }}>
                          💸
                        </div>
                        <h3 className="font-playfair text-lg font-bold text-[#1C1917]">No expenses yet</h3>
                        <p className="mt-1 text-md text-stone-400">Add your first expense using the form.</p>
                      </div>
                    ) : (
                      expenses.map((exp, idx) => {
                        const m = catMeta(exp.category);
                        return (
                          <div key={exp._id}
                            className="card-hover fade-up flex items-center gap-4 rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-4 shadow-[0_1px_6px_rgba(28,25,23,0.05)]"
                            style={{ animationDelay: `${idx * 0.04}s` }}>
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg ${m.bg} ${m.border}`}>
                              {m.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-md font-semibold text-[#1C1917]">{exp.title}</p>
                                <p className="shrink-0 font-playfair text-base font-bold text-amber-600">{fmt(exp.amount)}</p>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-stone-400">
                                <span className={`rounded-full border px-2 py-0.5 font-medium capitalize ${m.bg} ${m.text} ${m.border}`}>
                                  {exp.category}
                                </span>
                                {exp.paidBy?.name && <span> {exp.paidBy.name}</span>}
                                {exp.date && <span>📅 {exp.date.slice(0, 10)}</span>}
                                {exp.splitType && <span className="capitalize">⚖️ {exp.splitType} split</span>}
                              </div>
                            </div>
                            <div className="flex shrink-0 gap-1.5">
                              <button onClick={() => startEdit(exp)}
                                className="cursor-pointer rounded-lg border border-[#E7DDD0] bg-white px-2.5 py-1.5 text-sm font-semibold text-stone-500 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(exp._id)}
                                className="cursor-pointer rounded-lg border border-[#E7DDD0] bg-white px-2.5 py-1.5 text-sm text-stone-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button disabled={pagination.page <= 1} onClick={() => fetchExpenses(pagination.page - 1)}
                        className="cursor-pointer rounded-xl border border-[#E7DDD0] bg-white px-4 py-2 text-sm font-semibold text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        ← Prev
                      </button>
                      <span className="text-sm text-stone-400">{pagination.page} / {pagination.totalPages}</span>
                      <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchExpenses(pagination.page + 1)}
                        className="cursor-pointer rounded-xl border border-[#E7DDD0] bg-white px-4 py-2 text-sm font-semibold text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── CHARTS TAB ── */}
              {activeTab === "charts" && (
                <div className="fade-up delay-2 space-y-5">
                  {/* Donut */}
                  <div className="rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-6 shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
                    <h3 className="font-playfair mb-5 text-base font-bold text-[#1C1917]">Category Breakdown</h3>
                    {categoryData.length
                      ? <ExpenseChart data={categoryData} total={totalSpent} />
                      : <p className="py-10 text-center text-md text-stone-300">No data yet — add some expenses first.</p>}
                  </div>

                  {/* Bar */}
                  <div className="rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-6 shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
                    <h3 className="font-playfair mb-5 text-base font-bold text-[#1C1917]">Spending Comparison</h3>
                    {categoryData.length ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={categoryData} barCategoryGap="30%">
                          <CartesianGrid strokeDasharray="3 3" stroke="#E7DDD0" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#78716C" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#78716C" }} axisLine={false} tickLine={false}
                            tickFormatter={(v) => `₹${v}`} />
                          <Tooltip content={<BarTooltip />} />
                          <Bar dataKey="value" fill="#D97706" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="py-10 text-center text-md text-stone-300">No data yet.</p>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-[0_2px_12px_rgba(217,119,6,0.08)]">
                    <h3 className="font-playfair mb-4 text-base font-bold text-amber-800">💡 Smart Suggestions</h3>
                    <ul className="space-y-3">
                      {recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-md text-amber-800">
                          <span className="mt-0.5 shrink-0 text-amber-500">✦</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "split" && <SplitTab tripId={tripId} />}              

            </div>
          </div>
        </div>
      </div>
    </>
  );
}