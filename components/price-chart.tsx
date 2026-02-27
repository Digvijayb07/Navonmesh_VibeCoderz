'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan 1', wheat: 250, rice: 320, corn: 180 },
  { date: 'Jan 8', wheat: 265, rice: 310, corn: 195 },
  { date: 'Jan 15', wheat: 280, rice: 335, corn: 205 },
  { date: 'Jan 22', wheat: 295, rice: 340, corn: 220 },
  { date: 'Jan 29', wheat: 320, rice: 355, corn: 235 },
  { date: 'Feb 5', wheat: 315, rice: 365, corn: 245 },
  { date: 'Feb 12', wheat: 330, rice: 375, corn: 255 },
];

export function PriceChart() {
  return (
    <Card className="border-border col-span-2">
      <CardHeader>
        <CardTitle>Crop Price Trends</CardTitle>
        <CardDescription>Weekly market prices for major crops</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--foreground)" />
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
            <Line type="monotone" dataKey="wheat" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="rice" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="corn" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
