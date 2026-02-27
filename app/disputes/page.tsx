import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DisputesPage() {
  const disputes = [
    {
      id: 'D001',
      against: 'Buyer: Delhi Foods Co.',
      issue: 'Quality complaint on wheat delivery',
      date: 'Feb 15, 2024',
      status: 'resolved',
      resolution: 'Partial refund issued',
    },
    {
      id: 'D002',
      against: 'Transporter: Fast Freight',
      issue: 'Late delivery of rice shipment',
      date: 'Feb 18, 2024',
      status: 'in-mediation',
      resolution: 'Under review',
    },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Disputes & Resolution</h1>
          <p className="text-muted-foreground mt-2">Manage and track dispute cases</p>
        </div>

        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">ID</p>
                    <p className="font-bold text-foreground">{dispute.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Against</p>
                    <p className="text-sm text-foreground">{dispute.against}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Issue</p>
                    <p className="text-sm text-foreground">{dispute.issue}</p>
                  </div>
                  <div>
                    <Badge className={dispute.status === 'resolved' ? 'bg-green-100/50 text-green-700 border-green-300' : 'bg-yellow-100/50 text-yellow-700 border-yellow-300'}>
                      {dispute.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">{dispute.resolution}</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button className="bg-primary">+ File New Dispute</Button>
      </div>
    </AppLayout>
  );
}
