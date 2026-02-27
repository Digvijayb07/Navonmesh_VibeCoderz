"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

type Dispute = {
  id: string;
  against: string;
  issue: string;
  date: string;
  status: string;
  resolution?: string;
  created_at?: string;
  };

export default function DisputesPage() {
  const supabase = createClient();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [against, setAgainst] = useState("");
  const [issue, setIssue] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [clearLoading, setClearLoading] = useState(false);

  const handleOpen = () => setShowForm(true);
  const handleClose = () => {
    setShowForm(false);
    setSubmitError(null);
  };

  // ================= FETCH FROM SUPABASE =================
  const fetchDisputes = useCallback(async () => {
    setLoadingData(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from("disputes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError(error.message);
      } else if (data) {
        const formatted = data.map((d: any) => ({
          ...d,
          date: new Date(d.created_at).toLocaleDateString(),
        }));
        setDisputes(formatted);
      }
    } catch (err) {
      setFetchError("Failed to fetch disputes");
    } finally {
      setLoadingData(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);


  // ================= ADD DISPUTE =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!against.trim() || !issue.trim()) {
      setSubmitError("Please fill in both fields");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase
        .from("disputes")
        .insert([
          {
            against: against.trim(),
            issue: issue.trim(),
            status: "raised",
          },
        ])
        .select();

      if (error) {
        setSubmitError(error.message);
      } else if (data && data[0]) {
        const newDispute = {
          ...data[0],
          date: new Date(data[0].created_at).toLocaleDateString(),
        };
        setDisputes((prev) => [newDispute, ...prev]);
        setAgainst("");
        setIssue("");
        setShowForm(false);
      }
    } catch (err) {
      setSubmitError("Failed to submit dispute");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ================= CLEAR RESOLVED =================
  const clearResolved = async () => {
    setClearLoading(true);
    try {
      const { error } = await supabase
        .from("disputes")
        .delete()
        .eq("status", "resolved");

      if (error) {
        console.error("Clear error:", error.message);
      } else {
        fetchDisputes();
      }
    } catch (err) {
      console.error("Failed to clear resolved disputes");
    } finally {
      setClearLoading(false);
    }
  };

  const handleView = (d: Dispute) => setSelectedDispute(d);
  const closeDetail = () => setSelectedDispute(null);

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Disputes & Resolution
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track dispute cases
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="default" size="sm" onClick={handleOpen}>
            + File New Dispute
          </Button>
          <Button variant="outline" size="sm" onClick={clearResolved} disabled={clearLoading}>
            {clearLoading ? "Clearing..." : "Clear Resolved"}
          </Button>
        </div>

        {/* Loading state overlay */}
        {loadingData && (
          <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
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
            Loading disputes...
          </div>
        )}

        {/* Fetch Error */}
        {fetchError && !loadingData && (
          <div className="text-center py-16 text-destructive">
            <p className="text-lg font-semibold">Failed to load disputes</p>
            <p className="text-sm mt-1">{fetchError}</p>
            <Button variant="outline" className="mt-4" onClick={fetchDisputes}>
              Retry
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {disputes.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No disputes found.
            </div>
          ) : (
            disputes.map((dispute) => (
              <Card
                key={dispute.id}
                className={`border-border hover:shadow-lg transition-shadow duration-150
                  ${
                    dispute.status === "resolved"
                      ? "border-green-300 bg-green-50"
                      : ""
                  }
                  ${
                    dispute.status === "in-mediation"
                      ? "border-yellow-300 bg-yellow-50"
                      : ""
                  }
                  ${
                    dispute.status === "raised"
                      ? "border-blue-300 bg-blue-50"
                      : ""
                  }`}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center text-center">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        ID
                      </p>
                      <p className="font-bold text-foreground">
                        {dispute.id.slice(0, 8)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Against
                      </p>
                      <p className="text-sm text-foreground">
                        {dispute.against}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Issue
                      </p>
                      <p className="text-sm text-foreground">{dispute.issue}</p>
                    </div>

                    <div>
                      <Badge
                        className={
                          dispute.status === "resolved"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : dispute.status === "in-mediation"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-blue-100 text-blue-800 border-blue-300"
                        }
                      >
                        {dispute.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {dispute.resolution}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Date
                      </p>
                      <p className="text-sm text-foreground">{dispute.date}</p>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(dispute)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
            <form
              onSubmit={handleSubmit}
              className="relative z-10 w-full max-w-lg bg-white rounded-lg p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4">File New Dispute</h3>

              {submitError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
                  {submitError}
                </div>
              )}

              <label className="block mb-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Against (User / Entity)
                </div>
                <input
                  value={against}
                  onChange={(e) => setAgainst(e.target.value)}
                  placeholder="Enter user or entity name"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  disabled={submitLoading}
                />
              </label>

              <label className="block mb-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Issue Details
                </div>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  rows={5}
                  placeholder="Describe the dispute in detail"
                  className="w-full px-3 py-2 border border-border rounded-md resize-none"
                  disabled={submitLoading}
                />
              </label>

              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={handleClose} type="button" disabled={submitLoading}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" type="submit" disabled={submitLoading}>
                  {submitLoading ? "Submitting..." : "Submit Dispute"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      {/* DETAIL MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeDetail} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Dispute Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong> {selectedDispute.id}
              </p>
              <p>
                <strong>Against:</strong> {selectedDispute.against}
              </p>
              <p>
                <strong>Issue:</strong> {selectedDispute.issue}
              </p>
              <p>
                <strong>Date:</strong> {selectedDispute.date}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  className={
                    selectedDispute.status === "resolved"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : selectedDispute.status === "in-mediation"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                      : "bg-blue-100 text-blue-800 border-blue-300"
                  }
                >
                  {selectedDispute.status}
                </Badge>
              </p>

              {selectedDispute.resolution && (
                <p>
                  <strong>Resolution:</strong> {selectedDispute.resolution}
                </p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" size="sm" onClick={closeDetail}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
  }