import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { bloodGroups, districts } from '@/data/districts';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Clock, MapPin, Heart, CheckCircle, Phone, 
  AlertTriangle, AlertCircle, Droplet, Bell, 
  CalendarClock, User, Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Emergency request data (Sample)
const emergencyRequests = [
  {
    id: 1,
    name: 'Jahangir Alam',
    bloodGroup: 'O+',
    hospital: 'Dhaka Medical College',
    district: 'Dhaka',
    contactNumber: '+880 1712 345678',
    urgencyLevel: 'High',
    additionalNotes: 'Need blood for surgery scheduled tomorrow morning.',
    createdAt: '30 minutes ago',
  },
  {
    id: 2,
    name: 'Sadia Rahman',
    bloodGroup: 'B-',
    hospital: 'Square Hospital',
    district: 'Dhaka',
    contactNumber: '+880 1812 345678',
    urgencyLevel: 'Critical',
    additionalNotes: 'Accident victim needs immediate transfusion.',
    createdAt: '1 hour ago',
  },
  {
    id: 3,
    name: 'Kamal Hossain',
    bloodGroup: 'AB+',
    hospital: 'Chittagong Medical College',
    district: 'Chittagong',
    contactNumber: '+880 1912 345678',
    urgencyLevel: 'Medium',
    additionalNotes: 'Scheduled surgery next week.',
    createdAt: '3 hours ago',
  },
];

