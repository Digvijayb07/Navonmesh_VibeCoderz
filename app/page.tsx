import { AppLayout } from "@/components/app-layout";
import { StatCard } from "@/components/stat-card";
import { TrustScoreStat } from "@/components/trust-score-stat";
import { PriceChart } from "@/components/price-chart";
import { MarketAlerts } from "@/components/market-alerts";
import { MandiPriceTicker } from "@/components/mandi-price-ticker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-8 lg:p-10 space-y-8 relative">
        {/* Decorative blur orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-60 h-60 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/60 backdrop-blur-sm border border-green-200/40 text-green-700 text-sm font-medium mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Dashboard Overview
          </div>
          <h1
            className="text-4xl lg:text-5xl font-bold text-green-900 text-balance"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Welcome to <span className="gradient-text">Krishi Exchange</span>
          </h1>
          <p className="text-green-700/60 mt-3 text-base">
            Your trusted agricultural marketplace platform
          </p>
        </div>

        {/* Live Mandi Price Ticker */}
        <div className="animate-fade-in-up animate-stagger-1">
          <MandiPriceTicker />
        </div>

        {/* Statistics row – two cards flexed evenly */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animate-stagger-2">
          <div className="flex-1 min-w-[260px]">
            <StatCard
              icon="🤝"
              title="Pending Exchanges"
              value="8"
              subtitle="Awaiting your approval"
              trend={5}
            />
          </div>
          <div className="flex-1 min-w-[260px]">
            <TrustScoreStat />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up animate-stagger-3">
          <QuickActionCard
            icon="📤"
            title="List Item"
            description="Add a crop or tool listing"
            href="/marketplace?action=list"
          />
          <QuickActionCard
            icon="🔍"
            title="Find Buyers"
            description="Browse buyer requests"
            href="/marketplace"
          />
          <QuickActionCard
            icon="🚚"
            title="Arrange Transport"
            description="Book logistics services"
            href="/logistics"
          />
          <QuickActionCard
            icon="📞"
            title="Connect Stakeholders"
            description="Build your network"
            href="/exchange"
          />
        </div>

        {/* Recent Transactions */}
        <Card className="glass-card border-0 rounded-2xl animate-fade-in-up animate-stagger-4">
          <CardHeader>
            <CardTitle
              className="text-green-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-green-700/50">
              Your latest marketplace activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  type: "sale",
                  crop: "Wheat (500 kg)",
                  buyer: "Sharma Trading",
                  amount: "₹12,500",
                  status: "completed",
                  time: "2 days ago",
                },
                {
                  type: "exchange",
                  crop: "Rice exchange",
                  with: "Farmers Cooperative",
                  status: "pending",
                  time: "1 day ago",
                },
                {
                  type: "transport",
                  crop: "Corn delivery",
                  route: "Delhi to Haryana",
                  amount: "₹1,200",
                  status: "in-transit",
                  time: "12 hours ago",
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-green-50/50 backdrop-blur-sm rounded-xl border border-green-100/30 hover:bg-green-50/80 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
                      {tx.type === "sale" && "📦"}
                      {tx.type === "exchange" && "🔄"}
                      {tx.type === "transport" && "🚚"}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-green-900">
                        {tx.type === "sale" && `Sold ${tx.crop} to ${tx.buyer}`}
                        {tx.type === "exchange" &&
                          `Exchanged ${tx.crop} with ${tx.with}`}
                        {tx.type === "transport" && `Transport: ${tx.crop}`}
                      </p>
                      <p className="text-xs text-green-600/50">{tx.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {"amount" in tx && (
                      <span className="font-semibold text-green-800">
                        {tx.amount}
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-100/60 text-green-700 border border-green-200/40"
                          : tx.status === "pending"
                            ? "bg-amber-100/60 text-amber-700 border border-amber-200/40"
                            : "bg-blue-100/60 text-blue-700 border border-blue-200/40"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="quick-action-card p-6 rounded-2xl cursor-pointer group"
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3
        className="font-semibold text-base text-green-900"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {title}
      </h3>
      <p className="text-sm text-green-700/50 mt-1.5">{description}</p>
    </a>
  );
}
