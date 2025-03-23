import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DonorManager from '@/components/admin/DonorManager';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Droplet, 
  UserCheck, 
  BarChart3,
  MapPin,
  CalendarDays,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { donorManager } from '@/data/donors';
import { bloodGroups, districts } from '@/data/districts';

const AdminDashboard = () => {
  const allDonors = donorManager.getAllDonors();
  const verifiedDonors = donorManager.getVerifiedDonors();
  const availableDonors = donorManager.getAvailableDonors();
  
  // Calculate stats
  const donorsByBloodGroup = bloodGroups.map(group => ({
    group,
    count: allDonors.filter(donor => donor.bloodGroup === group).length
  })).sort((a, b) => b.count - a.count);
  
  const donorsByDistrict = Object.keys(districts || {}).map(district => ({
    district,
    count: allDonors.filter(donor => donor.district === district).length
  })).sort((a, b) => b.count - a.count);
  
  return (
    <Layout>
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage blood donors and view statistics</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/20 py-1.5 px-3"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Admin Access
            </Badge>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-5 bg-secondary/20 border-secondary/40">
            <div className="flex justify-between mb-3">
              <div className="text-gray-400 font-medium">Total Donors</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{allDonors.length}</div>
            <div className="text-xs text-gray-400">From {donorsByDistrict.length} districts</div>
          </Card>
          
          <Card className="p-5 bg-secondary/20 border-secondary/40">
            <div className="flex justify-between mb-3">
              <div className="text-gray-400 font-medium">Verified Donors</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{verifiedDonors.length}</div>
            <div className="text-xs text-gray-400">
              {Math.round((verifiedDonors.length / allDonors.length) * 100)}% of total donors
            </div>
          </Card>
          
          <Card className="p-5 bg-secondary/20 border-secondary/40">
            <div className="flex justify-between mb-3">
              <div className="text-gray-400 font-medium">Available Donors</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{availableDonors.length}</div>
            <div className="text-xs text-gray-400">
              {Math.round((availableDonors.length / allDonors.length) * 100)}% of total donors
            </div>
          </Card>
          
          <Card className="p-5 bg-secondary/20 border-secondary/40">
            <div className="flex justify-between mb-3">
              <div className="text-gray-400 font-medium">Most Common Blood Type</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Droplet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {donorsByBloodGroup[0]?.group || 'N/A'}
            </div>
            <div className="text-xs text-gray-400">
              {donorsByBloodGroup[0]?.count || 0} donors ({Math.round(((donorsByBloodGroup[0]?.count || 0) / allDonors.length) * 100)}%)
            </div>
          </Card>
        </div>
        
        {/* Main dashboard content */}
        <Tabs defaultValue="donors" className="w-full">
          <TabsList className="mb-6 bg-secondary/40">
            <TabsTrigger value="donors">Donor Management</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="donors">
            <DonorManager />
          </TabsContent>
          
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-5 bg-secondary/20 border-secondary/40">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Droplet className="h-5 w-5 mr-2 text-primary" />
                  Donors by Blood Group
                </h3>
                
                <div className="space-y-3">
                  {donorsByBloodGroup.map(({ group, count }) => (
                    <div key={group} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge 
                          className="h-7 w-7 rounded-full mr-3 bg-primary text-white flex items-center justify-center p-0"
                        >
                          {group}
                        </Badge>
                        <span className="text-gray-300">{group} Group</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2.5 bg-secondary/80 rounded-full overflow-hidden mr-3">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.max(5, (count / allDonors.length) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm font-medium w-7 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-5 bg-secondary/20 border-secondary/40">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Donors by Division
                </h3>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {donorsByDistrict.map(({ district, count }) => (
                    <div key={district} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-300">{district}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2.5 bg-secondary/80 rounded-full overflow-hidden mr-3">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.max(5, (count / allDonors.length) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm font-medium w-7 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-5 bg-secondary/20 border-secondary/40 md:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Donors Availability Status
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-36 h-36 rounded-full border-8 border-primary relative mb-4 flex items-center justify-center">
                      <div className="text-3xl font-bold text-white">
                        {Math.round((availableDonors.length / allDonors.length) * 100)}%
                      </div>
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-secondary"
                        style={{ 
                          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                          opacity: 0.3
                        }}
                      ></div>
                    </div>
                    <div className="text-lg font-medium text-white">Available Donors</div>
                    <div className="text-sm text-gray-400">Can donate right now</div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Available Now</span>
                        <span className="text-gray-400 text-sm">{availableDonors.length} donors</span>
                      </div>
                      <div className="w-full h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(availableDonors.length / allDonors.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Unavailable</span>
                        <span className="text-gray-400 text-sm">{allDonors.length - availableDonors.length} donors</span>
                      </div>
                      <div className="w-full h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-600 rounded-full"
                          style={{ width: `${((allDonors.length - availableDonors.length) / allDonors.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Verified (Available)</span>
                        <span className="text-gray-400 text-sm">
                          {availableDonors.filter(d => d.isVerified).length} donors
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ 
                            width: `${(availableDonors.filter(d => d.isVerified).length / allDonors.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard; 