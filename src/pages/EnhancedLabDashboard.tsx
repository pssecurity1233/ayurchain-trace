import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileText, CheckCircle2, XCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function EnhancedLabDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batch_id: '',
    sample_id: '',
    moisture_percent: '',
    pesticide_level: '',
    heavy_metals: '',
    dna_barcoding: '',
    additional_tests: '',
    notes: '',
    passed: true
  });

  useEffect(() => {
    if (user) {
      fetchBatches();
      fetchTests();
    }
  }, [user]);

  const fetchBatches = async () => {
    const { data } = await supabase
      .from('batches')
      .select('*')
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false });
    
    if (data) setBatches(data);
  };

  const fetchTests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('quality_tests')
      .select(`
        *,
        batches(batch_id, species_id, product_name)
      `)
      .order('created_at', { ascending: false });

    if (data) setTests(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const testsData = {
      moisture_percent: parseFloat(formData.moisture_percent) || null,
      pesticide_level: parseFloat(formData.pesticide_level) || null,
      heavy_metals: formData.heavy_metals || null,
      dna_barcoding: formData.dna_barcoding || null,
      additional_tests: formData.additional_tests || null
    };

    const { error } = await supabase
      .from('quality_tests')
      .insert({
        batch_id: formData.batch_id,
        sample_id: formData.sample_id,
        lab_id: user!.id,
        tests: testsData,
        rejected: !formData.passed,
        rejection_reason: !formData.passed ? formData.notes : null
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit test results",
        variant: "destructive"
      });
    } else {
      // Update batch status based on test results
      if (!formData.passed) {
        await supabase
          .from('batches')
          .update({ status: 'rejected' })
          .eq('batch_id', formData.batch_id);
      }

      toast({
        title: "Success",
        description: "Test results submitted successfully"
      });
      
      setShowForm(false);
      setFormData({
        batch_id: '',
        sample_id: '',
        moisture_percent: '',
        pesticide_level: '',
        heavy_metals: '',
        dna_barcoding: '',
        additional_tests: '',
        notes: '',
        passed: true
      });
      fetchTests();
      fetchBatches();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Laboratory Testing Portal</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Test Results
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quality Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Select Batch</Label>
                    <Select 
                      value={formData.batch_id}
                      onValueChange={(value) => setFormData({...formData, batch_id: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.batch_id} value={batch.batch_id}>
                            {batch.product_name || batch.species_id} - {batch.batch_id.substring(0, 8)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Sample ID</Label>
                    <Input
                      value={formData.sample_id}
                      onChange={(e) => setFormData({...formData, sample_id: e.target.value})}
                      placeholder="SAMPLE-2025-001"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Moisture Content (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.moisture_percent}
                      onChange={(e) => setFormData({...formData, moisture_percent: e.target.value})}
                      placeholder="12.5"
                    />
                  </div>

                  <div>
                    <Label>Pesticide Level (ppm)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.pesticide_level}
                      onChange={(e) => setFormData({...formData, pesticide_level: e.target.value})}
                      placeholder="0.05"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Heavy Metals</Label>
                    <Input
                      value={formData.heavy_metals}
                      onChange={(e) => setFormData({...formData, heavy_metals: e.target.value})}
                      placeholder="Lead: <0.1ppm, Arsenic: <0.1ppm"
                    />
                  </div>

                  <div>
                    <Label>DNA Barcoding Result</Label>
                    <Input
                      value={formData.dna_barcoding}
                      onChange={(e) => setFormData({...formData, dna_barcoding: e.target.value})}
                      placeholder="Species confirmed: 99.8% match"
                    />
                  </div>
                </div>

                <div>
                  <Label>Additional Tests</Label>
                  <Textarea
                    value={formData.additional_tests}
                    onChange={(e) => setFormData({...formData, additional_tests: e.target.value})}
                    placeholder="Microbial count, Aflatoxin levels, etc."
                  />
                </div>

                <div>
                  <Label>Test Result</Label>
                  <Select 
                    value={formData.passed.toString()}
                    onValueChange={(value) => setFormData({...formData, passed: value === 'true'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">✅ Passed - Quality Standards Met</SelectItem>
                      <SelectItem value="false">❌ Failed - Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!formData.passed && (
                  <div>
                    <Label>Rejection Reason</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Specify why the batch failed quality tests..."
                      required
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Results
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {loading && tests.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : tests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No test results recorded yet.
              </CardContent>
            </Card>
          ) : (
            tests.map((test: any) => (
              <Card key={test.id} className={test.rejected ? 'border-destructive' : 'border-primary'}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {test.rejected ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                      Sample {test.sample_id}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {new Date(test.created_at).toLocaleDateString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Batch:</strong> {test.batches?.product_name || test.batches?.species_id}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong> {test.rejected ? '❌ Rejected' : '✅ Passed'}
                    </p>
                    {test.tests && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Test Results:</h4>
                        {test.tests.moisture_percent && (
                          <p className="text-sm">• Moisture: {test.tests.moisture_percent}%</p>
                        )}
                        {test.tests.pesticide_level && (
                          <p className="text-sm">• Pesticides: {test.tests.pesticide_level} ppm</p>
                        )}
                        {test.tests.heavy_metals && (
                          <p className="text-sm">• Heavy Metals: {test.tests.heavy_metals}</p>
                        )}
                        {test.tests.dna_barcoding && (
                          <p className="text-sm">• DNA Barcoding: {test.tests.dna_barcoding}</p>
                        )}
                      </div>
                    )}
                    {test.rejection_reason && (
                      <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                        <p className="text-sm text-destructive">
                          <strong>Rejection Reason:</strong> {test.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
