
// List of districts in Bangladesh
export const districts = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barisal', 'Bhola', 
  'Bogra', 'Brahmanbaria', 'Chandpur', 'Chapainawabganj', 'Chittagong', 
  'Chuadanga', 'Comilla', 'Cox\'s Bazar', 'Dhaka', 'Dinajpur', 
  'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 
  'Habiganj', 'Jamalpur', 'Jessore', 'Jhalokati', 'Jhenaidah', 
  'Joypurhat', 'Khagrachari', 'Khulna', 'Kishoreganj', 'Kurigram', 
  'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 
  'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 
  'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 
  'Nawabganj', 'Netrakona', 'Nilphamari', 'Noakhali', 'Pabna', 
  'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 
  'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur', 
  'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon'
];

// Group districts by division
export const divisionDistricts = {
  'Dhaka': ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  'Chittagong': ['Chittagong', 'Bandarban', 'Brahmanbaria', 'Chandpur', 'Comilla', 'Cox\'s Bazar', 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  'Khulna': ['Khulna', 'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  'Rajshahi': ['Rajshahi', 'Bogra', 'Chapainawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Nawabganj', 'Pabna', 'Sirajganj'],
  'Barisal': ['Barisal', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  'Sylhet': ['Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj'],
  'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
  'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrakona', 'Sherpur']
};

// Blood Groups
export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Get nearby districts
export const getNearbyDistricts = (district: string): string[] => {
  // Find which division the district belongs to
  let division = '';
  for (const [div, districts] of Object.entries(divisionDistricts)) {
    if (districts.includes(district)) {
      division = div;
      break;
    }
  }
  
  // If division is found, return other districts in the same division
  if (division) {
    return divisionDistricts[division as keyof typeof divisionDistricts].filter(d => d !== district);
  }
  
  // Fallback - return random districts
  return districts.filter(d => d !== district).slice(0, 5);
};
