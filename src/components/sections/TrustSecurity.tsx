"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/ui/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const verifications = [
  { icon: "🆔", label: "KYC Verified", desc: "Government ID verification" },
  { icon: "📍", label: "Address Proof", desc: "Geo-verified farm location" },
  { icon: "🏦", label: "Bank Linked", desc: "Secure banking integration" },
  { icon: "📱", label: "Phone Verified", desc: "OTP-based phone validation" },
  { icon: "🌾", label: "Farm Certified", desc: "Agricultural land proof" },
  { icon: "⭐", label: "Trade History", desc: "Verified transaction record" },
];

function TrustScoreCircle({ score }: { score: number }) {
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!circleRef.current) return;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;

    gsap.fromTo(
      circleRef.current,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: offset,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: circleRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [score]);

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="rgba(22, 163, 74, 0.1)"
          strokeWidth="8"
        />
        <circle
          ref={circleRef}
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#trustGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
        <defs>
          <linearGradient id="trustGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold text-green-700"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {score}
        </span>
        <span className="text-xs text-green-600/60 font-medium">
          Trust Score
        </span>
      </div>
    </div>
  );
}

export default function TrustSecurity() {
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!badgesRef.current) return;
    const badges = badgesRef.current.children;
    gsap.fromTo(
      badges,
      { y: 30, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: badgesRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <SectionWrapper id="trust" className="bg-green-50/50">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          🛡️ Trust & Security
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Built on <span className="gradient-text">Trust & Transparency</span>
        </h2>
        <p className="text-lg text-green-700/60 max-w-2xl mx-auto">
          Every transaction is protected by our multi-layer verification system,
          escrow protection, and blockchain-backed trust scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Trust Score */}
        <div className="glass-card rounded-3xl p-10">
          <TrustScoreCircle score={92} />

          <div className="mt-8 space-y-4">
            {/* Score breakdown */}
            {[
              { label: "Transaction History", value: 96 },
              { label: "Delivery Reliability", value: 89 },
              { label: "Quality Rating", value: 94 },
              { label: "Response Time", value: 88 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-green-800 font-medium">
                    {item.label}
                  </span>
                  <span className="text-green-600">{item.value}%</span>
                </div>
                <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Escrow */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-green-50 to-green-100/80 border border-green-200/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">
                  Escrow Protection
                </h4>
                <p className="text-xs text-green-700/60 leading-relaxed">
                  Funds are securely held in escrow until both parties confirm
                  successful delivery. Full refund guarantee on disputes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Verification Badges */}
        <div>
          <h3
            className="text-2xl font-bold text-green-900 mb-6"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Multi-Layer Verification
          </h3>

          <div ref={badgesRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {verifications.map((v, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 card-hover flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-sm mb-1">
                    {v.label}
                  </h4>
                  <p className="text-xs text-green-700/60">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
