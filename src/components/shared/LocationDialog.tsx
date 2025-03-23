import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, X, ArrowRight, Globe } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

// Group districts by division for better organization
const divisionDistricts = [
  {
    division: "Dhaka",
    districts: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Faridpur", "Munshiganj"]
  },
  {
    division: "Chittagong",
    districts: ["Chittagong", "Cox's Bazar", "Rangamati", "Bandarban", "Khagrachari", "Feni", "Noakhali"]
  },
  {
    division: "Khulna",
    districts: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Chuadanga"]
  },
  {
    division: "Rajshahi",
    districts: ["Rajshahi", "Bogra", "Pabna", "Natore", "Sirajganj"]
  },
  {
    division: "Barisal",
    districts: ["Barisal", "Bhola", "Patuakhali", "Pirojpur"]
  },
  {
    division: "Sylhet",
    districts: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"]
  },
  {
    division: "Rangpur",
    districts: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha"]
  },
  {
    division: "Mymensingh",
    districts: ["Mymensingh", "Jamalpur", "Netrakona", "Sherpur"]
  }
];

// Flatten the districts for search
const allDistricts = divisionDistricts.flatMap(div => div.districts);

// Popular/major districts for quick selection
const popularDistricts = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Comilla"];

const LocationDialog = () => {
  const { 
    selectedLocation,
    setSelectedLocation,
    showLocationDialog,
    setShowLocationDialog
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("popular");
  const [activeDivision, setActiveDivision] = useState<string | null>(null);

  // Filter districts based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = allDistricts.filter(district => 
        district.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDistricts(filtered);
      setActiveTab("search");
    } else {
      setFilteredDistricts([]);
      if (activeTab === "search") {
        setActiveTab("popular");
      }
    }
  }, [searchTerm]);

  const handleSelectLocation = (district: string) => {
    setSelectedLocation(district);
    setShowLocationDialog(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Determine which districts to show based on active tab/view
  const getDisplayedDistricts = () => {
    if (activeTab === "search" && searchTerm) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => (
              <DistrictButton
                key={district}
                district={district}
                onClick={() => handleSelectLocation(district)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-6">
              <div className="text-gray-400 flex flex-col items-center">
                <Search className="h-8 w-8 mb-2 opacity-20" />
                <p>No districts found matching "{searchTerm}"</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "popular") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {popularDistricts.map((district) => (
            <DistrictButton
              key={district}
              district={district}
              onClick={() => handleSelectLocation(district)}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "divisions") {
      return (
        <div className="flex flex-col">
          {activeDivision ? (
            <>
              <div className="flex items-center mb-3">
                <Button 
                  variant="ghost" 
                  className="p-0 h-8 mr-2 text-sm text-gray-400 hover:text-primary"
                  onClick={() => setActiveDivision(null)}
                >
                  <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                  Back to divisions
                </Button>
                <h3 className="text-sm font-medium text-white">{activeDivision} Division</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {divisionDistricts
                  .find(d => d.division === activeDivision)?.districts
                  .map((district) => (
                    <DistrictButton
                      key={district}
                      district={district}
                      onClick={() => handleSelectLocation(district)}
                    />
                  ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {divisionDistricts.map((div) => (
                <Button
                  key={div.division}
                  variant="outline"
                  className="flex items-center justify-between h-auto py-3 px-4 text-left border-secondary/50 hover:border-primary bg-secondary/20"
                  onClick={() => setActiveDivision(div.division)}
                >
                  <div>
                    <span className="block font-medium text-white">{div.division}</span>
                    <span className="text-xs text-gray-400">{div.districts.length} districts</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Button>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-xl overflow-hidden bg-background border-secondary">
        <div className="bg-secondary/40 p-4 relative">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-primary" />
              <span>Select Your Location</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for your district..."
              className="bg-background pl-10 pr-10 h-11 rounded-lg border-secondary"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full px-3 text-gray-400 hover:text-gray-200"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center border-b border-secondary/50 mb-4">
            <TabButton
              active={activeTab === "popular"}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </TabButton>
            <TabButton
              active={activeTab === "divisions"}
              onClick={() => setActiveTab("divisions")}
            >
              All Divisions
            </TabButton>
            {activeTab === "search" && (
              <TabButton active>
                Search Results
              </TabButton>
            )}
          </div>
          
          <div className="mt-2 max-h-[300px] overflow-y-auto px-1 py-2">
            {getDisplayedDistricts()}
          </div>
        </div>
        
        {selectedLocation && (
          <div className="p-4 pt-0">
            <div className="text-xs text-gray-400 mb-1">Current location</div>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-secondary/50 border-secondary/80 gap-2 text-white"
            >
              <MapPin className="h-4 w-4 text-primary" />
              {selectedLocation}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// District button component
interface DistrictButtonProps {
  district: string;
  onClick: () => void;
}

const DistrictButton = ({ district, onClick }: DistrictButtonProps) => (
  <Button
    variant="outline"
    className="justify-start h-auto py-2 text-left border-secondary/50 hover:border-primary hover:bg-primary/5 bg-secondary/20 text-white"
    onClick={onClick}
  >
    <MapPin className="h-4 w-4 mr-2 text-primary" />
    {district}
  </Button>
);

// Tab button component
interface TabButtonProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active = false, onClick, children }: TabButtonProps) => (
  <button 
    className={cn(
      "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[1px]",
      active 
        ? "border-primary text-primary" 
        : "border-transparent text-gray-400 hover:text-gray-200"
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export default LocationDialog; 