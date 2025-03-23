import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Heart,
  Droplet,
  ChevronRight,
  Send
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-background to-black relative">
      {/* Top wave pattern */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center mb-5">
              <div className="mr-2 bg-primary/20 p-2 rounded-full">
                <Droplet className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white">BloodBuddy</h2>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              BloodBuddy connects blood donors with those in need through a direct, fast, and reliable platform helping save lives in emergencies.
            </p>
            
            <div className="flex space-x-3">
              <a href="#" className="bg-secondary/20 hover:bg-secondary/30 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5 text-gray-300" />
              </a>
              <a href="#" className="bg-secondary/20 hover:bg-secondary/30 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5 text-gray-300" />
              </a>
              <a href="#" className="bg-secondary/20 hover:bg-secondary/30 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5 text-gray-300" />
              </a>
              <a href="#" className="bg-secondary/20 hover:bg-secondary/30 p-2 rounded-full transition-colors">
                <Youtube className="h-5 w-5 text-gray-300" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Find Donors', path: '/find-donors' },
                { name: 'Request Blood', path: '/request-blood' },
                { name: 'Register as Donor', path: '/register-donor' },
                { name: 'Blood Banks', path: '/blood-banks' },
                { name: 'Emergency Contacts', path: '/emergency' },
                { name: 'Donation Process', path: '/donation-process' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary flex items-center group text-sm"
                  >
                    <ChevronRight className="h-3 w-3 mr-2 text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  House #42, Road #3, Dhanmondi
                  <br />Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+880 1234 567890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@bloodbuddy.com</span>
              </li>
            </ul>
            
            <div className="mt-8">
              <Link to="/donate">
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 hover:text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates on blood donation drives and emergency needs.
            </p>
            
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Input 
                  placeholder="Your email address" 
                  className="bg-secondary/20 border-secondary/40 pl-3 pr-10 py-2 text-sm"
                />
                <Button size="sm" className="absolute right-0.5 top-0.5 h-[34px] w-[34px] p-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-500 text-xs">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
            
            <div className="mt-8">
              <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full">
                Available 24/7 for emergencies
              </span>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-800" />
        
        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} BloodBuddy. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'FAQ'].map((item, index) => (
              <Link key={index} to="#" className="text-gray-500 hover:text-gray-300 text-sm">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 