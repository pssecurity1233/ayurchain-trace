import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface ExportCertification {
  id: string;
  batch_id: string;
  certificate_number: string;
  destination_country: string;
  export_date: string;
  expiry_date: string;
  certificate_type: string;
  certification_body: string;
  status: string;
  created_at: string;
}

const ExportCertificationManager = () => {
  const { toast } = useToast();
  const [certifications, setCertifications] = useState<ExportCertification[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    batch_id: '',
    destination_country: '',
    export_date: '',
    certificate_type: 'phytosanitary',
    certification_body: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [certsRes, batchesRes] = await Promise.all([
        supabase.from('export_certifications').select('*').order('created_at', { ascending: false }),
        supabase.from('batches').select('batch_id, species_id, product_name, status').eq('status', 'finalized')
      ]);

      if (certsRes.error) throw certsRes.error;
      if (batchesRes.error) throw batchesRes.error;

      setCertifications(certsRes.data || []);
      setBatches(batchesRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();
      const expiryDate = new Date(formData.export_date);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const { error } = await supabase.from('export_certifications').insert({
        batch_id: formData.batch_id,
        certificate_number: certificateNumber,
        destination_country: formData.destination_country,
        export_date: formData.export_date,
        expiry_date: expiryDate.toISOString().split('T')[0],
        certificate_type: formData.certificate_type,
        certification_body: formData.certification_body,
        verification_code: verificationCode,
        status: 'pending',
        issuer_id: (await supabase.auth.getUser()).data.user?.id || '',
      } as any);

      if (error) throw error;

      toast({
        title: "Certificate Created",
        description: `Export certificate ${certificateNumber} has been created.`,
      });

      setFormData({
        batch_id: '',
        destination_country: '',
        export_date: '',
        certificate_type: 'phytosanitary',
        certification_body: '',
      });
      setIsAdding(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('export_certifications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Certificate status changed to ${newStatus}`,
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pending' },
      issued: { variant: 'default' as const, icon: CheckCircle, label: 'Issued' },
      expired: { variant: 'destructive' as const, icon: XCircle, label: 'Expired' },
      revoked: { variant: 'destructive' as const, icon: XCircle, label: 'Revoked' },
    };

    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Certifications
            </CardTitle>
            <Button onClick={() => setIsAdding(!isAdding)}>
              <Plus className="h-4 w-4 mr-2" />
              Issue Certificate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label>Batch</Label>
                <Select value={formData.batch_id} onValueChange={(value) => setFormData({ ...formData, batch_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.batch_id} value={batch.batch_id}>
                        {batch.product_name || batch.species_id} - {batch.batch_id.slice(0, 8)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Certificate Type</Label>
                  <Select value={formData.certificate_type} onValueChange={(value) => setFormData({ ...formData, certificate_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phytosanitary">Phytosanitary</SelectItem>
                      <SelectItem value="quality">Quality Certificate</SelectItem>
                      <SelectItem value="organic">Organic Certification</SelectItem>
                      <SelectItem value="cites">CITES Permit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Destination Country</Label>
                  <Input
                    value={formData.destination_country}
                    onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                    placeholder="e.g., United States"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Export Date</Label>
                  <Input
                    type="date"
                    value={formData.export_date}
                    onChange={(e) => setFormData({ ...formData, export_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Certification Body</Label>
                  <Input
                    value={formData.certification_body}
                    onChange={(e) => setFormData({ ...formData, certification_body: e.target.value })}
                    placeholder="e.g., APEDA"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Issue Certificate</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{cert.certificate_number}</h3>
                      {getStatusBadge(cert.status)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Type: <span className="font-medium">{cert.certificate_type}</span></div>
                      <div>Destination: <span className="font-medium">{cert.destination_country}</span></div>
                      <div>Export Date: <span className="font-medium">{new Date(cert.export_date).toLocaleDateString()}</span></div>
                      <div>Expires: <span className="font-medium">{new Date(cert.expiry_date).toLocaleDateString()}</span></div>
                      <div>Certifying Body: <span className="font-medium">{cert.certification_body}</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {cert.status === 'pending' && (
                      <Button size="sm" onClick={() => updateStatus(cert.id, 'issued')}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Issue
                      </Button>
                    )}
                    {cert.status === 'issued' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {certifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No export certifications issued</p>
                <p className="text-sm">Issue your first certificate to enable international exports</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportCertificationManager;
