"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Fix Leaflet default icon (broken in bundlers like webpack/turbopack) ──────
// We use inline SVG data URIs so no external CDN image dependency
const BUYER_ICON_SVG = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><circle cx="12" cy="12" r="11" fill="#2563eb" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>`)}`;

const SELLER_ICON_SVG = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#16a34a" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="#fff"/></svg>`)}`;

const buyerIcon = new L.Icon({
  iconUrl: BUYER_ICON_SVG,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const sellerIcon = new L.Icon({
  iconUrl: SELLER_ICON_SVG,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

// ── Types ────────────────────────────────────────────────────────────────────
export interface MapListing {
  id: string;
  crop_name: string;
  listing_type?: 'crop' | 'tool';
  price_per_kg: number;
  unit: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  _distance?: number;
}

export interface MapBuyerLocation {
  latitude: number;
  longitude: number;
  label?: string;
}

interface Props {
  listings: MapListing[];
  buyerLocation: MapBuyerLocation | null;
  radiusKm?: number;
  onMarkerClick?: (listing: MapListing) => void;
}

// ── Fly animation sub-component ──────────────────────────────────────────────
function FlyToBuyer({ location }: { location: MapBuyerLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 10, {
        duration: 1.5,
      });
    }
  }, [location, map]);

  return null;
}

// ── Main Map Component ───────────────────────────────────────────────────────
export default function MiniMarketMap({
  listings,
  buyerLocation,
  radiusKm = 0,
  onMarkerClick,
}: Props) {
  // Filter to listings that have valid coordinates
  const mappableListings = useMemo(() => {
    return listings.filter(
      (l) =>
        l.latitude != null &&
        l.longitude != null &&
        (radiusKm <= 0 ||
          (l._distance !== undefined && l._distance <= radiusKm)),
    );
  }, [listings, radiusKm]);

  const center: [number, number] = buyerLocation
    ? [buyerLocation.latitude, buyerLocation.longitude]
    : [20.5937, 78.9629]; // India center fallback

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-sm relative z-0">
      <MapContainer
        center={center}
        zoom={buyerLocation ? 10 : 5}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToBuyer location={buyerLocation} />

        {/* Buyer marker */}
        {buyerLocation && (
          <>
            <Marker
              position={[buyerLocation.latitude, buyerLocation.longitude]}
              icon={buyerIcon}
            >
              <Popup>
                <div className="text-sm font-semibold">📍 Your Location</div>
              </Popup>
            </Marker>

            {/* Radius circle (if filter active) */}
            {radiusKm > 0 && (
              <Circle
                center={[buyerLocation.latitude, buyerLocation.longitude]}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: "#16a34a",
                  fillColor: "#16a34a",
                  fillOpacity: 0.06,
                  weight: 1.5,
                  dashArray: "6 4",
                }}
              />
            )}
          </>
        )}

        {/* Seller markers */}
        {mappableListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude!, listing.longitude!]}
            icon={sellerIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(listing),
            }}
          >
            <Popup>
              <div style={{ minWidth: 140 }}>
                <div className="font-semibold text-sm">
                  {listing.listing_type === 'tool' ? '🚜' : '🌾'} {listing.crop_name}
                </div>
                <div className="text-sm mt-1">
                  {listing.listing_type === 'tool'
                    ? `₹${listing.price_per_kg}/day`
                    : `₹${listing.price_per_kg}/${listing.unit}`}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  📍 {listing.location}
                </div>
                {listing._distance !== undefined && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    🚗{" "}
                    {listing._distance < 1
                      ? `${Math.round(listing._distance * 1000)} m`
                      : `${listing._distance.toFixed(1)} km`}{" "}
                    away
                  </div>
                )}
                <button
                  className="mt-2 text-xs text-green-600 underline font-medium"
                  onClick={() => onMarkerClick?.(listing)}
                >
                  Exchange →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
