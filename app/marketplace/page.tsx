'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/utils/supabase/client';

// ── Types ────────────────────────────────────────────────────────────────────
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
}

interface ListingForm {
  cropName: string;
  cropType: string;
  quantity: string;
  unit: string;
  price: string;
  quality: string;
  region: string;
  description: string;
  contactNumber: string;
}

const defaultForm: ListingForm = {
  cropName: '',
  cropType: '',
  quantity: '',
  unit: 'kg',
  price: '',
  quality: '',
  region: '',
  description: '',
  contactNumber: '',
};

// ── Constants ─────────────────────────────────────────────────────────────────
const CROP_TYPES = ['Wheat', 'Rice', 'Corn', 'Sugarcane', 'Cotton', 'Vegetables', 'Pulses', 'Spices', 'Fruits', 'Other'];
const REGIONS    = ['Punjab', 'Haryana', 'Madhya Pradesh', 'Delhi NCR', 'Uttar Pradesh', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Bihar', 'Other'];
const QUALITIES  = ['Grade A', 'Grade B', 'Premium', 'Organic Certified', 'Fresh', 'High Sugar Content', 'Standard'];

// Map a crop name to a display emoji
function cropEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('wheat'))      return '🌾';
  if (n.includes('rice'))       return '🍚';
  if (n.includes('corn') || n.includes('maize')) return '🌽';
  if (n.includes('cotton'))     return '☁️';
  if (n.includes('sugar'))      return '🍃';
  if (n.includes('veg'))        return '🥕';
  if (n.includes('fruit'))      return '🍎';
  if (n.includes('pulse') || n.includes('dal')) return '🫘';
  if (n.includes('spice'))      return '🌶️';
  return '🌱';
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const supabase = createClient();

  const [listings, setListings]     = useState<ProduceListing[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState<ListingForm>(defaultForm);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterQuality, setFilterQuality] = useState('');

  // ── Fetch listings ──────────────────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    setLoadingData(true);
    setFetchError(null);

    let query = supabase
      .from('produce_listings')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (filterRegion)  query = query.eq('location', filterRegion);
    if (filterQuality) query = query.eq('quality_grade', filterQuality);
    if (searchQuery)   query = query.ilike('crop_name', `%${searchQuery}%`);

    const { data, error } = await query;

    if (error) {
      setFetchError(error.message);
    } else {
      setListings(data ?? []);
    }
    setLoadingData(false);
  }, [filterRegion, filterQuality, searchQuery]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Form handlers ───────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setFormError('You must be signed in to list a crop.');
      setLoading(false);
      return;
    }

    // Ensure a profile row exists for this user (FK: produce_listings.farmer_id → profiles.id)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });

    if (profileError) {
      // Non-fatal: the profile may already exist or have extra required columns.
      // Only abort if it's NOT a duplicate-key scenario.
      console.warn('Profile upsert warning:', profileError.message);
    }

    const { error } = await supabase.from('produce_listings').insert({
      farmer_id:    user.id,
      crop_name:    form.cropName,
      quantity:     parseFloat(form.quantity),
      unit:         form.unit,
      price_per_kg: parseFloat(form.price),
      quality_grade: form.quality,
      location:     form.region,
      status:       'available',
    });

    if (error) {
      setFormError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
    fetchListings(); // refresh the grid
  };

  const handleClose = () => {
    setShowModal(false);
    setSubmitted(false);
    setFormError(null);
    setForm(defaultForm);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground mt-2">Browse and purchase crops from trusted farmers</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowModal(true)}
          >
            + List Your Crops
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <Input
            type="search"
            placeholder="Search crops..."
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={filterQuality}
            onChange={(e) => setFilterQuality(e.target.value)}
          >
            <option value="">All Quality</option>
            {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>

        {/* Loading */}
        {loadingData && (
          <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
            <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading listings...
          </div>
        )}

        {/* Fetch Error */}
        {fetchError && !loadingData && (
          <div className="text-center py-16 text-destructive">
            <p className="text-lg font-semibold">Failed to load listings</p>
            <p className="text-sm mt-1">{fetchError}</p>
            <Button variant="outline" className="mt-4" onClick={fetchListings}>Retry</Button>
          </div>
        )}

        {/* Empty State */}
        {!loadingData && !fetchError && listings.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-lg font-semibold text-foreground">No listings found</p>
            <p className="text-sm mt-1">Be the first to list your crop!</p>
            <Button className="mt-6 bg-primary hover:bg-primary/90" onClick={() => setShowModal(true)}>
              + List Your Crops
            </Button>
          </div>
        )}

        {/* Crop Grid */}
        {!loadingData && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-5xl mb-4">{cropEmoji(listing.crop_name)}</div>
                  <h3 className="text-xl font-bold text-foreground">{listing.crop_name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                    Farmer ID: {listing.farmer_id.slice(0, 8)}…
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-semibold text-foreground">
                        {listing.quantity} {listing.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-bold text-primary">
                        ₹{listing.price_per_kg}/{listing.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Region:</span>
                      <span className="text-foreground">{listing.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-secondary/50">{listing.quality_grade}</Badge>
                    <Badge
                      variant="outline"
                      className={
                        listing.status === 'available'
                          ? 'bg-green-100/50 text-green-700 border-green-300'
                          : 'bg-red-100/50 text-red-700 border-red-300'
                      }
                    >
                      {listing.status === 'available' ? '● Available' : '● Unavailable'}
                    </Badge>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={listing.status !== 'available'}
                    >
                      {listing.status === 'available' ? 'Buy Now' : 'Out of Stock'}
                    </Button>
                    <Button variant="outline" className="flex-1">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── List Crop Modal ──────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-background z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">List Your Crop</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to list your crop</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Success State */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-foreground">Listing Live!</h3>
                <p className="text-muted-foreground mt-2 max-w-xs">
                  <span className="font-semibold text-foreground">{form.cropName}</span> is now visible to buyers on the marketplace.
                </p>
                <Button className="mt-8 bg-primary hover:bg-primary/90" onClick={handleClose}>
                  Back to Marketplace
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                {/* Form Error */}
                {formError && (
                  <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                    {formError}
                  </div>
                )}

                {/* Crop Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Crop Name <span className="text-destructive">*</span>
                  </label>
                  <Input name="cropName" value={form.cropName} onChange={handleChange}
                    placeholder="e.g. Premium Basmati Rice" required />
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Crop Type <span className="text-destructive">*</span>
                  </label>
                  <select name="cropType" value={form.cropType} onChange={handleChange} required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select crop type</option>
                    {CROP_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Quantity <span className="text-destructive">*</span>
                    </label>
                    <Input name="quantity" type="number" min="1" value={form.quantity}
                      onChange={handleChange} placeholder="e.g. 500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Unit</label>
                    <select name="unit" value={form.unit} onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="kg">kg</option>
                      <option value="quintal">Quintal</option>
                      <option value="ton">Ton</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Price per {form.unit} (₹) <span className="text-destructive">*</span>
                  </label>
                  <Input name="price" type="number" min="1" value={form.price}
                    onChange={handleChange} placeholder="e.g. 25" required />
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Quality Grade <span className="text-destructive">*</span>
                  </label>
                  <select name="quality" value={form.quality} onChange={handleChange} required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select quality</option>
                    {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Region <span className="text-destructive">*</span>
                  </label>
                  <select name="region" value={form.region} onChange={handleChange} required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select region</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Contact Number <span className="text-destructive">*</span>
                  </label>
                  <Input name="contactNumber" type="tel" value={form.contactNumber}
                    onChange={handleChange} placeholder="e.g. +91 98765 43210" required />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Additional Details</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                    placeholder="Freshness, harvest date, storage conditions..."
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 pb-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : 'List Crop'}
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
