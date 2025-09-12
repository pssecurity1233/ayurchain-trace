import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Users, 
  Shield, 
  MapPin,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Collections',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Leaf,
      color: 'text-primary'
    },
    {
      title: 'Active Collectors',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-accent'
    },
    {
      title: 'Quality Tests',
      value: '1,203',
      change: '+15.1%',
      trend: 'up',
      icon: Shield,
      color: 'text-primary-glow'
    },
    {
      title: 'Products Traced',
      value: '4,521',
      change: '+22.3%',
      trend: 'up',
      icon: Package,
      color: 'text-primary'
    }
  ];

  const recentCollections = [
    {
      id: 'CE001',
      species: 'Ashwagandha',
      collector: 'Ram Singh',
      location: 'Himachal Pradesh',
      quantity: '25.5 kg',
      date: '2024-01-15',
      status: 'verified',
      quality: 'premium'
    },
    {
      id: 'CE002',
      species: 'Turmeric',
      collector: 'Priya Sharma',
      location: 'Karnataka',
      quantity: '18.2 kg',
      date: '2024-01-14',
      status: 'processing',
      quality: 'standard'
    },
    {
      id: 'CE003',
      species: 'Brahmi',
      collector: 'Kiran Patel',
      location: 'Gujarat',
      quantity: '12.8 kg',
      date: '2024-01-13',
      status: 'pending',
      quality: 'premium'
    },
    {
      id: 'CE004',
      species: 'Neem',
      collector: 'Amit Kumar',
      location: 'Rajasthan',
      quantity: '30.1 kg',
      date: '2024-01-12',
      status: 'verified',
      quality: 'commercial'
    }
  ];

  const qualityAlerts = [
    {
      type: 'warning',
      message: 'Heavy metal test pending for Batch #ASH-001',
      time: '2 hours ago'
    },
    {
      type: 'success',
      message: 'Turmeric batch TUR-045 passed all quality tests',
      time: '4 hours ago'
    },
    {
      type: 'error',
      message: 'Collection CE-089 rejected due to contamination',
      time: '6 hours ago'
    }
  ];

  const topCollectors = [
    { name: 'Ram Singh', collections: 89, quality: 98.5, location: 'Himachal Pradesh' },
    { name: 'Priya Sharma', collections: 76, quality: 96.2, location: 'Karnataka' },
    { name: 'Kiran Patel', collections: 65, quality: 97.8, location: 'Gujarat' },
    { name: 'Amit Kumar', collections: 58, quality: 95.1, location: 'Rajasthan' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'processing':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'premium':
        return <Badge variant="default">Premium</Badge>;
      case 'standard':
        return <Badge variant="secondary">Standard</Badge>;
      case 'commercial':
        return <Badge variant="outline">Commercial</Badge>;
      default:
        return <Badge variant="secondary">{quality}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Supply Chain <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage your Ayurvedic herb traceability network
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-medium hover:shadow-large transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Collections */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Recent Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCollections.map((collection, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{collection.species}</span>
                          {getStatusBadge(collection.status)}
                          {getQualityBadge(collection.quality)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {collection.collector}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {collection.location}
                          </span>
                          <span>{collection.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{collection.date}</div>
                        <div className="text-xs">ID: {collection.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Alerts */}
          <div className="space-y-8">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Quality Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityAlerts.map((alert, index) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Collectors */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Collectors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCollectors.map((collector, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{collector.name}</div>
                          <div className="text-xs text-muted-foreground">{collector.location}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{collector.collections}</div>
                        <div className="text-xs text-muted-foreground">{collector.quality}% quality</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Leaf className="h-6 w-6" />
                New Collection
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Shield className="h-6 w-6" />
                Quality Test
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Users className="h-6 w-6" />
                Manage Collectors
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;