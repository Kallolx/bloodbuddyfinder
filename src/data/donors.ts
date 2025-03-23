import { bloodGroups, districts, divisionDistricts } from './districts';

// Define donor interface for proper typing
export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  district: string;
  division: string;
  lastDonationDate: string;
  contactNumber: string;
  email?: string;
  isVerified: boolean;
  canDonate: boolean;
  donationCount: number;
  dateJoined: string;
  address?: string;
  availableTimePreference?: string[];
  medicalConditions?: string[];
}

// Format date as DD MMM YYYY
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Calculate days since last donation
export const daysSinceLastDonation = (lastDonationDate: string): number => {
  const lastDonation = new Date(lastDonationDate);
  const now = new Date();
  const differenceInTime = now.getTime() - lastDonation.getTime();
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
};

// Check if donor can donate (90 days since last donation)
export const canDonate = (lastDonationDate: string): boolean => {
  return daysSinceLastDonation(lastDonationDate) >= 90;
};

// Find division for a district
export const findDivisionForDistrict = (district: string): string => {
  for (const [division, divDistricts] of Object.entries(divisionDistricts)) {
    if (divDistricts.includes(district)) {
      return division;
    }
  }
  return 'Unknown';
};

// Name pool for generating random donor names
const firstNames = [
  'Ahmed', 'Mohammad', 'Rahim', 'Karim', 'Jashim', 'Faruk', 'Rubel', 'Nasir',
  'Fatima', 'Nusrat', 'Razia', 'Samira', 'Taslima', 'Rashida', 'Nargis', 'Sabina',
  'Abdul', 'Jamal', 'Sohel', 'Arif', 'Masud', 'Rafiq', 'Habib', 'Imran',
  'Ayesha', 'Rahima', 'Salma', 'Nasreen', 'Parvin', 'Sumaiya', 'Sultana', 'Poly'
];

const lastNames = [
  'Khan', 'Rahman', 'Ahmed', 'Hossain', 'Islam', 'Akter', 'Begum', 'Ali',
  'Miah', 'Uddin', 'Chowdhury', 'Sarkar', 'Roy', 'Das', 'Siddique', 'Molla',
  'Sheikh', 'Talukder', 'Huq', 'Mahmud', 'Haque', 'Khatun', 'Alam', 'Kazi',
  'Parveen', 'Jahan', 'Sultana', 'Bhuiyan', 'Rashid', 'Karim', 'Iqbal', 'Aziz'
];

// Generate random date within the past year
const getRandomDonationDate = (): Date => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  const randomTimestamp = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime());
  return new Date(randomTimestamp);
};

// Generate random date for joining (1-3 years ago)
const getRandomJoinDate = (): Date => {
  const now = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(now.getFullYear() - 3);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  const randomTimestamp = threeYearsAgo.getTime() + Math.random() * (oneYearAgo.getTime() - threeYearsAgo.getTime());
  return new Date(randomTimestamp);
};