const RequestBlood = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    bloodGroup: '',
    hospital: '',
    district: '',
    urgencyLevel: 'Medium',
    additionalNotes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'contactNumber', 'bloodGroup', 'hospital', 'district'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    }
    
    // Validate phone number format
    const phoneRegex = /^\+?[0-9\s]{10,15}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      return 'Please enter a valid contact number';
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Request Submitted",
        description: "Your blood request has been submitted successfully. Donors will be notified.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        contactNumber: '',
        bloodGroup: '',
        hospital: '',
        district: '',
        urgencyLevel: 'Medium',
        additionalNotes: '',
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Hero section */}
        <div className="bg-gradient-to-br from-background via-background/95 to-primary/10 py-12 sm:py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark-pattern opacity-50"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <Badge 
                className="mb-4 text-xs font-semibold px-3 py-1 bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5"
                variant="outline"
              >
                <Bell className="h-3.5 w-3.5" />
                Request Blood
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                Request <span className="text-primary text-glow-primary">Blood Donors</span> for Emergency
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Submit a request for blood donation. Nearby donors will be immediately notified 
                to help you or your loved ones during this critical time.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Request Form */}
              <div className="lg:col-span-2">
                <Card className="bg-background/95 backdrop-blur-md border-primary/10 shadow-glow overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-primary" />
                      Blood Request Form
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                      Fill out the details below to submit your blood request. All fields marked with * are required.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-400">
                            Patient Name *
                          </Label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              placeholder="Enter full name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="h-11 bg-secondary/20 border-secondary/50 pl-10"
                            />
                            <User className="h-4 w-4 text-gray-500 absolute left-3 top-3.5" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-400">
                            Contact Number *
                          </Label>
                          <div className="relative">
                            <Input
                              id="contactNumber"
                              name="contactNumber"
                              placeholder="+880 1XX XXXX XXX"
                              value={formData.contactNumber}
                              onChange={handleChange}
                              required
                              className="h-11 bg-secondary/20 border-secondary/50 pl-10"
                            />
                            <Phone className="h-4 w-4 text-gray-500 absolute left-3 top-3.5" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-400">
                            Blood Group *
                          </Label>
                          <Select
                            value={formData.bloodGroup}
                            onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                            required
                          >
                            <SelectTrigger id="bloodGroup" className="h-11 bg-secondary/20 border-secondary/50">
                              <SelectValue placeholder="Select Blood Group" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-secondary/50">
                              {bloodGroups.map(group => (
                                <SelectItem key={group} value={group}>{group}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="district" className="text-sm font-medium text-gray-400">
                            District *
                          </Label>
                          <Select
                            value={formData.district}
                            onValueChange={(value) => handleSelectChange('district', value)}
                            required
                          >
                            <SelectTrigger id="district" className="h-11 bg-secondary/20 border-secondary/50">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-secondary/50 max-h-[260px]">
                              {districts.map(district => (
                                <SelectItem key={district} value={district}>{district}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hospital" className="text-sm font-medium text-gray-400">
                          Hospital/Location *
                        </Label>
                        <div className="relative">
                          <Input
                            id="hospital"
                            name="hospital"
                            placeholder="Enter hospital or location name"
                            value={formData.hospital}
                            onChange={handleChange}
                            required
                            className="h-11 bg-secondary/20 border-secondary/50 pl-10"
                          />
                          <MapPin className="h-4 w-4 text-gray-500 absolute left-3 top-3.5" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-400">
                          Urgency Level *
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className={cn(
                            "border rounded-md p-3 cursor-pointer transition-all",
                            formData.urgencyLevel === 'Low' 
                              ? "border-blue-500/50 bg-blue-500/10" 
                              : "border-secondary/50 bg-secondary/20 hover:border-blue-500/30 hover:bg-blue-500/5"
                          )}
                          onClick={() => handleSelectChange('urgencyLevel', 'Low')}>
                            <div className="text-center">
                              <div className="mb-1 flex justify-center">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full", 
                                    formData.urgencyLevel === 'Low' ? "bg-blue-500" : "bg-blue-500/40"
                                  )}></div>
                                </div>
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-blue-400">Low</div>
                              <div className="text-xs text-gray-500 mt-1">Within a week</div>
                            </div>
                          </div>
                          
                          <div className={cn(
                            "border rounded-md p-3 cursor-pointer transition-all",
                            formData.urgencyLevel === 'Medium' 
                              ? "border-amber-500/50 bg-amber-500/10" 
                              : "border-secondary/50 bg-secondary/20 hover:border-amber-500/30 hover:bg-amber-500/5"
                          )}
                          onClick={() => handleSelectChange('urgencyLevel', 'Medium')}>
                            <div className="text-center">
                              <div className="mb-1 flex justify-center">
                                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full", 
                                    formData.urgencyLevel === 'Medium' ? "bg-amber-500" : "bg-amber-500/40"
                                  )}></div>
                                </div>
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-amber-400">Medium</div>
                              <div className="text-xs text-gray-500 mt-1">2-3 days</div>
                            </div>
                          </div>
                          
                          <div className={cn(
                            "border rounded-md p-3 cursor-pointer transition-all",
                            formData.urgencyLevel === 'High' 
                              ? "border-orange-500/50 bg-orange-500/10" 
                              : "border-secondary/50 bg-secondary/20 hover:border-orange-500/30 hover:bg-orange-500/5"
                          )}
                          onClick={() => handleSelectChange('urgencyLevel', 'High')}>
                            <div className="text-center">
                              <div className="mb-1 flex justify-center">
                                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full", 
                                    formData.urgencyLevel === 'High' ? "bg-orange-500" : "bg-orange-500/40"
                                  )}></div>
                                </div>
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-orange-400">High</div>
                              <div className="text-xs text-gray-500 mt-1">Within 24h</div>
                            </div>
                          </div>
                          
                          <div className={cn(
                            "border rounded-md p-3 cursor-pointer transition-all",
                            formData.urgencyLevel === 'Critical' 
                              ? "border-primary/50 bg-primary/10" 
                              : "border-secondary/50 bg-secondary/20 hover:border-primary/30 hover:bg-primary/5"
                          )}
                          onClick={() => handleSelectChange('urgencyLevel', 'Critical')}>
                            <div className="text-center">
                              <div className="mb-1 flex justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full", 
                                    formData.urgencyLevel === 'Critical' ? "bg-primary" : "bg-primary/40"
                                  )}></div>
                                </div>
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-primary">Critical</div>
                              <div className="text-xs text-gray-500 mt-1">Immediate</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-400">
                          Additional Notes
                        </Label>
                        <Textarea
                          id="additionalNotes"
                          name="additionalNotes"
                          placeholder="Any additional information that may help donors (e.g., reason for transfusion, patient condition)"
                          value={formData.additionalNotes}
                          onChange={handleChange}
                          rows={3}
                          className="bg-secondary/20 border-secondary/50"
                        />
                      </div>
                      
                      <Alert className="bg-secondary/30 border-primary/20">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-white text-sm">Important Notice</AlertTitle>
                        <AlertDescription className="text-gray-400 text-xs">
                          Your contact details will be verified via OTP before your request is published 
                          to ensure authenticity and prevent misuse.
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 shadow-glow" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-5 w-5" />
                            Submit Blood Request
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </Card>
              </div>

              {/* Recent Requests */}
              <div>
                <div className="sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      Recent Requests
                    </h3>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-400 h-8">
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {emergencyRequests.map(request => (
                      <Card key={request.id} className="bg-secondary/30 border-secondary/40 overflow-hidden hover:border-primary/30 transition-all duration-300">
                        <div className="p-3 sm:p-4">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white text-sm sm:text-base truncate">{request.name}</h4>
                                <Badge 
                                  className={cn(
                                    "text-xs whitespace-nowrap",
                                    request.urgencyLevel === 'Critical' ? 'bg-primary/20 text-primary border-primary/20' : 
                                    request.urgencyLevel === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 
                                    'bg-amber-500/20 text-amber-400 border-amber-500/20'
                                  )}
                                  variant="outline"
                                >
                                  {request.urgencyLevel}
                                </Badge>
                              </div>
                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{request.hospital}, {request.district}</span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-bold text-white bg-primary text-sm sm:text-base">
                                {request.bloodGroup}
                              </div>
                            </div>
                          </div>
                          
                          {request.additionalNotes && (
                            <p className="text-xs text-gray-400 my-2 line-clamp-2 bg-secondary/50 p-2 rounded-md">
                              {request.additionalNotes}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {request.createdAt}
                            </div>
                            
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                                <Share2 className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                              <a 
                                href={`https://wa.me/${request.contactNumber.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center h-7 w-7 bg-[#25D366] rounded-full text-white"
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
                  
                  <Alert className="mt-6 bg-secondary/30 border-secondary/50">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <AlertTitle className="text-white text-sm">Safety First</AlertTitle>
                    <AlertDescription className="text-gray-400 text-xs">
                      Always verify the requester's identity and hospital details before proceeding with donation.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestBlood;
