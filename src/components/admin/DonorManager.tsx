import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Donor, donorManager } from '@/data/donors';
import { bloodGroups, districts, divisionDistricts } from '@/data/districts';
import { 
  exportDonorsToCSV, 
  exportDonorsToJSON, 
  importDonorsFromCSV, 
  importDonorsFromJSON,
  generateCSVTemplate,
  addNewDonor
} from '@/data/donorUtils';
import { Download, Upload, Plus, AlertCircle, Info, Users, FileText, Copy, UserPlus } from 'lucide-react';

export const DonorManager = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isAddDonorDialogOpen, setIsAddDonorDialogOpen] = useState(false);
  const [importResult, setImportResult] = useState<{
    success?: boolean;
    message: string;
    imported?: number;
    errors?: number;
    errorDetails?: string[];
  } | null>(null);
  
  const [newDonor, setNewDonor] = useState<Partial<Donor>>({
    name: '',
    bloodGroup: 'O+',
    district: 'Dhaka',
    isVerified: false,
  });
  
  const [addDonorResult, setAddDonorResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalDonors = donorManager.getAllDonors().length;
  
  const handleExportCSV = () => {
    const csv = exportDonorsToCSV();
    downloadFile(csv, 'donors.csv', 'text/csv');
  };
  
  const handleExportJSON = () => {
    const json = exportDonorsToJSON();
    downloadFile(json, 'donors.json', 'application/json');
  };
  
  const handleExportTemplate = () => {
    const template = generateCSVTemplate();
    downloadFile(template, 'donor_template.csv', 'text/csv');
  };
  
  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (file.name.endsWith('.csv')) {
        const result = importDonorsFromCSV(content);
        setImportResult(result);
      } else if (file.name.endsWith('.json')) {
        const result = importDonorsFromJSON(content);
        setImportResult(result);
      } else {
        setImportResult({
          success: false,
          message: 'Unsupported file format. Please use CSV or JSON.',
        });
      }
    };
    reader.readAsText(file);
  };
  
  const handleAddDonor = () => {
    const result = addNewDonor(newDonor);
    setAddDonorResult(result);
    if (result.success) {
      setNewDonor({
        name: '',
        bloodGroup: 'O+',
        district: 'Dhaka',
        isVerified: false,
      });
      setTimeout(() => {
        setIsAddDonorDialogOpen(false);
        setAddDonorResult(null);
      }, 1500);
    }
  };
  
  const handleNewDonorChange = (field: keyof Donor, value: any) => {
    setNewDonor(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Donor Management</h2>
          <p className="text-gray-400 mt-1">
            Manage your blood donor database with import/export functionality
          </p>
        </div>
        
        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1 px-3 py-1.5">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">{totalDonors} Donors</span>
        </Badge>
      </div>
      
      <Card className="p-6 bg-secondary/20 border-secondary/40">
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="mb-6 bg-secondary/40">
            <TabsTrigger value="add">Add Donors</TabsTrigger>
            <TabsTrigger value="import">Import / Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <div className="text-center p-4 bg-secondary/10 rounded-lg border border-dashed border-secondary/40">
              <UserPlus className="h-10 w-10 text-primary/60 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-2">Add New Donors</h3>
              <p className="text-gray-400 mb-4">
                Add donors individually or bulk upload from a spreadsheet
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Dialog open={isAddDonorDialogOpen} onOpenChange={setIsAddDonorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" /> 
                      Add Individual Donor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Donor</DialogTitle>
                      <DialogDescription>
                        Enter donor details. All fields marked with * are required.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name"
                          value={newDonor.name}
                          onChange={(e) => handleNewDonorChange('name', e.target.value)}
                          placeholder="Enter donor's full name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup">Blood Group *</Label>
                          <Select 
                            value={newDonor.bloodGroup} 
                            onValueChange={(value) => handleNewDonorChange('bloodGroup', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
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
                            value={newDonor.district} 
                            onValueChange={(value) => handleNewDonorChange('district', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {districts.map(district => (
                                <SelectItem key={district} value={district}>{district}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactNumber">Contact Number</Label>
                          <Input 
                            id="contactNumber"
                            value={newDonor.contactNumber || ''}
                            onChange={(e) => handleNewDonorChange('contactNumber', e.target.value)}
                            placeholder="+880XXXXXXXXXX"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={newDonor.email || ''}
                            onChange={(e) => handleNewDonorChange('email', e.target.value)}
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="verified"
                          checked={newDonor.isVerified || false}
                          onCheckedChange={(checked) => handleNewDonorChange('isVerified', checked)}
                        />
                        <Label htmlFor="verified">Verified Donor</Label>
                      </div>
                    </div>
                    
                    {addDonorResult && (
                      <Alert className={addDonorResult.success ? "bg-green-950 border-green-800" : "bg-red-950 border-red-900"}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{addDonorResult.success ? "Success" : "Error"}</AlertTitle>
                        <AlertDescription>{addDonorResult.message}</AlertDescription>
                      </Alert>
                    )}
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDonorDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90" onClick={handleAddDonor}>
                        Add Donor
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Upload className="h-4 w-4 mr-2" /> 
                      Bulk Import
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Donors</DialogTitle>
                      <DialogDescription>
                        Upload a CSV or JSON file containing donor information
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="text-center p-6 bg-secondary/20 rounded-lg border border-dashed border-secondary/50">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-sm font-medium text-white mb-1">Upload Donor Data</h3>
                        <p className="text-xs text-gray-400 mb-3">
                          Drag and drop or click to browse
                        </p>
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef}
                          accept=".csv,.json" 
                          onChange={handleFileChange}
                        />
                        <Button 
                          variant="outline" 
                          className="border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">
                          <Info className="h-4 w-4 inline-block mr-1" />
                          Need a template?
                        </p>
                        <Button 
                          variant="ghost" 
                          className="text-sm h-8 px-3 text-gray-400 hover:text-white"
                          onClick={handleExportTemplate}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Download Template
                        </Button>
                      </div>
                      
                      {importResult && (
                        <Alert className={importResult.success ? "bg-green-950 border-green-800" : "bg-red-950 border-red-900"}>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>{importResult.success ? "Success" : "Error"}</AlertTitle>
                          <AlertDescription>
                            {importResult.message}
                            {importResult.errorDetails && importResult.errorDetails.length > 0 && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs">Show error details</summary>
                                <ul className="mt-2 text-xs space-y-1 list-disc pl-4">
                                  {importResult.errorDetails.slice(0, 5).map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                  {importResult.errorDetails.length > 5 && (
                                    <li>...and {importResult.errorDetails.length - 5} more errors</li>
                                  )}
                                </ul>
                              </details>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-5 bg-secondary/20 border-secondary/40">
                <h3 className="text-lg font-medium text-white mb-4">Export Data</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Download your donor database for backup or offline editing
                </p>
                
                <div className="space-y-3">
                  <Button className="w-full justify-start" onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-secondary/60"
                    onClick={handleExportJSON}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
              </Card>
              
              <Card className="p-5 bg-secondary/20 border-secondary/40">
                <h3 className="text-lg font-medium text-white mb-4">Import Options</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Upload donor records from external sources
                </p>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-primary hover:bg-primary/90"
                    onClick={() => setIsImportDialogOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Donors
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-secondary/60"
                    onClick={handleExportTemplate}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Get CSV Template
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DonorManager; 