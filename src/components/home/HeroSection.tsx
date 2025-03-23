
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Heart, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  React.useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 
            className={cn(
              "text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-opacity duration-1000",
              isAnimated ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="text-primary">Find Blood Donors</span> Near You — Save Lives Instantly
          </h1>
          
          <p 
            className={cn(
              "text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 transition-opacity duration-1000 delay-300", 
              isAnimated ? "opacity-100" : "opacity-0"
            )}
          >
            Connect with verified blood donors in your area and help save lives. Quick, reliable, and safe blood donation platform across Bangladesh.
          </p>
          
          <div 
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center transition-opacity duration-1000 delay-500", 
              isAnimated ? "opacity-100" : "opacity-0"
            )}
          >
            <Link to="/find-donors">
              <Button size="lg" className="w-full sm:w-auto btn-hover group">
                <Search className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Find a Donor
              </Button>
            </Link>
            
            <Link to="/request-blood">
              <Button size="lg" variant="outline" className="w-full sm:w-auto btn-hover">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Request Blood
              </Button>
            </Link>
            
            <Link to="/register-donor">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto btn-hover">
                <UserPlus className="mr-2 h-5 w-5" />
                Join as a Donor
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="fill-white dark:fill-black" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,90.7C960,96,1056,96,1152,90.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
