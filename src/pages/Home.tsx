import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Scan, 
  Shield, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Globe, 
  Zap,
  ArrowRight,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import heroImage from '@/assets/hero-herbs.jpg';

const Home = () => {
  const features = [
    {
      icon: Scan,
      title: 'QR Code Scanning',
      description: 'Instantly trace any Ayurvedic product from farm to pharmacy with our advanced QR scanning technology.',
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable records ensure authenticity and prevent counterfeiting with enterprise-grade security.',
      color: 'text-accent'
    },
    {
      icon: MapPin,
      title: 'GPS Verification',
      description: 'Precise location tracking ensures herbs are collected from certified organic regions.',
      color: 'text-primary-glow'
    },
    {
      icon: Users,
      title: 'Collector Network',
      description: 'Connect with verified herb collectors and support sustainable harvesting practices.',
      color: 'text-primary'
    },
    {
      icon: Calendar,
      title: 'Seasonal Tracking',
      description: 'Optimal harvest timing based on traditional Ayurvedic principles and modern science.',
      color: 'text-accent'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Laboratory-tested purity and potency certificates for every batch of herbs.',
      color: 'text-primary-glow'
    }
  ];

  const stats = [
    { label: 'Herbs Tracked', value: '10,000+' },
    { label: 'Collectors', value: '500+' },
    { label: 'Labs Verified', value: '50+' },
    { label: 'Products Traced', value: '25,000+' }
  ];

  const benefits = [
    'Complete transparency from seed to shelf',
    'Blockchain-verified authenticity',
    'Quality laboratory certifications',
    'Sustainable harvesting practices',
    'Real-time supply chain tracking',
    'Consumer confidence guarantee'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2">
                  <Leaf className="h-4 w-4 mr-2" />
                  Blockchain-Powered Traceability
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Pure Ayurvedic
                  <span className="block text-primary">Herbs Traced</span>
                  <span className="block text-accent">With Trust</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  From sacred groves to your medicine cabinet - trace every Ayurvedic herb's 
                  journey with complete transparency, authenticity, and blockchain security.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/scan">
                    <Scan className="h-5 w-5 mr-2" />
                    Scan Product
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link to="/collect">
                    <Users className="h-5 w-5 mr-2" />
                    Join as Collector
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-large">
                <img
                  src={heroImage}
                  alt="Fresh Ayurvedic herbs"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-medium animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">Verified Origin</div>
                    <div className="text-sm text-muted-foreground">Himalayan Region</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Complete <span className="text-primary">Traceability</span> Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform ensures every Ayurvedic herb's journey is transparent, 
              verified, and trustworthy from harvest to healing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-medium transition-smooth">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center group-hover:scale-110 transition-bounce ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">
                  Why Choose <span className="text-primary">AyurTrace</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Trust in the purity and authenticity of every Ayurvedic herb with 
                  our revolutionary blockchain-based traceability system.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/dashboard">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 space-y-3 animate-float">
                  <Globe className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold">Global Network</h4>
                  <p className="text-sm text-muted-foreground">Connected collectors worldwide</p>
                </Card>
                <Card className="p-6 space-y-3 animate-float" style={{ animationDelay: '1s' }}>
                  <Zap className="h-8 w-8 text-accent" />
                  <h4 className="font-semibold">Instant Verification</h4>
                  <p className="text-sm text-muted-foreground">Real-time authentication</p>
                </Card>
                <Card className="p-6 space-y-3 animate-float" style={{ animationDelay: '2s' }}>
                  <Shield className="h-8 w-8 text-primary-glow" />
                  <h4 className="font-semibold">Secure Records</h4>
                  <p className="text-sm text-muted-foreground">Immutable blockchain data</p>
                </Card>
                <Card className="p-6 space-y-3 animate-float" style={{ animationDelay: '3s' }}>
                  <Award className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold">Quality Assured</h4>
                  <p className="text-sm text-muted-foreground">Lab-tested purity</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Transform Ayurvedic Traceability?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of collectors, labs, and manufacturers creating a transparent 
              and trustworthy Ayurvedic supply chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link to="/scan">
                  <Scan className="h-5 w-5 mr-2" />
                  Start Scanning
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/collect">
                  <Users className="h-5 w-5 mr-2" />
                  Become a Collector
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;