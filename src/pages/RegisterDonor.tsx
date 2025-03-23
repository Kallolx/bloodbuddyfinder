
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, Info, Calendar, PhoneCall, AlertCircle, CheckCircle, 
  Calendar as CalendarIcon, MapPin, MessageSquare, Shield, Heart 
} from 'lucide-react';
import { bloodGroups, districts } from '@/data/districts';
import { useToast } from '@/hooks/use-toast';

const RegisterDonor = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    bloodGroup: '',
    district: '',
    lastDonationDate: '',
    age: '',
    gender: '',
    weight: '',
    address: '',
    hasDonatedBefore: false,
    hasNoMedicalConditions: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateStep1 = () => {
    const requiredFields = ['name', 'contactNumber', 'bloodGroup', 'district'];
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

  const validateStep2 = () => {
    // Check consent checkboxes
    if (!formData.hasNoMedicalConditions) {
      return 'You must confirm that you have no medical conditions that prevent donation';
    }
    
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep1();
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateStep2();
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission with delay
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Thank you for registering as a blood donor. Your profile is now active.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        contactNumber: '',
        bloodGroup: '',
        district: '',
        lastDonationDate: '',
        age: '',
        gender: '',
        weight: '',
        address: '',
        hasDonatedBefore: false,
        hasNoMedicalConditions: false,
      });
      
      setIsSubmitting(false);
      setStep(1);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Register as a Blood Donor</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join our community of lifesavers by registering as a blood donor. Your donation can save up to three lives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Donor Registration</CardTitle>
                      <CardDescription>
                        {step === 1 ? 'Enter your basic information' : 'Complete your medical information'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                      <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Enter your full name"
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="lastDonationDate">Last Donation Date (if any)</Label>
                            <Input
                              id="lastDonationDate"
                              name="lastDonationDate"
                              type="date"
                              value={formData.lastDonationDate}
                              onChange={handleChange}
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                              value={formData.gender}
                              onValueChange={(value) => handleSelectChange('gender', value)}
                            >
                              <SelectTrigger id="gender">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              name="age"
                              type="number"
                              placeholder="Enter your age"
                              min="18"
                              max="65"
                              value={formData.age}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                              id="weight"
                              name="weight"
                              type="number"
                              placeholder="Enter your weight in kg"
                              min="50"
                              value={formData.weight}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <AlertTitle className="text-blue-800 dark:text-blue-300">Information Notice</AlertTitle>
                          <AlertDescription className="text-blue-700 dark:text-blue-400">
                            Your contact information will only be shared with blood requesters after they verify their identity.
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">Health Information</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="hasDonatedBefore" 
                              checked={formData.hasDonatedBefore}
                              onCheckedChange={(checked) => handleCheckboxChange('hasDonatedBefore', checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor="hasDonatedBefore"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                I have donated blood before
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Check this if you have previous blood donation experience.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="hasNoMedicalConditions" 
                              checked={formData.hasNoMedicalConditions}
                              onCheckedChange={(checked) => handleCheckboxChange('hasNoMedicalConditions', checked as boolean)}
                              required
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label 
                                htmlFor="hasNoMedicalConditions"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                I confirm that I do not have any medical conditions that prevent me from donating blood
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                I am in good health and eligible to donate blood.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Donation Eligibility</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            To be eligible for blood donation, you should:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>Be between 18-65 years of age</li>
                            <li>Weigh at least 50 kg</li>
                            <li>Have hemoglobin level of at least 12.5 g/dL</li>
                            <li>Be in good health and feeling well</li>
                            <li>Have no fever or active infections</li>
                            <li>Wait at least 3 months between donations</li>
                          </ul>
                        </div>
                        
                        <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          <AlertTitle className="text-red-800 dark:text-red-300">Important</AlertTitle>
                          <AlertDescription className="text-red-700 dark:text-red-400">
                            By registering, you agree to be contacted by blood requesters in emergency situations. You can always update your availability status.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                      {step === 2 ? (
                        <>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handlePrevStep}
                          >
                            Previous
                          </Button>
                          <Button 
                            type="submit" 
                            className="btn-hover" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>Processing...</>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Complete Registration
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          type="button" 
                          className="ml-auto btn-hover" 
                          onClick={handleNextStep}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div>
              <div className="sticky top-20 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Why Become a Donor?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Heart className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Save Lives</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          One donation can save up to three lives and help people with cancer, blood disorders, and trauma.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <PhoneCall className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Easy Communication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Connect directly with people in need through our platform. No middlemen involved.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Safety & Privacy</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your personal information is protected and only shared with verified requesters.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Verification Badge</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get a verified donor badge after your first donation to build trust in the community.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Donor Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="features">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                      </TabsList>
                      <TabsContent value="features" className="space-y-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Trusted Donor Badge
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Donation Reminders
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                            <MapPin className="h-3 w-3 mr-1" />
                            Priority in Local Requests
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Direct Communication
                          </Badge>
                        </div>
                      </TabsContent>
                      <TabsContent value="faq" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">How often can I donate?</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            You can donate whole blood every 3 months (90 days).
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Will I get paid for donation?</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            No, this is a voluntary platform for humanitarian purposes only.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">How do I update my availability?</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            You can update your donor profile at any time from your account settings.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterDonor;
