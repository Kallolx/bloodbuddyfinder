import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Search, 
  Droplet, 
  Bell,
  Globe,
  LogIn,
  LogOut,
  User,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import LocationDialog from '@/components/shared/LocationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    language, 
    setLanguage,
    isAuthenticated,
    userRole,
    currentUser,
    logout
  } = useAppContext();

  // Track scroll position to add a solid background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/auth/login');
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-primary/20 py-3" 
          : "bg-transparent py-5"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="relative">
                  <img src="/logo.svg" alt="BloodBuddy Logo" className="w-8 h-8" />
                </div>
                <span className="font-display font-bold text-2xl text-white dark:text-white">
                  Blood<span className="text-primary">Buddy</span>
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <NavLink to="/find-donors" isActive={isActive('/find-donors')}>
                Find Donors
              </NavLink>
              <NavLink to="/request-blood" isActive={isActive('/request-blood')}>
                Request Blood
              </NavLink>
              <NavLink to="/register-donor" isActive={isActive('/register-donor')}>
                Register Donor
              </NavLink>
            </div>

            {/* Right section - Language, Auth, Profile */}
            <div className="hidden lg:flex items-center gap-4">  
              {/* Language selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-10 w-10 bg-secondary hover:bg-secondary/80"
                  >
                    <Globe className="h-5 w-5 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[120px] bg-secondary border-primary/20">
                  <DropdownMenuItem 
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-primary/10'}
                  >
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLanguage('bn')}
                    className={language === 'bn' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-primary/10'}
                  >
                    বাংলা
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shadow-md p-0 overflow-hidden"
                    >
                      <Avatar className="h-10 w-10 border-0">
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(currentUser?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-secondary border-primary/20">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem
                      className="text-gray-300 hover:bg-primary/10 cursor-pointer"
                      onClick={() => navigate('/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    {userRole === 'admin' && (
                      <DropdownMenuItem
                        className="text-gray-300 hover:bg-primary/10 cursor-pointer"
                        onClick={() => navigate('/admin')}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem
                      className="text-gray-300 hover:bg-red-900/20 cursor-pointer"
                      onClick={handleAuthAction}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  size="default" 
                  className="rounded-full h-10 flex items-center gap-2 px-5 bg-primary hover:bg-primary/90 shadow-md"
                  onClick={handleAuthAction}
                >
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Sign In</span>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 bg-primary p-0 overflow-hidden"
                  onClick={() => navigate('/profile')}
                >
                  <Avatar className="h-9 w-9 border-0">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {getInitials(currentUser?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              )}
                          
              {/* Menu toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu} 
                aria-label="Toggle menu"
                className="h-10 w-10 rounded-full bg-secondary"
              >
                {isMenuOpen ? <X className="h-5 w-5 text-gray-300" /> : <Menu className="h-5 w-5 text-gray-300" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-[400px] opacity-100 border-t border-primary/20 bg-background/90 backdrop-blur-md shadow-lg" : "max-h-0 opacity-0"
        )}>
          <div className="container mx-auto px-4 py-4 space-y-3">
            <MobileNavLink 
              to="/find-donors" 
              icon={<Search className="h-5 w-5" />}
              isActive={isActive('/find-donors')}
              onClick={() => setIsMenuOpen(false)}
            >
              Find Donors
            </MobileNavLink>
            <MobileNavLink 
              to="/request-blood" 
              icon={<Droplet className="h-5 w-5" />}
              isActive={isActive('/request-blood')}
              onClick={() => setIsMenuOpen(false)}
            >
              Request Blood
            </MobileNavLink>
            <MobileNavLink 
              to="/emergency" 
              icon={<Bell className="h-5 w-5" />}
              isActive={isActive('/emergency')}
              onClick={() => setIsMenuOpen(false)}
            >
              Emergency
            </MobileNavLink>
            
            {isAuthenticated && (
              <>
                <MobileNavLink 
                  to="/profile" 
                  icon={<User className="h-5 w-5" />}
                  isActive={isActive('/profile')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </MobileNavLink>
                
                {userRole === 'admin' && (
                  <MobileNavLink 
                    to="/admin" 
                    icon={<ShieldCheck className="h-5 w-5" />}
                    isActive={isActive('/admin')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </MobileNavLink>
                )}
              </>
            )}
            
            <div className="pt-3 border-t border-primary/20 flex flex-col gap-3">
              {/* Language selector mobile */}
              <div className="flex items-center gap-2 text-sm text-gray-400 px-2">
                <Globe className="h-4 w-4" />
                <span>Language:</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("px-2 py-1 h-7", language === 'en' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-primary/10')}
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("px-2 py-1 h-7", language === 'bn' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-primary/10')}
                  onClick={() => setLanguage('bn')}
                >
                  বাংলা
                </Button>
              </div>
              
              <Button 
                size="default" 
                className="rounded-lg bg-primary hover:bg-primary/90"
                onClick={() => {
                  handleAuthAction();
                  setIsMenuOpen(false);
                }}
              >
                {isAuthenticated ? (
                  <>
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className={cn(
        "transition-all duration-300",
        scrolled ? "h-[60px]" : "h-[80px]"
      )}></div>
      
      {/* Location Dialog */}
      <LocationDialog />
    </>
  );
};

// Desktop NavLink component
interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-md text-base font-medium transition-all duration-200",
        isActive 
          ? "text-primary font-semibold text-glow-primary" 
          : "text-gray-300 hover:text-primary"
      )}
    >
      {children}
      {isActive && (
        <div className="h-1 w-1/2 bg-primary rounded-full mx-auto mt-1 glow-primary"></div>
      )}
    </Link>
  );
};

// Mobile NavLink component
interface MobileNavLinkProps extends NavLinkProps {
  icon: React.ReactNode;
  onClick?: () => void;
}

const MobileNavLink = ({ to, isActive, children, icon, onClick }: MobileNavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-gray-300 hover:bg-primary/5 hover:text-white"
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </Link>
  );
};

export default Navbar;
