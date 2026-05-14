import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  MapPin, 
  Package, 
  Settings, 
  Edit2, 
  Plus,
  Trash2,
  Loader2,
  Check
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { selectCurrentUser, updateUser } from '../../features/auth/authSlice';
import { profileUpdateSchema, passwordChangeSchema } from '../../lib/validators';
import { getInitials } from '../../lib/utils';
import { sampleUser } from '../../data/dummyData';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const sidebarLinks = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

function ProfileSidebar() {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarFallback className="bg-primary-600 text-white text-2xl">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}

function ProfileDetails() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(updateUser(data));
    setIsEditing(false);
    setIsLoading(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your personal details</CardDescription>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              {isEditing ? (
                <>
                  <Input {...register('name')} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-900">{user?.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-gray-900">{user?.email}</p>
              {isEditing && (
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              {isEditing ? (
                <>
                  <Input {...register('phone')} />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <Badge variant="outline" className="capitalize">{user?.role}</Badge>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function AddressesSection() {
  const addresses = sampleUser.addresses;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>Manage your delivery addresses</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="p-4 border rounded-lg relative"
          >
            {address.isDefault && (
              <Badge className="absolute top-4 right-4" variant="secondary">
                Default
              </Badge>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{address.fullName}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {address.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Phone: {address.phone}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm">
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              {!address.isDefault && (
                <>
                  <Button variant="outline" size="sm">
                    <Check className="w-3 h-3 mr-1" />
                    Set Default
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SettingsSection() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsChangingPassword(false);
    reset();
    toast.success('Password changed successfully!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" {...register('currentPassword')} />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" {...register('newPassword')} />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" {...register('confirmNewPassword')} />
                {errors.confirmNewPassword && (
                  <p className="text-sm text-red-500">{errors.confirmNewPassword.message}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsChangingPassword(true)}>
              Change Password
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-gray-500">Receive notifications about your orders</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Promotional Emails</p>
              <p className="text-sm text-gray-500">Receive offers and deals</p>
            </div>
            <Badge variant="outline">Disabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Breadcrumbs items={[{ label: 'My Profile' }]} className="mb-6" />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route index element={<ProfileDetails />} />
              <Route path="addresses" element={<AddressesSection />} />
              <Route path="settings" element={<SettingsSection />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
