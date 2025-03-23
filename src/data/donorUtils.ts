import { Donor, donorManager, formatDate, findDivisionForDistrict, canDonate } from './donors';
import { bloodGroups, districts } from './districts';

/**
 * Utilities for managing donor data including import/export and data validation
 */

// Validate a donor record
export const validateDonor = (donor: Partial<Donor>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!donor.name || donor.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters');
  }
  
  if (!donor.bloodGroup || !bloodGroups.includes(donor.bloodGroup)) {
    errors.push('Blood group must be valid (A+, A-, B+, B-, AB+, AB-, O+, O-)');
  }
  
  if (!donor.district || !districts.includes(donor.district)) {
    errors.push('District must be a valid Bangladesh district');
  }
  
  if (donor.contactNumber && !/^\+880\d{10}$/.test(donor.contactNumber)) {
    errors.push('Contact number must be a valid Bangladesh number (+880xxxxxxxxxx)');
  }
  
  if (donor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.email)) {
    errors.push('Email must be valid');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate a new donor ID
export const generateDonorId = (): string => {
  const currentDonors = donorManager.getAllDonors();
  const lastId = currentDonors.length > 0 
    ? parseInt(currentDonors[currentDonors.length - 1].id.substring(1))
    : 0;
  return `D${(lastId + 1).toString().padStart(6, '0')}`;
};

// Add a new donor with validation
export const addNewDonor = (donorData: Partial<Donor>): { success: boolean; message: string; donor?: Donor } => {
  const validation = validateDonor(donorData);
  
  if (!validation.isValid) {
    return {
      success: false,
      message: `Validation failed: ${validation.errors.join(', ')}`
    };
  }
  
  // Set default values for missing fields
  const district = donorData.district || 'Dhaka';
  const now = new Date();
  const lastDonationDate = donorData.lastDonationDate || formatDate(new Date(now.setMonth(now.getMonth() - 3))); // Default 3 months ago
  
  const newDonor: Donor = {
    id: generateDonorId(),
    name: donorData.name || '',
    bloodGroup: donorData.bloodGroup || 'O+',
    district: district,
    division: donorData.division || findDivisionForDistrict(district),
    lastDonationDate: lastDonationDate,
    contactNumber: donorData.contactNumber || '+880XXXXXXXXXX',
    email: donorData.email,
    isVerified: donorData.isVerified !== undefined ? donorData.isVerified : false,
    canDonate: donorData.canDonate !== undefined ? donorData.canDonate : canDonate(lastDonationDate),
    donationCount: donorData.donationCount || 0,
    dateJoined: donorData.dateJoined || formatDate(new Date()),
    address: donorData.address,
    availableTimePreference: donorData.availableTimePreference || ['Any Time'],
    medicalConditions: donorData.medicalConditions
  };
  
  donorManager.addDonor(newDonor);
  
  return {
    success: true,
    message: 'Donor added successfully',
    donor: newDonor
  };
};

// Convert donor data to CSV format
export const exportDonorsToCSV = (): string => {
  const donors = donorManager.getAllDonors();
  const headers = [
    'ID', 'Name', 'Blood Group', 'District', 'Division', 
    'Last Donation Date', 'Contact Number', 'Email', 
    'Verified', 'Can Donate', 'Donation Count', 'Date Joined',
    'Address', 'Available Time', 'Medical Conditions'
  ];
  
  const csvRows = [
    headers.join(','), // Header row
    ...donors.map(donor => [
      donor.id,
      `"${donor.name.replace(/"/g, '""')}"`, // Escape quotes in name
      donor.bloodGroup,
      donor.district,
      donor.division,
      donor.lastDonationDate,
      donor.contactNumber,
      donor.email || '',
      donor.isVerified ? 'Yes' : 'No',
      donor.canDonate ? 'Yes' : 'No',
      donor.donationCount.toString(),
      donor.dateJoined,
      donor.address ? `"${donor.address.replace(/"/g, '""')}"` : '',
      donor.availableTimePreference ? `"${donor.availableTimePreference.join(', ')}"` : '',
      donor.medicalConditions ? `"${donor.medicalConditions.join(', ')}"` : ''
    ].join(','))
  ];
  
  return csvRows.join('\n');
};

// Parse CSV data and import donors
export const importDonorsFromCSV = (csvData: string): { 
  success: boolean; 
  message: string; 
  imported: number; 
  errors: number; 
  errorDetails?: string[] 
} => {
  const errorDetails: string[] = [];
  let imported = 0;
  let errors = 0;
  
  try {
    // Split by lines and get headers
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    // Define column indices
    const idIndex = headers.indexOf('ID');
    const nameIndex = headers.indexOf('Name');
    const bloodGroupIndex = headers.indexOf('Blood Group');
    const districtIndex = headers.indexOf('District');
    const divisionIndex = headers.indexOf('Division');
    const lastDonationDateIndex = headers.indexOf('Last Donation Date');
    const contactNumberIndex = headers.indexOf('Contact Number');
    const emailIndex = headers.indexOf('Email');
    const verifiedIndex = headers.indexOf('Verified');
    const canDonateIndex = headers.indexOf('Can Donate');
    const donationCountIndex = headers.indexOf('Donation Count');
    const dateJoinedIndex = headers.indexOf('Date Joined');
    const addressIndex = headers.indexOf('Address');
    const availableTimeIndex = headers.indexOf('Available Time');
    const medicalConditionsIndex = headers.indexOf('Medical Conditions');
    
    // Check if required columns exist
    if (nameIndex === -1 || bloodGroupIndex === -1 || districtIndex === -1) {
      return {
        success: false,
        message: 'CSV format is invalid. Required columns: Name, Blood Group, District',
        imported,
        errors: 1,
        errorDetails: ['Missing required columns']
      };
    }
    
    // Parse each line (skip header)
    const parsedDonors: Donor[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      // Handle quoted values with commas inside correctly
      const values: string[] = [];
      let value = '';
      let inQuotes = false;
      
      // Simple CSV parser
      for (let char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(value);
          value = '';
        } else {
          value += char;
        }
      }
      values.push(value); // Add the last value
      
      try {
        // Create donor object from CSV
        const donor: Partial<Donor> = {
          name: values[nameIndex].replace(/^"|"$/g, ''),
          bloodGroup: values[bloodGroupIndex],
          district: values[districtIndex],
        };
        
        // Add optional fields if they exist
        if (idIndex !== -1 && values[idIndex]) donor.id = values[idIndex];
        if (divisionIndex !== -1) donor.division = values[divisionIndex] || findDivisionForDistrict(donor.district || '');
        if (lastDonationDateIndex !== -1) donor.lastDonationDate = values[lastDonationDateIndex];
        if (contactNumberIndex !== -1) donor.contactNumber = values[contactNumberIndex];
        if (emailIndex !== -1) donor.email = values[emailIndex];
        if (verifiedIndex !== -1) donor.isVerified = values[verifiedIndex].toLowerCase() === 'yes';
        if (canDonateIndex !== -1) donor.canDonate = values[canDonateIndex].toLowerCase() === 'yes';
        if (donationCountIndex !== -1) donor.donationCount = parseInt(values[donationCountIndex]) || 0;
        if (dateJoinedIndex !== -1) donor.dateJoined = values[dateJoinedIndex];
        if (addressIndex !== -1) donor.address = values[addressIndex].replace(/^"|"$/g, '');
        if (availableTimeIndex !== -1) {
          const timeValue = values[availableTimeIndex].replace(/^"|"$/g, '');
          donor.availableTimePreference = timeValue ? timeValue.split(', ') : undefined;
        }
        if (medicalConditionsIndex !== -1) {
          const conditionsValue = values[medicalConditionsIndex].replace(/^"|"$/g, '');
          donor.medicalConditions = conditionsValue ? conditionsValue.split(', ') : undefined;
        }
        
        // Validate donor
        const validation = validateDonor(donor);
        
        if (validation.isValid) {
          if (!donor.id) {
            donor.id = generateDonorId();
          }
          
          // Set any missing required fields
          const completeDonor: Donor = {
            id: donor.id || generateDonorId(),
            name: donor.name || '',
            bloodGroup: donor.bloodGroup || 'O+',
            district: donor.district || 'Dhaka',
            division: donor.division || findDivisionForDistrict(donor.district || 'Dhaka'),
            lastDonationDate: donor.lastDonationDate || formatDate(new Date()),
            contactNumber: donor.contactNumber || '+880XXXXXXXXXX',
            email: donor.email,
            isVerified: donor.isVerified !== undefined ? donor.isVerified : false,
            canDonate: donor.canDonate !== undefined ? donor.canDonate : true,
            donationCount: donor.donationCount || 0,
            dateJoined: donor.dateJoined || formatDate(new Date()),
            address: donor.address,
            availableTimePreference: donor.availableTimePreference,
            medicalConditions: donor.medicalConditions
          };
          
          parsedDonors.push(completeDonor);
          imported++;
        } else {
          errorDetails.push(`Row ${i}: ${validation.errors.join(', ')}`);
          errors++;
        }
      } catch (err) {
        errorDetails.push(`Error parsing row ${i}: ${(err as Error).message}`);
        errors++;
      }
    }
    
    // Add valid donors
    if (parsedDonors.length > 0) {
      donorManager.addDonors(parsedDonors);
    }
    
    return {
      success: imported > 0,
      message: `Imported ${imported} donors. Encountered ${errors} errors.`,
      imported,
      errors,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to parse CSV: ${(err as Error).message}`,
      imported,
      errors: 1,
      errorDetails: [(err as Error).message]
    };
  }
};

// Generate a sample CSV template
export const generateCSVTemplate = (): string => {
  const headers = [
    'Name', 'Blood Group', 'District', 'Last Donation Date', 
    'Contact Number', 'Email', 'Verified', 'Donation Count'
  ];
  
  const sampleData = [
    '"Ahmed Khan","A+","Dhaka","15 Jan 2023","+8801712345678","ahmed.khan@example.com","Yes","3"',
    '"Fatima Rahman","O-","Chittagong","02 Mar 2023","+8801812345678","fatima.rahman@example.com","No","1"'
  ];
  
  return [headers.join(','), ...sampleData].join('\n');
};

// Download donors data as JSON
export const exportDonorsToJSON = (): string => {
  const donors = donorManager.getAllDonors();
  return JSON.stringify(donors, null, 2);
};

// Import donors from JSON
export const importDonorsFromJSON = (jsonData: string): { 
  success: boolean; 
  message: string; 
  imported: number; 
} => {
  try {
    const donors = JSON.parse(jsonData) as Donor[];
    
    if (!Array.isArray(donors)) {
      return {
        success: false,
        message: 'JSON data is not an array of donors',
        imported: 0
      };
    }
    
    donorManager.importDonors(donors);
    
    return {
      success: true,
      message: `Successfully imported ${donors.length} donors`,
      imported: donors.length
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to parse JSON: ${(err as Error).message}`,
      imported: 0
    };
  }
}; 