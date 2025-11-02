import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '/contact' },
  { name: 'Login', href: '/login' },
  { name: 'Restaurant Login', href: '/restaurant-login' },
];

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2" aria-label="Home">
            <img 
              src="/khadyamqr-logo.svg" 
              alt="KhadyamQR Logo" 
              className="h-8 w-auto"
              width={32}
              height={32}
              loading="eager"
            />
            <span className="font-bold inline-block">KhadyamQR</span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex gap-6">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80',
                    location.pathname === item.href ? 'text-foreground' : ''
                  )}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isMobile ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/restaurant-login">Restaurant Login</Link>
              </Button>
            </div>
          ) : (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <span className="font-bold">Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="flex flex-col p-4 gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center h-12 px-4 rounded-md text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        location.pathname === item.href 
                          ? 'bg-accent text-accent-foreground' 
                          : 'text-muted-foreground'
                      )}
                      onClick={() => setIsOpen(false)}
                      aria-current={location.pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
