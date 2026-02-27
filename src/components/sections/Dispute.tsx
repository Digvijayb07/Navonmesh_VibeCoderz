"use client";

import React, { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";

export default function Dispute() {
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    // for now just update status locally
    setStatus("Dispute Raised");
    setDetails("");
  };

  return (
    <SectionWrapper id="dispute" className="bg-green-50/50">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          ⚖️ Dispute Center
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Raise a <span className="gradient-text">Dispute</span>
        </h2>
        <p className="text-lg text-green-700/60 max-w-2xl mx-auto">
          Let us know if another user has defaulted on an agreement. We'll review your case promptly.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={6}
          placeholder="Describe the dispute in detail..."
          className="w-full p-4 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
        />
        <div className="text-right">
          <Button type="submit" variant="primary">
            Submit Dispute
          </Button>
        </div>
      </form>

      {/* Tracker */}
      <div className="mt-12 max-w-xl mx-auto">
        <div className="relative">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="w-full flex justify-between items-center px-4 py-3 bg-white border border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
          >
            <span className="text-green-700">
              {status || "No dispute submitted"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDropdown && (
            <div className="mt-1 bg-white border border-green-200 rounded-lg shadow-sm">
              <ul className="text-sm text-green-700">
                <li className="px-4 py-2 hover:bg-green-50">Dispute Raised</li>
                <li className="px-4 py-2 hover:bg-green-50">Under Review</li>
                <li className="px-4 py-2 hover:bg-green-50">Resolved</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
