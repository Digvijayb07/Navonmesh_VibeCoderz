import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
}

export function StatCard({ icon, title, value, subtitle, trend }: StatCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {trend !== undefined && (
                <span className={`text-sm font-medium ${trend >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
