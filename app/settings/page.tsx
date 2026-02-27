import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">Farm Name</label>
              <Input value="Ram Kumar Farms" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Email</label>
              <Input value="ram@farmlink.com" type="email" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Phone</label>
              <Input value="+91 98765 43210" className="mt-2" />
            </div>
            <Button className="bg-primary">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Location & Service Area</CardTitle>
            <CardDescription>Set your primary location and service radius</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">State</label>
              <select className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground">
                <option>Punjab</option>
                <option>Haryana</option>
                <option>Madhya Pradesh</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">District</label>
              <Input value="Amritsar" className="mt-2" />
            </div>
            <Button className="bg-primary">Update Location</Button>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Privacy & Notifications</CardTitle>
            <CardDescription>Control your privacy and communication preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Profile Visibility', desc: 'Allow other farmers to see your profile' },
              { label: 'Email Notifications', desc: 'Receive emails for new inquiries and messages' },
              { label: 'Marketing Communications', desc: 'Receive promotional updates and tips' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods and bank details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">+ Add Bank Account</Button>
            <Button variant="outline" className="w-full">+ Add UPI Account</Button>
            <Button variant="outline" className="w-full">+ Add Payment Wallet</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-border border-red-300 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50">
              Deactivate Account
            </Button>
            <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
