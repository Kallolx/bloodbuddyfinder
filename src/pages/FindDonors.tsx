
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  User, Search, MapPin, Calendar, Phone, 
  MessageSquare, CheckCircle, AlertCircle, Filter
} from 'lucide-react';
import { bloodGroups, districts, getNearbyDistricts } from '@/data/districts';
import { filterDonors, daysSinceLastDonation } from '@/data/donors';
import { cn } from '@/lib/utils';

const FindDonors = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [filteredDonors, setFilteredDonors] = useState(filterDonors());
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize selected district from localStorage if available
  useEffect(() => {
    const savedDistrict = localStorage.getItem('selectedDistrict');
    if (savedDistrict) {
      setSelectedDistrict(savedDistrict);
    }
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update filtered donors when filters change
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setFilteredDonors(filterDonors(
        selectedBloodGroup, 
        selectedDistrict, 
        showAvailableOnly
      ));
      setIsLoading(false);
    }, 500);
  }, [selectedBloodGroup, selectedDistrict, showAvailableOnly]);

  const handleReset = () => {
    setSelectedBloodGroup('');
    setSelectedDistrict('');
    setShowAvailableOnly(false);
  };

  const nearbyDistricts = selectedDistrict ? getNearbyDistricts(selectedDistrict) : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Find Blood Donors</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Search for blood donors in your area by blood type and location. Connect directly with verified donors to save lives.
            </p>
          </div>

          {/* Filter section */}
          <Card className="mb-8 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Search Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className={cn(
              "p-4 md:p-6 transition-all duration-300 overflow-hidden", 
              showFilters ? "max-h-96" : "max-h-0 md:max-h-96"
            )}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={selectedBloodGroup}
                    onValueChange={setSelectedBloodGroup}
                  >
                    <SelectTrigger id="bloodGroup">
                      <SelectValue placeholder="All Blood Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Blood Groups</SelectItem>
                      {bloodGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Districts</SelectItem>
                      {districts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="available"
                      checked={showAvailableOnly}
                      onCheckedChange={setShowAvailableOnly}
                    />
                    <Label htmlFor="available">Available donors only</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={handleReset} className="mr-2">
                  Reset Filters
                </Button>
                <Button className="btn-hover">
                  <Search className="h-4 w-4 mr-2" />
                  Search Donors
                </Button>
              </div>
            </div>
          </Card>

          {/* Results section */}
          <div className="mb-6">
            <Tabs defaultValue="grid">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {isLoading ? 'Searching...' : 
                   `${filteredDonors.length} Donors Found`}
                </h2>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="grid" className="mt-0">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Card key={i} className="animate-pulse">
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="ml-4">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                            </div>
                          </div>
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : filteredDonors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDonors.map(donor => (
                      <Card key={donor.id} className="overflow-hidden card-hover">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-700">
                                <AvatarImage src={`/placeholder.svg`} alt={donor.name} />
                                <AvatarFallback className="bg-primary text-white">
                                  {donor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {donor.name}
                                  </h3>
                                  {donor.isVerified && (
                                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {donor.district}
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-white bg-primary">
                                {donor.bloodGroup}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Last donation: {donor.lastDonationDate}
                            {' '}
                            {donor.canDonate ? (
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                {90 - daysSinceLastDonation(donor.lastDonationDate)} days until available
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex justify-between gap-2">
                            <Button variant="default" className="w-1/2">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button variant="outline" className="w-1/2">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300">No donors found</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      Try adjusting your search filters or check nearby districts.
                    </AlertDescription>
                  </Alert>
                )}
                
                {!isLoading && filteredDonors.length === 0 && selectedDistrict && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Check Nearby Districts</h3>
                    <div className="flex flex-wrap gap-2">
                      {nearbyDistricts.slice(0, 5).map(district => (
                        <Button 
                          key={district} 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDistrict(district)}
                          className="btn-hover"
                        >
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          {district}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Card key={i} className="animate-pulse">
                        <div className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="ml-4 flex-1">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                            </div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : filteredDonors.length > 0 ? (
                  <div className="space-y-3">
                    {filteredDonors.map(donor => (
                      <Card key={donor.id} className="overflow-hidden card-hover">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                                <AvatarImage src={`/placeholder.svg`} alt={donor.name} />
                                <AvatarFallback className="bg-primary text-white">
                                  {donor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {donor.name}
                                  </h3>
                                  {donor.isVerified && (
                                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 h-5">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4">
                                  <span className="flex items-center">
                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                    {donor.district}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {donor.lastDonationDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-white bg-primary">
                                {donor.bloodGroup}
                              </div>
                              <div className="hidden sm:flex">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button variant="default" size="sm" className="sm:hidden">
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300">No donors found</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      Try adjusting your search filters or check nearby districts.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindDonors;
