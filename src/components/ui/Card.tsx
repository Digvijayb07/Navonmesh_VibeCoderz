"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
  glow = false,
}: CardProps) {
  return (
    <div
      className={`
        glass-card rounded-2xl p-6
        ${hover ? "card-hover" : ""}
        ${glow ? "glow-border" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
