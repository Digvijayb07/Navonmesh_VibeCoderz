import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const alerts = [
  {
    id: 1,
    type: 'price_spike',
    crop: 'Wheat',
    message: 'Price increased by 12% in the last 24 hours',
    time: '2 hours ago',
    severity: 'info',
  },
  {
    id: 2,
    type: 'demand',
    crop: 'Rice',
    message: 'High demand detected from buyers in Northern Region',
    time: '4 hours ago',
    severity: 'success',
  },
  {
    id: 3,
    type: 'weather',
    crop: 'Corn',
    message: 'Heavy rainfall warning for growing regions',
    time: '1 hour ago',
    severity: 'warning',
  },
  {
    id: 4,
    type: 'quality',
    crop: 'Vegetables',
    message: 'New buyer with premium quality requirements joined',
    time: '30 minutes ago',
    severity: 'info',
  },
];

export function MarketAlerts() {
  const severityColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Market Alerts</CardTitle>
        <CardDescription>Real-time market notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${severityColors[alert.severity]}`}
            >
              <span className="text-lg mt-0.5">
                {alert.type === 'price_spike' && '📈'}
                {alert.type === 'demand' && '🤝'}
                {alert.type === 'weather' && '⛈️'}
                {alert.type === 'quality' && '✅'}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{alert.crop}</h4>
                  <Badge variant="outline" className="text-xs">{alert.type.replace('_', ' ')}</Badge>
                </div>
                <p className="text-sm mt-1">{alert.message}</p>
                <p className="text-xs opacity-70 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
