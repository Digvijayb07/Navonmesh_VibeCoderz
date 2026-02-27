'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/utils/supabase/client';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExchangeRequest {
  id: string;
  listing_id: string;
  buyer_id: string;
  quantity_requested: number;
  offer_crop_name: string | null;
  offer_quantity: number | null;
  offer_unit: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'in_transit' | 'completed';
  created_at: string;
  produce_listings?: {
    crop_name: string;
    unit: string;
    price_per_kg: number;
    location: string;
    quality_grade: string;
    farmer_id: string;
  };
  // joined from profiles via buyer_id → profiles.id
  profiles?: {
    full_name: string | null;
    phone: string | null;
    role: string | null;
  };
}

type StatusFilter = 'all' | 'pending' | 'accepted' | 'in_transit' | 'completed' | 'rejected';

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusColor(status: string) {
  switch (status) {
    case 'pending':    return 'bg-yellow-100/60 text-yellow-700 border-yellow-300';
    case 'accepted':   return 'bg-blue-100/60 text-blue-700 border-blue-300';
    case 'in_transit': return 'bg-purple-100/60 text-purple-700 border-purple-300';
    case 'completed':  return 'bg-green-100/60 text-green-700 border-green-300';
    case 'rejected':   return 'bg-red-100/60 text-red-700 border-red-300';
    default:           return 'bg-gray-100/60 text-gray-700 border-gray-300';
  }
}

