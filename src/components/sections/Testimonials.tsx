"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/data/mockData";
import SectionWrapper from "@/components/ui/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.children;
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0, rotateY: 15 },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.9,
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
    <SectionWrapper id="testimonials" className="bg-green-50/50">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          💬 Farmer Stories
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Trusted by <span className="gradient-text">Thousands</span>
        </h2>
        <p className="text-lg text-green-700/60 max-w-2xl mx-auto">
          Hear from farmers and traders who have transformed their agricultural
          business with Navonmesh.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-8 card-hover"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={i < t.rating ? "#facc15" : "none"}
                  stroke={i < t.rating ? "#facc15" : "#d1d5db"}
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <p className="text-green-800/80 text-base leading-relaxed mb-6 italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Avatar + Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/20">
                {t.avatar}
              </div>
              <div>
                <h4 className="font-bold text-green-900 text-sm">
                  {t.name}
                </h4>
                <p className="text-xs text-green-600/60">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
