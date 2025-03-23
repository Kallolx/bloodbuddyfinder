import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  User, Search, MapPin, Calendar, Phone, 
  MessageSquare, CheckCircle, AlertCircle, Filter,
  Droplet, Users, ArrowRight, Clock
} from 'lucide-react';
import { bloodGroups, districts, getNearbyDistricts, divisionDistricts } from '@/data/districts';
import { filterDonors, daysSinceLastDonation, Donor, donorManager } from '@/data/donors';
import { cn } from '@/lib/utils';

const FindDonors = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreDonors, setHasMoreDonors] = useState(false);
  const [visibleDonorsCount, setVisibleDonorsCount] = useState(10);

  // Get divisions from the divisionDistricts object
  const divisions = Object.keys(divisionDistricts);

  // Initialize selected district from localStorage if available
  useEffect(() => {
    const savedDistrict = localStorage.getItem('selectedDistrict');
    if (savedDistrict) {
      setSelectedDistrict(savedDistrict);
      
      // Find division for the saved district
      for (const [division, districts] of Object.entries(divisionDistricts)) {
        if (districts.includes(savedDistrict)) {
          setSelectedDivision(division);
          break;
        }
      }
    }
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update filtered donors when filters change
  useEffect(() => {
    setIsLoading(true);
    setVisibleDonorsCount(10);
    
    // Simulate API call delay
    setTimeout(() => {
      // Convert all to empty string for the filter function
      const bloodGroupFilter = selectedBloodGroup === "all" ? "" : selectedBloodGroup;
      const districtFilter = selectedDistrict === "all" ? "" : selectedDistrict;
      
      let filtered = filterDonors(
        bloodGroupFilter, 
        districtFilter, 
        showAvailableOnly
      );
      
      // Further filter by division if selected
      if (selectedDivision !== "all" && selectedDistrict === "all") {
        filtered = filtered.filter(donor => donor.division === selectedDivision);
      }
      
      setFilteredDonors(filtered);
      setHasMoreDonors(filtered.length > 10);
      setIsLoading(false);
    }, 500);
  }, [selectedBloodGroup, selectedDistrict, selectedDivision, showAvailableOnly]);

  const handleReset = () => {
    setSelectedBloodGroup("all");
    setSelectedDistrict("all");
    setSelectedDivision("all");
    setShowAvailableOnly(false);
  };
  
  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    setSelectedDistrict("all"); // Reset district when division changes
  };
  
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    
    // Update local storage
    if (district !== "all") {
      localStorage.setItem('selectedDistrict', district);
    } else {
      localStorage.removeItem('selectedDistrict');
    }
  };

  const loadMoreDonors = () => {
    setVisibleDonorsCount(prev => prev + 10);
    setHasMoreDonors(filteredDonors.length > visibleDonorsCount + 10);
  };

  const nearbyDistricts = selectedDistrict ? getNearbyDistricts(selectedDistrict) : [];
  const visibleDonors = filteredDonors.slice(0, visibleDonorsCount);

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Hero search section */}
        <div className="bg-gradient-to-br from-background to-secondary/20 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark-pattern opacity-50"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <Badge 
                className="mb-4 text-xs font-semibold px-3 py-1 bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5"
                variant="outline"
              >
                <Droplet className="h-3.5 w-3.5" />
                Find Donors
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Find <span className="text-primary text-glow-primary">Blood Donors</span> Quickly
              </h1>
            </div>

            {/* Main search bar */}
            <Card className="bg-background/80 backdrop-blur-md border-primary/10 shadow-glow overflow-hidden">
              <div className="p-3 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 items-end">
                  <div className="sm:col-span-1 md:col-span-4">
                    <Label htmlFor="bloodGroupSearch" className="text-sm font-medium text-gray-400 mb-1.5 block">
                      Blood Group
                    </Label>
                    <Select
                      value={selectedBloodGroup}
                      onValueChange={setSelectedBloodGroup}
                    >
                      <SelectTrigger id="bloodGroupSearch" className="h-10 sm:h-12 bg-secondary/20 border-secondary/50">
                        <SelectValue placeholder="All Blood Groups" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-secondary/50">
                        <SelectItem value="all">All Blood Groups</SelectItem>
                        {bloodGroups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-1 md:col-span-3">
                    <Label htmlFor="divisionSearch" className="text-sm font-medium text-gray-400 mb-1.5 block">
                      Division
                    </Label>
                    <Select
                      value={selectedDivision}
                      onValueChange={handleDivisionChange}
                    >
                      <SelectTrigger id="divisionSearch" className="h-10 sm:h-12 bg-secondary/20 border-secondary/50">
                        <SelectValue placeholder="All Divisions" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-secondary/50">
                        <SelectItem value="all">All Divisions</SelectItem>
                        {divisions.map(division => (
                          <SelectItem key={division} value={division}>{division}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-1 md:col-span-3">
                    <Label htmlFor="districtSearch" className="text-sm font-medium text-gray-400 mb-1.5 block">
                      District
                    </Label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={handleDistrictChange}
                      disabled={selectedDivision === "all"}
                    >
                      <SelectTrigger id="districtSearch" className="h-10 sm:h-12 bg-secondary/20 border-secondary/50">
                        <SelectValue placeholder={selectedDivision !== "all" ? "All Districts" : "Select Division First"} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-secondary/50 max-h-[260px]">
                        <SelectItem value="all">All Districts in {selectedDivision}</SelectItem>
                        {selectedDivision && selectedDivision !== "all" && 
                          divisionDistricts[selectedDivision as keyof typeof divisionDistricts]?.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-1 md:col-span-2">
                    <Button className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 shadow-glow">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:col-span-2 md:col-span-12 pt-2">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <Switch
                        id="available"
                        checked={showAvailableOnly}
                        onCheckedChange={setShowAvailableOnly}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="available" className="text-sm text-gray-400">
                        Available donors only
                      </Label>
                    </div>
                    
                    <Button variant="ghost" onClick={handleReset} className="h-8 text-xs sm:text-sm text-gray-400 hover:text-white">
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Results section */}
        <div className="max-w-5xl mx-auto px-3 sm:px-4 -mt-4">
          <div className="flex justify-between items-center mb-6 pt-8">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              {isLoading ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse mr-2"></span>
                  Searching...
                </span>
              ) : (
                <span className="flex flex-wrap items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>{filteredDonors.length} Donors Found</span>
                  {selectedDistrict !== "all" && (
                    <Badge variant="outline" className="ml-0 sm:ml-2 bg-secondary/40 text-gray-300 border-secondary/60 text-xs sm:text-sm">
                      {selectedDistrict}
                    </Badge>
                  )}
                  {selectedDivision !== "all" && selectedDistrict === "all" && (
                    <Badge variant="outline" className="ml-0 sm:ml-2 bg-secondary/40 text-gray-300 border-secondary/60 text-xs sm:text-sm">
                      {selectedDivision} Division
                    </Badge>
                  )}
                </span>
              )}
            </h2>
          </div>
          
          {/* List view */}
          <div className="mt-0">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i} className="animate-pulse bg-secondary/40 border-secondary/50">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary rounded-full"></div>
                        <div className="ml-3 sm:ml-4 flex-1">
                          <div className="h-3 sm:h-4 bg-secondary rounded w-32 sm:w-48 mb-2"></div>
                          <div className="h-2 sm:h-3 bg-secondary rounded w-24 sm:w-32"></div>
                        </div>
                        <div className="h-6 sm:h-8 bg-secondary rounded w-16 sm:w-20"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : visibleDonors.length > 0 ? (
              <div className="space-y-3">
                {visibleDonors.map(donor => (
                  <Card 
                    key={donor.id} 
                    className="overflow-hidden transition-all duration-300 border-secondary/50 bg-secondary/40
                    hover:border-primary/30 hover:shadow-glow"
                  >
                    <div className="p-3 sm:p-4">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="flex-shrink-0">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-primary/20">
                              <AvatarImage src={`/placeholder.svg`} alt={donor.name} />
                              <AvatarFallback className="bg-primary text-white text-xs">
                                {donor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-2 sm:ml-3 min-w-0">
                            <div className="flex items-center flex-wrap gap-x-2">
                              <h3 className="font-medium text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                                {donor.name}
                              </h3>
                              <div className="hidden sm:flex sm:items-center sm:gap-2">
                                {donor.isVerified && (
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 h-5 text-xs whitespace-nowrap">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                {donor.canDonate ? (
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 h-5 text-xs whitespace-nowrap">
                                    Available
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-secondary/80 text-gray-300 border-secondary h-5 text-xs whitespace-nowrap">
                                    {90 - daysSinceLastDonation(donor.lastDonationDate)}d
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-400">
                              <div className="sm:hidden flex gap-1 items-center">
                                {donor.canDonate ? (
                                  <span className="text-primary text-xs">Available</span>
                                ) : (
                                  <span className="text-gray-400 text-xs">{90 - daysSinceLastDonation(donor.lastDonationDate)}d</span>
                                )}
                                •
                              </div>
                              <span className="truncate max-w-[140px] sm:max-w-none">
                                {donor.district}, {donor.division}
                              </span>
                              <span className="hidden sm:flex sm:items-center sm:ml-4">
                                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-gray-500" />
                                {donor.lastDonationDate}
                              </span>
                              {donor.availableTimePreference && (
                                <span className="hidden sm:flex sm:items-center sm:ml-4">
                                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-gray-500" />
                                  {donor.availableTimePreference.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-bold text-white bg-primary glow-primary text-sm sm:text-base">
                            {donor.bloodGroup}
                          </div>
                          <div className="sm:flex hidden">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"
                              title={donor.contactNumber}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"
                              title={donor.email || 'No email provided'}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                          <a 
                            href={`https://wa.me/${donor.contactNumber.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm:hidden flex items-center justify-center h-7 w-7 bg-[#25D366] rounded-full text-white"
                            title="Contact on WhatsApp"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-3.5 w-3.5">
                              <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-secondary/40 border-primary/20 overflow-hidden mb-6">
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No donors found</h3>
                  <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
                    Try adjusting your search filters or check nearby districts
                  </p>
                </div>
              </Card>
            )}
          </div>
          
          {!isLoading && filteredDonors.length === 0 && selectedDistrict !== "all" && (
            <div className="mt-6 bg-secondary/20 p-3 sm:p-4 rounded-lg border border-secondary/50">
              <h3 className="text-base sm:text-lg font-medium mb-3 text-white">
                <span className="text-primary">Nearby</span> Districts
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearbyDistricts.slice(0, 5).map(district => (
                  <Button 
                    key={district} 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDistrict(district)}
                    className="border-secondary/50 bg-secondary/40 hover:border-primary hover:bg-primary/10 text-xs h-8 sm:text-sm"
                  >
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-primary" />
                    {district}
                    <ArrowRight className="ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-70" />
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {!isLoading && hasMoreDonors && (
            <div className="flex justify-center mt-6 sm:mt-8 mb-10 sm:mb-12">
              <Button 
                className="px-6 sm:px-8 py-2 sm:py-6 text-sm sm:text-base bg-primary hover:bg-primary/90 shadow-glow gap-2"
                onClick={loadMoreDonors}
              >
                Load More Donors
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FindDonors;
