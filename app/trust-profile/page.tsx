import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TrustProfilePage() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trust Profile</h1>
          <p className="text-muted-foreground mt-2">Your reputation and trust metrics in the FarmLink community</p>
        </div>

        {/* Main Profile Card */}
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="flex items-start gap-8">
              {/* Trust Score Circle */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-primary-foreground">4.8</p>
                    <p className="text-sm text-primary-foreground/80">out of 5</p>
                  </div>
                </div>
                <Badge className="mt-6 bg-green-100/50 text-green-700 border-green-300 text-base px-4 py-2">
                  ✓ Verified Farmer
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Ram Kumar Farms</h2>
                  <p className="text-muted-foreground mt-1">Registered since January 2020</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-3xl font-bold text-foreground">156</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Successful Deals</p>
                    <p className="text-3xl font-bold text-primary">150 (96%)</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-3xl font-bold text-foreground">2.3 hours</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Member Status</p>
                    <p className="text-3xl font-bold text-green-600">Gold</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quality Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Product Quality</span>
                  <span className="text-2xl font-bold text-primary">4.9/5</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: '98%' }} />
                </div>
                <p className="text-xs text-muted-foreground">Based on 42 reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Responsiveness</span>
                  <span className="text-2xl font-bold text-primary">4.7/5</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: '94%' }} />
                </div>
                <p className="text-xs text-muted-foreground">Based on 156 interactions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Reliability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">On-Time Delivery</span>
                  <span className="text-2xl font-bold text-primary">4.8/5</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: '96%' }} />
                </div>
                <p className="text-xs text-muted-foreground">Based on 150 deliveries</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications & Badges */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Certifications & Achievements</CardTitle>
            <CardDescription>Your earned badges and certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '✓', label: 'Email Verified', color: 'bg-blue-100/50 text-blue-700 border-blue-300' },
                { icon: '🏆', label: 'Gold Member', color: 'bg-yellow-100/50 text-yellow-700 border-yellow-300' },
                { icon: '🌾', label: 'Organic Certified', color: 'bg-green-100/50 text-green-700 border-green-300' },
                { icon: '✅', label: 'KYC Verified', color: 'bg-green-100/50 text-green-700 border-green-300' },
                { icon: '📋', label: 'Tax Compliant', color: 'bg-purple-100/50 text-purple-700 border-purple-300' },
                { icon: '🎯', label: '100+ Sales', color: 'bg-orange-100/50 text-orange-700 border-orange-300' },
                { icon: '⭐', label: '4.5+ Rating', color: 'bg-red-100/50 text-red-700 border-red-300' },
                { icon: '🚀', label: 'Top Seller', color: 'bg-indigo-100/50 text-indigo-700 border-indigo-300' },
              ].map((badge, i) => (
                <div key={i} className={`p-4 rounded-lg border ${badge.color} text-center`}>
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <p className="text-sm font-semibold">{badge.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Feedback from your transaction partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { reviewer: 'Sharma Trading', rating: 5, comment: 'Excellent quality wheat. Prompt delivery and professional handling.', date: '2 days ago' },
                { reviewer: 'Green Valley Co.', rating: 5, comment: 'Very reliable partner. Always delivers on time with best quality.', date: '1 week ago' },
                { reviewer: 'Delhi Fresh Produce', rating: 4, comment: 'Good quality crops. Would appreciate faster response times.', date: '2 weeks ago' },
              ].map((review, i) => (
                <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{review.reviewer}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(review.rating)].map((_, j) => (
                          <span key={j} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-foreground/80">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Request Verification</Button>
          <Button variant="outline">Download Certificate</Button>
          <Button variant="outline">View Full Profile</Button>
        </div>
      </div>
    </AppLayout>
  );
}
