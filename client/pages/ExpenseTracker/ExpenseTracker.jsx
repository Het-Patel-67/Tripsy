import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS = {
  Food: "#FDBA74",
  Transport: "#93C5FD",
  Hotel: "#A7F3D0",
  Activities: "#DDD6FE",
  Other: "#E5E7EB",
};

const DAILY_IDEAL_SPLIT = {
  Food: 0.35,
  Transport: 0.25,
  Hotel: 0.3,
  Activities: 0.1,
};

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const [person, setPerson] = useState("");
  const [splitAmount, setSplitAmount] = useState("");
  const [splitType, setSplitType] = useState("receive");

  /* -------------------- Calculations -------------------- */

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  /* -------------------- Recommendations -------------------- */

  const recommendations = useMemo(() => {
    if (!totalSpent) return [];

    const recs = [];
    categoryData.forEach(({ name, value }) => {
      const ratio = value / totalSpent;
      const ideal = DAILY_IDEAL_SPLIT[name];

      if (ideal && ratio > ideal + 0.1) {
        if (name === "Food") {
          recs.push(
            "Food expenses are higher than average. Try local thalis or skip one restaurant meal per day."
          );
        }
        if (name === "Transport") {
          recs.push(
            "Transport costs are adding up. Walking short distances or using shared autos can help."
          );
        }
        if (name === "Hotel") {
          recs.push(
            "Hotel expenses are on the higher side. Consider negotiating extensions or choosing simpler rooms."
          );
        }
      }
    });

    if (!recs.length) {
      recs.push("Your spending looks well balanced. Keep enjoying the trip 👍");
    }

    return recs;
  }, [categoryData, totalSpent]);

  /* -------------------- Handlers -------------------- */

  const addExpense = () => {
    if (!description || !amount) return;

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        description,
        amount: Number(amount),
        category,
      },
    ]);

    setDescription("");
    setAmount("");
    setCategory("Food");
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 mt-10">

      {/* Intro */}
      <section className="px-5 py-10 max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Understand your trip expenses
        </h1>
        <p className="mt-2 text-slate-600 max-w-xl">
          Add expenses as you travel. Tripsy helps you see patterns and gently reduce unnecessary spending.
        </p>
      </section>

      {/* Summary */}
      <section className="px-5 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryItem label="Total Spent" value={`₹${totalSpent}`} />
          <SummaryItem label="Daily Avg" value="₹—" />
          <SummaryItem label="Budget Status" value="Within budget" />
          <SummaryItem
            label="Top Category"
            value={categoryData[0]?.name || "—"}
          />
        </div>
      </section>

      {/* Add Expense */}
      <section className="px-5 py-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <input
            className="w-full border-none bg-slate-100 rounded-xl p-3 outline-none"
            placeholder="Poonam Restaurant dinner"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-3">
            <input
              type="number"
              className="flex-1 bg-slate-100 rounded-xl p-3 outline-none"
              placeholder="₹ Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(CATEGORY_COLORS).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm ${
                  category === c
                    ? "bg-orange-400 text-white"
                    : "bg-slate-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={addExpense}
            className="mt-2 bg-orange-400 text-white px-6 py-3 rounded-xl"
          >
            Add Expense
          </button>
        </div>
      </section>

      {/* Charts */}
      {expenses.length > 0 && (
        <section className="px-5 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <ChartCard title="Category Split">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" outerRadius={90}>
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Expense Comparison">
            <ResponsiveContainer width="60%" height={250}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>
      )}

      {/* Recommendations */}
      <section className="px-5 py-12 max-w-5xl mx-auto bg-orange-50 rounded-3xl mt-12">
        <h2 className="text-xl font-semibold mb-4">
          Smart cost-saving suggestions
        </h2>
        <ul className="space-y-3 text-slate-700">
          {recommendations.map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      </section>

      {/* Split */}
      <section className="px-5 py-12 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Split expenses with friends
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <input
            className="w-full bg-slate-100 rounded-xl p-3"
            placeholder="Person name"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
          />
          <input
            className="w-full bg-slate-100 rounded-xl p-3"
            placeholder="₹ Amount"
            value={splitAmount}
            onChange={(e) => setSplitAmount(e.target.value)}
          />
          <select
            className="w-full bg-slate-100 rounded-xl p-3"
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
          >
            <option value="receive">I paid for them</option>
            <option value="give">They paid for me</option>
          </select>

          {person && splitAmount && (
            <p className="text-slate-700">
              {splitType === "receive"
                ? `You should receive ₹${splitAmount} from ${person}`
                : `You owe ₹${splitAmount} to ${person}`}
            </p>
          )}
        </div>
      </section>

      {/* Expense List */}
      <section className="px-5 pb-20 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">All expenses</h2>
        <div className="space-y-3">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="bg-white p-4 rounded-xl flex justify-between"
            >
              <div>
                <p className="font-medium">{e.description}</p>
                <p className="text-sm text-slate-500">{e.category}</p>
              </div>
              <p className="font-semibold">₹{e.amount}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="mb-3 font-medium">{title}</p>
      {children}
    </div>
  );
}

export default ExpenseTracker;