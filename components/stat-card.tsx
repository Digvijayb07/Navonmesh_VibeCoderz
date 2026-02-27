import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
}

export function StatCard({
  icon,
  title,
  value,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <Card className="stat-card-gradient card-hover-subtle rounded-2xl border-0">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-green-700/60">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-green-900">{value}</h3>
              {trend !== undefined && (
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    trend >= 0
                      ? "bg-green-100/60 text-green-700"
                      : "bg-red-100/60 text-red-600"
                  }`}
                >
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-green-600/50 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="text-4xl animate-bounce-gentle">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
