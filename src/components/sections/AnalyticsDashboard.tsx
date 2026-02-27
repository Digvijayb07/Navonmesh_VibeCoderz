"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chartData, transactions } from "@/data/mockData";
import SectionWrapper from "@/components/ui/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

function BarChart({ data }: { data: { month: string; value: number }[] }) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll(".bar-fill");
    gsap.fromTo(
      bars,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: barsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div ref={barsRef} className="flex items-end justify-between gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
          <div
            className="bar-fill w-full rounded-t-lg bg-gradient-to-t from-green-600 to-green-400 origin-bottom min-h-[4px]"
            style={{ height: `${(d.value / maxVal) * 100}%` }}
          />
          <span className="text-xs text-green-700/50 mt-2 font-medium">
            {d.month}
          </span>
        </div>
      ))}
    </div>
  );
}

function NearbyMap() {
  return (
    <div className="lg:col-span-2 glass-card rounded-2xl p-8">
      <h3 className="text-lg font-bold text-green-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>📍 Nearby Buyers & Farmers</h3>
      <div className="rounded-lg bg-green-50 h-[220px] flex items-center justify-center relative overflow-hidden">
        {/* Stylized map placeholder */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] left-[30%] w-3 h-3 rounded-full bg-green-600 animate-pulse" />
          <div className="absolute top-[40%] left-[55%] w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <div className="absolute top-[60%] left-[25%] w-3 h-3 rounded-full bg-green-600 animate-pulse" />
          <div className="absolute top-[35%] left-[70%] w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
          <div className="absolute top-[70%] left-[60%] w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <div className="absolute top-[15%] left-[80%] w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <div className="absolute top-[80%] left-[40%] w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          {/* Lines connecting dots */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="30%" y1="20%" x2="55%" y2="40%" stroke="#16a34a" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1="55%" y1="40%" x2="25%" y2="60%" stroke="#16a34a" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1="55%" y1="40%" x2="70%" y2="35%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          </svg>
        </div>
        <div className="text-center z-10">
          <p className="text-green-700/70 text-sm font-medium">Interactive Map</p>
          <p className="text-xs text-green-700/50 mt-1">🟢 12 Farmers · 🔵 8 Buyers nearby</p>
        </div>
      </div>
      <div className="flex gap-4 mt-4 text-xs text-green-700/70">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-600" /> Farmers
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Buyers
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500" /> Transporters
        </span>
      </div>
    </div>
  );
}

function DonutChart({
  data,
}: {
  data: { name: string; percentage: number }[];
}) {
  const colors = ["#16a34a", "#22c55e", "#4ade80", "#86efac"];
  let cumulativePercent = 0;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {data.map((segment, i) => {
          const dashArray = `${segment.percentage} ${100 - segment.percentage}`;
          const dashOffset = -cumulativePercent;
          cumulativePercent += segment.percentage;
          return (
            <circle
              key={i}
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={colors[i]}
              strokeWidth="3"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-green-700">100%</span>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.children;
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <SectionWrapper id="dashboard" className="pattern-grid">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          📊 Analytics
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Powerful <span className="gradient-text">Analytics Dashboard</span>
        </h2>
        <p className="text-lg text-green-700/60 max-w-2xl mx-auto">
          Track your performance with real-time analytics, monitor your token
          wallet, and stay on top of every transaction.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-green-900" style={{ fontFamily: "var(--font-poppins)" }}>
                Revenue Trends
              </h3>
              <p className="text-sm text-green-600/50">Last 7 months</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              +23.5%
            </div>
          </div>
          <BarChart data={chartData.monthly} />
        </div>

        {/* Token Wallet */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-8">
          <h3 className="text-lg font-bold text-green-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
            Token Wallet
          </h3>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white mb-6">
            <p className="text-sm text-green-200 mb-1">Available Balance</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
              ₹2,45,800
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-green-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              </svg>
              +12.4% this month
            </div>
          </div>

          <DonutChart data={chartData.categories} />

          <div className="mt-4 space-y-2">
            {chartData.categories.map((cat, i) => {
              const colors = ["bg-green-600", "bg-green-500", "bg-green-400", "bg-green-300"];
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[i]}`} />
                    <span className="text-green-800">{cat.name}</span>
                  </div>
                  <span className="text-green-600 font-medium">
                    {cat.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nearby Map */}
        <NearbyMap />

        {/* Transaction History */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-green-900" style={{ fontFamily: "var(--font-poppins)" }}>
              Recent Transactions
            </h3>
            <button className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors cursor-pointer">
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-100">
                  <th className="text-left text-xs font-medium text-green-600/60 py-3 pr-4 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="text-left text-xs font-medium text-green-600/60 py-3 pr-4 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="text-left text-xs font-medium text-green-600/60 py-3 pr-4 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-green-600/60 py-3 pr-4 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-green-600/60 py-3 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, i) => (
                  <tr
                    key={i}
                    className="border-b border-green-50 last:border-none hover:bg-green-50/50 transition-colors"
                  >
                    <td className="py-4 pr-4 text-sm font-mono text-green-700">
                      {txn.id}
                    </td>
                    <td className="py-4 pr-4 text-sm text-green-900 font-medium">
                      {txn.item}
                    </td>
                    <td className="py-4 pr-4 text-sm text-green-700 font-semibold">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          txn.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {txn.status === "completed" ? "✓ " : "⏳ "}
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-green-600/60">
                      {txn.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