function statusLabel(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function cropEmoji(name = ''): string {
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ExchangePage() {
  const supabase = createClient();

  const [exchanges, setExchanges]       = useState<ExchangeRequest[]>([]);
  const [loadingData, setLoadingData]   = useState(true);
  const [fetchError, setFetchError]     = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ── Get current user ────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, []);

  // ── Fetch exchanges ─────────────────────────────────────────────────────────
  const fetchExchanges = useCallback(async () => {
    setLoadingData(true);
    setFetchError(null);

    let query = supabase
      .from('exchange_requests')
      .select(`
        *,
        produce_listings (
          crop_name,
          unit,
          price_per_kg,
          location,
          quality_grade,
          farmer_id
        ),
        profiles (
          full_name,
          phone,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (activeFilter !== 'all') query = query.eq('status', activeFilter);

    const { data, error } = await query;
    if (error) {
      setFetchError(error.message);
      setLoadingData(false);
      return;
    }

    setExchanges((data ?? []) as ExchangeRequest[]);
    setLoadingData(false);
  }, [activeFilter]);

  useEffect(() => { fetchExchanges(); }, [fetchExchanges]);

  // ── Update exchange status ──────────────────────────────────────────────────
  const updateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from('exchange_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setExchanges((prev) =>
        prev.map((ex) => ex.id === id ? { ...ex, status: newStatus as ExchangeRequest['status'] } : ex)
      );

      // Notify the buyer for farmer-initiated status changes
      const notifyMessages: Record<string, string> = {
        accepted: 'Your buy request for {crop} has been accepted',
        rejected: 'Your buy request for {crop} has been rejected',
        in_transit: 'Your order for {crop} is now in transit',
      };

      if (notifyMessages[newStatus]) {
        const exchange = exchanges.find((ex) => ex.id === id);
        if (exchange) {
          const cropName = exchange.produce_listings?.crop_name ?? 'your crop';
          const message = notifyMessages[newStatus].replace('{crop}', cropName);
          await supabase.from('notifications').insert({
            user_id: exchange.buyer_id,
            message,
          });
        }
      }
    }
    setActionLoading(null);
  };

  const filters: StatusFilter[] = ['all', 'pending', 'accepted', 'in_transit', 'completed', 'rejected'];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exchange Requests</h1>
            <p className="text-muted-foreground mt-2">Track all buy requests for your listed crops</p>
          </div>
          <Button variant="outline" onClick={fetchExchanges} disabled={loadingData}>
            {loadingData ? 'Refreshing…' : '↺ Refresh'}
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <Button
              key={f}
              variant="outline"
              onClick={() => setActiveFilter(f)}
              className={activeFilter === f ? 'bg-primary/10 border-primary text-primary' : ''}
            >
              {f === 'all' ? 'All Requests' : statusLabel(f)}
            </Button>
          ))}
        </div>

        {/* Loading */}
        {loadingData && (
          <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
            <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading exchanges...
          </div>
        )}

        {/* Error */}
        {fetchError && !loadingData && (
          <div className="text-center py-16 text-destructive">
            <p className="text-lg font-semibold">Failed to load exchanges</p>
            <p className="text-sm mt-1">{fetchError}</p>
            <Button variant="outline" className="mt-4" onClick={fetchExchanges}>Retry</Button>
          </div>
        )}

        {/* Empty */}
        {!loadingData && !fetchError && exchanges.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-semibold text-foreground">No exchange requests yet</p>
            <p className="text-sm mt-1">
              {activeFilter !== 'all'
                ? `No ${statusLabel(activeFilter).toLowerCase()} requests found.`
                : 'Buyers will appear here after they click "Buy Now" on your listings.'}
            </p>
          </div>
        )}

        {/* Exchange Cards */}
        {!loadingData && exchanges.length > 0 && (
          <div className="space-y-4">
            {exchanges.map((ex) => {
              const crop  = ex.produce_listings;
              const buyer = ex.profiles; // joined from profiles table via buyer_id
              const isLoading = actionLoading === ex.id;
              const isFarmer  = currentUserId === crop?.farmer_id;
              const isBuyer   = currentUserId === ex.buyer_id;

              // Derive display name: full_name from profiles → short UUID fallback
              const buyerName =
                buyer?.full_name ||
                `User ${ex.buyer_id.slice(0, 6).toUpperCase()}`;
              const buyerInitial = buyerName.charAt(0).toUpperCase();
              const buyerRole = buyer?.role
                ? buyer.role.charAt(0).toUpperCase() + buyer.role.slice(1)
                : null;

              return (
                <Card key={ex.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-center">

                      {/* Crop Info */}
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cropEmoji(crop?.crop_name)}</span>
                        <div>
                          <p className="font-bold text-foreground">{crop?.crop_name ?? '—'}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            📍 {crop?.location ?? '—'} · {crop?.quality_grade ?? '—'}
                          </p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Wants</p>
                        <p className="font-semibold text-foreground">
                          {ex.quantity_requested} {crop?.unit ?? 'units'}
                        </p>
                        {crop && (
                          <p className="text-sm text-primary font-medium">
                            ₹{(ex.quantity_requested * crop.price_per_kg).toLocaleString('en-IN')} est.
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">{formatDate(ex.created_at)}</p>
                      </div>

                      {/* Barter Offer */}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Offering In Exchange</p>
                        {ex.offer_crop_name ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{cropEmoji(ex.offer_crop_name)}</span>
                            <div>
                              <p className="font-semibold text-foreground">{ex.offer_crop_name}</p>
                              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                                {ex.offer_quantity} {ex.offer_unit}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No offer specified</p>
                        )}
                      </div>

                      {/* Requested By */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Requested By</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                            {buyerInitial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">{buyerName}</p>
                          </div>
                        </div>
                        {isBuyer && (
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-100/60 text-blue-700 border border-blue-300 font-medium">
                            You
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 flex-wrap">
                          {isFarmer && (
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-medium">
                              You're the Farmer
                            </span>
                          )}
                          {isBuyer && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100/60 text-blue-700 border border-blue-300 font-medium">
                              You're the Buyer
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className={statusColor(ex.status)}>
                          {statusLabel(ex.status)}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {/* Farmer actions on pending */}
                        {isFarmer && ex.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90"
                              disabled={isLoading} onClick={() => updateStatus(ex.id, 'accepted')}>
                              {isLoading ? '…' : 'Accept'}
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                              disabled={isLoading} onClick={() => updateStatus(ex.id, 'rejected')}>
                              {isLoading ? '…' : 'Reject'}
                            </Button>
                          </div>
                        )}

                        {/* Farmer marks in-transit */}
                        {isFarmer && ex.status === 'accepted' && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={isLoading} onClick={() => updateStatus(ex.id, 'in_transit')}>
                            {isLoading ? '…' : '🚚 Mark In Transit'}
                          </Button>
                        )}

                        {/* Buyer marks completed */}
                        {isBuyer && ex.status === 'in_transit' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isLoading} onClick={() => updateStatus(ex.id, 'completed')}>
                            {isLoading ? '…' : '✅ Mark Received'}
                          </Button>
                        )}

                        {ex.status === 'completed' && (
                          <span className="text-sm text-green-600 font-medium">✔ Exchange completed</span>
                        )}

                        {ex.status === 'rejected' && (
                          <span className="text-sm text-destructive font-medium">✕ Request rejected</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
