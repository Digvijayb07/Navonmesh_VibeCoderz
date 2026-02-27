"use client";

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const transporters = [
  {
    id: 1,
    name: 'Fast Freight India',
    rating: 4.9,
    reviews: 342,
    specialization: 'Cold Chain & Perishables',
    vehicles: 'Refrigerated Trucks',
    price: '₹50/km',
    coverage: 'All India',
    status: 'available',
    image: '🚚',
  },
  {
    id: 2,
    name: 'Green Logistics',
    rating: 4.7,
    reviews: 256,
    specialization: 'Eco-Friendly Transport',
    vehicles: 'Bio-Diesel Fleet',
    price: '₹35/km',
    coverage: 'North & Central',
    status: 'available',
    image: '🌱',
  },
  {
    id: 3,
    name: 'Farmers Express',
    rating: 4.8,
    reviews: 189,
    specialization: 'Agricultural Produce',
    vehicles: 'Standard & Container',
    price: '₹40/km',
    coverage: 'Pan India',
    status: 'available',
    image: '🚛',
  },
  {
    id: 4,
    name: 'Premium Cargo',
    rating: 4.6,
    reviews: 134,
    specialization: 'Premium Quality Control',
    vehicles: 'Premium Trucks',
    price: '₹60/km',
    coverage: 'Major Cities',
    status: 'limited',
    image: '⚡',
  },
];

const shipments = [
  {
    id: 'SH001',
    crop: 'Wheat (500 kg)',
    from: 'Punjab',
    to: 'Delhi',
    date: '2024-02-23',
    status: 'in-transit',
    transporter: 'Fast Freight India',
    eta: '24 hours',
  },
  {
    id: 'SH002',
    crop: 'Rice (1000 kg)',
    from: 'Haryana',
    to: 'Bangalore',
    date: '2024-02-21',
    status: 'delivered',
    transporter: 'Farmers Express',
    eta: 'Completed',
  },
  {
    id: 'SH003',
    crop: 'Vegetables (200 kg)',
    from: 'Delhi NCR',
    to: 'Mumbai',
    date: '2024-02-24',
    status: 'pending',
    transporter: 'Green Logistics',
    eta: 'Pickup tomorrow',
  },
];

export default function LogisticsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit':
        return 'bg-blue-100/50 text-blue-700 border-blue-300';
      case 'delivered':
        return 'bg-green-100/50 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100/50 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100/50 text-gray-700 border-gray-300';
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Logistics & Transport</h1>
            <p className="text-muted-foreground mt-2">Connect with reliable transporters for your agricultural produce</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ Book Transport</Button>
        </div>

        {/* Available Transporters */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Available Transporters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transporters.map((transporter) => (
              <Card key={transporter.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-4xl mb-2">{transporter.image}</div>
                      <h3 className="text-lg font-bold text-foreground">{transporter.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-semibold text-foreground">{transporter.rating}</span>
                        <span className="text-xs text-muted-foreground">({transporter.reviews} reviews)</span>
                      </div>
                    </div>
                    <Badge 
                      className={transporter.status === 'available' ? 'bg-green-100/50 text-green-700 border-green-300' : 'bg-yellow-100/50 text-yellow-700 border-yellow-300'}
                    >
                      {transporter.status.charAt(0).toUpperCase() + transporter.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Specialization:</span>
                      <span className="font-medium text-foreground">{transporter.specialization}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vehicles:</span>
                      <span className="font-medium text-foreground">{transporter.vehicles}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coverage:</span>
                      <span className="font-medium text-foreground">{transporter.coverage}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-bold text-primary text-lg">{transporter.price}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Shipments */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Your Shipments</h2>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <Card key={shipment.id} className="border-border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">ID</p>
                      <p className="font-mono text-sm font-bold text-foreground">{shipment.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Cargo</p>
                      <p className="font-medium text-foreground">{shipment.crop}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Route</p>
                      <p className="text-sm text-foreground">{shipment.from} → {shipment.to}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Transporter</p>
                      <p className="text-sm text-foreground">{shipment.transporter}</p>
                    </div>
                    <div>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">ETA: {shipment.eta}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Track</Button>
                      <Button size="sm" variant="outline">Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
