"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
    _googleTranslateReady: boolean;
  }
}

export default function GoogleTranslateLoader() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Monkey-patch removeChild to gracefully handle Google Translate's
    // DOM mutations that conflict with React's virtual DOM reconciliation.
    // Google Translate wraps text nodes in <font> tags — when React later
    // tries to update those nodes, it crashes with "not a child of this node".
    const originalRemoveChild = Node.prototype.removeChild;
    // @ts-ignore
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        if (child.parentNode) {
          return originalRemoveChild.call(child.parentNode, child) as T;
        }
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    // Same fix for insertBefore
    const originalInsertBefore = Node.prototype.insertBefore;
    // @ts-ignore
    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null,
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        return originalInsertBefore.call(this, newNode, null) as T;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };

    // Set up Google Translate
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,en",
          autoDisplay: false,
        },
        "google_translate_element",
      );

      window._googleTranslateReady = true;

      // Keep fixing the body offset Google injects
      const fixInterval = setInterval(() => {
        if (document.body.style.top !== "0px") {
          document.body.style.top = "0px";
        }
        const banner = document.querySelector(
          "iframe.goog-te-banner-frame",
        ) as HTMLElement;
        if (banner) banner.style.display = "none";
      }, 300);

      setTimeout(() => clearInterval(fixInterval), 10000);
    };

    // Load the script
    if (
      !document.querySelector(
        'script[src*="translate.google.com/translate_a/element.js"]',
      )
    ) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "0px",
        width: "500px",
        height: "100px",
      }}
    />
  );
}
