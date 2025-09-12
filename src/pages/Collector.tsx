import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Camera, 
  Leaf, 
  Calendar, 
  Weight, 
  CheckCircle,
  AlertCircle,
  Upload,
  Navigation,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

interface CollectionData {
  species: string;
  quantity: string;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  harvestDate: string;
  notes: string;
  photos: File[];
  quality: string;
}

const Collector = () => {
  const [formData, setFormData] = useState<CollectionData>({
    species: '',
    quantity: '',
    location: '',
    coordinates: null,
    harvestDate: new Date().toISOString().split('T')[0],
    notes: '',
    photos: [],
    quality: ''
  });
  
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);

  const ayurvedicHerbs = [
    { id: 'ASH001', name: 'Ashwagandha', scientific: 'Withania somnifera' },
    { id: 'TUR001', name: 'Turmeric', scientific: 'Curcuma longa' },
    { id: 'NIM001', name: 'Neem', scientific: 'Azadirachta indica' },
    { id: 'BRA001', name: 'Brahmi', scientific: 'Bacopa monnieri' },
    { id: 'AML001', name: 'Amla', scientific: 'Phyllanthus emblica' }
  ];

  const qualityGrades = [
    { value: 'premium', label: 'Premium Grade (A+)' },
    { value: 'standard', label: 'Standard Grade (A)' },
    { value: 'commercial', label: 'Commercial Grade (B)' }
  ];

  const getCurrentLocation = () => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          coordinates: { lat: latitude, lng: longitude },
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }));
        setLocationStatus('success');
        toast.success('Location captured successfully!');
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get current location');
        setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files].slice(0, 5) // Limit to 5 photos
      }));
      toast.success(`${files.length} photo(s) added`);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.species || !formData.quantity || !formData.coordinates) {
      toast.error('Please fill in all required fields and capture location');
      return;
    }

    setSubmitting(true);
    
    // Simulate blockchain transaction
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Collection recorded successfully on blockchain!');
      
      // Reset form
      setFormData({
        species: '',
        quantity: '',
        location: '',
        coordinates: null,
        harvestDate: new Date().toISOString().split('T')[0],
        notes: '',
        photos: [],
        quality: ''
      });
      setLocationStatus('idle');
      
    } catch (error) {
      toast.error('Failed to record collection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHerb = ayurvedicHerbs.find(herb => herb.id === formData.species);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Herb <span className="text-primary">Collection</span> Entry
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Record your Ayurvedic herb collection with precise GPS tracking and quality assessment. 
            All data is immediately secured on the blockchain for traceability.
          </p>
        </div>

        {/* Collection Form */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              New Collection Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Species Selection */}
              <div className="space-y-2">
                <Label htmlFor="species">Herb Species *</Label>
                <Select value={formData.species} onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select herb species" />
                  </SelectTrigger>
                  <SelectContent>
                    {ayurvedicHerbs.map((herb) => (
                      <SelectItem key={herb.id} value={herb.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{herb.name}</span>
                          <span className="text-sm text-muted-foreground italic">{herb.scientific}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedHerb && (
                  <Badge variant="secondary" className="mt-2">
                    <Leaf className="h-3 w-3 mr-1" />
                    {selectedHerb.scientific}
                  </Badge>
                )}
              </div>

              {/* Quantity and Quality */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg) *</Label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="25.5"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality Grade</Label>
                  <Select value={formData.quality} onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityGrades.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location Capture */}
              <div className="space-y-4">
                <Label>GPS Location *</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationStatus === 'loading'}
                    variant={locationStatus === 'success' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {locationStatus === 'loading' ? 'Getting Location...' : 
                     locationStatus === 'success' ? 'Location Captured' : 
                     'Capture Current Location'}
                  </Button>
                  
                  {locationStatus === 'success' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>GPS: {formData.location}</span>
                    </div>
                  )}
                  
                  {locationStatus === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>Location capture failed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Harvest Date */}
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                    className="pl-10"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <Label>Collection Photos</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload photos of the collected herbs (max 5 photos)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photos
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Photo Preview */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Collection photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Collection Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about the collection (weather conditions, soil quality, etc.)"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={submitting || !formData.species || !formData.quantity || !formData.coordinates}
                  className="flex-1 text-lg py-6"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Recording on Blockchain...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Record Collection
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="text-lg py-6">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Save Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Collection Tips */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Collection Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Timing</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Collect during optimal seasons</li>
                  <li>• Early morning harvest preferred</li>
                  <li>• Avoid rainy or wet conditions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Quality</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Select mature, healthy plants</li>
                  <li>• Clean harvesting tools</li>
                  <li>• Proper handling and storage</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Documentation</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Accurate GPS coordinates</li>
                  <li>• Clear photos of specimens</li>
                  <li>• Detailed environmental notes</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Sustainability</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Follow sustainable practices</li>
                  <li>• Respect quantity limits</li>
                  <li>• Preserve ecosystem balance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Collector;