import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store, Upload, Loader2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { vendorProfileSchema } from '../../lib/validators';
import { vendors } from '../../data/dummyData';
import { toast } from 'sonner';

export default function StoreProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const vendor = vendors[0]; // Demo vendor

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      storeName: vendor.storeName,
      storeDescription: vendor.storeDescription,
      contactNumber: vendor.contactNumber,
      address: vendor.address,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Store profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Profile</h1>
        <p className="text-gray-500">Manage your store information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Store Info Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                This information will be displayed on your store page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Store Logo */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-primary-100 rounded-xl flex items-center justify-center text-5xl">
                    {vendor.logo}
                  </div>
                  <div>
                    <Button type="button" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name *</Label>
                  <Input
                    id="storeName"
                    {...register('storeName')}
                    className={errors.storeName ? 'border-red-500' : ''}
                  />
                  {errors.storeName && (
                    <p className="text-sm text-red-500">{errors.storeName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    {...register('storeDescription')}
                    rows={4}
                    placeholder="Tell customers about your store..."
                  />
                  {errors.storeDescription && (
                    <p className="text-sm text-red-500">{errors.storeDescription.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    {...register('contactNumber')}
                    className={errors.contactNumber ? 'border-red-500' : ''}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-500">{errors.contactNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Store Address *</Label>
                  <Textarea
                    id="address"
                    {...register('address')}
                    rows={3}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              {vendor.isVerified ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-700">Verified Seller</p>
                    <p className="text-sm text-green-600">Your store is verified</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-700">Pending Verification</p>
                    <p className="text-sm text-yellow-600">Under review</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Store Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Store Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Products</span>
                <span className="font-semibold">{vendor.totalProducts}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Store Rating</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{vendor.rating}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Member Since</span>
                <span className="font-semibold">{vendor.joinedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Store className="w-4 h-4 mr-2" />
                View Public Store Page
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Share Store Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
