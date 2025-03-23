import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Activity, 
  Shield, 
  Droplet, 
  Clock, 
  Edit, 
  Save,
  AlertTriangle
} from 'lucide-react';

// Extend the currentUser type to include all the fields we need
interface ExtendedUser {
  email: string;
  name?: string;
  phone?: string;
  location?: string;
  bloodGroup?: string;
  lastDonation?: string;
  avatar?: string;
}

const UserProfile = () => {
  const { currentUser: baseUser, userRole, isAuthenticated, logout } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create an extended user object that includes all the fields we need
  const currentUser: ExtendedUser = {
    ...(baseUser || { email: '' }),
    name: baseUser?.name || '',
    phone: baseUser?.phone || '',
    location: baseUser?.location || '',
    bloodGroup: baseUser?.bloodGroup || '',
    lastDonation: baseUser?.lastDonation || '',
    avatar: baseUser?.avatar || '',
  };
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    location: currentUser.location || '',
    bloodGroup: currentUser.bloodGroup || '',
    lastDonation: currentUser.lastDonation || '',
  });
  
  if (!isAuthenticated || !baseUser) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-10">
          <Card className="bg-secondary/20 border-secondary/40">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <h2 className="text-xl font-semibold text-white">Not Authenticated</h2>
                <p className="text-gray-400 text-center max-w-md">
                  You need to be logged in to view your profile. Please sign in to continue.
                </p>
                <Button onClick={() => navigate('/auth/login')} className="mt-4">
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // Update the authData in localStorage
    try {
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      
      // Update with new form data
      const updatedAuthData = {
        ...authData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bloodGroup: formData.bloodGroup,
        lastDonation: formData.lastDonation
      };
      
      // Save back to localStorage
      localStorage.setItem('auth', JSON.stringify(updatedAuthData));
      
      // Update the current user in the UI
      Object.assign(currentUser, formData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated. Refresh the page to see all changes.",
        variant: "default"
      });
      
      setEditing(false);
      
      // Force reload the page to ensure context is updated
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default"
    });
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-900/30 text-red-400 border-red-900/50' : 'bg-blue-900/30 text-blue-400 border-blue-900/50';
  };
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-primary/30 text-lg">
                  {getInitials(currentUser.name || '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-white">{currentUser.name || 'User'}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getRoleColor(userRole || '')}>
                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'}
                  </Badge>
                  {currentUser.bloodGroup && (
                    <Badge variant="outline" className="bg-primary/30 text-primary border-primary/50">
                      {currentUser.bloodGroup}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-secondary/30 border-secondary/60 hover:bg-secondary/50"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full bg-secondary/20 border border-secondary/40 p-1 mb-6">
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Donation Activity</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="bg-secondary/20 border-secondary/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-secondary/30 border-secondary/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-secondary/30 border-secondary/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-secondary/30 border-secondary/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="bg-secondary/30 border-secondary/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input 
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="bg-secondary/30 border-secondary/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastDonation">Last Donation Date</Label>
                      <Input 
                        id="lastDonation"
                        name="lastDonation"
                        type="date"
                        value={formData.lastDonation}
                        onChange={handleInputChange}
                        className="bg-secondary/30 border-secondary/60"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Full Name</p>
                          <p className="text-white">{currentUser.name || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="text-white">{currentUser.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white">{currentUser.location || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Droplet className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Blood Group</p>
                          <p className="text-white">{currentUser.bloodGroup || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Last Donation</p>
                          <p className="text-white">{currentUser.lastDonation || 'No record'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {editing && (
                <CardFooter className="flex justify-end space-x-2 border-t border-secondary/40 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="bg-secondary/20 border-secondary/40">
              <CardHeader>
                <CardTitle>Donation Activity</CardTitle>
                <CardDescription>Your blood donation history and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-secondary/30 border-secondary/60">
                      <CardContent className="p-4 text-center">
                        <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-sm text-gray-400">Total Donations</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary/30 border-secondary/60">
                      <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-sm text-gray-400">Months Since Last</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary/30 border-secondary/60">
                      <CardContent className="p-4 text-center">
                        <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-sm text-gray-400">Lives Saved</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Separator className="bg-secondary/60" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Recent Donations</h3>
                    
                    {/* If there are no donations */}
                    <div className="text-center py-8">
                      <Droplet className="h-10 w-10 mx-auto mb-3 text-gray-500" />
                      <p className="text-gray-400">No donation records found</p>
                      <p className="text-sm text-gray-500 mt-1">Your donation history will appear here</p>
                    </div>
                    
                    {/* Sample donations (would be dynamically generated in a real app) */}
                    {/* 
                    <div className="space-y-3">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-secondary/60">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-white font-medium">January 15, 2023</p>
                              <p className="text-sm text-gray-400">City Hospital Blood Bank</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-900/50">
                            Verified
                          </Badge>
                        </div>
                      ))}
                    </div>
                    */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-secondary/20 border-secondary/40">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Notification settings would go here */}
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg border border-secondary/60">
                      <div className="text-white">Email Notifications</div>
                      <Button variant="outline" size="sm" className="h-8">Enable</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg border border-secondary/60">
                      <div className="text-white">SMS Alerts</div>
                      <Button variant="outline" size="sm" className="h-8">Disable</Button>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-secondary/60" />
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-yellow-400 bg-yellow-900/20 border-yellow-900/40 hover:bg-yellow-900/30"
                    >
                      Reset Password
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-400 bg-red-900/20 border-red-900/40 hover:bg-red-900/30"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile; 