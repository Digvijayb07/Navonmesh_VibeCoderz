"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SectionWrapper from "@/components/ui/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const vehicles = [
  { id: 1, type: "Mini Truck", capacity: "2 Ton", route: "Nashik → Pune", price: "₹3,500", available: true, emoji: "🛻" },
  { id: 2, type: "Pickup Van", capacity: "1 Ton", route: "Nashik → Mumbai", price: "₹5,200", available: true, emoji: "🚐" },
  { id: 3, type: "Large Truck", capacity: "10 Ton", route: "Indore → Pune", price: "₹12,000", available: false, emoji: "🚚" },
  { id: 4, type: "Tempo", capacity: "3 Ton", route: "Solapur → Nashik", price: "₹4,800", available: true, emoji: "🚛" },
];

const Logistics = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <SectionWrapper id="logistics" className="bg-green-50/50">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          🚚 Logistics & Transport
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Reliable <span className="gradient-text">Logistics Solutions</span>
        </h2>
        <p className="text-lg text-green-700/60 max-w-2xl mx-auto">
          Find and book reliable transport for your produce shipments with verified carriers.
        </p>
      </div>

      {/* Optimization tip */}
      <div className="mb-12 glass-card rounded-2xl p-6 bg-green-50/80 border-green-200 card-hover">
        <div className="flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">✅</span>
          <div className="flex-1">
            <p className="font-bold text-green-900 text-lg mb-1">Smart Optimization</p>
            <p className="text-green-700/70 text-base mb-4">
              Combine your Wheat (200 kg) and Corn (150 kg) shipments to Pune — save ₹1,200 on transport costs!
            </p>
            <Button size="sm" className="text-sm">
              Apply Suggestion
            </Button>
          </div>
        </div>
      </div>

      {/* Transport Cards */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {vehicles.map((v, i) => (
          <div
            key={v.id}
            className="glass-card rounded-2xl p-8 card-hover text-center"
          >
            {/* Emoji Icon */}
            <div className="mb-5">
              <span className="text-5xl inline-block">{v.emoji}</span>
            </div>

            {/* Vehicle Type */}
            <h3
              className="text-xl font-bold text-green-900 mb-4"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {v.type}
            </h3>

            {/* Details */}
            <div className="space-y-3 mb-6 text-sm text-green-700/60">
              <p className="font-medium text-green-800">
                📦 <span className="font-semibold">{v.capacity}</span>
              </p>
              <p className="font-medium text-green-800">
                📍 {v.route}
              </p>
              <p className="text-lg font-bold text-green-700">
                💰 {v.price}
              </p>
            </div>

            {/* Status and Action */}
            <div className="mt-6 flex flex-col gap-3">
              <Badge
                variant={v.available ? "green" : "gray"}
                className={`justify-center text-xs font-semibold ${
                  v.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {v.available ? "🟢 Available" : "🔴 Booked"}
              </Badge>
              <Button
                size="sm"
                className="w-full text-xs font-semibold"
                disabled={!v.available}
              >
                {v.available ? "Book Now" : "Unavailable"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Logistics;