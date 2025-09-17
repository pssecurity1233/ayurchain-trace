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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { 
  Building2, 
  Package, 
  QrCode, 
  TrendingUp,
  Factory,
  Truck,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

const ManufacturerDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('batches');
  const [batches, setBatches] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [manufacturingStats, setManufacturingStats] = useState({
    activeBatches: 0,
    completedBatches: 0,
    qrCodesGenerated: 0,
    recalls: 0
  });
  const [newBatchData, setNewBatchData] = useState({
    species_id: '',
    plannedQuantity: '',
    productType: ''
  });
  const [qrGenerationData, setQrGenerationData] = useState({
    batch_id: '',
    quantity: '',
    productName: ''
  });
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');

  useEffect(() => {
    loadManufacturingData();
  }, []);

  const loadManufacturingData = async () => {
    try {
      // Load batches
      const { data: batchData, error: batchError } = await supabase
        .from('batches')
        .select('*')
        .eq('producer_id', user?.id)
        .order('created_at', { ascending: false });

      if (batchError) throw batchError;

      console.log('Loaded batches:', batchData);
      console.log('Current user ID:', user?.id);
      console.log('Finalized batches:', batchData?.filter(b => b.status === 'finalized'));

      setBatches(batchData || []);

      // Load QR codes
      const { data: qrData, error: qrError } = await supabase
        .from('product_qr')
        .select('*')
        .eq('issued_by', user?.id)
        .order('issued_at', { ascending: false });

      if (qrError) throw qrError;

      setQrCodes(qrData || []);

      // Calculate stats
      const active = batchData?.filter(b => b.status === 'in_progress').length || 0;
      const completed = batchData?.filter(b => b.status === 'completed').length || 0;
      const recalls = batchData?.filter(b => b.status === 'recalled').length || 0;

      setManufacturingStats({
        activeBatches: active,
        completedBatches: completed,
        qrCodesGenerated: qrData?.length || 0,
        recalls
      });
    } catch (error) {
      console.error('Error loading manufacturing data:', error);
    }
  };

  const createNewBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('batches')
        .insert({
          producer_id: user?.id,
          species_id: newBatchData.species_id,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Batch Created",
        description: `New batch ${data.batch_id} has been created successfully.`,
      });

      setNewBatchData({
        species_id: '',
        plannedQuantity: '',
        productType: ''
      });

      loadManufacturingData();
    } catch (error: any) {
      toast({
        title: "Batch Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateQRCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const quantity = parseInt(qrGenerationData.quantity);
      const qrCodesToGenerate = [];

      for (let i = 0; i < quantity; i++) {
        qrCodesToGenerate.push({
          batch_id: qrGenerationData.batch_id,
          qr_id: `QR-${Date.now()}-${i}`,
          issued_by: user?.id,
          collection_event_ids: []
        });
      }

      const { data, error } = await supabase
        .from('product_qr')
        .insert(qrCodesToGenerate)
        .select();

      if (error) throw error;

      toast({
        title: "QR Codes Generated",
        description: `${quantity} QR codes have been generated successfully.`,
      });

      setQrGenerationData({
        batch_id: '',
        quantity: '',
        productName: ''
      });

      loadManufacturingData();
    } catch (error: any) {
      toast({
        title: "QR Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateQRCodeImage = async (qrId: string) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrId, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const handleViewQR = async (qrId: string) => {
    setSelectedQrCode(qrId);
    const imageUrl = await generateQRCodeImage(qrId);
    setQrImageUrl(imageUrl);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalized':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Finalized</Badge>;
      case 'in_progress':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'recalled':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Recalled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const finalizeBatch = async (batchId: string) => {
    try {
      const { error } = await supabase
        .from('batches')
        .update({ 
          status: 'finalized',
          finalized_at: new Date().toISOString()
        })
        .eq('batch_id', batchId);

      if (error) throw error;

      toast({
        title: "Batch Finalized",
        description: "Batch has been marked as completed.",
      });

      loadManufacturingData();
    } catch (error: any) {
      toast({
        title: "Finalization Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Manufacturing <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Batch processing, QR generation, and product management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Active Batches</p>
                  <p className="text-3xl font-bold text-blue-500">{manufacturingStats.activeBatches}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Factory className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Completed Batches</p>
                  <p className="text-3xl font-bold text-green-500">{manufacturingStats.completedBatches}</p>
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
                  <p className="text-sm text-muted-foreground">QR Codes Generated</p>
                  <p className="text-3xl font-bold text-primary">{manufacturingStats.qrCodesGenerated}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Recalls</p>
                  <p className="text-3xl font-bold text-red-500">{manufacturingStats.recalls}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Manufacturing Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="batches">Batches</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="batches" className="space-y-4 mt-4">
                    {batches.map((batch: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Package className="h-4 w-4 text-primary" />
                            <span className="font-semibold">Batch #{batch.batch_id?.slice(-8)}</span>
                            {getStatusBadge(batch.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Species: {batch.species_id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(batch.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {batch.status === 'in_progress' && (
                            <Button 
                              size="sm" 
                              onClick={() => finalizeBatch(batch.batch_id)}
                            >
                              Finalize
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="processing" className="space-y-4 mt-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Processing steps will be tracked here</p>
                      <p className="text-sm">Add processing operations to batches</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="qrcodes" className="space-y-4 mt-4">
                    {qrCodes.slice(0, 10).map((qr: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <QrCode className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{qr.qr_id}</span>
                            <Badge variant="outline">Active</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Batch: {qr.batch_id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Generated: {new Date(qr.issued_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleViewQR(qr.qr_id)}>
                              View QR
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>QR Code: {selectedQrCode}</DialogTitle>
                              <DialogDescription>Scan or download this code to verify product authenticity.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                              {qrImageUrl && (
                                <div className="p-4 bg-white rounded-lg">
                                  <img 
                                    src={qrImageUrl} 
                                    alt={`QR Code for ${selectedQrCode}`}
                                    className="w-64 h-64"
                                  />
                                </div>
                              )}
                              <div className="text-center">
                                <p className="font-semibold">{selectedQrCode}</p>
                                <p className="text-sm text-muted-foreground">
                                  Scan this code to verify product authenticity
                                </p>
                              </div>
                              <Button 
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.download = `${selectedQrCode}.png`;
                                  link.href = qrImageUrl;
                                  link.click();
                                }}
                                className="w-full"
                              >
                                Download QR Code
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Create New Batch */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-primary" />
                  Create New Batch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createNewBatch} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Species</Label>
                    <Select 
                      value={newBatchData.species_id} 
                      onValueChange={(value) => setNewBatchData({ ...newBatchData, species_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ashwagandha">Ashwagandha</SelectItem>
                        <SelectItem value="turmeric">Turmeric</SelectItem>
                        <SelectItem value="brahmi">Brahmi</SelectItem>
                        <SelectItem value="neem">Neem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Planned Quantity (kg)</Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={newBatchData.plannedQuantity}
                      onChange={(e) => setNewBatchData({ ...newBatchData, plannedQuantity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <Select 
                      value={newBatchData.productType} 
                      onValueChange={(value) => setNewBatchData({ ...newBatchData, productType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="powder">Powder</SelectItem>
                        <SelectItem value="capsules">Capsules</SelectItem>
                        <SelectItem value="extract">Extract</SelectItem>
                        <SelectItem value="tablets">Tablets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Batch
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Generate QR Codes */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  Generate QR Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={generateQRCodes} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Batch</Label>
                    <Select 
                      value={qrGenerationData.batch_id} 
                      onValueChange={(value) => setQrGenerationData({ ...qrGenerationData, batch_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.filter(b => b.status === 'finalized').map((batch: any) => (
                          <SelectItem key={batch.batch_id} value={batch.batch_id}>
                            Batch #{batch.batch_id?.slice(-8)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="Product name for QR"
                      value={qrGenerationData.productName}
                      onChange={(e) => setQrGenerationData({ ...qrGenerationData, productName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Number of QR codes"
                      value={qrGenerationData.quantity}
                      onChange={(e) => setQrGenerationData({ ...qrGenerationData, quantity: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Generate QR Codes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;