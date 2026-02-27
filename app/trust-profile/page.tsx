"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";

interface Profile {
  full_name: string | null;
  role: string | null;
  trust_score: number | null;
  total_completed: number | null;
  total_failed: number | null;
}

function memberStatus(score: number): string {
  if (score >= 80) return "Gold";
  if (score >= 60) return "Silver";
  if (score >= 40) return "Bronze";
  return "New";
}

function memberStatusColor(status: string): string {
  switch (status) {
    case "Gold":
      return "text-yellow-600";
    case "Silver":
      return "text-gray-500";
    case "Bronze":
      return "text-orange-600";
    default:
      return "text-muted-foreground";
  }
}

export default function TrustProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUserCreatedAt(user.created_at);

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role, trust_score, total_completed, total_failed")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data as Profile);
      setLoading(false);
    }
    load();
  }, []);

  const score = profile?.trust_score ?? 50;
  const scoreOut5 = (score / 20).toFixed(1);
  const completed = profile?.total_completed ?? 0;
  const failed = profile?.total_failed ?? 0;
  const total = completed + failed;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const status = memberStatus(score);
  const displayName = profile?.full_name ?? "Your Farm";
  const role = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Farmer";
  const registeredSince = userCreatedAt
    ? new Date(userCreatedAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const badges = [
    {
      icon: "✓",
      label: "Email Verified",
      color: "bg-blue-100/50 text-blue-700 border-blue-300",
      earned: true,
    },
    {
      icon: "🏆",
      label: "Gold Member",
      color: "bg-yellow-100/50 text-yellow-700 border-yellow-300",
      earned: score >= 80,
    },
    {
      icon: "🎯",
      label: "10+ Sales",
      color: "bg-orange-100/50 text-orange-700 border-orange-300",
      earned: completed >= 10,
    },
    {
      icon: "🎯",
      label: "50+ Sales",
      color: "bg-orange-100/50 text-orange-700 border-orange-300",
      earned: completed >= 50,
    },
    {
      icon: "🎯",
      label: "100+ Sales",
      color: "bg-orange-100/50 text-orange-700 border-orange-300",
      earned: completed >= 100,
    },
    {
      icon: "⭐",
      label: "4.0+ Rating",
      color: "bg-red-100/50 text-red-700 border-red-300",
      earned: score >= 80,
    },
    {
      icon: "⭐",
      label: "4.5+ Rating",
      color: "bg-red-100/50 text-red-700 border-red-300",
      earned: score >= 90,
    },
    {
      icon: "🚀",
      label: "Top Seller",
      color: "bg-indigo-100/50 text-indigo-700 border-indigo-300",
      earned: completed >= 100 && score >= 90,
    },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-32 text-muted-foreground gap-3">
          <svg
            className="animate-spin h-6 w-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading trust profile...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Trust Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Your reputation and trust metrics in the Krishi Exchange community
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="border-border">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
              {/* Trust Score Circle */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <p className="text-5xl sm:text-6xl font-bold text-primary-foreground">
                      {scoreOut5}
                    </p>
                    <p className="text-xs sm:text-sm text-primary-foreground/80">
                      out of 5
                    </p>
                  </div>
                </div>
                <Badge className="mt-4 sm:mt-6 bg-green-100/50 text-green-700 border-green-300 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
                  ✓ Verified {role}
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 sm:space-y-6 w-full">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {displayName}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Registered since {registeredSince}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-secondary/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Total Transactions
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {total}
                    </p>
                  </div>
                  <div className="bg-secondary/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Successful Deals
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">
                      {completed} {total > 0 ? `(${successRate}%)` : ""}
                    </p>
                  </div>
                  <div className="bg-secondary/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Failed / Rejected
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-destructive">
                      {failed}
                    </p>
                  </div>
                  <div className="bg-secondary/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Member Status
                    </p>
                    <p
                      className={`text-2xl sm:text-3xl font-bold ${memberStatusColor(status)}`}
                    >
                      {status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Trust Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Overall Score
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {scoreOut5}/5
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {total} transactions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Completion Rate
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {total > 0 ? successRate : 0}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${total > 0 ? successRate : 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {completed} completed of {total} total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Reliability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Member Tier
                  </span>
                  <span
                    className={`text-2xl font-bold ${memberStatusColor(status)}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {score >= 80
                    ? "Excellent standing"
                    : score >= 60
                      ? "Good standing"
                      : score >= 40
                        ? "Average standing"
                        : "Build your reputation with more trades"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications & Badges */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              Badges earned based on your trading activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {badges.map((badge, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border text-center ${
                    badge.earned
                      ? badge.color
                      : "bg-muted/30 text-muted-foreground border-border opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <p className="text-sm font-semibold">{badge.label}</p>
                  {!badge.earned && (
                    <p className="text-[10px] mt-1">Not yet earned</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
