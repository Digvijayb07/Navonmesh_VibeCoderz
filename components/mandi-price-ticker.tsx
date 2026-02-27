'use client';

import { useEffect, useState } from 'react';

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
  'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001a7e2391ebe434c456bf495fca2f0faad&format=json&limit=30';

const cropEmoji: Record<string, string> = {
  tomato: '🍅',
  banana: '🍌',
  onion: '🧅',
  cabbage: '🥬',
  potato: '🥔',
  wheat: '🌾',
  rice: '🍚',
};

function getEmoji(name: string) {
  const lower = name.toLowerCase();
  for (const key in cropEmoji)
    if (lower.includes(key)) return cropEmoji[key];
  return '🌿';
}

export function MandiPriceTicker() {
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [date, setDate] = useState('');

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
    <div className="w-full border rounded-xl bg-muted/30 flex items-center overflow-hidden">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 px-4 shrink-0 bg-primary/10 h-11">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold text-primary uppercase">
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
                className="inline-flex items-center gap-2 px-5 border-r shrink-0"
              >
                <span>{getEmoji(r.commodity)}</span>

                <span className="text-sm font-medium">
                  {r.commodity}
                </span>

                <span className="text-sm font-bold text-green-600">
                  ₹{price}/kg
                </span>

                <span className="text-xs text-muted-foreground">
                  ({r.market.split(' ')[0]})
                </span>

                <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
                  ₹{min}–₹{max}
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* RIGHT DATE */}
      <div className="px-4 shrink-0 text-xs text-muted-foreground h-11 flex items-center bg-background">
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