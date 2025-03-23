
import { bloodGroups, districts } from './districts';

// Generate random date within the past 6 months
const getRandomDonationDate = () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  const randomTimestamp = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTimestamp);
};

// Format date as DD MMM YYYY
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Calculate days since last donation
export const daysSinceLastDonation = (lastDonationDate: string) => {
  const lastDonation = new Date(lastDonationDate);
  const now = new Date();
  const differenceInTime = now.getTime() - lastDonation.getTime();
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
};

// Check if donor can donate (90 days since last donation)
export const canDonate = (lastDonationDate: string) => {
  return daysSinceLastDonation(lastDonationDate) >= 90;
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

// Generate a random donor
const generateRandomDonor = (id: number) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
  const lastDonationDate = formatDate(getRandomDonationDate());
  const isVerified = Math.random() > 0.3; // 70% chance of being verified
  
  return {
    id,
    name: `${firstName} ${lastName}`,
    bloodGroup,
    district,
    lastDonationDate,
    contactNumber: `+880 ${Math.floor(Math.random() * 3) + 1}${Math.floor(Math.random() * 10)}${Math.floor(1000000 + Math.random() * 9000000)}`,
    isVerified,
    canDonate: canDonate(lastDonationDate),
    donationCount: Math.floor(Math.random() * 10) + 1
  };
};

// Generate a list of donors
export const generateDonors = (count: number) => {
  return Array.from({ length: count }, (_, i) => generateRandomDonor(i + 1));
};

// Sample donors data
export const donors = generateDonors(50);

// Filter donors by criteria
export const filterDonors = (
  bloodGroup?: string, 
  district?: string, 
  canDonateOnly: boolean = false
) => {
  return donors.filter(donor => {
    if (bloodGroup && donor.bloodGroup !== bloodGroup) return false;
    if (district && donor.district !== district) return false;
    if (canDonateOnly && !donor.canDonate) return false;
    return true;
  });
};