// Generate a random phone number
const generatePhoneNumber = (): string => {
  const operators = ['013', '014', '015', '016', '017', '018', '019'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `+880${operator}${number}`;
};

// Generate a random email based on name
const generateEmail = (firstName: string, lastName: string): string => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@${domain}`;
};

// Generate a random donor
const generateRandomDonor = (id: number): Donor => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const division = findDivisionForDistrict(district);
  const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
  const lastDonationDate = formatDate(getRandomDonationDate());
  const isVerified = Math.random() > 0.3; // 70% chance of being verified
  const donationCount = Math.floor(Math.random() * 10) + 1;
  const contactNumber = generatePhoneNumber();
  const email = generateEmail(firstName, lastName);
  const dateJoined = formatDate(getRandomJoinDate());
  
  return {
    id: `D${id.toString().padStart(6, '0')}`,
    name: `${firstName} ${lastName}`,
    bloodGroup,
    district,
    division,
    lastDonationDate,
    contactNumber,
    email,
    isVerified,
    canDonate: canDonate(lastDonationDate),
    donationCount,
    dateJoined,
    availableTimePreference: Math.random() > 0.5 ? 
      ['Morning', 'Evening'] : 
      Math.random() > 0.5 ? ['Afternoon', 'Night'] : ['Any Time'],
  };
};

// Generate a list of donors with structured IDs
export const generateDonors = (count: number): Donor[] => {
  return Array.from({ length: count }, (_, i) => generateRandomDonor(i + 1));
};

// Initial donors data - 50 donors to start with
const initialDonors: Donor[] = generateDonors(50);

// Create a singleton to manage donor data
class DonorManager {
  private static instance: DonorManager;
  private donors: Donor[] = [...initialDonors];

  private constructor() {}

  public static getInstance(): DonorManager {
    if (!DonorManager.instance) {
      DonorManager.instance = new DonorManager();
    }
    return DonorManager.instance;
  }

  public getAllDonors(): Donor[] {
    return this.donors;
  }

  public getDonorsSortedByLocation(): Donor[] {
    return [...this.donors].sort((a, b) => {
      // First sort by division
      if (a.division !== b.division) {
        return a.division.localeCompare(b.division);
      }
      // Then sort by district within the same division
      return a.district.localeCompare(b.district);
    });
  }

  public getDonorsByBloodGroup(bloodGroup: string): Donor[] {
    return this.donors.filter(donor => donor.bloodGroup === bloodGroup);
  }

  public getDonorsByDistrict(district: string): Donor[] {
    return this.donors.filter(donor => donor.district === district);
  }

  public getDonorsByDivision(division: string): Donor[] {
    return this.donors.filter(donor => donor.division === division);
  }

  public getAvailableDonors(): Donor[] {
    return this.donors.filter(donor => donor.canDonate);
  }

  public getVerifiedDonors(): Donor[] {
    return this.donors.filter(donor => donor.isVerified);
  }

  public addDonor(donor: Donor): void {
    this.donors.push(donor);
  }

  public addDonors(newDonors: Donor[]): void {
    this.donors = [...this.donors, ...newDonors];
  }

  public updateDonor(id: string, updates: Partial<Donor>): void {
    const index = this.donors.findIndex(donor => donor.id === id);
    if (index !== -1) {
      this.donors[index] = { ...this.donors[index], ...updates };
    }
  }

  public deleteDonor(id: string): void {
    this.donors = this.donors.filter(donor => donor.id !== id);
  }

  public importDonors(donorsData: Donor[]): void {
    this.donors = donorsData;
  }

  public exportDonors(): Donor[] {
    return [...this.donors];
  }
}

// Export the DonorManager instance to use throughout the application
export const donorManager = DonorManager.getInstance();

// Filter function for the Find Donors page
export const filterDonors = (
  bloodGroup?: string, 
  district?: string, 
  canDonateOnly: boolean = false
): Donor[] => {
  let filteredDonors = donorManager.getAllDonors();
  
  if (bloodGroup && bloodGroup !== '') {
    filteredDonors = filteredDonors.filter(donor => donor.bloodGroup === bloodGroup);
  }
  
  if (district && district !== '') {
    filteredDonors = filteredDonors.filter(donor => donor.district === district);
  }
  
  if (canDonateOnly) {
    filteredDonors = filteredDonors.filter(donor => donor.canDonate);
  }
  
  // Sort by location
  return filteredDonors.sort((a, b) => {
    if (a.division !== b.division) {
      return a.division.localeCompare(b.division);
    }
    return a.district.localeCompare(b.district);
  });
};

// Utility to add new donors in bulk (for future expansion)
export const addBulkDonors = (count: number): void => {
  const currentCount = donorManager.getAllDonors().length;
  const newDonors = generateDonors(count).map((donor, index) => ({
    ...donor,
    id: `D${(currentCount + index + 1).toString().padStart(6, '0')}`
  }));
  donorManager.addDonors(newDonors);
};

// Export donors to be used in the app
export const donors = donorManager.getAllDonors();
