import { useState } from "react";

const categories = [
  "adventure",
  "nature",
  "cultural",
  "religious",
  "entertainment",
  "beach",
  "mountain",
  "tourist"
];

export default function PreferencesSelect({ selected, setSelected }) {
  const [open, setOpen] = useState(false);

  const toggleCategory = (cat) => {
    if (selected.includes(cat)) {
      setSelected(selected.filter((c) => c !== cat));
    } else {
      setSelected([...selected, cat]);
    }
  };

  const removeCategory = (cat) => {
    setSelected(selected.filter((c) => c !== cat));
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      
      {/* LABEL */}
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        Preferences
      </label>

      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="border rounded-xl p-3 bg-white cursor-pointer shadow-sm focus:ring-2 focus:ring-orange-400"
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">Select preferences</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
              >
                {cat}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(cat);
                  }}
                  className="text-orange-500 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="mt-2 border rounded-xl shadow-lg bg-white p-3 grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-2 rounded-lg cursor-pointer text-sm capitalize transition ${
                selected.includes(cat)
                  ? "bg-orange-200 text-orange-800"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}