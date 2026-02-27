import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const exchanges = [
  {
    id: 1,
    requester: 'Sharma Trading',
    offeringCrop: 'Wheat (500 kg)',
    seekingCrop: 'Rice (400 kg)',
    date: 'Feb 20, 2024',
    status: 'pending',
    trustScore: 4.7,
    region: 'Haryana',
  },
  {
    id: 2,
    requester: 'Green Valley Coop',
    offeringCrop: 'Corn (750 kg)',
    seekingCrop: 'Wheat (600 kg)',
    date: 'Feb 18, 2024',
    status: 'accepted',
    trustScore: 4.9,
    region: 'Madhya Pradesh',
  },
  {
    id: 3,
    requester: 'Delhi Fresh Produce',
    offeringCrop: 'Vegetables (200 kg)',
    seekingCrop: 'Grains mix (300 kg)',
    date: 'Feb 15, 2024',
    status: 'completed',
    trustScore: 4.6,
    region: 'Delhi',
  },
  {
    id: 4,
    requester: 'Punjab Grains',
    offeringCrop: 'Rice (1000 kg)',
    seekingCrop: 'Wheat (800 kg)',
    date: 'Feb 22, 2024',
    status: 'pending',
    trustScore: 4.8,
    region: 'Punjab',
  },
  {
    id: 5,
    requester: 'Harvest Plus',
    offeringCrop: 'Cotton (500 kg)',
    seekingCrop: 'Seeds package',
    date: 'Feb 21, 2024',
    status: 'pending',
    trustScore: 4.5,
    region: 'Gujarat',
  },
];

export default function ExchangePage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100/50 text-yellow-700 border-yellow-300';
      case 'accepted':
        return 'bg-blue-100/50 text-blue-700 border-blue-300';
      case 'completed':
        return 'bg-green-100/50 text-green-700 border-green-300';
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
            <h1 className="text-3xl font-bold text-foreground">Exchange Requests</h1>
            <p className="text-muted-foreground mt-2">Manage crop exchange proposals with other farmers</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ Create Exchange Request</Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="bg-primary/10">All Requests</Button>
          <Button variant="outline">Pending</Button>
          <Button variant="outline">Accepted</Button>
          <Button variant="outline">Completed</Button>
        </div>

        {/* Exchange Requests Table/Cards */}
        <div className="space-y-4">
          {exchanges.map((exchange) => (
            <Card key={exchange.id} className="border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                  {/* Requester Info */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">From</p>
                    <p className="font-bold text-foreground">{exchange.requester}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-muted-foreground">{exchange.trustScore}</span>
                    </div>
                  </div>

                  {/* Offering */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Offering</p>
                    <p className="font-medium text-primary">{exchange.offeringCrop}</p>
                    <p className="text-xs text-muted-foreground mt-1">📍 {exchange.region}</p>
                  </div>

                  {/* Exchange Arrow */}
                  <div className="flex justify-center">
                    <span className="text-2xl">⇄</span>
                  </div>

                  {/* Seeking */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Seeking</p>
                    <p className="font-medium text-secondary">{exchange.seekingCrop}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exchange.date}</p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(exchange.status)}>
                      {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                    </Badge>
                    <div className="flex gap-2">
                      {exchange.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="flex-1">Accept</Button>
                          <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                        </>
                      )}
                      {exchange.status === 'accepted' && (
                        <Button size="sm" className="flex-1 bg-primary/90">Confirm Ready</Button>
                      )}
                      {exchange.status === 'completed' && (
                        <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
