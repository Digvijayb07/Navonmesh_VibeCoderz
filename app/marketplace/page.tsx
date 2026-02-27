'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const crops = [
  {
    id: 1,
    name: 'Premium Wheat',
    farmer: 'Ram Kumar Farms',
    quantity: '500 kg',
    price: '₹25/kg',
    quality: 'Grade A',
    rating: 4.8,
    image: '🌾',
    region: 'Punjab',
    available: true,
  },
  {
    id: 2,
    name: 'Basmati Rice',
    farmer: 'Golden Harvest Co.',
    quantity: '1000 kg',
    price: '₹32/kg',
    quality: 'Premium',
    rating: 4.9,
    image: '🍚',
    region: 'Haryana',
    available: true,
  },
  {
    id: 3,
    name: 'Organic Corn',
    farmer: 'Green Valley Farmers',
    quantity: '750 kg',
    price: '₹18/kg',
    quality: 'Organic Certified',
    rating: 4.6,
    image: '🌽',
    region: 'Madhya Pradesh',
    available: true,
  },
  {
    id: 4,
    name: 'Fresh Vegetables Mix',
    farmer: 'Urban Farming Initiative',
    quantity: '200 kg',
    price: '₹40/kg',
    quality: 'Fresh',
    rating: 4.7,
    image: '🥕',
    region: 'Delhi NCR',
    available: true,
  },
  {
    id: 5,
    name: 'Sugarcane',
    farmer: 'Sweet Harvest Farms',
    quantity: '2000 kg',
    price: '₹60/quintal',
    quality: 'High Sugar Content',
    rating: 4.5,
    image: '🍃',
    region: 'Uttar Pradesh',
    available: false,
  },
  {
    id: 6,
    name: 'Cotton (Raw)',
    farmer: 'Cotton Kingdom Farms',
    quantity: '500 kg',
    price: '₹55/kg',
    quality: 'Grade A White',
    rating: 4.8,
    image: '☁️',
    region: 'Gujarat',
    available: true,
  },
];

const CROP_TYPES = ['Wheat', 'Rice', 'Corn', 'Sugarcane', 'Cotton', 'Vegetables', 'Pulses', 'Spices', 'Fruits', 'Other'];
const REGIONS = ['Punjab', 'Haryana', 'Madhya Pradesh', 'Delhi NCR', 'Uttar Pradesh', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Bihar', 'Other'];
const QUALITIES = ['Grade A', 'Grade B', 'Premium', 'Organic Certified', 'Fresh', 'High Sugar Content', 'Standard'];

interface ListingForm {
  cropName: string;
  cropType: string;
  quantity: string;
  unit: string;
  price: string;
  priceUnit: string;
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
  priceUnit: 'kg',
  quality: '',
  region: '',
  description: '',
  contactNumber: '',
};

export default function MarketplacePage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ListingForm>(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSubmitted(false);
    setForm(defaultForm);
  };

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
          <Input type="search" placeholder="Search crops, farmers..." className="w-64" />
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground">
            <option>All Crops</option>
            <option>Wheat</option>
            <option>Rice</option>
            <option>Corn</option>
            <option>Vegetables</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground">
            <option>All Regions</option>
            <option>Punjab</option>
            <option>Haryana</option>
            <option>Madhya Pradesh</option>
            <option>Delhi NCR</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground">
            <option>All Quality</option>
            <option>Grade A</option>
            <option>Premium</option>
            <option>Organic</option>
          </select>
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">{crop.image}</div>
                <h3 className="text-xl font-bold text-foreground">{crop.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{crop.farmer}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-semibold text-foreground">{crop.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold text-primary">{crop.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Region:</span>
                    <span className="text-foreground">{crop.region}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="bg-secondary/50">{crop.quality}</Badge>
                  <Badge variant="outline" className="bg-yellow-100/50 text-yellow-700 border-yellow-300">
                    ⭐ {crop.rating}
                  </Badge>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!crop.available}
                  >
                    {crop.available ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                  <Button variant="outline" className="flex-1">Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── List Crop Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-background z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">List Your Crop</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to list your crop on the marketplace</p>
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
                <h3 className="text-2xl font-bold text-foreground">Listing Submitted!</h3>
                <p className="text-muted-foreground mt-2 max-w-xs">
                  Your crop <span className="font-semibold text-foreground">{form.cropName}</span> has been listed successfully. Buyers will be able to find it shortly.
                </p>
                <Button className="mt-8 bg-primary hover:bg-primary/90" onClick={handleClose}>
                  Back to Marketplace
                </Button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                {/* Crop Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Crop Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="cropName"
                    value={form.cropName}
                    onChange={handleChange}
                    placeholder="e.g. Premium Basmati Rice"
                    required
                  />
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Crop Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="cropType"
                    value={form.cropType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
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
                    <Input
                      name="quantity"
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Unit</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">Quintal</option>
                      <option value="ton">Ton</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>

                {/* Price & Price Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Price (₹) <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="price"
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Per</label>
                    <select
                      name="priceUnit"
                      value={form.priceUnit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">Quintal</option>
                      <option value="ton">Ton</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Quality Grade <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="quality"
                    value={form.quality}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select quality</option>
                    {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Region <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select region</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Contact Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="contactNumber"
                    type="tel"
                    value={form.contactNumber}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Additional Details
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your crop — freshness, harvest date, storage conditions..."
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 pb-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'List Crop'
                    )}
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
