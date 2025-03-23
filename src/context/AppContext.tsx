import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Sample districts of Bangladesh (copied from LocationSelector)
const districts = [
  'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 
  'Sylhet', 'Rangpur', 'Mymensingh', 'Comilla', 'Dinajpur',
  'Jessore', 'Bogra', 'Narayanganj', 'Gazipur', 'Tangail',
  'Jamalpur', 'Pabna', 'Kushtia', 'Feni', 'Noakhali',
  'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Chandpur'
];

type Language = 'en' | 'bn';

// Define user roles
export type UserRole = 'admin' | 'user' | null;

// Define User interface
interface User {
  email: string;
  name?: string;
  phone?: string;
  location?: string;
  bloodGroup?: string;
  lastDonation?: string;
  avatar?: string;
}

// Define context type
interface AppContextType {
  // Location state
  selectedLocation: string | null;
  setSelectedLocation: (location: string) => void;
  showLocationDialog: boolean;
  setShowLocationDialog: (show: boolean) => void;
  
  // Language state
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // District data
  districts: string[];
  
  // Authentication state
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  currentUser: User | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // Location state
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  
  // Language state
  const [language, setLanguage] = useState<Language>('en');
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Load saved location preference from localStorage if available
    const savedLocation = localStorage.getItem('selectedDistrict');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    } else {
      // Show dialog on first visit if no location is set
      const timer = setTimeout(() => {
        setShowLocationDialog(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn')) {
      setLanguage(savedLanguage);
    }

    // Load auth state from localStorage on mount
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserRole(authData.role);
      setCurrentUser({
        email: authData.email,
        name: authData.name,
        phone: authData.phone,
        location: authData.location,
        bloodGroup: authData.bloodGroup,
        lastDonation: authData.lastDonation,
        avatar: authData.avatar
      });
    }
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleSetLocation = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedDistrict', location);
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication for demo purposes
    // In a real app, this would be an API call
    if (email === 'blood@admin.com' && password === 'admin1234') {
      const userData: User = {
        email,
        name: 'Admin User',
        location: 'Dhaka',
        bloodGroup: 'A+',
        phone: '+880123456789'
      };
      const authData = { ...userData, role: 'admin' as UserRole };
      localStorage.setItem('auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUserRole('admin');
      setCurrentUser(userData);
      return true;
    } else if (email === 'blood@user.com' && password === 'user1234') {
      const userData: User = {
        email,
        name: 'Regular User',
        location: 'Chittagong',
        bloodGroup: 'O+',
        phone: '+880198765432'
      };
      const authData = { ...userData, role: 'user' as UserRole };
      localStorage.setItem('auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUserRole('user');
      setCurrentUser(userData);
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  // Register function
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration for demo purposes
    // In a real app, this would be an API call
    if (email && password) {
      const userData: User = {
        email,
        name
      };
      const authData = { ...userData, role: 'user' as UserRole };
      localStorage.setItem('auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUserRole('user');
      setCurrentUser(userData);
      return true;
    }

    return false;
  };

  return (
    <AppContext.Provider 
      value={{ 
        selectedLocation, 
        setSelectedLocation: handleSetLocation,
        showLocationDialog,
        setShowLocationDialog,
        language, 
        setLanguage: handleSetLanguage,
        districts,
        isAuthenticated,
        userRole,
        login,
        logout,
        registerUser,
        currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 