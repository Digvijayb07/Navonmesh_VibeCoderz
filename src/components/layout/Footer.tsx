"use client";

import React from "react";
import { footerLinks } from "@/data/mockData";

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900" />
      <div className="absolute inset-0 pattern-dots opacity-30" />

      {/* Decorative blur orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span
                className="text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Navonmesh
              </span>
            </div>
            <p className="text-green-200/80 text-sm leading-relaxed max-w-sm mb-6">
              Empowering farmers with AI-powered price discovery, trust-based
              trading, and secure digital transactions. Building the future of
              agricultural commerce.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {["twitter", "linkedin", "github", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/10"
                  aria-label={social}
                >
                  <span className="text-green-300 text-sm capitalize">
                    {social[0].toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-green-200/70 text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-green-700/40 pt-10 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">
                Stay updated with Navonmesh
              </h4>
              <p className="text-green-200/60 text-sm">
                Get the latest updates on agricultural market trends and
                platform features.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 rounded-full bg-white/10 border border-green-600/40 text-white placeholder:text-green-300/40 text-sm focus:outline-none focus:border-green-400 transition-colors w-full md:w-72"
              />
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold text-sm shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-green-700/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-green-300/50 text-sm">
            © 2026 Navonmesh. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-green-300/50 text-sm hover:text-green-200 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-green-300/50 text-sm hover:text-green-200 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-green-300/50 text-sm hover:text-green-200 transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
