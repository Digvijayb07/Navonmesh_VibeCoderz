import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const priceData = [
  { crop: 'Wheat', minPrice: 220, maxPrice: 280, avgPrice: 250, trend: 'up' },
  { crop: 'Rice', minPrice: 300, maxPrice: 380, avgPrice: 340, trend: 'up' },
  { crop: 'Corn', minPrice: 160, maxPrice: 220, avgPrice: 190, trend: 'down' },
  { crop: 'Vegetables', minPrice: 30, maxPrice: 80, avgPrice: 55, trend: 'stable' },
  { crop: 'Cotton', minPrice: 45, maxPrice: 65, avgPrice: 55, trend: 'up' },
  { crop: 'Sugarcane', minPrice: 50, maxPrice: 75, avgPrice: 62, trend: 'up' },
];

const regionPrices = [
  { region: 'Punjab', wheat: 260, rice: 345, corn: 195 },
  { region: 'Haryana', wheat: 255, rice: 340, corn: 190 },
  { region: 'MP', wheat: 245, rice: 335, corn: 185 },
  { region: 'UP', wheat: 250, rice: 338, corn: 188 },
  { region: 'Gujarat', wheat: 255, rice: 342, corn: 192 },
];

export default function MarketPricesPage() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Prices</h1>
          <p className="text-muted-foreground mt-2">Real-time crop prices across different regions</p>
        </div>

        {/* Price Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priceData.map((item) => (
            <Card key={item.crop} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{item.crop}</p>
                    <p className="text-2xl font-bold text-primary">₹{item.avgPrice}/kg</p>
                  </div>
                  <span className={`text-lg ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➡️'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Price:</span>
                    <span className="font-medium">₹{item.minPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Price:</span>
                    <span className="font-medium">₹{item.maxPrice}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Range:</span>
                    <span className="font-semibold text-foreground">₹{item.maxPrice - item.minPrice}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${((item.avgPrice - item.minPrice) / (item.maxPrice - item.minPrice)) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Regional Price Comparison Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Regional Price Comparison</CardTitle>
            <CardDescription>Average crop prices across major regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionPrices}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="region" stroke="var(--foreground)" />
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
                <Bar dataKey="wheat" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="rice" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="corn" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price History Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Detailed Price Information</CardTitle>
            <CardDescription>Comprehensive market data for informed decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Crop</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Min Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Max Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Avg Price</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Trend</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">7-Day Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceData.map((item) => (
                    <tr key={item.crop} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-3 px-4 font-medium text-foreground">{item.crop}</td>
                      <td className="text-right py-3 px-4 text-foreground">₹{item.minPrice}</td>
                      <td className="text-right py-3 px-4 text-foreground">₹{item.maxPrice}</td>
                      <td className="text-right py-3 px-4 font-bold text-primary">₹{item.avgPrice}</td>
                      <td className="text-center py-3 px-4">
                        <span className={item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                          {item.trend === 'up' ? '📈 Up' : item.trend === 'down' ? '📉 Down' : '➡️ Stable'}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 font-semibold">
                        <span className={item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                          {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : '±'}3.5%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="border-border bg-secondary/30">
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="font-semibold text-foreground">Highest Demand</p>
                  <p className="text-sm text-muted-foreground">Rice prices showing strong upward trend across all regions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-foreground">Best Opportunity</p>
                  <p className="text-sm text-muted-foreground">Corn prices are lowest this season - good time to stock</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-foreground">Market Peak</p>
                  <p className="text-sm text-muted-foreground">March-April shows seasonal price hikes - plan accordingly</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
