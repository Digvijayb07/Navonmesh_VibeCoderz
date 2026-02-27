"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "@/data/mockData";

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({
  value,
  prefix,
  suffix,
}: {
  value: number;
  prefix: string;
  suffix: string;
}) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!counterRef.current) return;

    const el = counterRef.current;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: value,
      duration: 2.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (value >= 1000000) {
          el.textContent = `${prefix}${(obj.val / 1000000).toFixed(1)}M${suffix.replace("+", "+")}`;
        } else if (value >= 1000) {
          el.textContent = `${prefix}${Math.round(obj.val / 1000)}K${suffix}`;
        } else {
          el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        }
      },
    });
  }, [value, prefix, suffix]);

  return (
    <span ref={counterRef} className="gradient-text">
      0
    </span>
  );
}

export default function Stats() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;

    const cards = statsRef.current.children;
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
          trigger: statsRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section className="py-16 px-4 md:px-6 relative -mt-8">
      <div
        ref={statsRef}
        className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-6 md:p-8 text-center card-hover"
          >
            <div className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-poppins)" }}>
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </div>
            <div className="text-sm text-green-700/60 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
