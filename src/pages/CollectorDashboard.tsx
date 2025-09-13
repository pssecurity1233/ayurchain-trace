import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Leaf, 
  MapPin, 
  Camera, 
  Wifi, 
  WifiOff, 
  Upload,
  TrendingUp,
  Award,
  Clock,
  Smartphone,
  Signal,
  Battery
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CollectorDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);
  const [collectionStats, setCollectionStats] = useState({
    totalCollections: 0,
    thisMonth: 0,
    sustainabilityScore: 0,
    earnings: 0
  });
  const [recentCollections, setRecentCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load stats and recent collections
    loadCollectorData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCollectorData = async () => {
    try {
      // Load collection events for this collector
      const { data: collections, error } = await supabase
        .from('collection_events')
        .select('*')
        .eq('collector_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setRecentCollections(collections || []);
      
      // Calculate stats
      const thisMonth = collections?.filter(c => 
        new Date(c.created_at).getMonth() === new Date().getMonth()
      ).length || 0;

      setCollectionStats({
        totalCollections: collections?.length || 0,
        thisMonth,
        sustainabilityScore: 85, // Mock data
        earnings: 15420 // Mock data
      });
    } catch (error) {
      console.error('Error loading collector data:', error);
    }
  };

  const startNewCollection = () => {
    // In a real app, this would navigate to collection form
    toast({
      title: "Collection Started",
      description: "GPS tracking activated. Ready to collect herbs.",
    });
  };

  const syncOfflineData = async () => {
    try {
      // Mock sync process
      toast({
        title: "Syncing Data",
        description: "Uploading offline collections...",
      });
      
      // Simulate sync delay
      setTimeout(() => {
        setPendingSync(0);
        toast({
          title: "Sync Complete",
          description: "All offline data has been synchronized.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Please try again when connection is stable.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      {/* Mobile-First Header */}
      <div className="bg-gradient-primary rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Welcome back, {profile?.name}</h1>
            <p className="text-white/80 text-sm">Collector Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-300" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-300" />
            )}
            <Battery className="h-5 w-5" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{collectionStats.totalCollections}</div>
            <div className="text-sm text-white/80">Total Collections</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{collectionStats.thisMonth}</div>
            <div className="text-sm text-white/80">This Month</div>
          </div>
        </div>
      </div>

      {/* Offline Mode Banner */}
      {!isOnline && (
        <Card className="mb-4 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline Mode Active</span>
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Data will sync when connection is restored
            </p>
            {pendingSync > 0 && (
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={syncOfflineData}
                  className="text-orange-700 border-orange-300"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Sync {pendingSync} items
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          className="h-20 flex-col gap-2" 
          onClick={startNewCollection}
          size="lg"
        >
          <Leaf className="h-6 w-6" />
          <span className="text-sm">Start Collection</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2" size="lg">
          <Camera className="h-6 w-6" />
          <span className="text-sm">Photo Upload</span>
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{collectionStats.sustainabilityScore}</div>
            <div className="text-xs text-muted-foreground">Sustainability Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">₹{collectionStats.earnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Earnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Collections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Collections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentCollections.length > 0 ? (
            recentCollections.slice(0, 5).map((collection: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{collection.species_id}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location: {collection.latitude?.toFixed(4)}, {collection.longitude?.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(collection.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{collection.quantity_kg}kg</div>
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No collections yet</p>
              <p className="text-sm">Start your first collection to see it here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS/Offline Features */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Offline Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">SMS Updates</div>
              <div className="text-xs text-muted-foreground">Get collection confirmations via SMS</div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">Offline Storage</div>
              <div className="text-xs text-muted-foreground">Store collections locally when offline</div>
            </div>
            <Badge variant="outline">Enabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectorDashboard;