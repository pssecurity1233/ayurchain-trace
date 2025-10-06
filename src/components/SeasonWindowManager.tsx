import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface SeasonWindow {
  id: string;
  species_id: string;
  start_mmdd: string;
  end_mmdd: string;
  created_at: string;
}

const SeasonWindowManager = () => {
  const { toast } = useToast();
  const [seasonWindows, setSeasonWindows] = useState<SeasonWindow[]>([]);
  const [species, setSpecies] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    species_id: '',
    start_mmdd: '',
    end_mmdd: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [windowsRes, speciesRes] = await Promise.all([
        supabase.from('season_windows').select('*').order('species_id'),
        supabase.from('species').select('*')
      ]);

      if (windowsRes.error) throw windowsRes.error;
      if (speciesRes.error) throw speciesRes.error;

      setSeasonWindows(windowsRes.data || []);
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
      const { error } = await supabase.from('season_windows').insert({
        species_id: formData.species_id,
        start_mmdd: formData.start_mmdd,
        end_mmdd: formData.end_mmdd,
      });

      if (error) throw error;

      toast({
        title: "Season Window Created",
        description: "New harvest season has been configured.",
      });

      setFormData({ species_id: '', start_mmdd: '', end_mmdd: '' });
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

  const deleteWindow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this season window?')) return;

    try {
      const { error } = await supabase.from('season_windows').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: "Season Window Deleted",
        description: "Season window has been removed.",
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

  const formatDateDisplay = (mmdd: string) => {
    const [month, day] = mmdd.split('-');
    const date = new Date(2024, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isCurrentlyInSeason = (start: string, end: string) => {
    const today = new Date();
    const currentMMDD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    if (start <= end) {
      return currentMMDD >= start && currentMMDD <= end;
    } else {
      // Wraps around year
      return currentMMDD >= start || currentMMDD <= end;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Harvest Season Windows
            </CardTitle>
            <Button onClick={() => setIsAdding(!isAdding)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Season Window
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date (MM-DD)</Label>
                  <Input
                    value={formData.start_mmdd}
                    onChange={(e) => setFormData({ ...formData, start_mmdd: e.target.value })}
                    placeholder="06-01"
                    pattern="\d{2}-\d{2}"
                    title="Format: MM-DD (e.g., 06-01)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date (MM-DD)</Label>
                  <Input
                    value={formData.end_mmdd}
                    onChange={(e) => setFormData({ ...formData, end_mmdd: e.target.value })}
                    placeholder="08-31"
                    pattern="\d{2}-\d{2}"
                    title="Format: MM-DD (e.g., 08-31)"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Use MM-DD format (e.g., 06-01 for June 1st). Season can wrap around the year.
              </p>

              <div className="flex gap-2">
                <Button type="submit">Create Season Window</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {seasonWindows.map((window) => {
              const inSeason = isCurrentlyInSeason(window.start_mmdd, window.end_mmdd);
              return (
                <div key={window.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{window.species_id}</h3>
                        <Badge variant={inSeason ? 'default' : 'secondary'}>
                          {inSeason ? 'In Season' : 'Off Season'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDateDisplay(window.start_mmdd)} - {formatDateDisplay(window.end_mmdd)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteWindow(window.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {seasonWindows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No season windows configured</p>
                <p className="text-sm">Add harvest seasons to ensure sustainable collection practices</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonWindowManager;
