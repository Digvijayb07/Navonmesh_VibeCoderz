import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesTrend = [
  { month: 'Jan', sales: 8, revenue: 24000 },
  { month: 'Feb', sales: 12, revenue: 36000 },
  { month: 'Mar', sales: 10, revenue: 30000 },
  { month: 'Apr', sales: 15, revenue: 45000 },
  { month: 'May', sales: 18, revenue: 54000 },
  { month: 'Jun', sales: 22, revenue: 66000 },
];

const cropDistribution = [
  { name: 'Wheat', value: 35, color: '#d4a574' },
  { name: 'Rice', value: 28, color: '#e8d4b8' },
  { name: 'Corn', value: 20, color: '#f4e4c1' },
  { name: 'Vegetables', value: 12, color: '#90ee90' },
  { name: 'Others', value: 5, color: '#d3d3d3' },
];

const categoryMetrics = [
  { name: 'Sales Volume', value: '2,450 kg', trend: '+12%' },
  { name: 'Total Revenue', value: '₹2,55,000', trend: '+18%' },
  { name: 'Avg Order Value', value: '₹12,500', trend: '+5%' },
  { name: 'Customer Count', value: '45+', trend: '+25%' },
];

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-2">Track your performance and market trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryMetrics.map((metric, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{metric.name}</p>
                <div className="flex items-end justify-between mt-3">
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <span className="text-green-600 font-semibold text-sm">{metric.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Sales & Revenue Trend</CardTitle>
              <CardDescription>Monthly performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--foreground)" />
                  <YAxis stroke="var(--foreground)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      border: '1px solid var(--border)',
                      borderRadius: '0.625rem'
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="var(--chart-1)" strokeWidth={2} yAxisId="left" />
                  <Line type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={2} yAxisId="right" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Crop Distribution */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Crop Distribution</CardTitle>
              <CardDescription>Sales breakdown by crop type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cropDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cropDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      border: '1px solid var(--border)',
                      borderRadius: '0.625rem'
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Conversion Rate', value: '8.5%', icon: '📊' },
                { label: 'Avg Days to Sale', value: '3.2', icon: '⏱️' },
                { label: 'Customer Retention', value: '92%', icon: '👥' },
                { label: 'Repeat Customers', value: '68%', icon: '🔄' },
                { label: 'Net Promoter Score', value: '72', icon: '⭐' },
                { label: 'Market Share (Local)', value: '12.5%', icon: '🎯' },
                { label: 'Complaint Rate', value: '0.8%', icon: '⚠️' },
                { label: 'Processing Speed', value: '98%', icon: '⚡' },
              ].map((metric, i) => (
                <div key={i} className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <div className="text-3xl mb-2">{metric.icon}</div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">{metric.label}</p>
                  <p className="text-2xl font-bold text-primary mt-2">{metric.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Reports */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
            <CardDescription>Geographic breakdown of your sales</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { region: 'Punjab', sales: 450, avg: 12500 },
                { region: 'Haryana', sales: 380, avg: 11200 },
                { region: 'Delhi NCR', sales: 290, avg: 13500 },
                { region: 'UP', sales: 350, avg: 10800 },
                { region: 'Madhya Pradesh', sales: 280, avg: 9500 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="region" stroke="var(--foreground)" />
                <YAxis stroke="var(--foreground)" yAxisId="left" />
                <YAxis stroke="var(--foreground)" yAxisId="right" orientation="right" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    border: '1px solid var(--border)',
                    borderRadius: '0.625rem'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Bar dataKey="sales" fill="var(--chart-1)" yAxisId="left" radius={[8, 8, 0, 0]} />
                <Bar dataKey="avg" fill="var(--chart-2)" yAxisId="right" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="border-border bg-secondary/30">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <p className="font-semibold text-foreground">Expand Rice Sales</p>
                  <p className="text-sm text-muted-foreground">Rice has highest demand but only 28% of your inventory. Consider increasing supply.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">📈</span>
                <div>
                  <p className="font-semibold text-foreground">Focus on Delhi Region</p>
                  <p className="text-sm text-muted-foreground">Delhi NCR has highest avg order value. Allocate more marketing resources there.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="font-semibold text-foreground">Seasonal Planning</p>
                  <p className="text-sm text-muted-foreground">March-April shows 25% sales spike. Prepare inventory accordingly.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
