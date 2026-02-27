"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { howItWorks } from "@/data/mockData";
import SectionWrapper from "@/components/ui/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const stepIcons: Record<string, React.ReactNode> = {
  "user-plus": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  zap: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  "check-circle": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

export default function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const connectorsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!stepsRef.current) return;

    const steps = stepsRef.current.querySelectorAll(".step-card");
    const connectors = connectorsRef.current.filter(Boolean);

    gsap.fromTo(
      steps,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    connectors.forEach((connector, i) => {
      gsap.fromTo(
        connector,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3 + i * 0.2,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <SectionWrapper id="how-it-works" className="bg-green-50/50">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          🔄 Simple Process
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          How <span className="gradient-text">Navonmesh</span> Works
        </h2>
        <p className="text-lg text-green-700/60 max-w-2xl mx-auto">
          Get started in minutes. Our streamlined process makes agricultural
          trading simple and secure.
        </p>
      </div>

      {/* Steps */}
      <div ref={stepsRef} className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {howItWorks.map((step, index) => (
            <React.Fragment key={index}>
              <div className="step-card relative">
                {/* Step number */}
                <div className="absolute -top-3 -left-1 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-green-500/30 z-10">
                  {step.step}
                </div>

                <div className="glass-card rounded-2xl p-8 pt-10 h-full card-hover text-center lg:text-left">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-600 mb-5 mx-auto lg:mx-0">
                    {stepIcons[step.icon]}
                  </div>

                  <h3
                    className="text-lg font-bold text-green-900 mb-3"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-green-700/60 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line (desktop only) */}
                {index < howItWorks.length - 1 && (
                  <div
                    ref={(el) => { connectorsRef.current[index] = el; }}
                    className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-green-400 to-green-300 origin-left z-0"
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
