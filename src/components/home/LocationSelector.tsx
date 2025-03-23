
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

// Sample districts of Bangladesh
const districts = [
  'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 
  'Sylhet', 'Rangpur', 'Mymensingh', 'Comilla', 'Dinajpur',
  'Jessore', 'Bogra', 'Narayanganj', 'Gazipur', 'Tangail',
  'Jamalpur', 'Pabna', 'Kushtia', 'Feni', 'Noakhali',
  'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Chandpur'
];

const LocationSelector = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [filteredDistricts, setFilteredDistricts] = useState(districts);

  useEffect(() => {
    // Check if location is already stored in localStorage
    const savedLocation = localStorage.getItem('selectedDistrict');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    } else {
      // Show dialog on first visit
      const timer = setTimeout(() => {
        setOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = districts.filter(district => 
        district.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts);
    }
  }, [searchTerm]);

  const handleSelectLocation = (district: string) => {
    setSelectedLocation(district);
    localStorage.setItem('selectedDistrict', district);
    setOpen(false);
  };

  return (
    <>
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        style={{ visibility: selectedLocation ? 'visible' : 'hidden' }}
      >
        <Button 
          onClick={() => setOpen(true)}
          className="group shadow-lg px-4 py-2 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/50 dark:border-gray-700 dark:hover:bg-black/70"
        >
          <MapPin className="h-4 w-4 mr-2 text-primary group-hover:animate-pulse" />
          <span className="text-gray-900 dark:text-white font-medium">
            {selectedLocation || 'Select Location'}
          </span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose your location</DialogTitle>
            <DialogDescription>
              Select your district to find blood donors near you
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative mt-4 mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search districts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
            {filteredDistricts.map((district) => (
              <Button
                key={district}
                variant="outline"
                className="justify-start"
                onClick={() => handleSelectLocation(district)}
              >
                <MapPin className="h-3.5 w-3.5 mr-2 text-primary" />
                {district}
              </Button>
            ))}
          </div>
          
          {filteredDistricts.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No districts found matching "{searchTerm}"
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationSelector;
