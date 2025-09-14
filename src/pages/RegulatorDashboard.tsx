import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// DatePickerWithRange component removed - not available
import { 
  Shield, 
  MapPin, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  TrendingUp,
  Users,
  Package,
  BarChart3,
  Calendar,
  Clock,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ComplianceData {
  id: string;
  entity_name: string;
  entity_type: 'collector' | 'processor' | 'manufacturer' | 'lab';
  compliance_score: number;
  last_audit: string;
  violations: number;
  status: 'compliant' | 'warning' | 'non_compliant';
  location: string;
  license_expiry: string;
}

interface AuditReport {
  id: string;
  audit_date: string;
  entity_name: string;
  findings: string[];
  score: number;
  auditor: string;
  status: 'draft' | 'final' | 'published';
}

const RegulatorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [complianceData, setComplianceData] = useState<ComplianceData[]>([]);
  const [auditReports, setAuditReports] = useState<AuditReport[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [regulatorStats, setRegulatorStats] = useState({
    totalEntities: 0,
    compliantEntities: 0,
    pendingAudits: 0,
    complianceRate: 0
  });

  useEffect(() => {
    loadRegulatorData();
  }, []);

  const loadRegulatorData = async () => {
    try {
      // Load compliance data - mock data for now
      const mockComplianceData: ComplianceData[] = [
        {
          id: '1',
          entity_name: 'Green Valley Herbs',
          entity_type: 'collector',
          compliance_score: 85,
          last_audit: '2024-01-15',
          violations: 2,
          status: 'warning',
          location: 'Himachal Pradesh',
          license_expiry: '2024-12-31'
        },
        {
          id: '2',
          entity_name: 'Pure Processing Co.',
          entity_type: 'processor',
          compliance_score: 95,
          last_audit: '2024-02-01',
          violations: 0,
          status: 'compliant',
          location: 'Kerala',
          license_expiry: '2025-06-30'
        },
        {
          id: '3',
          entity_name: 'Ayur Labs Pvt Ltd',
          entity_type: 'lab',
          compliance_score: 92,
          last_audit: '2024-01-20',
          violations: 1,
          status: 'compliant',
          location: 'Karnataka',
          license_expiry: '2025-03-15'
        },
        {
          id: '4',
          entity_name: 'Heritage Medicines',
          entity_type: 'manufacturer',
          compliance_score: 78,
          last_audit: '2023-12-10',
          violations: 4,
          status: 'non_compliant',
          location: 'Tamil Nadu',
          license_expiry: '2024-08-20'
        }
      ];

      setComplianceData(mockComplianceData);

      // Mock audit reports
      const mockAuditReports: AuditReport[] = [
        {
          id: '1',
          audit_date: '2024-01-15',
          entity_name: 'Green Valley Herbs',
          findings: ['Incomplete documentation', 'Minor storage issues'],
          score: 85,
          auditor: 'Regulatory Officer A',
          status: 'final'
        },
        {
          id: '2',
          audit_date: '2024-02-01',
          entity_name: 'Pure Processing Co.',
          findings: ['Excellent compliance'],
          score: 95,
          auditor: 'Regulatory Officer B',
          status: 'published'
        }
      ];

      setAuditReports(mockAuditReports);

      // Calculate stats
      const compliant = mockComplianceData.filter(e => e.status === 'compliant').length;
      const stats = {
        totalEntities: mockComplianceData.length,
        compliantEntities: compliant,
        pendingAudits: 3,
        complianceRate: Math.round((compliant / mockComplianceData.length) * 100)
      };
      setRegulatorStats(stats);

    } catch (error) {
      console.error('Error loading regulator data:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance data",
        variant: "destructive",
      });
    }
  };

  const getComplianceStatusBadge = (status: string, score: number) => {
    const config = {
      'compliant': { variant: 'default' as const, icon: CheckCircle, color: 'bg-green-500' },
      'warning': { variant: 'secondary' as const, icon: AlertTriangle, color: 'bg-yellow-500' },
      'non_compliant': { variant: 'destructive' as const, icon: AlertTriangle, color: 'bg-red-500' }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.warning;
    const Icon = statusConfig.icon;
    
    return (
      <div className="flex items-center gap-2">
        <Badge variant={statusConfig.variant}>
          <Icon className="h-3 w-3 mr-1" />
          {status.replace('_', ' ').toUpperCase()}
        </Badge>
        <span className="text-sm font-medium">{score}%</span>
      </div>
    );
  };

  const filteredComplianceData = selectedEntityType === 'all' 
    ? complianceData 
    : complianceData.filter(entity => entity.entity_type === selectedEntityType);

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Compliance report has been generated and will be available for download shortly.",
    });
  };

  const scheduleAudit = () => {
    toast({
      title: "Audit Scheduled",
      description: "New audit has been scheduled successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Regulatory Dashboard</h1>
            <p className="text-muted-foreground">Monitor compliance and manage regulatory oversight</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateReport}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button onClick={scheduleAudit}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entities</p>
                <p className="text-2xl font-bold">{regulatorStats.totalEntities}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliant Entities</p>
                <p className="text-2xl font-bold">{regulatorStats.compliantEntities}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Audits</p>
                <p className="text-2xl font-bold">{regulatorStats.pendingAudits}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{regulatorStats.complianceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-glow" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Compliance Overview</TabsTrigger>
            <TabsTrigger value="map">Geographic View</TabsTrigger>
            <TabsTrigger value="audits">Audit Reports</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Entity Compliance Status</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="collector">Collectors</SelectItem>
                        <SelectItem value="processor">Processors</SelectItem>
                        <SelectItem value="manufacturer">Manufacturers</SelectItem>
                        <SelectItem value="lab">Laboratories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredComplianceData.map((entity) => (
                    <div key={entity.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{entity.entity_name}</h3>
                          <Badge variant="outline">{entity.entity_type}</Badge>
                        </div>
                        {getComplianceStatusBadge(entity.status, entity.compliance_score)}
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Location:</span> {entity.location}
                        </div>
                        <div>
                          <span className="font-medium">Last Audit:</span> {entity.last_audit}
                        </div>
                        <div>
                          <span className="font-medium">Violations:</span> {entity.violations}
                        </div>
                        <div>
                          <span className="font-medium">License Expires:</span> {entity.license_expiry}
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Compliance View
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Globe className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Interactive Compliance Map</h3>
                      <p className="text-muted-foreground">
                        Geographic visualization of entity compliance status across regions
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold">Compliant</div>
                    <div className="text-sm text-muted-foreground">Good standing</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold">Warning</div>
                    <div className="text-sm text-muted-foreground">Needs attention</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                    <div className="font-semibold">Non-Compliant</div>
                    <div className="text-sm text-muted-foreground">Immediate action</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{report.entity_name}</h3>
                          <Badge variant={report.status === 'published' ? 'default' : 'outline'}>
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Score: {report.score}%</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium">Audit Date:</span> {report.audit_date}
                        </div>
                        <div>
                          <span className="font-medium">Auditor:</span> {report.auditor}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Key Findings:</span>
                        <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                          {report.findings.map((finding, index) => (
                            <li key={index}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Compliance Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceData
                    .filter(entity => entity.violations > 0)
                    .map((entity) => (
                    <div key={entity.id} className="border rounded-lg p-4 border-red-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{entity.entity_name}</h3>
                          <Badge variant="destructive">
                            {entity.violations} Violation{entity.violations !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Type:</span> {entity.entity_type}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {entity.location}
                        </div>
                        <div>
                          <span className="font-medium">Compliance Score:</span> {entity.compliance_score}%
                        </div>
                      </div>
                    </div>
                  ))}
                  {complianceData.filter(entity => entity.violations > 0).length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">No Active Violations</h3>
                      <p className="text-muted-foreground">All entities are currently in compliance</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RegulatorDashboard;