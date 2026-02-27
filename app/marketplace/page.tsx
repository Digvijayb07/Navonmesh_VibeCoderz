import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const crops = [
  {
    id: 1,
    name: 'Premium Wheat',
    farmer: 'Ram Kumar Farms',
    quantity: '500 kg',
    price: '₹25/kg',
    quality: 'Grade A',
    rating: 4.8,
    image: '🌾',
    region: 'Punjab',
    available: true,
  },
  {
    id: 2,
    name: 'Basmati Rice',
    farmer: 'Golden Harvest Co.',
    quantity: '1000 kg',
    price: '₹32/kg',
    quality: 'Premium',
    rating: 4.9,
    image: '🍚',
    region: 'Haryana',
    available: true,
  },
  {
    id: 3,
    name: 'Organic Corn',
    farmer: 'Green Valley Farmers',
    quantity: '750 kg',
    price: '₹18/kg',
    quality: 'Organic Certified',
    rating: 4.6,
    image: '🌽',
    region: 'Madhya Pradesh',
    available: true,
  },
  {
    id: 4,
    name: 'Fresh Vegetables Mix',
    farmer: 'Urban Farming Initiative',
    quantity: '200 kg',
    price: '₹40/kg',
    quality: 'Fresh',
    rating: 4.7,
    image: '🥕',
    region: 'Delhi NCR',
    available: true,
  },
  {
    id: 5,
    name: 'Sugarcane',
    farmer: 'Sweet Harvest Farms',
    quantity: '2000 kg',
    price: '₹60/quintal',
    quality: 'High Sugar Content',
    rating: 4.5,
    image: '🍃',
    region: 'Uttar Pradesh',
    available: false,
  },
  {
    id: 6,
    name: 'Cotton (Raw)',
    farmer: 'Cotton Kingdom Farms',
    quantity: '500 kg',
    price: '₹55/kg',
    quality: 'Grade A White',
    rating: 4.8,
    image: '☁️',
    region: 'Gujarat',
    available: true,
  },
];

export default function MarketplacePage() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground mt-2">Browse and purchase crops from trusted farmers</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ List Your Crops</Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <Input type="search" placeholder="Search crops, farmers..." className="w-64" />
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground">
            <option>All Crops</option>
            <option>Wheat</option>
            <option>Rice</option>
            <option>Corn</option>
            <option>Vegetables</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground">
            <option>All Regions</option>
            <option>Punjab</option>
            <option>Haryana</option>
            <option>Madhya Pradesh</option>
            <option>Delhi NCR</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground">
            <option>All Quality</option>
            <option>Grade A</option>
            <option>Premium</option>
            <option>Organic</option>
          </select>
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">{crop.image}</div>
                <h3 className="text-xl font-bold text-foreground">{crop.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{crop.farmer}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-semibold text-foreground">{crop.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold text-primary">{crop.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Region:</span>
                    <span className="text-foreground">{crop.region}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="bg-secondary/50">{crop.quality}</Badge>
                  <Badge variant="outline" className="bg-yellow-100/50 text-yellow-700 border-yellow-300">
                    ⭐ {crop.rating}
                  </Badge>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!crop.available}
                  >
                    {crop.available ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                  <Button variant="outline" className="flex-1">Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
