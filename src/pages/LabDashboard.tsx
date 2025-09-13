import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FlaskConical, 
  Microscope, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Beaker,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LabDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [testResults, setTestResults] = useState([]);
  const [labStats, setLabStats] = useState({
    pendingTests: 0,
    completedToday: 0,
    passRate: 0,
    avgTurnaround: 0
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [testFormData, setTestFormData] = useState({
    testType: '',
    results: '',
    status: 'completed',
    rejectionReason: ''
  });

  useEffect(() => {
    loadLabData();
  }, []);

  const loadLabData = async () => {
    try {
      // Load quality tests for this lab
      const { data: tests, error } = await supabase
        .from('quality_tests')
        .select(`
          *,
          collection_events (
            species_id,
            quantity_kg,
            collector_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestResults(tests || []);
      
      // Calculate stats - using rejected status since status field doesn't exist
      const pending = tests?.filter(t => !t.rejected && !t.tests).length || 0;
      const completedToday = tests?.filter(t => 
        t.tests && 
        new Date(t.created_at).toDateString() === new Date().toDateString()
      ).length || 0;
      
      const completed = tests?.filter(t => t.tests && Object.keys(t.tests).length > 0) || [];
      const passed = completed.filter(t => !t.rejected).length;
      const passRate = completed.length > 0 ? (passed / completed.length) * 100 : 0;

      setLabStats({
        pendingTests: pending,
        completedToday,
        passRate: Math.round(passRate),
        avgTurnaround: 2.5 // Mock data
      });
    } catch (error) {
      console.error('Error loading lab data:', error);
    }
  };

  const submitTestResults = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTest) return;

    try {
      const updateData = {
        tests: JSON.parse(testFormData.results || '{}'),
        status: testFormData.status,
        rejected: testFormData.status === 'rejected',
        rejection_reason: testFormData.status === 'rejected' ? testFormData.rejectionReason : null,
        conducted_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('quality_tests')
        .update(updateData)
        .eq('id', selectedTest.id);

      if (error) throw error;

      toast({
        title: "Test Results Submitted",
        description: "Quality test results have been recorded successfully.",
      });

      setSelectedTest(null);
      setTestFormData({
        testType: '',
        results: '',
        status: 'completed',
        rejectionReason: ''
      });
      
      loadLabData();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, rejected: boolean) => {
    if (rejected) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    }
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Passed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline"><Beaker className="h-3 w-3 mr-1" />In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'heavy_metals':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'pesticides':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'microbiology':
        return <Microscope className="h-4 w-4 text-blue-500" />;
      default:
        return <FlaskConical className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Laboratory <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Quality testing and certification workflows
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Tests
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pending Tests</p>
                  <p className="text-3xl font-bold text-orange-500">{labStats.pendingTests}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-3xl font-bold text-green-500">{labStats.completedToday}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <p className="text-3xl font-bold text-primary">{labStats.passRate}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg. Turnaround</p>
                  <p className="text-3xl font-bold text-accent">{labStats.avgTurnaround}d</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Test Queue */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  Test Queue Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="space-y-4 mt-4">
                    {testResults.filter(t => t.status === 'pending').map((test: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {getTestTypeIcon('microbiology')}
                            <span className="font-semibold">Sample #{test.sample_id?.slice(-8)}</span>
                            {getStatusBadge(test.status, test.rejected)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Species: {test.collection_events?.species_id || 'Unknown'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Received: {new Date(test.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedTest(test)}
                        >
                          Start Test
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="in_progress" className="space-y-4 mt-4">
                    {testResults.filter(t => t.status === 'in_progress').map((test: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {getTestTypeIcon('pesticides')}
                            <span className="font-semibold">Sample #{test.sample_id?.slice(-8)}</span>
                            {getStatusBadge(test.status, test.rejected)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Started: {new Date(test.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTest(test)}
                        >
                          Complete
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-4">
                    {testResults.filter(t => t.status === 'completed').slice(0, 10).map((test: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {getTestTypeIcon('heavy_metals')}
                            <span className="font-semibold">Sample #{test.sample_id?.slice(-8)}</span>
                            {getStatusBadge(test.status, test.rejected)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Completed: {new Date(test.conducted_at || test.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Test Results Form */}
          <div>
            {selectedTest ? (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" />
                    Test Results Entry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitTestResults} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sample ID</Label>
                      <Input 
                        value={selectedTest.sample_id || ''} 
                        disabled 
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Test Type</Label>
                      <Select 
                        value={testFormData.testType} 
                        onValueChange={(value) => setTestFormData({ ...testFormData, testType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="heavy_metals">Heavy Metals</SelectItem>
                          <SelectItem value="pesticides">Pesticides</SelectItem>
                          <SelectItem value="microbiology">Microbiology</SelectItem>
                          <SelectItem value="identity">Identity Testing</SelectItem>
                          <SelectItem value="purity">Purity Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Test Results (JSON)</Label>
                      <Textarea
                        placeholder='{"lead": "< 2 ppm", "mercury": "< 0.5 ppm"}'
                        value={testFormData.results}
                        onChange={(e) => setTestFormData({ ...testFormData, results: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={testFormData.status} 
                        onValueChange={(value) => setTestFormData({ ...testFormData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Passed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {testFormData.status === 'rejected' && (
                      <div className="space-y-2">
                        <Label>Rejection Reason</Label>
                        <Textarea
                          placeholder="Explain why the sample was rejected..."
                          value={testFormData.rejectionReason}
                          onChange={(e) => setTestFormData({ ...testFormData, rejectionReason: e.target.value })}
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Submit Results
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setSelectedTest(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-medium">
                <CardContent className="p-8 text-center">
                  <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Select a Test</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a test from the queue to enter results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;