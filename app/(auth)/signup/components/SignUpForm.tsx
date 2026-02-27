"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";
import SignInWithGoogleButton from "../../login/components/SignInWithGoogleButton";

const ROLES = [
  { value: "farmer",      label: "🌾 Farmer" },
  { value: "buyer",       label: "🛒 Buyer" },
  { value: "transporter", label: "🚚 Transporter" },
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
];

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const error   = searchParams.get("error");
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      signup(formData);
    });
  };

  return (
    <Card className="mx-auto max-w-lg shadow-lg">
      <CardHeader className="px-8 pt-8 pb-6">
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>
          Fill in your details to join Navonmesh
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-500/10 text-green-500 text-sm p-3 rounded-md mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">

            {/* ── Name ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  name="first-name" id="first-name"
                  placeholder="Ramesh" required disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  name="last-name" id="last-name"
                  placeholder="Kumar" required disabled={isPending}
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email" id="email" type="email"
                placeholder="ramesh@example.com" required disabled={isPending}
              />
            </div>

            {/* ── Password ── */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password" id="password" type="password"
                required minLength={6} disabled={isPending}
                placeholder="Min 6 characters"
              />
            </div>

            {/* ── Role ── */}
            <div className="grid gap-2">
              <Label htmlFor="role">I am a…</Label>
              <select
                name="role" id="role" required disabled={isPending}
                defaultValue="farmer"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* ── Phone ── */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                name="phone" id="phone" type="tel"
                placeholder="+91 98765 43210" disabled={isPending}
              />
            </div>

            <div className="border-t border-border pt-2">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Location</p>
              <div className="grid gap-4">

                {/* ── Village & District ── */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="village">Village / Town</Label>
                    <Input
                      name="village" id="village"
                      placeholder="e.g. Ludhiana" disabled={isPending}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      name="district" id="district"
                      placeholder="e.g. Ludhiana" disabled={isPending}
                    />
                  </div>
                </div>

                {/* ── State ── */}
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <select
                    name="state" id="state" disabled={isPending}
                    defaultValue=""
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  >
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "Creating account…" : "Create Account"}
            </Button>

            <SignInWithGoogleButton />
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
