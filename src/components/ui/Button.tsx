"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  href,
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none";

  const variants = {
    primary:
      "btn-gradient text-white shadow-lg hover:shadow-green-500/30",
    secondary:
      "bg-white/80 text-green-700 border border-green-200 hover:bg-green-50 hover:border-green-300 hover:shadow-lg backdrop-blur-sm",
    outline:
      "bg-transparent text-green-600 border-2 border-green-500 hover:bg-green-500 hover:text-white hover:shadow-lg",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-base",
    lg: "px-9 py-4 text-lg",
  };

  const combinedClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClass}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClass} disabled={disabled}>
      {children}
    </button>
  );
}
