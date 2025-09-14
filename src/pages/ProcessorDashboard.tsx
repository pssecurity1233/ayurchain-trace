import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  ArrowRight, 
  Settings, 
  Timer, 
  Thermometer,
  Droplets,
  Weight,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProcessingStep {
  id: string;
  operation: string;
  parameters: {
    temperature?: number;
    humidity?: number;
    duration?: number;
    pressure?: number;
    [key: string]: any;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  input_batch_ids: string[];
  output_batch_id?: string;
}

interface BatchData {
  id: string;
  batch_id: string;
  status: string;
  total_quantity_kg: number;
  remaining_quantity_kg: number;
  current_location: string;
  traceability_data: any;
}

const ProcessorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('batches');
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [newStep, setNewStep] = useState({
    operation: '',
    temperature: '',
    humidity: '',
    duration: '',
    pressure: '',
    notes: ''
  });
  const [processorStats, setProcessorStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    completedSteps: 0,
    efficiency: 0
  });

  useEffect(() => {
    loadProcessorData();
  }, []);

  const loadProcessorData = async () => {
    try {
      // Load batch data from batches table
      const { data: batchData, error: batchError } = await supabase
        .from('batches')
        .select('*')
        .eq('producer_id', user?.id)
        .order('created_at', { ascending: false });

      if (batchError) throw batchError;
      
      // Transform to match BatchData interface
      const transformedBatches: BatchData[] = (batchData || []).map(batch => ({
        id: batch.batch_id,
        batch_id: batch.batch_id || 'Unknown',
        status: batch.status || 'unknown',
        total_quantity_kg: 100, // Mock data
        remaining_quantity_kg: 80, // Mock data  
        current_location: 'Processing Facility',
        traceability_data: {}
      }));
      
      setBatches(transformedBatches);

      // Load processing steps  
      const { data: stepData, error: stepError } = await supabase
        .from('processing_steps')
        .select('*')
        .eq('processor_id', user?.id)
        .order('created_at', { ascending: false });

      if (stepError) throw stepError;
      
      // Transform to match ProcessingStep interface
      const transformedSteps: ProcessingStep[] = (stepData || []).map(step => ({
        id: step.id,
        operation: step.operation,
        parameters: step.parameters as any,
        status: 'completed' as const,
        input_batch_ids: step.input_batch_ids,
        output_batch_id: step.output_batch_id
      }));
      
      setProcessingSteps(transformedSteps);

      // Calculate stats
      const stats = {
        totalBatches: transformedBatches?.length || 0,
        activeBatches: transformedBatches?.filter(b => b.status === 'processing').length || 0,
        completedSteps: transformedSteps?.length || 0,
        efficiency: Math.round(Math.random() * 20 + 80) // Mock efficiency
      };
      setProcessorStats(stats);

    } catch (error) {
      console.error('Error loading processor data:', error);
      toast({
        title: "Error",
        description: "Failed to load processing data",
        variant: "destructive",
      });
    }
  };

  const handleAddProcessingStep = async () => {
    if (!selectedBatch || !newStep.operation) {
      toast({
        title: "Error",
        description: "Please select a batch and operation type",
        variant: "destructive",
      });
      return;
    }

    try {
      const parameters = {
        temperature: newStep.temperature ? parseFloat(newStep.temperature) : undefined,
        humidity: newStep.humidity ? parseFloat(newStep.humidity) : undefined,
        duration: newStep.duration ? parseInt(newStep.duration) : undefined,
        pressure: newStep.pressure ? parseFloat(newStep.pressure) : undefined,
        notes: newStep.notes
      };

      const { error } = await supabase
        .from('processing_steps')
        .insert({
          processor_id: user?.id,
          batch_id: selectedBatch,
          operation: newStep.operation,
          parameters,
          input_batch_ids: [selectedBatch]
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Processing step added successfully",
      });

      // Reset form
      setNewStep({
        operation: '',
        temperature: '',
        humidity: '',
        duration: '',
        pressure: '',
        notes: ''
      });

      loadProcessorData();
    } catch (error) {
      console.error('Error adding processing step:', error);
      toast({
        title: "Error",
        description: "Failed to add processing step",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'outline' as const, icon: Clock },
      'in_progress': { variant: 'default' as const, icon: Timer },
      'processing': { variant: 'default' as const, icon: Settings },
      'completed': { variant: 'secondary' as const, icon: CheckCircle },
      'failed': { variant: 'destructive' as const, icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const processOperations = [
    'washing',
    'drying',
    'grinding',
    'sieving',
    'mixing',
    'packaging',
    'quality_check',
    'sterilization'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Processing Dashboard</h1>
            <p className="text-muted-foreground">Manage batch processing steps and operations</p>
          </div>
          <Button onClick={loadProcessorData}>
            <Settings className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold">{processorStats.totalBatches}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Processing</p>
                <p className="text-2xl font-bold">{processorStats.activeBatches}</p>
              </div>
              <Timer className="h-8 w-8 text-accent" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Steps Completed</p>
                <p className="text-2xl font-bold">{processorStats.completedSteps}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">{processorStats.efficiency}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-glow" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batches">Batch Management</TabsTrigger>
            <TabsTrigger value="processing">New Processing Step</TabsTrigger>
            <TabsTrigger value="history">Processing History</TabsTrigger>
          </TabsList>

          <TabsContent value="batches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{batch.batch_id}</h3>
                          {getStatusBadge(batch.status)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBatch(batch.id)}
                        >
                          Select for Processing
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Quantity:</span> {batch.total_quantity_kg} kg
                        </div>
                        <div>
                          <span className="font-medium">Remaining:</span> {batch.remaining_quantity_kg} kg
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {batch.current_location}
                        </div>
                      </div>
                    </div>
                  ))}
                  {batches.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No batches available for processing
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Processing Step</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="batch-select">Select Batch</Label>
                      <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose batch to process" />
                        </SelectTrigger>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id}>
                              {batch.batch_id} ({batch.remaining_quantity_kg} kg)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="operation">Processing Operation</Label>
                      <Select value={newStep.operation} onValueChange={(value) => setNewStep({...newStep, operation: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          {processOperations.map((op) => (
                            <SelectItem key={op} value={op}>
                              {op.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="temperature">Temperature (°C)</Label>
                        <div className="relative">
                          <Thermometer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="temperature"
                            type="number"
                            placeholder="25"
                            className="pl-10"
                            value={newStep.temperature}
                            onChange={(e) => setNewStep({...newStep, temperature: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="humidity">Humidity (%)</Label>
                        <div className="relative">
                          <Droplets className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="humidity"
                            type="number"
                            placeholder="60"
                            className="pl-10"
                            value={newStep.humidity}
                            onChange={(e) => setNewStep({...newStep, humidity: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Duration (hours)</Label>
                        <div className="relative">
                          <Timer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="duration"
                            type="number"
                            placeholder="24"
                            className="pl-10"
                            value={newStep.duration}
                            onChange={(e) => setNewStep({...newStep, duration: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="pressure">Pressure (PSI)</Label>
                        <div className="relative">
                          <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pressure"
                            type="number"
                            placeholder="15"
                            className="pl-10"
                            value={newStep.pressure}
                            onChange={(e) => setNewStep({...newStep, pressure: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Processing Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes about this processing step..."
                    value={newStep.notes}
                    onChange={(e) => setNewStep({...newStep, notes: e.target.value})}
                  />
                </div>

                <Button onClick={handleAddProcessingStep} className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Processing Step
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Processing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingSteps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{step.operation.replace('_', ' ').toUpperCase()}</h3>
                        {getStatusBadge('completed')}
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        {step.parameters.temperature && (
                          <div>
                            <span className="font-medium">Temperature:</span> {step.parameters.temperature}°C
                          </div>
                        )}
                        {step.parameters.humidity && (
                          <div>
                            <span className="font-medium">Humidity:</span> {step.parameters.humidity}%
                          </div>
                        )}
                        {step.parameters.duration && (
                          <div>
                            <span className="font-medium">Duration:</span> {step.parameters.duration}h
                          </div>
                        )}
                        {step.parameters.pressure && (
                          <div>
                            <span className="font-medium">Pressure:</span> {step.parameters.pressure} PSI
                          </div>
                        )}
                      </div>
                      {step.parameters.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground">{step.parameters.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {processingSteps.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No processing steps recorded yet
                    </p>
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

export default ProcessorDashboard;