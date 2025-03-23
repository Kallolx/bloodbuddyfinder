import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import LocationDialog from '@/components/shared/LocationDialog';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { selectedLocation, setShowLocationDialog } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Floating location button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button 
          onClick={() => setShowLocationDialog(true)}
          className="group shadow-lg rounded-full border border-primary/20 bg-secondary/80 backdrop-blur-md h-auto py-2 px-4 text-white"
          size="sm"
        >
          <MapPin className="h-4 w-4 mr-2 text-primary group-hover:animate-pulse" />
          <span className="font-medium">
            {selectedLocation || 'Set Location'}
          </span>
        </Button>
      </div>
      
      {/* Location Dialog */}
      <LocationDialog />
    </div>
  );
};

export default Layout;
