
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, Search, Droplet, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:bg-black/50 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Droplet className="h-8 w-8 text-primary" />
            <span className="font-display font-bold text-xl">BloodBuddy</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/find-donors" className="text-gray-700 hover:text-primary transition-colors font-medium dark:text-gray-300">
              Find Donors
            </Link>
            <Link to="/request-blood" className="text-gray-700 hover:text-primary transition-colors font-medium dark:text-gray-300">
              Request Blood
            </Link>
            <Link to="/register-donor" className="text-gray-700 hover:text-primary transition-colors font-medium dark:text-gray-300">
              Become a Donor
            </Link>
          </div>

          {/* Call to action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="btn-hover">
              <Heart className="h-4 w-4 mr-2" />
              Emergency
            </Button>
            <Button variant="default" size="sm" className="btn-hover">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "max-h-screen opacity-100 shadow-xl" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pt-2 pb-6 space-y-4">
          <Link 
            to="/find-donors" 
            className="block py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Search className="h-4 w-4 inline mr-2" />
            Find Donors
          </Link>
          <Link 
            to="/request-blood" 
            className="block py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Droplet className="h-4 w-4 inline mr-2" />
            Request Blood
          </Link>
          <Link 
            to="/register-donor" 
            className="block py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <UserPlus className="h-4 w-4 inline mr-2" />
            Become a Donor
          </Link>
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" className="w-1/2">Emergency</Button>
            <Button variant="default" className="w-1/2">Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
