import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FlaskConical, 
  Microscope, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Award,
  Search,
  Upload,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface TestResult {
  parameter: string;
  value: string;
  unit: string;
  standard: string;
  status: 'pass' | 'fail' | 'warning';
}

interface QualityTest {
  id: string;
  sampleId: string;
  species: string;
  collector: string;
  receivedDate: string;
  testDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  results: TestResult[];
  overallGrade: string;
  certificateUrl?: string;
}

const Laboratory = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTest, setSelectedTest] = useState<QualityTest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const mockTests: QualityTest[] = [
    {
      id: 'QT001',
      sampleId: 'CE001',
      species: 'Ashwagandha',
      collector: 'Ram Singh',
      receivedDate: '2024-01-16',
      testDate: '2024-01-17',
      status: 'completed',
      overallGrade: 'Premium',
      results: [
        { parameter: 'Moisture Content', value: '8.2', unit: '%', standard: '≤ 10%', status: 'pass' },
        { parameter: 'Total Ash', value: '4.1', unit: '%', standard: '≤ 5%', status: 'pass' },
        { parameter: 'Withanolides', value: '2.8', unit: '%', standard: '≥ 2.5%', status: 'pass' },
        { parameter: 'Heavy Metals (Lead)', value: '0.5', unit: 'ppm', standard: '≤ 2 ppm', status: 'pass' },
        { parameter: 'Pesticide Residue', value: 'ND', unit: '', standard: 'Not Detected', status: 'pass' },
        { parameter: 'Microbial Count', value: '1000', unit: 'CFU/g', standard: '≤ 10000', status: 'pass' }
      ],
      certificateUrl: '/certificates/QT001.pdf'
    },
    {
      id: 'QT002',
      sampleId: 'CE002',
      species: 'Turmeric',
      collector: 'Priya Sharma',
      receivedDate: '2024-01-15',
      testDate: '',
      status: 'in_progress',
      overallGrade: '',
      results: []
    },
    {
      id: 'QT003',
      sampleId: 'CE003',
      species: 'Brahmi',
      collector: 'Kiran Patel',
      receivedDate: '2024-01-14',
      testDate: '',
      status: 'pending',
      overallGrade: '',
      results: []
    }
  ];

  const testParameters = [
    { name: 'Moisture Content', unit: '%', method: 'LOD Method' },
    { name: 'Total Ash', unit: '%', method: 'Gravimetric' },
    { name: 'Active Compounds', unit: '%', method: 'HPLC' },
    { name: 'Heavy Metals', unit: 'ppm', method: 'ICP-MS' },
    { name: 'Pesticide Residue', unit: 'ppm', method: 'GC-MS' },
    { name: 'Microbial Analysis', unit: 'CFU/g', method: 'Plate Count' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary"><FlaskConical className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getResultStatus = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const filteredTests = mockTests.filter(test => 
    test.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.collector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartTest = (testId: string) => {
    toast.success('Test started successfully');
    // Update test status logic would go here
  };

  const handleCompleteTest = (testId: string) => {
    toast.success('Test completed and results recorded on blockchain');
    // Complete test logic would go here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Quality <span className="text-primary">Laboratory</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive testing and certification for Ayurvedic herbs
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Results
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests by species, collector, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Test Queue */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      Pending Tests ({filteredTests.filter(t => t.status === 'pending').length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTests.filter(test => test.status === 'pending').map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{test.species}</span>
                              {getStatusBadge(test.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {test.collector}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Received: {test.receivedDate}
                              </span>
                              <span>ID: {test.id}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setSelectedTest(test)}>
                              View Details
                            </Button>
                            <Button size="sm" onClick={() => handleStartTest(test.id)}>
                              Start Test
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="in_progress" className="mt-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Microscope className="h-5 w-5 text-primary" />
                      Tests In Progress ({filteredTests.filter(t => t.status === 'in_progress').length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTests.filter(test => test.status === 'in_progress').map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{test.species}</span>
                              {getStatusBadge(test.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {test.collector}
                              </span>
                              <span>ID: {test.id}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedTest(test)}>
                              Enter Results
                            </Button>
                            <Button size="sm" onClick={() => handleCompleteTest(test.id)}>
                              Complete Test
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Completed Tests ({filteredTests.filter(t => t.status === 'completed').length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTests.filter(test => test.status === 'completed').map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{test.species}</span>
                              {getStatusBadge(test.status)}
                              <Badge variant="default">{test.overallGrade}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {test.collector}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Tested: {test.testDate}
                              </span>
                              <span>ID: {test.id}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedTest(test)}>
                              View Results
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Certificate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Rejected Tests (0)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      No rejected tests found
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Test Details Sidebar */}
          <div className="space-y-6">
            {selectedTest ? (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-lg">Test Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Sample Information</Label>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Species:</span> {selectedTest.species}</div>
                      <div><span className="font-medium">Sample ID:</span> {selectedTest.sampleId}</div>
                      <div><span className="font-medium">Collector:</span> {selectedTest.collector}</div>
                      <div><span className="font-medium">Received:</span> {selectedTest.receivedDate}</div>
                      {selectedTest.testDate && (
                        <div><span className="font-medium">Tested:</span> {selectedTest.testDate}</div>
                      )}
                    </div>
                  </div>

                  {selectedTest.results.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Test Results</Label>
                      <div className="space-y-2">
                        {selectedTest.results.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                            <div className="flex-1">
                              <div className="font-medium">{result.parameter}</div>
                              <div className="text-muted-foreground">{result.value} {result.unit}</div>
                            </div>
                            {getResultStatus(result.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTest.overallGrade && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Overall Grade:</span>
                        <Badge variant="default">{selectedTest.overallGrade}</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-medium">
                <CardContent className="p-6 text-center text-muted-foreground">
                  <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  Select a test to view details
                </CardContent>
              </Card>
            )}

            {/* Test Parameters Reference */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-lg">Standard Test Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testParameters.map((param, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{param.name}</div>
                      <div className="text-muted-foreground">
                        Unit: {param.unit} | Method: {param.method}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laboratory;