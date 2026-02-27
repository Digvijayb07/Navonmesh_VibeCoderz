import { AppLayout } from '@/components/app-layout';
import { StatCard } from '@/components/stat-card';
import { PriceChart } from '@/components/price-chart';
import { MarketAlerts } from '@/components/market-alerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground text-balance">Welcome to FarmLink</h1>
          <p className="text-muted-foreground mt-2">Your trusted agricultural exchange platform</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="📊"
            title="Active Listings"
            value="24"
            subtitle="Current crop listings"
            trend={12}
          />
          <StatCard
            icon="🤝"
            title="Pending Exchanges"
            value="8"
            subtitle="Awaiting your approval"
            trend={5}
          />
          <StatCard
            icon="⭐"
            title="Trust Score"
            value="4.8/5"
            subtitle="Based on 156 transactions"
            trend={8}
          />
          <StatCard
            icon="💰"
            title="Revenue (This Month)"
            value="₹42,500"
            subtitle="From completed sales"
            trend={15}
          />
        </div>

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PriceChart />
          <MarketAlerts />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon="📤"
            title="List Crop"
            description="Add new crop to sell"
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
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest marketplace activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'sale', crop: 'Wheat (500 kg)', buyer: 'Sharma Trading', amount: '₹12,500', status: 'completed', time: '2 days ago' },
                { type: 'exchange', crop: 'Rice exchange', with: 'Farmers Cooperative', status: 'pending', time: '1 day ago' },
                { type: 'transport', crop: 'Corn delivery', route: 'Delhi to Haryana', amount: '₹1,200', status: 'in-transit', time: '12 hours ago' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {tx.type === 'sale' && '📦'}
                      {tx.type === 'exchange' && '🔄'}
                      {tx.type === 'transport' && '🚚'}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {tx.type === 'sale' && `Sold ${tx.crop} to ${tx.buyer}`}
                        {tx.type === 'exchange' && `Exchanged ${tx.crop} with ${tx.with}`}
                        {tx.type === 'transport' && `Transport: ${tx.crop}`}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {'amount' in tx && <span className="font-semibold text-primary">{tx.amount}</span>}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-100/50 text-green-700' :
                      tx.status === 'pending' ? 'bg-yellow-100/50 text-yellow-700' :
                      'bg-blue-100/50 text-blue-700'
                    }`}>
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

function QuickActionCard({ icon, title, description, href }: { icon: string; title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </a>
  );
}
