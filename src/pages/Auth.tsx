import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Users, FlaskConical, Building2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: '',
    organization: '',
    address: '',
    licenseNumber: ''
  });

  useEffect(() => {
    if (user) {
      // User is already authenticated, redirect will be handled by the router
    }
  }, [user]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      // Navigation will be handled by auth context
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!signUpData.role) {
      toast({
        title: "Role Required",
        description: "Please select your role to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const userData = {
      name: signUpData.name,
      phone: signUpData.phone,
      role: signUpData.role,
      organization: signUpData.organization,
      address: signUpData.address,
      license_number: signUpData.licenseNumber
    };

    const { error } = await signUp(signUpData.email, signUpData.password, userData);
    
    if (!error) {
      setActiveTab('signin');
      setSignUpData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        role: '',
        organization: '',
        address: '',
        licenseNumber: ''
      });
    }

    setLoading(false);
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

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'collector': return 'Field collectors and herb gatherers';
      case 'lab_technician': return 'Quality testing and laboratory analysis';
      case 'manufacturer': return 'Product manufacturing and processing';
      case 'consumer': return 'End consumers and product buyers';
      case 'admin': return 'System administrators and supervisors';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">AyurChain Trace</h1>
          </div>
          <p className="text-white/80">Authentic Ayurvedic Herb Traceability</p>
        </div>

        <Card className="shadow-xl backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
              {activeTab === 'signin' ? 'Welcome Back' : 'Join Our Network'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        placeholder="Your full name"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone</Label>
                      <Input
                        id="signup-phone"
                        placeholder="Phone number"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select 
                      value={signUpData.role} 
                      onValueChange={(value) => setSignUpData({ ...signUpData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {['collector', 'lab_technician', 'manufacturer', 'consumer'].map((role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(role)}
                              <div>
                                <div className="font-medium capitalize">{role.replace('_', ' ')}</div>
                                <div className="text-xs text-muted-foreground">
                                  {getRoleDescription(role)}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-organization">Organization</Label>
                    <Input
                      id="signup-organization"
                      placeholder="Company/Organization name"
                      value={signUpData.organization}
                      onChange={(e) => setSignUpData({ ...signUpData, organization: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-address">Address</Label>
                    <Textarea
                      id="signup-address"
                      placeholder="Your address"
                      value={signUpData.address}
                      onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {signUpData.role && signUpData.role !== 'consumer' && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-license">License/Certificate Number</Label>
                      <Input
                        id="signup-license"
                        placeholder="Professional license number"
                        value={signUpData.licenseNumber}
                        onChange={(e) => setSignUpData({ ...signUpData, licenseNumber: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;