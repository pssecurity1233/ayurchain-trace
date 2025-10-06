import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface GeoFence {
  id: string;
  species_id: string;
  name: string;
  polygon: any;
  created_at: string;
  created_by: string;
}

const GeoFenceManager = () => {
  const { toast } = useToast();
  const [geoFences, setGeoFences] = useState<GeoFence[]>([]);
  const [species, setSpecies] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    species_id: '',
    name: '',
    polygon: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fencesRes, speciesRes] = await Promise.all([
        supabase.from('geo_fences').select('*').order('created_at', { ascending: false }),
        supabase.from('species').select('*')
      ]);

      if (fencesRes.error) throw fencesRes.error;
      if (speciesRes.error) throw speciesRes.error;

      setGeoFences(fencesRes.data || []);
      setSpecies(speciesRes.data || []);
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
      let polygonData;
      try {
        polygonData = JSON.parse(formData.polygon);
      } catch {
        throw new Error('Invalid GeoJSON format');
      }

      const { error } = await supabase.from('geo_fences').insert({
        species_id: formData.species_id,
        name: formData.name,
        polygon: polygonData,
      } as any);

      if (error) throw error;

      toast({
        title: "Geo-Fence Created",
        description: "New geo-fence has been added successfully.",
      });

      setFormData({ species_id: '', name: '', polygon: '' });
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

  const deleteFence = async (id: string) => {
    if (!confirm('Are you sure you want to delete this geo-fence?')) return;

    try {
      const { error } = await supabase.from('geo_fences').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: "Geo-Fence Deleted",
        description: "Geo-fence has been removed.",
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


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geo-Fence Management
            </CardTitle>
            <Button onClick={() => setIsAdding(!isAdding)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Geo-Fence
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label>Species</Label>
                <Select value={formData.species_id} onValueChange={(value) => setFormData({ ...formData, species_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.common_name} ({s.scientific_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fence Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Western Ghats Protected Area"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>GeoJSON Polygon</Label>
                <Textarea
                  value={formData.polygon}
                  onChange={(e) => setFormData({ ...formData, polygon: e.target.value })}
                  placeholder='{"type":"Polygon","coordinates":[[[lat1,lng1],[lat2,lng2],...]]}'
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use GeoJSON format. You can generate polygons using tools like geojson.io
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Geo-Fence</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {geoFences.map((fence) => (
              <div key={fence.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{fence.name}</h3>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Species: {fence.species_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(fence.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteFence(fence.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {geoFences.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No geo-fences configured</p>
                <p className="text-sm">Add your first geo-fence to start validating collection locations</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeoFenceManager;
