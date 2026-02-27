"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/mockData";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Badge from "@/components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

const categories = ["All", "Grains", "Vegetables", "Equipment"];

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

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
      }
    );
  }, [activeCategory]);

  return (
    <SectionWrapper id="marketplace">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          🏪 Marketplace
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Browse Our <span className="gradient-text">Marketplace</span>
        </h2>
        <p className="text-lg text-green-700/60 max-w-2xl mx-auto">
          Discover fresh produce, quality grains, and modern agricultural
          equipment from verified sellers across India.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/25"
                : "bg-white/80 text-green-700 border border-green-200 hover:bg-green-50 hover:border-green-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((product) => (
          <div
            key={product.id}
            className="group glass-card rounded-2xl overflow-hidden card-hover"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
              <span className="text-7xl transition-transform duration-500 group-hover:scale-125">
                {product.image}
              </span>
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <Badge>{product.category}</Badge>
              </div>
              {/* Trust score */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-green-700 shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {product.trustScore}%
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-green-900" style={{ fontFamily: "var(--font-poppins)" }}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    {product.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-green-700/60 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {product.location}
                <span className="mx-1">·</span>
                {product.seller}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-700">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-green-600/50">
                    /{product.unit}
                  </span>
                </div>
                <button className="px-5 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer">
                  View Deal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
