import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    deliveryFee: 40,
    freeDeliveryThreshold: 500,
    taxRate: 5,
    enableCOD: true,
    enableUPI: true,
    enableNetBanking: true,
    enableCard: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500">Configure platform-wide settings</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Settings</CardTitle>
            <CardDescription>Configure delivery fees and thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Standard Delivery Fee (₹)</Label>
              <Input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Free Delivery Threshold (₹)</Label>
              <Input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
              />
              <p className="text-sm text-gray-500">
                Orders above this amount get free delivery
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Settings</CardTitle>
            <CardDescription>Configure tax rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Enable or disable payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <Checkbox
                  checked={settings.enableUPI}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableUPI: checked })}
                />
                <div>
                  <p className="font-medium">UPI</p>
                  <p className="text-sm text-gray-500">Accept UPI payments</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <Checkbox
                  checked={settings.enableNetBanking}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableNetBanking: checked })}
                />
                <div>
                  <p className="font-medium">Net Banking</p>
                  <p className="text-sm text-gray-500">Accept net banking</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <Checkbox
                  checked={settings.enableCard}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableCard: checked })}
                />
                <div>
                  <p className="font-medium">Debit/Credit Card</p>
                  <p className="text-sm text-gray-500">Accept card payments</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <Checkbox
                  checked={settings.enableCOD}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableCOD: checked })}
                />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Accept COD orders</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
