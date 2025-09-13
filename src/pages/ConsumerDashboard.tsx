import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Scan, 
  History, 
  MapPin, 
  Leaf, 
  Award,
  Clock,
  Search,
  Camera,
  FileText,
  Star,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ConsumerDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [scanHistory, setScanHistory] = useState([]);
  const [consumerStats, setConsumerStats] = useState({
    totalScans: 0,
    authenticProducts: 0,
    savedProducts: 0,
    rewardPoints: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    loadConsumerData();
  }, []);

  const loadConsumerData = async () => {
    try {
      // Mock data since we don't have a consumer_scans table directly linked to users
      const mockScans = [
        {
          id: '1',
          product_name: 'Organic Ashwagandha Powder',
          brand: 'Pure Ayur',
          scanned_at: new Date(Date.now() - 86400000).toISOString(),
          authenticity: 'verified',
          location: 'Mumbai, India',
          rating: 4.5
        },
        {
          id: '2',
          product_name: 'Turmeric Capsules',
          brand: 'Herbal Life',
          scanned_at: new Date(Date.now() - 172800000).toISOString(),
          authenticity: 'verified',
          location: 'Delhi, India',
          rating: 4.8
        },
        {
          id: '3',
          product_name: 'Brahmi Extract',
          brand: 'Nature\'s Best',
          scanned_at: new Date(Date.now() - 259200000).toISOString(),
          authenticity: 'verified',
          location: 'Bangalore, India',
          rating: 4.3
        }
      ];

      setScanHistory(mockScans);
      
      setConsumerStats({
        totalScans: mockScans.length,
        authenticProducts: mockScans.filter(s => s.authenticity === 'verified').length,
        savedProducts: 2,
        rewardPoints: 150
      });
    } catch (error) {
      console.error('Error loading consumer data:', error);
    }
  };

  const startQRScan = () => {
    setShowScanner(true);
    toast({
      title: "Camera Activated",
      description: "Point your camera at the QR code to scan the product.",
    });
  };

  const mockScanResult = () => {
    // Simulate a successful scan
    const newScan = {
      id: Date.now().toString(),
      product_name: 'Premium Neem Oil',
      brand: 'Organic Herbs Co.',
      scanned_at: new Date().toISOString(),
      authenticity: 'verified',
      location: 'Chennai, India',
      rating: 4.6
    };

    setScanHistory([newScan, ...scanHistory]);
    setConsumerStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      authenticProducts: prev.authenticProducts + 1,
      rewardPoints: prev.rewardPoints + 10
    }));

    setShowScanner(false);
    
    toast({
      title: "Product Verified!",
      description: "This is an authentic Ayurvedic product. +10 reward points earned!",
    });
  };

  const getAuthenticityBadge = (authenticity: string) => {
    switch (authenticity) {
      case 'verified':
        return <Badge className="bg-green-500"><Shield className="h-3 w-3 mr-1" />Authentic</Badge>;
      case 'suspicious':
        return <Badge variant="destructive">Suspicious</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      {/* Header */}
      <div className="bg-gradient-primary rounded-xl p-6 mb-6 text-white">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">Ayurvedic Product Scanner</h1>
          <p className="text-white/80 text-sm">Verify authenticity instantly</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{consumerStats.totalScans}</div>
            <div className="text-sm text-white/80">Products Scanned</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{consumerStats.rewardPoints}</div>
            <div className="text-sm text-white/80">Reward Points</div>
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {!showScanner ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scan the QR code on your Ayurvedic product to verify its authenticity and trace its journey.
              </p>
              <Button onClick={startQRScan} className="w-full" size="lg">
                <Camera className="h-5 w-5 mr-2" />
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="text-white text-xs">Camera View</div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Point your camera at the QR code
              </p>
              <div className="flex gap-2">
                <Button onClick={mockScanResult} className="flex-1">
                  Simulate Scan
                </Button>
                <Button variant="outline" onClick={() => setShowScanner(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, brands, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">{consumerStats.authenticProducts}</div>
            <div className="text-xs text-muted-foreground">Verified Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{consumerStats.savedProducts}</div>
            <div className="text-xs text-muted-foreground">Saved Products</div>
          </CardContent>
        </Card>
      </div>

      {/* Scan History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scanHistory.length > 0 ? (
            scanHistory.map((scan: any) => (
              <div key={scan.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{scan.product_name}</h4>
                      <p className="text-xs text-muted-foreground">{scan.brand}</p>
                    </div>
                    {getAuthenticityBadge(scan.authenticity)}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(scan.rating)}
                    <span className="text-xs text-muted-foreground ml-1">{scan.rating}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(scan.scanned_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {scan.location}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scans yet</p>
              <p className="text-sm">Start scanning products to see your history</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rewards Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rewards & Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">Scan Rewards</div>
              <div className="text-xs text-muted-foreground">Earn points for each verified scan</div>
            </div>
            <Badge variant="outline">10 pts/scan</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">Product Reviews</div>
              <div className="text-xs text-muted-foreground">Get bonus points for detailed reviews</div>
            </div>
            <Badge variant="outline">25 pts/review</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">Authenticity Reports</div>
              <div className="text-xs text-muted-foreground">Help community by reporting suspicious products</div>
            </div>
            <Badge variant="outline">50 pts/report</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerDashboard;