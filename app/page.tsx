"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { StatCard } from "@/components/stat-card";
import { TrustScoreStat } from "@/components/trust-score-stat";
import { PriceChart } from "@/components/price-chart";
import { MarketAlerts } from "@/components/market-alerts";
import { MandiPriceTicker } from "@/components/mandi-price-ticker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

interface ProduceListing {
  id: string;
  farmer_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  price_per_kg: number;
  quality_grade: string;
  location: string;
  status: string;
  created_at: string;
  listing_type: "crop" | "tool";
  condition: string | null;
  rental_price_per_day: number | null;
  profiles?: {
    trust_score: number | null;
    full_name: string | null;
  };
}

interface BuyForm {
  quantity_requested: string;
  offer_type: "crop" | "tool";
  offer_crop_name: string;
  offer_quantity: string;
  offer_unit: string;
  offer_tool_condition: string;
}

const defaultBuyForm: BuyForm = {
  quantity_requested: "",
  offer_type: "crop",
  offer_crop_name: "",
  offer_quantity: "",
  offer_unit: "kg",
  offer_tool_condition: "",
};

function itemEmoji(name: string, listingType: "crop" | "tool" = "crop"): string {
  const n = name.toLowerCase();
  if (listingType === "tool") {
    if (n.includes("tractor")) return "🚜";
    if (n.includes("harvest")) return "🌾";
    if (n.includes("plough")) return "⚙️";
    if (n.includes("drill")) return "🔧";
    if (n.includes("spray")) return "💨";
    if (n.includes("thresh")) return "🔄";
    if (n.includes("trailer")) return "🚛";
    if (n.includes("pump")) return "💧";
    return "🔧";
  }
  if (n.includes("wheat")) return "🌾";
  if (n.includes("rice")) return "🍚";
  if (n.includes("corn") || n.includes("maize")) return "🌽";
  if (n.includes("mustard")) return "🌼";
  if (n.includes("pulse") || n.includes("dal")) return "🫘";
  return "🌱";
}

export default function DashboardPage() {
  const supabase = createClient();
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Exchange modal state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  const [exchangeForm, setExchangeForm] = useState<BuyForm>(defaultBuyForm);
  const [exchangeSubmitted, setExchangeSubmitted] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  // Fetch marketplace listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("produce_listings")
        .select("*, profiles!farmer_id(trust_score, full_name)")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setListings(data);
      }
      setLoading(false);
    };
    fetchListings();
  }, [supabase]);

  const openExchangeModal = (listing: ProduceListing) => {
    setSelectedListing(listing);
    setExchangeForm(defaultBuyForm);
    setExchangeSubmitted(false);
    setExchangeError(null);
    setShowExchangeModal(true);
  };

  const closeExchangeModal = () => {
    setShowExchangeModal(false);
    setSelectedListing(null);
    setExchangeForm(defaultBuyForm);
    setExchangeError(null);
  };

  const handleExchangeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setExchangeForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExchangeLoading(true);
    setExchangeError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setExchangeError("You must be signed in to place an order.");
      setExchangeLoading(false);
      return;
    }

    // Ensure buyer profile exists
    await supabase
      .from("profiles")
      .upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });

    const qty = parseFloat(exchangeForm.quantity_requested);
    if (!selectedListing) return;

    if (qty > selectedListing.quantity) {
      setExchangeError(`Only ${selectedListing.quantity} ${selectedListing.unit} available.`);
      setExchangeLoading(false);
      return;
    }

    const { error } = await supabase.from("exchange_requests").insert({
      listing_id: selectedListing.id,
      buyer_id: user.id,
      quantity_requested: qty,
      offer_type: exchangeForm.offer_type,
      offer_crop_name: exchangeForm.offer_crop_name || null,
      offer_quantity: exchangeForm.offer_type === "crop" && exchangeForm.offer_quantity
        ? parseFloat(exchangeForm.offer_quantity)
        : null,
      offer_unit: exchangeForm.offer_type === "crop" ? (exchangeForm.offer_unit || null) : "piece",
      status: "pending",
    });

    if (error) {
      setExchangeError(error.message);
      setExchangeLoading(false);
      return;
    }
    setExchangeLoading(false);
    setExchangeSubmitted(true);
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8 relative">
        {/* Decorative blur orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-60 h-60 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="animate-fade-in-up">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100/60 backdrop-blur-sm border border-green-200/40 text-green-700 text-xs font-medium mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Dashboard Overview
          </div> */}
          <h1
            className="text-4xl font-bold text-green-900 text-balance"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Welcome to <span className="gradient-text">FarmLink</span>
          </h1>
          <p className="text-green-700/60 mt-2">
            Your trusted agricultural exchange platform
          </p>
        </div>

        {/* Live Mandi Price Ticker */}
        <div className="animate-fade-in-up animate-stagger-1">
          <MandiPriceTicker />
        </div>

        {/* Recently Listed for Barter - marketplace-style cards */}
        <div className="animate-fade-in-up animate-stagger-2">
          <h2 className="text-xl font-semibold text-green-900" style={{ fontFamily: "var(--font-poppins)" }}>
            Recently Listed for Exchange
          </h2>
          <p className="text-green-700/50 mb-4">Available crops & tools from your neighbors</p>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-green-600/50">
              <span>Loading listings...</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-green-600/50">
              <p>No listings available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="border-border overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-4xl mb-2">{itemEmoji(listing.crop_name, listing.listing_type)}</div>
                    <h3 className="text-lg font-bold text-green-900">
                      {listing.crop_name} <span className="font-medium text-base">· {listing.quantity} {listing.unit}</span>
                    </h3>
                    <p className="text-xs text-green-600/50 mt-1">
                      {listing.profiles?.full_name || `Farmer ${listing.farmer_id.slice(0, 6)}`}
                    </p>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={listing.listing_type === "tool" ? "bg-orange-100/50 text-orange-700 border-orange-300" : "bg-emerald-100/50 text-emerald-700 border-emerald-300"}
                      >
                        {listing.listing_type === "tool" ? "🚜 Tool" : "🌾 Crop"}
                      </Badge>
                      <p className="text-xs text-green-600/50">{listing.location}</p>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-yellow-100/50 text-yellow-700 border-yellow-300 ml-auto">
                        ⭐ {((listing.profiles?.trust_score ?? 50) / 20).toFixed(1)}/5
                      </Badge>
                    </div>

                    <div className="mt-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700/60">Price:</span>
                        <span className="font-semibold text-green-900">₹{listing.price_per_kg}/{listing.unit}</span>
                      </div>
                      {listing.listing_type === "crop" && listing.quality_grade && (
                        <div className="flex justify-between">
                          <span className="text-green-700/60">Quality:</span>
                          <span className="font-semibold text-green-900">{listing.quality_grade}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        onClick={() => openExchangeModal(listing)}
                      >
                        Exchange
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="/marketplace">View All</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Statistics row – two cards flexed evenly */}
        {/* <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animate-stagger-2">
          <div className="flex-1 min-w-[260px]">
            <StatCard
              icon="🤝"
              title="Pending Exchanges"
              value="8"
              subtitle="Awaiting your approval"
              trend={5}
            />
          </div>
          <div className="flex-1 min-w-[260px]">
            <TrustScoreStat />
          </div>
        </div> */}

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up animate-stagger-3">
          <QuickActionCard
            icon="📤"
            title="List Item"
            description="Add a crop or tool listing"
            href="/marketplace?action=list"
          />
          <QuickActionCard
            icon="🔍"
            title="Find Buyers"
            description="Browse buyer requests"
            href="/marketplace"
          />
          <QuickActionCard
            icon="🚚"
            title="Arrange Transport"
            description="Book logistics services"
            href="/logistics"
          />
          <QuickActionCard
            icon="📞"
            title="Connect Stakeholders"
            description="Build your network"
            href="/exchange"
          />
        </div> */}

        {/* Recent Transactions */}
        <Card className="glass-card border-0 rounded-2xl animate-fade-in-up animate-stagger-4">
          <CardHeader>
            <CardTitle
              className="text-green-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-green-700/50">
              Your latest marketplace activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  type: "sale",
                  crop: "Wheat (500 kg)",
                  buyer: "Sharma Trading",
                  amount: "₹12,500",
                  status: "completed",
                  time: "2 days ago",
                },
                {
                  type: "exchange",
                  crop: "Rice exchange",
                  with: "Farmers Cooperative",
                  status: "pending",
                  time: "1 day ago",
                },
                {
                  type: "transport",
                  crop: "Corn delivery",
                  route: "Delhi to Haryana",
                  amount: "₹1,200",
                  status: "in-transit",
                  time: "12 hours ago",
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-green-50/50 backdrop-blur-sm rounded-xl border border-green-100/30 hover:bg-green-50/80 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
                      {tx.type === "sale" && "📦"}
                      {tx.type === "exchange" && "🔄"}
                      {tx.type === "transport" && "🚚"}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-green-900">
                        {tx.type === "sale" && `Sold ${tx.crop} to ${tx.buyer}`}
                        {tx.type === "exchange" &&
                          `Exchanged ${tx.crop} with ${tx.with}`}
                        {tx.type === "transport" && `Transport: ${tx.crop}`}
                      </p>
                      <p className="text-xs text-green-600/50">{tx.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {"amount" in tx && (
                      <span className="font-semibold text-green-800">
                        {tx.amount}
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-100/60 text-green-700 border border-green-200/40"
                          : tx.status === "pending"
                            ? "bg-amber-100/60 text-amber-700 border border-amber-200/40"
                            : "bg-blue-100/60 text-blue-700 border border-blue-200/40"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          EXCHANGE MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {showExchangeModal && selectedListing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeExchangeModal();
          }}
        >
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-background z-10">
              <div>
                <h2 className="text-xl font-bold text-green-900">Exchange Request</h2>
                <p className="text-sm text-green-700/50 mt-0.5">
                  Make an offer for {selectedListing.crop_name}
                </p>
              </div>
              <button
                onClick={closeExchangeModal}
                className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-600 hover:text-green-700 transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {exchangeSubmitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-900">Request Sent!</h3>
                <p className="text-green-700/60 mt-2">
                  Your exchange request has been sent to the farmer. They'll review it shortly.
                </p>
                <Button
                  className="mt-8 bg-green-600 hover:bg-green-700"
                  onClick={closeExchangeModal}
                >
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <form onSubmit={handleExchangeSubmit} className="px-6 py-5 space-y-5">
                {exchangeError && (
                  <div className="px-4 py-3 rounded-lg bg-red-100/20 border border-red-300/30 text-red-700 text-sm">
                    {exchangeError}
                  </div>
                )}

                {/* Listing summary */}
                <div className="p-4 rounded-lg bg-green-50/50 border border-green-100/30">
                  <p className="text-sm font-semibold text-green-900">Listing Details</p>
                  <p className="text-sm text-green-700 mt-2">
                    {itemEmoji(selectedListing.crop_name)} <span className="font-medium">{selectedListing.crop_name}</span> · {selectedListing.quantity} {selectedListing.unit}
                  </p>
                  <p className="text-xs text-green-600/50 mt-1">
                    ₹{selectedListing.price_per_kg}/{selectedListing.unit} • {selectedListing.location}
                  </p>
                </div>

                {/* Quantity requested */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1.5">
                    Quantity You Want <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="quantity_requested"
                    value={exchangeForm.quantity_requested}
                    onChange={handleExchangeChange}
                    placeholder="e.g., 50"
                    step="0.01"
                    required
                    className="border-green-200/50 focus:border-green-500"
                  />
                  <p className="text-xs text-green-600/50 mt-1">
                    Available: {selectedListing.quantity} {selectedListing.unit}
                  </p>
                </div>

                {/* Offer type */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1.5">
                    What are you offering? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setExchangeForm(p => ({ ...p, offer_type: "crop" }))}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        exchangeForm.offer_type === "crop"
                          ? "bg-green-100 border-green-500 text-green-900"
                          : "border-green-200/40 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      🌾 Crop
                    </button>
                    <button
                      type="button"
                      onClick={() => setExchangeForm(p => ({ ...p, offer_type: "tool" }))}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        exchangeForm.offer_type === "tool"
                          ? "bg-green-100 border-green-500 text-green-900"
                          : "border-green-200/40 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      🚜 Tool
                    </button>
                  </div>
                </div>

                {/* Offer crop name */}
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1.5">
                    {exchangeForm.offer_type === "crop" ? "Crop Name" : "Tool Name"} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="offer_crop_name"
                    value={exchangeForm.offer_crop_name}
                    onChange={handleExchangeChange}
                    placeholder={exchangeForm.offer_type === "crop" ? "e.g., Rice" : "e.g., Tractor"}
                    required
                    className="border-green-200/50 focus:border-green-500"
                  />
                </div>

                {/* Offer quantity (crop only) */}
                {exchangeForm.offer_type === "crop" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-1.5">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        name="offer_quantity"
                        value={exchangeForm.offer_quantity}
                        onChange={handleExchangeChange}
                        placeholder="e.g., 40"
                        step="0.01"
                        required
                        className="border-green-200/50 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-1.5">
                        Unit
                      </label>
                      <select
                        name="offer_unit"
                        value={exchangeForm.offer_unit}
                        onChange={handleExchangeChange}
                        className="w-full px-3 py-2 rounded-lg border border-green-200/50 bg-background text-green-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                      >
                        <option value="kg">kg</option>
                        <option value="quintal">Quintal</option>
                        <option value="bag">Bag</option>
                        <option value="liter">Liter</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                    onClick={closeExchangeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={exchangeLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {exchangeLoading ? "Sending..." : "Send Request"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
