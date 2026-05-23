import React,{useState, useEffect } from 'react';
import API from '../../../src/services/apiService';

export default function BalancesCard({ tripId }) {
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {};

    if (tripId) {
      params.tripId = tripId;
    }

    API.get("/api/expenses/balance", { params })
      .then((res) => setBalances(res.data.data.balances))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tripId]);

  return (
    <div className="rounded-2xl border border-[#E7DDD0] bg-[#FFFCF9] p-6 shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
      <h3 className="font-playfair mb-4 text-base font-bold text-[#1C1917]">
        {tripId ? " Trip Balances" : " Overall Balances"}
      </h3>
      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-10 w-full" />)}</div>
      ) : !balances || !Object.keys(balances).length ? (
        <p className="text-md text-stone-400">No balance data available.</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(balances).map(([person, amount]) => {
            const pos = amount >= 0;
            return (
              <div
                key={person}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${pos ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-md font-bold ${pos ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                    {person.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-md font-medium text-[#1C1917]">{person}</span>
                </div>
                <span className={`font-playfair text-base font-bold ${pos ? "text-emerald-600" : "text-red-500"}`}>
                  {pos ? "+" : ""}₹{Math.abs(amount).toLocaleString("en-IN")}
                </span>
              </div>
            );
          })}
          <p className="pt-1 text-[11px] text-stone-400">Positive = to receive · Negative = to pay</p>
        </div>
      )}
    </div>
  );
}