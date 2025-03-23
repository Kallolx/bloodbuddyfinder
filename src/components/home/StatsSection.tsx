
import React, { useState, useEffect } from 'react';
import { Droplet, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Statistics data
const statsData = [
  {
    id: 1,
    label: 'Donors Registered',
    value: 1250,
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 2,
    label: 'Blood Requests Fulfilled',
    value: 850,
    icon: Droplet,
    color: 'text-primary dark:text-primary',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    id: 3,
    label: 'Lives Saved',
    value: 670,
    icon: Heart,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
];

const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('#stats-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    statsData.forEach((stat, index) => {
      const target = stat.value;
      const duration = 2000; // ms
      const steps = 50;
      const stepValue = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = Math.round(current);
          return newCounts;
        });
      }, duration / steps);

      return () => clearInterval(timer);
    });
  }, [inView]);

  return (
    <section id="stats-section" className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <div 
                key={stat.id} 
                className={cn(
                  "p-6 bg-white shadow-md rounded-xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                  "transform transition-all duration-700",
                  inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                  index === 1 && inView ? "delay-100" : "",
                  index === 2 && inView ? "delay-200" : ""
                )}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">{stat.label}</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat().format(counts[index])}+
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
