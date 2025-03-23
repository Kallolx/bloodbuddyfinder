
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone } from 'lucide-react';
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
  },
];

const EmergencyRequests = () => {
  const [visibleRequests, setVisibleRequests] = useState(3);
  const [animated, setAnimated] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            emergencyRequestsData.slice(0, visibleRequests).forEach((_, index) => {
              setTimeout(() => {
                setAnimated(prev => [...prev, index]);
              }, index * 150);
            });
          }, 300);
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
  }, [visibleRequests]);

  const handleShowMore = () => {
    setVisibleRequests(prev => Math.min(prev + 4, emergencyRequestsData.length));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <section id="emergency-requests-section" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-2" variant="outline">URGENT</Badge>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Emergency Blood Requests</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            These requests need immediate attention. If you're eligible to donate, please contact the requesters directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyRequestsData.slice(0, visibleRequests).map((request, index) => (
            <Card 
              key={request.id}
              className={cn(
                "overflow-hidden border border-gray-200 dark:border-gray-800 card-hover",
                "transition-all duration-500 transform",
                animated.includes(index) 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-8 opacity-0"
              )}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-white bg-primary`}>
                        {request.bloodType}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {request.location}
                      </div>
                    </div>
                  </div>
                  <Badge className={getUrgencyColor(request.urgency)}>
                    {request.urgency}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  Posted {request.postedAt}
                </div>
                
                <div className="flex items-center justify-between">
                  <Button variant="default" className="w-full btn-hover">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {visibleRequests < emergencyRequestsData.length && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={handleShowMore}
              className="btn-hover"
            >
              Show More Requests
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EmergencyRequests;
