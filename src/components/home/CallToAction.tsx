
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Every donation can save up to three lives. Join our community of heroes today and be there when someone needs you the most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register-donor">
              <Button size="lg" className="group btn-hover w-full sm:w-auto">
                <Heart className="mr-2 h-5 w-5 group-hover:text-white transition-colors" />
                Register as a Donor
              </Button>
            </Link>
            <Link to="/find-donors">
              <Button size="lg" variant="outline" className="btn-hover w-full sm:w-auto">
                Find Blood Donors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
