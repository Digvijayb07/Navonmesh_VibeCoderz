import React, { Suspense } from "react";
import { LoginForm } from "./components/LoginForm";

const loginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 pattern-dots" />

      {/* Decorative blurs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-300/15 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-green-400/15 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-amber-200/10 blur-3xl" />

      {/* Floating emojis */}
      <div className="absolute top-[15%] left-[8%] animate-float pointer-events-none">
        <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-2xl border border-white/40">
          🌾
        </div>
      </div>
      <div className="absolute top-[20%] right-[10%] animate-float-delayed pointer-events-none">
        <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-xl border border-white/40">
          🚜
        </div>
      </div>
      <div className="absolute bottom-[25%] left-[15%] animate-float-delayed pointer-events-none">
        <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-lg border border-white/40">
          🌿
        </div>
      </div>
      <div className="absolute bottom-[30%] right-[8%] animate-float pointer-events-none">
        <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center text-xl border border-white/40">
          🌱
        </div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 animate-scale-in">
        <Suspense
          fallback={
            <div className="glass-card rounded-2xl p-8 text-center text-green-700/50">
              Loading...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
};

export default loginPage;
