import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Camera, 
  Scan, 
  Leaf, 
  MapPin, 
  Calendar, 
  User, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  History,
  FlaskConical,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BrowserMultiFormatReader } from '@zxing/library';

interface ProvenanceData {
  productId: string;
  productName: string;
  species: {
    scientific: string;
    common: string;
  };
  collection: {
    collector: string;
    location: string;
    date: string;
    coordinates: [number, number];
    quantity: number;
  };
  quality: {
    tested: boolean;
    lab: string;
    purity: number;
    certificates: string[];
  };
  processing: {
    facility: string;
    date: string;
    method: string;
  };
  blockchain: {
    txHash: string;
    verified: boolean;
  };
}

const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [provenanceData, setProvenanceData] = useState<ProvenanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  // Mock data for demonstration
  const mockProvenanceData: ProvenanceData = {
    productId: 'ASH-001-2024-001',
    productName: 'Premium Ashwagandha Root Powder',
    species: {
      scientific: 'Withania somnifera',
      common: 'Ashwagandha'
    },
    collection: {
      collector: 'Ram Singh (Verified)',
      location: 'Himachal Pradesh, India',
      date: '2024-01-15',
      coordinates: [31.1048, 77.1734],
      quantity: 25.5
    },
    quality: {
      tested: true,
      lab: 'Ayurvedic Testing Lab, Delhi',
      purity: 98.5,
      certificates: ['NABL Certified', 'Organic Certificate', 'Heavy Metals Test']
    },
    processing: {
      facility: 'Green Valley Processing Unit',
      date: '2024-01-20',
      method: 'Traditional Sun Drying'
    },
    blockchain: {
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
      verified: true
    }
  };

  const handleScan = async () => {
    const code = qrInput.trim();
    handleScanWithCode(code);
  };


  const startCameraScanning = async () => {
    setShowCameraDialog(true);
    setScanning(true);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Initialize QR code reader
        codeReaderRef.current = new BrowserMultiFormatReader();
        
        // Start scanning
        codeReaderRef.current.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, error) => {
            if (result) {
              const qrCode = result.getText();
              stopCameraScanning();
              setQrInput(qrCode);
              toast.success('QR Code detected!');
              handleScanWithCode(qrCode);
            }
          }
        );
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Unable to access camera. Please check permissions.');
      stopCameraScanning();
    }
  };

  const stopCameraScanning = () => {
    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    // Reset code reader
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }

    setScanning(false);
    setShowCameraDialog(false);
  };

  const handleScanWithCode = async (code: string) => {
    // Validate input
    if (!code || code.trim() === '') {
      toast.error('Please enter a QR code or product ID');
      return;
    }

    const trimmedCode = code.trim().toUpperCase();
    
    // Validate QR code format (basic validation)
    if (trimmedCode.length < 3 || trimmedCode.length > 100) {
      toast.error('Invalid QR code format. Please check and try again.');
      return;
    }

    setLoading(true);

    try {
      // Try product_qr table first (primary lookup)
      const { data: pq, error: pqError } = await supabase
        .from('product_qr')
        .select('*')
        .eq('qr_id', trimmedCode)
        .maybeSingle();

      if (pqError) {
        console.error('Product QR lookup error:', pqError);
      }

      if (pq) {
        // Fetch batch details
        const { data: batch, error: batchError } = await supabase
          .from('batches')
          .select('*')
          .eq('batch_id', pq.batch_id)
          .maybeSingle();

        if (batchError) {
          console.error('Batch lookup error:', batchError);
        }

        // Fetch collection events if available
        let collectionEvent: any = null;
        if (pq.collection_event_ids && pq.collection_event_ids.length > 0) {
          const { data: col } = await supabase
            .from('collection_events')
            .select('*')
            .in('id', pq.collection_event_ids as string[])
            .limit(1);
          collectionEvent = col?.[0] ?? null;
        }

        // Fetch processing steps
        const { data: steps } = await supabase
          .from('processing_steps')
          .select('*')
          .eq('batch_id', pq.batch_id)
          .order('created_at', { ascending: false })
          .limit(1);
        const step = steps?.[0] ?? null;

        // Fetch species info
        const { data: speciesData } = await supabase
          .from('species')
          .select('*')
          .eq('id', batch?.species_id)
          .maybeSingle();

        const pd: ProvenanceData = {
          productId: pq.qr_id,
          productName: batch?.product_name || (speciesData?.common_name ? `${speciesData.common_name} Product` : 'Ayurvedic Product'),
          species: {
            scientific: speciesData?.scientific_name || batch?.species_id || 'N/A',
            common: speciesData?.common_name || batch?.species_id || 'N/A',
          },
          collection: {
            collector: collectionEvent?.collector_id || 'Verified Collector',
            location: collectionEvent ? `Lat: ${collectionEvent.latitude}, Lon: ${collectionEvent.longitude}` : 'N/A',
            date: (collectionEvent?.timestamp as string) || (batch?.created_at as string) || new Date().toISOString(),
            coordinates: [
              collectionEvent?.latitude ?? 0,
              collectionEvent?.longitude ?? 0,
            ],
            quantity: Number(collectionEvent?.quantity_kg ?? batch?.total_quantity_kg ?? 0),
          },
          quality: {
            tested: batch?.quality_grade != null,
            lab: 'Certified Testing Laboratory',
            purity: Number(batch?.quality_grade ?? 0),
            certificates: batch?.quality_grade ? ['Quality Certified', 'Lab Tested'] : [],
          },
          processing: {
            facility: step?.processor_id || 'Processing Facility',
            date: (step?.created_at as string) || new Date().toISOString(),
            method: step?.operation || 'Traditional Processing',
          },
          blockchain: {
            txHash: batch?.blockchain_tx_hash || pq.blockchain_tx_hash || 'N/A',
            verified: Boolean(batch?.blockchain_tx_hash || pq.blockchain_tx_hash),
          },
        };

        setProvenanceData(pd);
        toast.success('✓ Product verified and authenticated!');
        return;
      }

      // Fallback: Try batches table directly by QR code
      const { data: batchByQR, error: batchQRError } = await supabase
        .from('batches')
        .select('*')
        .eq('qr_code', trimmedCode)
        .maybeSingle();

      if (batchQRError) {
        console.error('Batch QR lookup error:', batchQRError);
      }

      if (batchByQR) {
        const { data: steps } = await supabase
          .from('processing_steps')
          .select('*')
          .eq('batch_id', batchByQR.batch_id)
          .order('created_at', { ascending: false })
          .limit(1);
        const step = steps?.[0] ?? null;

        const { data: speciesData } = await supabase
          .from('species')
          .select('*')
          .eq('id', batchByQR.species_id)
          .maybeSingle();

        const pd: ProvenanceData = {
          productId: trimmedCode,
          productName: batchByQR.product_name || (speciesData?.common_name ? `${speciesData.common_name} Product` : 'Ayurvedic Product'),
          species: {
            scientific: speciesData?.scientific_name || batchByQR.species_id || 'N/A',
            common: speciesData?.common_name || batchByQR.species_id || 'N/A',
          },
          collection: {
            collector: 'Verified Collector',
            location: 'N/A',
            date: new Date(batchByQR.created_at || new Date().toISOString()).toISOString(),
            coordinates: [0, 0],
            quantity: Number(batchByQR.total_quantity_kg ?? 0),
          },
          quality: {
            tested: batchByQR.quality_grade != null,
            lab: 'Certified Testing Laboratory',
            purity: Number(batchByQR.quality_grade ?? 0),
            certificates: batchByQR.quality_grade ? ['Quality Certified'] : [],
          },
          processing: {
            facility: step?.processor_id || 'Processing Facility',
            date: (step?.created_at as string) || new Date().toISOString(),
            method: step?.operation || 'Traditional Processing',
          },
          blockchain: {
            txHash: batchByQR.blockchain_tx_hash || 'N/A',
            verified: Boolean(batchByQR.blockchain_tx_hash),
          },
        };

        setProvenanceData(pd);
        toast.success('✓ Product verified and authenticated!');
        return;
      }

      // Demo mode
      if (trimmedCode === 'DEMO') {
        setProvenanceData(mockProvenanceData);
        toast.success('✓ Demo product loaded successfully!');
        return;
      }

      // Product not found - provide helpful message
      toast.error(
        'Product not found. Please check the QR code or try scanning again. ' +
        'Available test codes: AYR-2025-100000 through AYR-2025-100004, or type "DEMO"',
        { duration: 6000 }
      );
      setProvenanceData(null);
    } catch (err) {
      console.error('Scan error:', err);
      toast.error('Verification failed. Please check your connection and try again.');
      setProvenanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraScan = () => {
    startCameraScanning();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Scan <span className="text-primary">Ayurvedic Product</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify the authenticity and trace the complete journey of your Ayurvedic herbs 
            from farm to pharmacy using our blockchain-powered system.
          </p>
        </div>

        {/* Scanner Section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-primary" />
              Product Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={handleCameraScan}
                disabled={scanning}
                size="lg"
                className="h-16 text-lg"
              >
                <Camera className="h-6 w-6 mr-2" />
                {scanning ? 'Scanning...' : 'Scan with Camera'}
              </Button>
              
              <div className="space-y-2">
                <Label htmlFor="qr-input">Or enter QR code / Product ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="qr-input"
                    placeholder="Try: AYR-2025-100000 or DEMO"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                    className="font-mono"
                  />
                  <Button onClick={handleScan} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Camera Scanner Dialog */}
        <Dialog open={showCameraDialog} onOpenChange={(open) => {
          if (!open) stopCameraScanning();
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Scan QR Code</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={stopCameraScanning}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  playsInline
                />
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-4 border-primary rounded-lg animate-pulse" />
                  </div>
                )}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Position the QR code within the frame to scan
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Provenance Results */}
        {provenanceData && (
          <div className="space-y-6">
            {/* Product Info */}
            <Card className="shadow-medium animate-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{provenanceData.productName}</h2>
                    <p className="text-muted-foreground">
                      <em>{provenanceData.species.scientific}</em> ({provenanceData.species.common})
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      ID: {provenanceData.productId}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {provenanceData.blockchain.verified ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Collected</div>
                    <div className="text-sm text-muted-foreground">{formatDate(provenanceData.collection.date)}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <FlaskConical className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="font-semibold">Purity</div>
                    <div className="text-sm text-muted-foreground">{provenanceData.quality.purity}%</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <MapPin className="h-8 w-8 text-primary-glow mx-auto mb-2" />
                    <div className="font-semibold">Origin</div>
                    <div className="text-sm text-muted-foreground">{provenanceData.collection.location}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Blockchain</div>
                    <div className="text-sm text-muted-foreground">Secured</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Journey Timeline */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Complete Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Collection */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Leaf className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Collection</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Collector:</span> {provenanceData.collection.collector}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(provenanceData.collection.date)}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {provenanceData.collection.location}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {provenanceData.collection.quantity} kg
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Quality Testing */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Quality Testing</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Laboratory:</span> {provenanceData.quality.lab}
                      </div>
                      <div>
                        <span className="font-medium">Purity:</span> {provenanceData.quality.purity}%
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium">Certificates:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {provenanceData.quality.certificates.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Processing */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-glow text-primary-foreground flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Processing</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Facility:</span> {provenanceData.processing.facility}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(provenanceData.processing.date)}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium">Method:</span> {provenanceData.processing.method}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Blockchain */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Blockchain Verification</h3>
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium">Transaction Hash:</span>
                        <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                          {provenanceData.blockchain.txHash}
                        </code>
                      </div>
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Blockchain Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => setProvenanceData(null)}>
                Scan Another Product
              </Button>
              <Button>
                View Full Report
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;