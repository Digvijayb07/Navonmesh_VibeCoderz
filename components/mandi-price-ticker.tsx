"use client";

import { useEffect, useState } from "react";

interface MandiRecord {
  state: string;
  market: string;
  commodity: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

const API_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001a7e2391ebe434c456bf495fca2f0faad&format=json&limit=30";

const cropEmoji: Record<string, string> = {
  tomato: "🍅",
  banana: "🍌",
  onion: "🧅",
  cabbage: "🥬",
  potato: "🥔",
  wheat: "🌾",
  rice: "🍚",
};

function getEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const key in cropEmoji) if (lower.includes(key)) return cropEmoji[key];
  return "🌿";
}

export function MandiPriceTicker() {
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.records?.length) {
        setRecords(data.records);
        setDate(data.records[0].arrival_date);
      }
    }

    load();
  }, []);

  if (!records.length) return null;

  const tickerItems = [...records, ...records];

  return (
    <div className="w-full glass-card rounded-2xl flex items-center overflow-hidden border-0">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 px-4 shrink-0 bg-gradient-to-r from-green-600 to-green-500 h-11">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-xs font-bold text-white uppercase tracking-wide">
          Live Prices
        </span>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker">
          {tickerItems.map((r, i) => {
            const price = (r.modal_price / 100).toFixed(1);
            const min = (r.min_price / 100).toFixed(1);
            const max = (r.max_price / 100).toFixed(1);

            return (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-5 border-r border-green-100/30 shrink-0"
              >
                <span>{getEmoji(r.commodity)}</span>

                <span className="text-sm font-medium text-green-900">
                  {r.commodity}
                </span>

                <span className="text-sm font-bold gradient-text">
                  ₹{price}/kg
                </span>

                <span className="text-xs text-green-600/50">
                  ({r.market.split(" ")[0]})
                </span>

                <span className="text-xs bg-green-100/50 text-green-700 px-2 py-0.5 rounded-full border border-green-200/30">
                  ₹{min}–₹{max}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT DATE */}
      <div className="px-4 shrink-0 text-xs text-green-700/50 h-11 flex items-center bg-green-50/30 backdrop-blur-sm">
        📅 {date}
      </div>

      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          animation: ticker 10s linear infinite;
        }

        div:hover > .animate-ticker {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
