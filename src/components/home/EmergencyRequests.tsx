import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, AlertTriangle, ArrowRight, Share2, Heart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample emergency requests data
const emergencyRequestsData = [
  {
    id: 1,
    name: 'Ahmed Khan',
    bloodType: 'A+',
    location: 'Dhaka Medical College',
    district: 'Dhaka',
    urgency: 'High',
    postedAt: '30 minutes ago',
    contact: '+880 1712 345678',
    neededUnits: 2,
    reason: 'Accident victim',
  },
  {
    id: 2,
    name: 'Fatima Rahman',
    bloodType: 'O-',
    location: 'Square Hospital',
    district: 'Dhaka',
    urgency: 'Critical',
    postedAt: '1 hour ago',
    contact: '+880 1912 345678',
    neededUnits: 3,
    reason: 'Surgery scheduled',
  },
  {
    id: 3,
    name: 'Rahul Dev',
    bloodType: 'B+',
    location: 'Chittagong Medical College',
    district: 'Chittagong',
    urgency: 'Medium',
    postedAt: '2 hours ago',
    contact: '+880 1812 345678',
    neededUnits: 1,
    reason: 'Cancer treatment',
  },
  {
    id: 4,
    name: 'Priya Begum',
    bloodType: 'AB+',
    location: 'Rajshahi Medical College',
    district: 'Rajshahi',
    urgency: 'High',
    postedAt: '3 hours ago',
    contact: '+880 1612 345678',
    neededUnits: 2,
    reason: 'Childbirth complications',
  },
  {
    id: 5,
    name: 'Mohammed Ali',
    bloodType: 'B-',
    location: 'United Hospital',
    district: 'Dhaka',
    urgency: 'Critical',
    postedAt: '1.5 hours ago',
    contact: '+880 1512 345678',
    neededUnits: 2,
    reason: 'Cardiac surgery',
  },
  {
    id: 6,
    name: 'Sonia Akter',
    bloodType: 'A-',
    location: 'Khulna Medical College',
    district: 'Khulna',
    urgency: 'Medium',
    postedAt: '4 hours ago',
    contact: '+880 1912 987654',
    neededUnits: 1,
    reason: 'Thalassemia patient',
  },
];

const EmergencyRequests = () => {
  const [visibleRequests, setVisibleRequests] = useState(3);
  const [animated, setAnimated] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    setAnimated([]);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            emergencyRequestsData.slice(0, visibleRequests).forEach((_, index) => {
              setTimeout(() => {
                setAnimated(prev => [...prev, index]);
              }, index * 100);
            });
          }, 200);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('#emergency-requests-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [visibleRequests, activeTab]);

  const handleShowMore = () => {
    setVisibleRequests(prev => Math.min(prev + 3, emergencyRequestsData.length));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'high':
        return 'bg-orange-950/30 text-orange-400 border-orange-900/30';
      case 'medium':
        return 'bg-yellow-950/30 text-yellow-400 border-yellow-900/30';
      default:
        return 'bg-blue-950/30 text-blue-400 border-blue-900/30';
    }
  };

  const getUrgencyDot = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return (
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        );
      case 'high':
        return <span className="h-2 w-2 rounded-full bg-orange-400 mr-2"></span>;
      case 'medium':
        return <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>;
    }
  };

  const filteredRequests = activeTab === 'all' 
    ? emergencyRequestsData 
    : emergencyRequestsData.filter(r => r.bloodType.includes(activeTab));

  return (
    <section id="emergency-requests-section" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <Badge 
              className="mb-3 border-primary/20 bg-primary/10 text-primary px-3 py-1 gap-1.5 items-center"
              variant="outline"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              URGENT BLOOD NEEDS
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Emergency <span className="text-primary text-glow-primary">Blood Requests</span>
            </h2>
            
            <p className="text-gray-400 max-w-2xl mt-3">
              These patients need immediate blood donations. Your quick response can save lives in critical moments.
            </p>
          </div>
          
          <div className="flex items-center space-x-1 bg-secondary/20 p-1 rounded-lg border border-secondary/30">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "rounded-md px-3", 
                activeTab === 'all' ? 'bg-secondary text-white' : 'text-gray-400 hover:text-white'
              )}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
            {['A', 'B', 'AB', 'O'].map(type => (
              <Button 
                key={type}
                variant="ghost" 
                size="sm" 
                className={cn(
                  "rounded-md min-w-[40px]", 
                  activeTab === type ? 'bg-secondary text-white' : 'text-gray-400 hover:text-white'
                )}
                onClick={() => setActiveTab(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.slice(0, visibleRequests).map((request, index) => (
            <Card 
              key={request.id}
              className={cn(
                "overflow-hidden bg-secondary/10 border border-secondary/30 shadow-lg hover:shadow-xl",
                "transition-all duration-500 transform hover:border-primary/40 hover:shadow-primary/10",
                animated.includes(index) 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-8 opacity-0"
              )}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-lg text-white bg-primary shadow-md shadow-primary/20`}>
                      {request.bloodType}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-white">{request.name}</h3>
                      <div className="flex items-center text-sm text-gray-400 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {request.location}, {request.district}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-secondary/30 rounded-lg mb-4 border border-secondary/40">
                  <div className="flex items-center mb-2">
                    {getUrgencyDot(request.urgency)}
                    <span className="text-sm font-medium text-gray-300">{request.urgency} Urgency</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {request.neededUnits} unit{request.neededUnits > 1 ? 's' : ''} needed
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {request.postedAt}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mb-4">
                  <span className="text-gray-300">Reason: </span>
                  {request.reason}
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <Button variant="default" className="w-full bg-primary hover:bg-primary/90 shadow-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Directly
                  </Button>
                  <Button variant="outline" size="icon" className="border-secondary/50 hover:bg-secondary/20">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {visibleRequests < filteredRequests.length && (
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              onClick={handleShowMore}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:text-white px-6 group"
            >
              Show More Requests
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
        
        <div className="mt-16 mx-auto max-w-2xl p-5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="bg-primary/20 p-3 rounded-full">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white mb-1">Need to request blood urgently?</h3>
              <p className="text-gray-400 text-sm">Post your request and get connected with potential donors quickly</p>
            </div>
            <Button className="sm:ml-auto whitespace-nowrap bg-primary hover:bg-primary/90">
              Request Blood
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyRequests;

