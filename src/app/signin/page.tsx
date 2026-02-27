"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "./actions";

function SignInForm() {
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error");
  const successMsg = searchParams.get("message");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(formData);
      } else {
        await signIn(formData);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-green-900 mb-2"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-green-700/60 text-sm">
          {isSignUp
            ? "Join the agricultural revolution"
            : "Sign in to your Navonmesh account"}
        </p>
      </div>

      {/* Error / Success messages */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={async () => {
            const { signInWithGoogle } = await import("./actions");
            await signInWithGoogle();
          }}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={async () => {
            const { signInWithGithub } = await import("./actions");
            await signInWithGithub();
          }}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-green-200/60" />
        <span className="text-xs text-green-600/50 font-medium uppercase tracking-wider">
          or continue with email
        </span>
        <div className="flex-1 h-px bg-green-200/60" />
      </div>

      {/* Email Form */}
      <form action={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-800 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="farmer@example.com"
              className="w-full px-5 py-3 rounded-2xl bg-white/80 border border-green-200 text-green-900 placeholder:text-green-400/50 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-800 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-2xl bg-white/80 border border-green-200 text-green-900 placeholder:text-green-400/50 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
            />
          </div>

          {!isSignUp && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors cursor-pointer">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" />
                </svg>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </span>
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      {/* Toggle Sign Up / Sign In */}
      <div className="mt-6 text-center">
        <p className="text-sm text-green-700/60">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-green-600 font-semibold hover:text-green-700 transition-colors cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Create one"}
          </button>
        </p>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 pattern-dots" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-300/15 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-green-400/15 blur-3xl" />
      <div className="absolute top-1/4 right-1/3 w-72 h-72 rounded-full bg-amber-200/10 blur-3xl" />

      {/* Floating elements */}
      <div className="absolute top-[15%] left-[10%] animate-float pointer-events-none">
        <div className="w-14 h-14 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl flex items-center justify-center text-2xl border border-white/40">
          🌾
        </div>
      </div>
      <div className="absolute bottom-[20%] right-[10%] animate-float-delayed pointer-events-none">
        <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl flex items-center justify-center text-xl border border-white/40">
          🌿
        </div>
      </div>
      <div className="absolute top-[60%] left-[5%] animate-float-slow pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-green-400/20 backdrop-blur-sm border border-green-300/30" />
      </div>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-shadow duration-300">
              <svg
                width="26"
                height="26"
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
              className="text-2xl font-bold text-green-900 tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Navonmesh
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl shadow-green-900/10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-green-200 border-t-green-600 rounded-full animate-spin" />
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-green-700/60 hover:text-green-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
