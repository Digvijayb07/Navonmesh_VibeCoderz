"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Marketplace from "@/components/sections/Marketplace";
import TrustSecurity from "@/components/sections/TrustSecurity";
import AnalyticsDashboard from "@/components/sections/AnalyticsDashboard";
import Logistics from "@/components/sections/Logistics";
import Testimonials from "@/components/sections/Testimonials";
import Button from "@/components/ui/Button";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Marketplace />
        <Logistics />
        <TrustSecurity />
        <AnalyticsDashboard />
        <Testimonials />

        {/* CTA Section */}
        <SectionWrapper className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-green-700 rounded-3xl" />
          <div className="absolute inset-0 pattern-dots opacity-20 rounded-3xl" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-green-300/20 blur-3xl" />

          <div className="relative z-10 text-center py-16 px-6 rounded-3xl">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Ready to Transform Your
              <br />
              Agricultural Business?
            </h2>
            <p className="text-lg text-green-100/80 max-w-2xl mx-auto mb-10">
              Join thousands of farmers and traders who are already using
              Navonmesh to get better prices, faster settlements, and trusted
              partnerships.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50 border-none shadow-xl"
                href="#features"
              >
                🚀 Start Trading Today
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:border-white/60"
                href="#how-it-works"
              >
                📞 Talk to Sales
              </Button>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
