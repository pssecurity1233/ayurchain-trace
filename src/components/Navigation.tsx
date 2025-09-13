import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Leaf, 
  Home, 
  QrCode, 
  FlaskConical, 
  BarChart3, 
  Users,
  User,
  Settings,
  LogOut,
  Building2,
  Package
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { user, userRole, profile, signOut } = useAuth();

  const getRoleBasedNavItems = () => {
    const baseItems = [
      { path: '/', icon: Home, label: 'Home' },
    ];

    switch (userRole) {
      case 'collector':
        return [
          ...baseItems,
          { path: '/collector-dashboard', icon: Leaf, label: 'My Collections' },
          { path: '/collect', icon: QrCode, label: 'New Collection' },
        ];
      case 'lab_technician':
        return [
          ...baseItems,
          { path: '/lab-dashboard', icon: FlaskConical, label: 'Lab Tests' },
          { path: '/lab', icon: BarChart3, label: 'Quality Control' },
        ];
      case 'manufacturer':
        return [
          ...baseItems,
          { path: '/manufacturer-dashboard', icon: Building2, label: 'Manufacturing' },
          { path: '/scan', icon: Package, label: 'Batch Management' },
        ];
      case 'consumer':
        return [
          ...baseItems,
          { path: '/consumer-dashboard', icon: QrCode, label: 'Scanner' },
          { path: '/scan', icon: BarChart3, label: 'Product Search' },
        ];
      case 'admin':
        return [
          ...baseItems,
          { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
          { path: '/scan', icon: QrCode, label: 'Scanner' },
          { path: '/collect', icon: Leaf, label: 'Collections' },
          { path: '/lab', icon: FlaskConical, label: 'Laboratory' },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getRoleBasedNavItems();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'lab_technician':
        return 'Lab Technician';
      default:
        return role?.charAt(0).toUpperCase() + role?.slice(1);
    }
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-primary">AyurChain</span>
            <span className="text-muted-foreground">Trace</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(profile?.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{profile?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {getRoleDisplayName(userRole || 'user')}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;