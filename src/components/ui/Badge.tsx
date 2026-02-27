import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "amber" | "gray";
  className?: string;
}

export default function Badge({
  children,
  variant = "green",
  className = "",
}: BadgeProps) {
  const variants = {
    green: "bg-green-100 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
