import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, RefreshCw, Key, Search, Users } from 'lucide-react';
import { ResetPasswordDialog } from '@/components/admin/ResetPasswordDialog';
import { toast } from '@/components/ui/use-toast';

interface Restaurant {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function RestaurantUsers() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load restaurants',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handlePasswordResetSuccess = (email: string) => {
    toast({
      title: 'Success',
      description: `Password for ${email} has been reset successfully.`,
    });
  };

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Restaurant Users
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage restaurant accounts and reset passwords
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRestaurants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No restaurants found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">{restaurant.name}</TableCell>
                    <TableCell className="text-gray-600">{restaurant.email}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(restaurant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <ResetPasswordDialog 
                        email={restaurant.email}
                        onSuccess={() => handlePasswordResetSuccess(restaurant.email)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 ml-auto"
                        >
                          <Key className="h-4 w-4" />
                          <span>Reset Password</span>
                        </Button>
                      </ResetPasswordDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <p>• Click "Reset Password" to set a new password for a restaurant</p>
          <p>• The new password will be updated immediately</p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRestaurants}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
}
