import { useState, useEffect, useCallback } from "react";
import API from "../../../src/services/apiService.js";

/* ─────────────────────────────────────────────────────────────────────────────
   DEBT MINIMISATION ALGORITHM
   
   Input : { "Raj": 2100, "Priya": -300, "Aman": -1800 }
   Output: [{ from: "Aman", to: "Raj", amount: 1800 }, { from: "Priya", to: "Raj", amount: 300 }]
   
   How it works:
   1. Split people into creditors (positive balance) and debtors (negative balance)
   2. Greedily match the largest debtor with the largest creditor
   3. Partial settlements reduce both; fully settled person is removed
   4. Repeat until all balances are zero
   
   This always produces the minimum number of transactions needed.
───────────────────────────────────────────────────────────────────────────── */
function minimiseDebts(balances) {
  // Round to 2 decimal places to avoid floating point noise
  const round = (n) => Math.round(n * 100) / 100;

  const creditors = []; // people who are owed money (positive balance)
  const debtors   = []; // people who owe money (negative balance)

  Object.entries(balances).forEach(([name, amount]) => {
    const amt = round(amount);
    if (amt > 0)  creditors.push({ name, amount: amt });
    if (amt < 0)  debtors.push({ name, amount: Math.abs(amt) });
  });

  // Sort descending so we always match largest first
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor   = debtors[0];

    const settle = round(Math.min(creditor.amount, debtor.amount));

    transactions.push({
      from:   debtor.name,
      to:     creditor.name,
      amount: settle,
    });

    creditor.amount = round(creditor.amount - settle);
    debtor.amount   = round(debtor.amount   - settle);

    if (creditor.amount === 0) creditors.shift();
    if (debtor.amount   === 0) debtors.shift();
  }

  return transactions;
}

/* ─── Avatar colour derived from name (consistent across renders) ─────────── */
const AVATAR_COLORS = [
  ["bg-amber-100",   "text-amber-700"],
  ["bg-sky-100",     "text-sky-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-violet-100",  "text-violet-700"],
  ["bg-rose-100",    "text-rose-700"],
  ["bg-orange-100",  "text-orange-700"],
];

function avatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Avatar({ name, size = "h-9 w-9 text-sm" }) {
  const [bg, text] = avatarColor(name);
  return (
    <span className={`${size} ${bg} ${text} inline-flex shrink-0 items-center justify-center rounded-full font-bold`}>
      {name?.charAt(0).toUpperCase() ?? "?"}
    </span>
  );
}

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/* ─── Copy to clipboard helper ───────────────────────────────────────────── */
function buildShareText(transactions, balances) {
  if (!transactions.length) return "✅ All settled up! No payments needed.";

  const lines = ["🧾 Trip Settlement Summary", ""];
  transactions.forEach(({ from, to, amount }, i) => {
    lines.push(`${i + 1}. ${from} → ${to}  ${fmt(amount)}`);
  });
  lines.push("", "── Balances ──");
  Object.entries(balances).forEach(([name, amt]) => {
    const sign = amt >= 0 ? "+" : "";
    lines.push(`${name}: ${sign}${fmt(amt)}`);
  });
  return lines.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function SplitTab({ tripId }) {
  const [balances,      setBalances]      = useState({});
  const [transactions,  setTransactions]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [settledIds,    setSettledIds]    = useState(new Set()); // track manually marked

  const fetchAndCompute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (tripId) params.tripId = tripId;
      const res = await API.get("/api/expenses/balance", { params });
      const raw = res.data?.data?.balances ?? {};
      setBalances(raw);
      setTransactions(minimiseDebts(raw));
      setSettledIds(new Set()); // reset on refresh
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load balances");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => { fetchAndCompute(); }, [fetchAndCompute]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(transactions, balances));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — silently ignore */
    }
  };

  const toggleSettled = (idx) => {
    setSettledIds((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const pendingCount  = transactions.filter((_, i) => !settledIds.has(i)).length;
  const settledCount  = settledIds.size;
  const totalToSettle = transactions.reduce((s, t) => s + t.amount, 0);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-4 fade-up">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-5">
            <div className="flex items-center gap-4">
              <div className="skeleton h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-2/5" />
                <div className="skeleton h-3 w-1/4" />
              </div>
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={fetchAndCompute}
          className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  const peopleCount   = Object.keys(balances).length;
  const allSettledUp  = transactions.length === 0;

  return (
    <div className="fade-up delay-2 space-y-5">

      {/* ── Header card: summary stats ── */}
      <div className="rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-5 shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-playfair text-base font-bold text-[#1C1917]">Group Settlement</h3>
            <p className="mt-0.5 text-sm text-stone-400">
              Minimum transactions to settle all debts among {peopleCount} {peopleCount === 1 ? "person" : "people"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <button onClick={fetchAndCompute}
              className="cursor-pointer rounded-xl border border-[#E7DDD0] bg-white px-3 py-2 text-sm font-semibold text-stone-500 hover:bg-stone-50 transition-all">
              ↻ Refresh
            </button>

           
            {!allSettledUp && (
              <button onClick={handleCopy}
                className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                  copied
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-[#E7DDD0] bg-white text-stone-500 hover:bg-stone-50"
                }`}>
                {copied ? "✓ Copied!" : " Copy summary"}
              </button>
            )}
          </div>
        </div>

        {/* Stats strip */}
        {!allSettledUp && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Transactions needed", value: transactions.length },
              { label: "Pending",              value: pendingCount },
              { label: "Total to settle",      value: fmt(totalToSettle) },
            ].map((s) => (
              <div key={s.label}
                className="rounded-xl border border-[#E7DDD0] bg-white px-3 py-3 text-center">
                <div className="font-playfair text-xl font-bold text-amber-600">{s.value}</div>
                <div className="text-[13px] uppercase tracking-wider text-stone-400">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── All settled state ── */}
      {allSettledUp ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center shadow-[0_2px_12px_rgba(16,185,129,0.08)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✅
          </div>
          <h3 className="font-playfair text-xl font-bold text-emerald-800">All Settled Up!</h3>
          <p className="mt-1 text-md text-emerald-600">
            {peopleCount > 0
              ? "Everyone's balances are zero. No payments needed."
              : "Add some expenses with participants to see settlement here."}
          </p>
        </div>
      ) : (
        /* ── Transaction list ── */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[14px] font-semibold uppercase tracking-widest text-stone-400">
              Payments to make
            </p>
            {settledCount > 0 && (
              <p className="text-[14px] text-emerald-600 font-semibold">
                {settledCount} marked as done
              </p>
            )}
          </div>

          {transactions.map((t, idx) => {
            const isSettled = settledIds.has(idx);
            return (
              <div key={idx}
                className={`group rounded-2xl border bg-[#FFFCF9] p-4 shadow-[0_1px_6px_rgba(28,25,23,0.05)] transition-all duration-200 ${
                  isSettled
                    ? "border-emerald-200 bg-emerald-50/60 opacity-70"
                    : "border-[#E7DDD0] hover:border-amber-200 hover:shadow-[0_4px_16px_rgba(217,119,6,0.08)]"
                }`}>
                <div className="flex items-center gap-3">

                  {/* From avatar */}
                  <Avatar name={t.from} />

                  {/* Arrow + amount */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-md font-semibold ${isSettled ? "line-through text-stone-400" : "text-[#1C1917]"}`}>
                        {t.from}
                      </span>
                      <span className="text-stone-500 text-md">pays</span>
                      <span className={`text-md font-semibold ${isSettled ? "line-through text-stone-400" : "text-[#1C1917]"}`}>
                        {t.to}
                      </span>
                    </div>
                    <div className={`mt-0.5 font-playfair text-lg font-bold ${isSettled ? "text-stone-400" : "text-amber-600"}`}>
                      {fmt(t.amount)}
                    </div>
                  </div>

                  {/* To avatar */}
                  <Avatar name={t.to} />

                  {/* Mark settled toggle */}
                  <button
                    onClick={() => toggleSettled(idx)}
                    className={`ml-2 cursor-pointer shrink-0 rounded-xl border px-3 py-2 text-md font-semibold transition-all ${
                      isSettled
                        ? "border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "border-[#E7DDD0] bg-white text-stone-400 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}>
                    {isSettled ? "✓ Done" : "Mark done"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Individual balances breakdown ── */}
      {peopleCount > 0 && (
        <div className="rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-5 shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
          <h3 className="font-playfair mb-4 text-base font-bold text-[#1C1917]">
            Individual Balances
          </h3>

          <div className="space-y-3">
            {Object.entries(balances)
              .sort((a, b) => b[1] - a[1]) // creditors first
              .map(([name, amount]) => {
                const isCreditor = amount > 0;
                const isEven     = Math.abs(amount) < 0.5;
                const pct = Math.min(100, (Math.abs(amount) / Math.max(...Object.values(balances).map(Math.abs))) * 100);

                return (
                  <div key={name} className="flex items-center gap-3">
                    <Avatar name={name} size="h-8 w-8 text-md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-md font-semibold text-[#1C1917] truncate">{name}</span>
                        <span className={`text-md font-bold tabular-nums ${
                          isEven     ? "text-stone-400"
                          : isCreditor ? "text-emerald-600"
                          : "text-red-500"
                        }`}>
                          {isEven ? "Settled" : `${isCreditor ? "+" : "-"}${fmt(Math.abs(amount))}`}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {!isEven && (
                        <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isCreditor ? "bg-emerald-400" : "bg-red-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Label pill */}
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[13px] font-semibold uppercase tracking-wide ${
                      isEven
                        ? "border-stone-200 bg-stone-50 text-stone-400"
                        : isCreditor
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}>
                      {isEven ? "Even" : isCreditor ? "Gets back" : "Owes"}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 border-t border-[#E7DDD0] pt-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-[13px] text-stone-400">Gets money back</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="text-[13px] text-stone-400">Owes money</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}