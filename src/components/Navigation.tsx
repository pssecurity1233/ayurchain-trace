import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Leaf, Menu, Scan, Users, Shield, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/', icon: Leaf },
    { name: 'Scan Product', href: '/scan', icon: Scan },
    { name: 'Collect Herbs', href: '/collect', icon: Users },
    { name: 'Lab Testing', href: '/lab', icon: Shield },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ];

  const NavContent = ({ mobile = false }) => (
    <div className={cn('flex gap-6', mobile ? 'flex-col' : 'items-center')}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth',
              'hover:bg-primary/10 hover:text-primary',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">AyurTrace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavContent />
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold">AyurTrace</span>
                </div>
                <nav className="mt-4">
                  <NavContent mobile />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;