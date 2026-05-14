import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { vendors } from '../../data/dummyData';
import { toast } from 'sonner';

export default function AdminVendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const pendingVendors = vendors.filter(v => !v.isVerified);
  const approvedVendors = vendors.filter(v => v.isVerified);

  const handleApprove = (vendor) => {
    toast.success(`${vendor.storeName} has been approved`);
    setDialogOpen(false);
  };

  const handleReject = (vendor) => {
    toast.success(`${vendor.storeName} has been rejected`);
    setDialogOpen(false);
    setRejectReason('');
  };

  const VendorCard = ({ vendor, showActions = false }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-3xl">
            {vendor.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{vendor.storeName}</h3>
              {vendor.isVerified && (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-2">{vendor.address}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{vendor.storeDescription}</p>
            
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-gray-500">
                📞 {vendor.contactNumber}
              </span>
              <span className="text-sm text-gray-500">
                📦 {vendor.totalProducts} products
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                ⭐ {vendor.rating}
              </span>
            </div>
          </div>
          
          {showActions ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleApprove(vendor)}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setSelectedVendor(vendor);
                  setDialogOpen(true);
                }}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-gray-500">Manage and approve vendor registrations</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold">{approvedVendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{pendingVendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">
                  {vendors.reduce((sum, v) => sum + v.totalProducts, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Vendors ({vendors.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingVendors.length})
              </TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedVendors.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {vendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingVendors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No pending vendor applications
                </div>
              ) : (
                pendingVendors.map(vendor => (
                  <VendorCard key={vendor.id} vendor={vendor} showActions />
                ))
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedVendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vendor Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to reject {selectedVendor?.storeName}? 
              Please provide a reason.
            </p>
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleReject(selectedVendor)}
              disabled={!rejectReason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
