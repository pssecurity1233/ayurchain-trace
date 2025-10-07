import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Database, 
  Activity,
  Settings,
  UserCheck,
  UserX,
  Zap,
  Globe,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  last_login?: string;
  verification_status: string;
}

interface SystemMetric {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
}

interface BlockchainTransaction {
  id: string;
  type: string;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  entity: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUserRole, setSelectedUserRole] = useState<string>('all');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [blockchainTxs, setBlockchainTxs] = useState<BlockchainTransaction[]>([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockchainTxs: 0,
    systemHealth: 98
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Load user profiles with roles from user_roles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          name,
          created_at,
          last_login,
          verification_status,
          is_verified
        `)
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // Fetch roles for all users
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Create a map of user_id to role
      const userRolesMap = new Map<string, string>();
      (rolesData || []).forEach(ur => {
        if (!userRolesMap.has(ur.user_id)) {
          userRolesMap.set(ur.user_id, ur.role);
        }
      });

      // Transform profile data to UserData format
      const transformedUsers: UserData[] = (profileData || []).map(profile => ({
        id: profile.user_id,
        name: profile.name || 'Unknown',
        email: `user-${profile.user_id.slice(0, 8)}@ayurtrace.com`, // Mock email
        role: userRolesMap.get(profile.user_id) || 'user',
        status: profile.is_verified ? 'active' : 'pending',
        created_at: profile.created_at,
        last_login: profile.last_login,
        verification_status: profile.verification_status
      }));

      setUsers(transformedUsers);

      // Load system metrics
      const metrics: SystemMetric[] = [
        {
          name: 'Total Collections',
          value: '2,847',
          change: '+12%',
          trend: 'up',
          icon: Database
        },
        {
          name: 'Quality Tests',
          value: '1,523',
          change: '+8%',
          trend: 'up',
          icon: Activity
        },
        {
          name: 'QR Codes Generated',
          value: '5,672',
          change: '+15%',
          trend: 'up',
          icon: Zap
        },
        {
          name: 'System Uptime',
          value: '99.9%',
          change: '0%',
          trend: 'stable',
          icon: Globe
        }
      ];
      setSystemMetrics(metrics);

      // Mock blockchain transactions
      const mockTxs: BlockchainTransaction[] = [
        {
          id: '1',
          type: 'Collection Event',
          hash: '0x1a2b3c4d...',
          status: 'confirmed',
          timestamp: '2024-01-15T10:30:00Z',
          entity: 'Green Valley Collector'
        },
        {
          id: '2',
          type: 'Quality Test',
          hash: '0x5e6f7g8h...',
          status: 'pending',
          timestamp: '2024-01-15T11:45:00Z',
          entity: 'Ayur Labs'
        },
        {
          id: '3',
          type: 'Batch Processing',
          hash: '0x9i0j1k2l...',
          status: 'confirmed',
          timestamp: '2024-01-15T09:15:00Z',
          entity: 'Pure Processing Co.'
        }
      ];
      setBlockchainTxs(mockTxs);

      // Calculate stats
      const activeCount = transformedUsers.filter(u => u.status === 'active').length;
      const stats = {
        totalUsers: transformedUsers.length,
        activeUsers: activeCount,
        blockchainTxs: mockTxs.length,
        systemHealth: 98
      };
      setAdminStats(stats);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    }
  };

  const handleUserStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_verified: newStatus === 'active',
          verification_status: newStatus === 'active' ? 'verified' : 'suspended'
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      });

      loadAdminData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      'active': { variant: 'default' as const, icon: CheckCircle },
      'inactive': { variant: 'secondary' as const, icon: UserX },
      'pending': { variant: 'outline' as const, icon: Clock },
      'confirmed': { variant: 'default' as const, icon: CheckCircle },
      'failed': { variant: 'destructive' as const, icon: AlertTriangle }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <Badge variant={statusConfig.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredUsers = selectedUserRole === 'all' 
    ? users 
    : users.filter(user => user.role === selectedUserRole);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System administration and management console</p>
          </div>
          <Button onClick={loadAdminData}>
            <Settings className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{adminStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{adminStats.activeUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blockchain Txs</p>
                <p className="text-2xl font-bold">{adminStats.blockchainTxs}</p>
              </div>
              <LinkIcon className="h-8 w-8 text-accent" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold">{adminStats.systemHealth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-glow" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemMetrics.map((metric, index) => {
                      const Icon = metric.icon;
                      return (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{metric.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{metric.value}</div>
                            <div className={`text-sm ${
                              metric.trend === 'up' ? 'text-green-600' : 
                              metric.trend === 'down' ? 'text-red-600' : 
                              'text-muted-foreground'
                            }`}>
                              {metric.change}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New collector registration approved</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Quality test results uploaded</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Batch processing step completed</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">QR codes generated for new batch</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="collector">Collectors</SelectItem>
                      <SelectItem value="processor">Processors</SelectItem>
                      <SelectItem value="manufacturer">Manufacturers</SelectItem>
                      <SelectItem value="lab">Labs</SelectItem>
                      <SelectItem value="consumer">Consumers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.status)}
                          <div className="flex gap-1">
                            {user.status !== 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserStatusChange(user.id, 'active')}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                            {user.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserStatusChange(user.id, 'inactive')}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Email:</span> {user.email}
                        </div>
                        <div>
                          <span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Login:</span> {
                            user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No users found for the selected role
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Blockchain Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blockchainTxs.map((tx) => (
                    <div key={tx.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{tx.type}</h3>
                          {getStatusBadge(tx.status)}
                        </div>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {tx.hash}
                        </code>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Entity:</span> {tx.entity}
                        </div>
                        <div>
                          <span className="font-medium">Timestamp:</span> {new Date(tx.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Analytics chart placeholder</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Performance metrics placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;