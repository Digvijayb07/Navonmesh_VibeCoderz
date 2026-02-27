"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export default function HindiToggle() {
  const [isHindi, setIsHindi] = useState(false);
  const [ready, setReady] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if page was already translated (persisted via cookie)
    const cookie = document.cookie;
    if (cookie.includes("/hi")) {
      setIsHindi(true);
    }

    // Poll for the Google Translate widget to be ready
    let elapsed = 0;
    pollRef.current = setInterval(() => {
      elapsed += 500;
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        setReady(true);
        if (pollRef.current) clearInterval(pollRef.current);
      }
      // After 8 seconds, show button anyway with cookie fallback
      if (elapsed >= 8000) {
        setReady(true);
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 500);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = isHindi ? "en" : "hi";

    // Method 1: Use the widget's select dropdown
    const select = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement | null;

    if (select) {
      select.value = newLang;
      const event = document.createEvent("HTMLEvents");
      event.initEvent("change", true, true);
      select.dispatchEvent(event);
      setIsHindi(!isHindi);
      return;
    }

    // Method 2: Cookie-based fallback — set googtrans cookie and reload
    if (newLang === "hi") {
      document.cookie =
        "googtrans=/en/hi; path=/; domain=" + window.location.hostname;
      document.cookie = "googtrans=/en/hi; path=/";
    } else {
      document.cookie =
        "googtrans=; path=/; domain=" +
        window.location.hostname +
        "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setIsHindi(!isHindi);
    window.location.reload();
  }, [isHindi]);

  return (
    <button
      onClick={toggleLanguage}
      disabled={!ready}
      className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed"
      title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
    >
      {!ready ? "⏳" : isHindi ? "🇬🇧 EN" : "🇮🇳 हिंदी"}
    </button>
  );
}
