"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "none";
}

export default function SectionWrapper({
  children,
  id,
  className = "",
  animation = "fade-up",
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (animation === "none" || !sectionRef.current) return;

    const el = sectionRef.current;

    const animationMap = {
      "fade-up": { y: 60, opacity: 0 },
      "fade-left": { x: -60, opacity: 0 },
      "fade-right": { x: 60, opacity: 0 },
      scale: { scale: 0.9, opacity: 0 },
    };

    const fromVars = animationMap[animation];

    gsap.fromTo(el, fromVars, {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [animation]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`py-20 md:py-28 px-4 md:px-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
