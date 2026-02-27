"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: 150,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Content entrance
      if (contentRef.current) {
        const children = contentRef.current.children;
        gsap.fromTo(
          children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.5,
          }
        );
      }

      // Floating elements
      if (floatingRef.current) {
        const els = floatingRef.current.children;
        gsap.fromTo(
          els,
          { scale: 0, opacity: 0, rotation: -30 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "elastic.out(1, 0.5)",
            delay: 1,
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated gradient bg */}
      <div
        ref={bgRef}
        className="absolute inset-0 gradient-hero"
        style={{ top: "-50px" }}
      />

      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-dots" />

      {/* Large decorative circles */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-300/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-green-400/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-200/10 blur-3xl" />

      {/* Floating elements */}
      <div
        ref={floatingRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-[15%] left-[8%] animate-float">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-3xl md:text-4xl border border-white/40">
            🌾
          </div>
        </div>
        <div className="absolute top-[20%] right-[10%] animate-float-delayed">
          <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-2xl md:text-3xl border border-white/40">
            🚜
          </div>
        </div>
        <div className="absolute bottom-[25%] left-[15%] animate-float-slow">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-2xl md:text-3xl border border-white/40">
            🌿
          </div>
        </div>
        <div className="absolute bottom-[30%] right-[8%] animate-float">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-2xl md:text-3xl border border-white/40">
            🌱
          </div>
        </div>
        <div className="absolute top-[55%] left-[5%] animate-bounce-gentle">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-green-400/20 backdrop-blur-sm border border-green-300/30" />
        </div>
        <div className="absolute top-[10%] right-[30%] animate-float-slow">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-amber-300/20 backdrop-blur-sm border border-amber-200/30" />
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/80 backdrop-blur-sm border border-green-200/60 text-green-700 text-sm font-medium mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Revolutionizing Agricultural Commerce
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <span className="text-green-900">Trust-Enabled</span>
          <br />
          <span className="gradient-text">Agricultural Exchange</span>
          <br />
          <span className="text-green-900">Platform</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-green-800/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connecting farmers, buyers, and logistics providers with AI-powered
          price discovery, blockchain trust scores, and secure digital
          transactions.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" href="#features">
            <span className="mr-2">🚀</span>
            Get Started
          </Button>
          <Button variant="secondary" size="lg" href="#marketplace">
            <span className="mr-2">🏪</span>
            Explore Marketplace
          </Button>
        </div>

        {/* Trust badges below CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-green-700/60">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Escrow Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>AI-Powered Pricing</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Verified Traders</span>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
