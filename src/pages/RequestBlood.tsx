
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Clock, MapPin, Heart, CheckCircle, Phone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Request Blood</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Submit a blood request for yourself or someone in need. Nearby donors will be notified to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Request Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Blood Request Form</CardTitle>
                  <CardDescription>
                    Fill out the details to submit a blood request. All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter patient's full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number *</Label>
                        <Input
                          id="contactNumber"
                          name="contactNumber"
                          placeholder="+880 1XX XXXX XXX"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group *</Label>
                        <Select
                          value={formData.bloodGroup}
                          onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                          required
                        >
                          <SelectTrigger id="bloodGroup">
                            <SelectValue placeholder="Select Blood Group" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodGroups.map(group => (
                              <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="district">District *</Label>
                        <Select
                          value={formData.district}
                          onValueChange={(value) => handleSelectChange('district', value)}
                          required
                        >
                          <SelectTrigger id="district">
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map(district => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital/Location *</Label>
                      <Input
                        id="hospital"
                        name="hospital"
                        placeholder="Enter hospital or location name"
                        value={formData.hospital}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Urgency Level *</Label>
                      <RadioGroup
                        value={formData.urgencyLevel}
                        onValueChange={(value) => handleSelectChange('urgencyLevel', value)}
                        className="flex flex-wrap gap-6"
                        required
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Low" id="urgency-low" />
                          <Label htmlFor="urgency-low" className="text-blue-600 dark:text-blue-400 font-medium">Low (Within a week)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Medium" id="urgency-medium" />
                          <Label htmlFor="urgency-medium" className="text-amber-600 dark:text-amber-400 font-medium">Medium (Within 2-3 days)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="High" id="urgency-high" />
                          <Label htmlFor="urgency-high" className="text-orange-600 dark:text-orange-400 font-medium">High (Within 24 hours)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Critical" id="urgency-critical" />
                          <Label htmlFor="urgency-critical" className="text-red-600 dark:text-red-400 font-medium">Critical (Immediate)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        placeholder="Any additional information that may help donors (e.g., reason for transfusion, patient condition)"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                    
                    <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <AlertTitle className="text-blue-800 dark:text-blue-300">Verification Notice</AlertTitle>
                      <AlertDescription className="text-blue-700 dark:text-blue-400">
                        Your contact details will be verified via OTP before your request is published to ensure authenticity.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-hover" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Submitting Request...</>
                      ) : (
                        <>
                          <Heart className="mr-2 h-5 w-5" />
                          Submit Blood Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Recent Requests */}
            <div>
              <div className="sticky top-20">
                <h3 className="text-xl font-semibold mb-4">Recent Blood Requests</h3>
                
                <div className="space-y-4">
                  {emergencyRequests.map(request => (
                    <Card key={request.id} className="overflow-hidden card-hover">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-gray-900 dark:text-white">{request.name}</h4>
                              <Badge 
                                className={
                                  request.urgencyLevel === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 ml-2' : 
                                  request.urgencyLevel === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 ml-2' : 
                                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ml-2'
                                }
                              >
                                {request.urgencyLevel}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {request.hospital}, {request.district}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-white bg-primary">
                              {request.bloodGroup}
                            </div>
                          </div>
                        </div>
                        
                        {request.additionalNotes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 my-2 line-clamp-2">
                            {request.additionalNotes}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Posted {request.createdAt}
                          </div>
                          
                          <Button variant="default" size="sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <Button variant="outline" className="w-full">
                    View All Requests
                  </Button>
                </div>
                
                <Alert className="mt-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">Beware of scams</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    Always verify the requester's identity and hospital details before proceeding with donation.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestBlood;
