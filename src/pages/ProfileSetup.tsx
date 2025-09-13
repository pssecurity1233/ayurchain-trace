import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Leaf, Users, FlaskConical, Building2, ShieldCheck } from 'lucide-react';

const ProfileSetup = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    role: '',
    organization: '',
    address: '',
    license_number: ''
  });

  useEffect(() => {
    if (profile) {
      navigate('/');
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user?.id,
          name: profileData.name,
          phone: profileData.phone,
          role: profileData.role,
          organization: profileData.organization,
          address: profileData.address,
          license_number: profileData.license_number
        });

      if (profileError) throw profileError;

      // Create role-specific profile if needed
      if (profileData.role === 'collector') {
        const { error: collectorError } = await supabase
          .from('collector_profiles')
          .insert({
            user_id: user?.id,
            collector_id: `COLL_${Date.now()}`,
            experience_years: 0,
            specializations: [],
            collection_zones: []
          });
        
        if (collectorError) throw collectorError;
      } else if (profileData.role === 'lab_technician') {
        const { error: labError } = await supabase
          .from('lab_technician_profiles')
          .insert({
            user_id: user?.id,
            technician_id: `TECH_${Date.now()}`,
            qualifications: [],
            specializations: []
          });
        
        if (labError) throw labError;
      } else if (profileData.role === 'manufacturer') {
        const { error: mfgError } = await supabase
          .from('manufacturer_profiles')
          .insert({
            user_id: user?.id,
            manufacturer_id: `MFG_${Date.now()}`,
            company_name: profileData.organization || 'Company Name',
            facility_locations: [],
            certifications: []
          });
        
        if (mfgError) throw mfgError;
      }

      toast({
        title: "Profile Created",
        description: "Your profile has been set up successfully!",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Profile Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'collector': return <Leaf className="h-5 w-5" />;
      case 'lab_technician': return <FlaskConical className="h-5 w-5" />;
      case 'manufacturer': return <Building2 className="h-5 w-5" />;
      case 'admin': return <ShieldCheck className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={profileData.role} 
                onValueChange={(value) => setProfileData({ ...profileData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {['collector', 'lab_technician', 'manufacturer', 'consumer'].map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role)}
                        <span className="capitalize">{role.replace('_', ' ')}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={profileData.organization}
                onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                rows={2}
              />
            </div>

            {profileData.role && profileData.role !== 'consumer' && (
              <div className="space-y-2">
                <Label htmlFor="license">License/Certificate Number</Label>
                <Input
                  id="license"
                  value={profileData.license_number}
                  onChange={(e) => setProfileData({ ...profileData, license_number: e.target.value })}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Setting up...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;