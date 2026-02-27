'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/utils/supabase/client';

// ── Types ─────────────────────────────────────────────────────────────────────
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
  profiles?: {
    trust_score: number | null;
    full_name: string | null;
  };
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

interface BuyForm {
  quantity_requested: string;
  offer_crop_name: string;
  offer_quantity: string;
  offer_unit: string;
}

const defaultListingForm: ListingForm = {
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

const defaultBuyForm: BuyForm = { quantity_requested: '', offer_crop_name: '', offer_quantity: '', offer_unit: 'kg' };

// ── Constants ──────────────────────────────────────────────────────────────────
const CROP_TYPES = ['Wheat', 'Rice', 'Corn', 'Sugarcane', 'Cotton', 'Vegetables', 'Pulses', 'Spices', 'Fruits', 'Other'];
const REGIONS    = ['Punjab', 'Haryana', 'Madhya Pradesh', 'Delhi NCR', 'Uttar Pradesh', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Bihar', 'Other'];
const QUALITIES  = ['Grade A', 'Grade B', 'Premium', 'Organic Certified', 'Fresh', 'High Sugar Content', 'Standard'];

function cropEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('wheat'))                       return '🌾';
  if (n.includes('rice'))                        return '🍚';
  if (n.includes('corn') || n.includes('maize')) return '🌽';
  if (n.includes('cotton'))                      return '☁️';
  if (n.includes('sugar'))                       return '🍃';
  if (n.includes('veg'))                         return '🥕';
  if (n.includes('fruit'))                       return '🍎';
  if (n.includes('pulse') || n.includes('dal'))  return '🫘';
  if (n.includes('spice'))                       return '🌶️';
  return '🌱';
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const supabase = createClient();

  // Listings state
  const [listings, setListings]         = useState<ProduceListing[]>([]);
  const [fetchError, setFetchError]     = useState<string | null>(null);
  const [loadingData, setLoadingData]   = useState(true);

  // List-crop modal
  const [showListModal, setShowListModal] = useState(false);
  const [listForm, setListForm]           = useState<ListingForm>(defaultListingForm);
  const [listSubmitted, setListSubmitted] = useState(false);
  const [listLoading, setListLoading]     = useState(false);
  const [listError, setListError]         = useState<string | null>(null);

  // Buy-now modal
  const [showBuyModal, setShowBuyModal]   = useState(false);
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  const [buyForm, setBuyForm]             = useState<BuyForm>(defaultBuyForm);
  const [buySubmitted, setBuySubmitted]   = useState(false);
  const [buyLoading, setBuyLoading]       = useState(false);
  const [buyError, setBuyError]           = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterQuality, setFilterQuality] = useState('');

  // ── Fetch listings ──────────────────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    setLoadingData(true);
    setFetchError(null);

    let query = supabase
      .from('produce_listings')
      .select('*, profiles!farmer_id(trust_score, full_name)')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (filterRegion)  query = query.eq('location', filterRegion);
    if (filterQuality) query = query.eq('quality_grade', filterQuality);
    if (searchQuery)   query = query.ilike('crop_name', `%${searchQuery}%`);

    const { data, error } = await query;
    if (error) setFetchError(error.message);
    else {
      // Sort by farmer trust score (descending), then by created_at (descending)
      const sorted = (data ?? []).sort((a: ProduceListing, b: ProduceListing) => {
        const scoreA = a.profiles?.trust_score ?? 50;
        const scoreB = b.profiles?.trust_score ?? 50;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setListings(sorted);
    }
    setLoadingData(false);
  }, [filterRegion, filterQuality, searchQuery]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  // ── List-crop modal handlers ────────────────────────────────────────────────
  const handleListChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setListForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setListLoading(true);
    setListError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setListError('You must be signed in.'); setListLoading(false); return; }

    // Ensure profile exists
    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });

    const { error } = await supabase.from('produce_listings').insert({
      farmer_id:     user.id,
      crop_name:     listForm.cropName,
      quantity:      parseFloat(listForm.quantity),
      unit:          listForm.unit,
      price_per_kg:  parseFloat(listForm.price),
      quality_grade: listForm.quality,
      location:      listForm.region,
      status:        'available',
    });

    if (error) { setListError(error.message); setListLoading(false); return; }
    setListLoading(false);
    setListSubmitted(true);
    fetchListings();
  };

  const closeListModal = () => {
    setShowListModal(false);
    setListSubmitted(false);
    setListError(null);
    setListForm(defaultListingForm);
  };

  // ── Buy-now modal handlers ──────────────────────────────────────────────────
  const openBuyModal = (listing: ProduceListing) => {
    setSelectedListing(listing);
    setBuyForm(defaultBuyForm);
    setBuySubmitted(false);
    setBuyError(null);
    setShowBuyModal(true);
  };

  const handleBuyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setBuyForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyLoading(true);
    setBuyError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBuyError('You must be signed in to place an order.'); setBuyLoading(false); return; }

    // Ensure buyer profile exists
    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });

    const qty = parseFloat(buyForm.quantity_requested);
    if (!selectedListing) return;

    if (qty > selectedListing.quantity) {
      setBuyError(`Only ${selectedListing.quantity} ${selectedListing.unit} available.`);
      setBuyLoading(false);
      return;
    }

    const { error } = await supabase.from('exchange_requests').insert({
      listing_id:         selectedListing.id,
      buyer_id:           user.id,
      quantity_requested: qty,
      offer_crop_name:    buyForm.offer_crop_name || null,
      offer_quantity:     buyForm.offer_quantity ? parseFloat(buyForm.offer_quantity) : null,
      offer_unit:         buyForm.offer_unit || null,
      status:             'pending',
    });

    if (error) { setBuyError(error.message); setBuyLoading(false); return; }
    setBuyLoading(false);
    setBuySubmitted(true);
  };

  const closeBuyModal = () => {
    setShowBuyModal(false);
    setBuySubmitted(false);
    setBuyError(null);
    setSelectedListing(null);
    setBuyForm(defaultBuyForm);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground mt-2">Browse and purchase crops from trusted farmers</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowListModal(true)}>
            + List Your Crops
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <Input type="search" placeholder="Search crops..." className="w-64"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
            <option value="">All Regions</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={filterQuality} onChange={(e) => setFilterQuality(e.target.value)}>
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
            <Button className="mt-6 bg-primary hover:bg-primary/90" onClick={() => setShowListModal(true)}>
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
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {listing.profiles?.full_name ?? `ID: ${listing.farmer_id.slice(0, 8)}…`}
                    </p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-yellow-100/50 text-yellow-700 border-yellow-300">
                      ⭐ {((listing.profiles?.trust_score ?? 50) / 20).toFixed(1)}/5
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-semibold text-foreground">{listing.quantity} {listing.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-bold text-primary">₹{listing.price_per_kg}/{listing.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Region:</span>
                      <span className="text-foreground">{listing.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-secondary/50">{listing.quality_grade}</Badge>
                    <Badge variant="outline" className="bg-green-100/50 text-green-700 border-green-300">
                      ● Available
                    </Badge>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => openBuyModal(listing)}
                    >
                      Buy Now
                    </Button>
                    <Button variant="outline" className="flex-1">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LIST CROP MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeListModal(); }}>
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-background z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">List Your Crop</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to list your crop</p>
              </div>
              <button onClick={closeListModal}
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-lg">
                ✕
              </button>
            </div>

            {listSubmitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-foreground">Listing Live!</h3>
                <p className="text-muted-foreground mt-2">
                  <span className="font-semibold text-foreground">{listForm.cropName}</span> is now visible to buyers.
                </p>
                <Button className="mt-8 bg-primary hover:bg-primary/90" onClick={closeListModal}>Back to Marketplace</Button>
              </div>
            ) : (
              <form onSubmit={handleListSubmit} className="px-6 py-5 space-y-5">
                {listError && (
                  <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">{listError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Crop Name <span className="text-destructive">*</span></label>
                  <Input name="cropName" value={listForm.cropName} onChange={handleListChange} placeholder="e.g. Premium Basmati Rice" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Crop Type <span className="text-destructive">*</span></label>
                  <select name="cropType" value={listForm.cropType} onChange={handleListChange} required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select crop type</option>
                    {CROP_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Quantity <span className="text-destructive">*</span></label>
                    <Input name="quantity" type="number" min="1" value={listForm.quantity} onChange={handleListChange} placeholder="e.g. 500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Unit</label>
                    <select name="unit" value={listForm.unit} onChange={handleListChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="kg">kg</option>
                      <option value="quintal">Quintal</option>
                      <option value="ton">Ton</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Price per {listForm.unit} (₹) <span className="text-destructive">*</span></label>
                  <Input name="price" type="number" min="1" value={listForm.price} onChange={handleListChange} placeholder="e.g. 25" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Quality Grade <span className="text-destructive">*</span></label>
                  <select name="quality" value={listForm.quality} onChange={handleListChange} required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select quality</option>
                    {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Region <span className="text-destructive">*</span></label>
                  <select name="region" value={listForm.region} onChange={handleListChange} required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select region</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Contact Number <span className="text-destructive">*</span></label>
                  <Input name="contactNumber" type="tel" value={listForm.contactNumber} onChange={handleListChange} placeholder="e.g. +91 98765 43210" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Additional Details</label>
                  <textarea name="description" value={listForm.description} onChange={handleListChange} rows={3}
                    placeholder="Freshness, harvest date, storage conditions..."
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm" />
                </div>
                <div className="flex gap-3 pt-2 pb-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={closeListModal}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={listLoading}>
                    {listLoading ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting...</span> : 'List Crop'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          BUY NOW MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {showBuyModal && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeBuyModal(); }}>
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Place Buy Request</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Submit a purchase request to the farmer</p>
              </div>
              <button onClick={closeBuyModal}
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-lg">
                ✕
              </button>
            </div>

            {buySubmitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-foreground">Request Sent!</h3>
                <p className="text-muted-foreground mt-2 max-w-xs">
                  Your request for <span className="font-semibold text-foreground">{buyForm.quantity_requested} {selectedListing.unit}</span> of{' '}
                  <span className="font-semibold text-foreground">{selectedListing.crop_name}</span>{' '}
                  in exchange for <span className="font-semibold text-foreground">{buyForm.offer_quantity} {buyForm.offer_unit}</span> of{' '}
                  <span className="font-semibold text-foreground">{buyForm.offer_crop_name}</span> has been submitted.
                  Track it in <span className="font-semibold">Exchanges</span>.
                </p>
                <Button className="mt-8 bg-primary hover:bg-primary/90" onClick={closeBuyModal}>Back to Marketplace</Button>
              </div>
            ) : (
              <form onSubmit={handleBuySubmit} className="px-6 py-6 space-y-5">
                {/* Crop Summary */}
                <div className="rounded-xl bg-secondary/30 border border-border p-4 flex gap-4 items-center">
                  <span className="text-4xl">{cropEmoji(selectedListing.crop_name)}</span>
                  <div>
                    <p className="font-bold text-foreground">{selectedListing.crop_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedListing.location} · {selectedListing.quality_grade}</p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      ₹{selectedListing.price_per_kg}/{selectedListing.unit} · Available: {selectedListing.quantity} {selectedListing.unit}
                    </p>
                  </div>
                </div>

                {buyError && (
                  <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">{buyError}</div>
                )}

                {/* Quantity Requested */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Quantity to Buy ({selectedListing.unit}) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="quantity_requested"
                    type="number"
                    min="1"
                    max={selectedListing.quantity}
                    step="0.01"
                    value={buyForm.quantity_requested}
                    onChange={handleBuyChange}
                    placeholder={`Max: ${selectedListing.quantity} ${selectedListing.unit}`}
                    required
                  />
                  {buyForm.quantity_requested && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Estimated total:{' '}
                      <span className="font-semibold text-foreground">
                        ₹{(parseFloat(buyForm.quantity_requested || '0') * selectedListing.price_per_kg).toLocaleString('en-IN')}
                      </span>
                    </p>
                  )}
                </div>

                {/* Barter Offer */}
                <div className="rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">🔄 What will you offer in exchange?</p>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Crop to Offer <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="offer_crop_name"
                      value={buyForm.offer_crop_name}
                      onChange={handleBuyChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select crop</option>
                      {CROP_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Quantity <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="offer_quantity"
                        type="number"
                        min="1"
                        step="0.01"
                        value={buyForm.offer_quantity}
                        onChange={handleBuyChange}
                        placeholder="e.g. 100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Unit</label>
                      <select
                        name="offer_unit"
                        value={buyForm.offer_unit}
                        onChange={handleBuyChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="kg">kg</option>
                        <option value="quintal">Quintal</option>
                        <option value="ton">Ton</option>
                        <option value="piece">Piece</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={closeBuyModal}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={buyLoading}>
                    {buyLoading
                      ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Sending...</span>
                      : 'Send Buy Request'}
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
