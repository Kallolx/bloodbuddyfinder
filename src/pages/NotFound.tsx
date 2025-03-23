
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Droplet, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse">
            <Droplet className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="btn-hover w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </Link>
          
          <Link to="/find-donors">
            <Button variant="outline" className="w-full sm:w-auto">
              Find Blood Donors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
