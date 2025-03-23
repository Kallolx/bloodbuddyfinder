
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Arif Rahman',
    location: 'Dhaka',
    avatar: '/placeholder.svg',
    quote: 'BloodBuddy helped me find a donor in just 20 minutes when my father needed urgent transfusion. Forever grateful!',
    role: 'Blood Recipient'
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    location: 'Chittagong',
    avatar: '/placeholder.svg',
    quote: 'As a regular donor, this platform made it easy for me to help people in need. The process is simple and the team verifies everything.',
    role: 'Blood Donor'
  },
  {
    id: 3,
    name: 'Mohammad Khan',
    location: 'Sylhet',
    avatar: '/placeholder.svg',
    quote: 'During the flood emergency, we used BloodBuddy to coordinate blood donations. It saved many lives in our community.',
    role: 'NGO Volunteer'
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('#testimonials-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    // Auto rotate testimonials every 5 seconds
    if (!isVisible) return;
    
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section id="testimonials-section" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="mb-2" variant="outline">TESTIMONIALS</Badge>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Stories from Our Community
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from people whose lives were touched by blood donors they found through our platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div 
            className={cn(
              "absolute -top-10 -left-10 text-gray-200 dark:text-gray-800 transform -rotate-180 opacity-0",
              isVisible && "animate-fade-in opacity-100"
            )}
          >
            <Quote className="h-20 w-20" />
          </div>
          
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className={cn(
                  "bg-gray-50 border border-gray-200 p-8 rounded-xl dark:bg-gray-800/50 dark:border-gray-700",
                  "transition-all duration-500 absolute top-0 left-0 w-full",
                  activeIndex === index 
                    ? "translate-x-0 opacity-100 z-10" 
                    : index < activeIndex 
                      ? "-translate-x-full opacity-0 z-0" 
                      : "translate-x-full opacity-0 z-0",
                  !isVisible && "opacity-0"
                )}
              >
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-4 border-2 border-primary">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary text-white">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg italic">
                    "{testimonial.quote}"
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {testimonial.role} · {testimonial.location}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-80 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  activeIndex === index 
                    ? "bg-primary scale-125" 
                    : "bg-gray-300 dark:bg-gray-700"
                )}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
