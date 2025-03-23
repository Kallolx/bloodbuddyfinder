import React, { useState, useEffect } from 'react';
import { 
  Users, Heart, Award, Clock, 
  TrendingUp, MapPin, 
  Building, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define keyframes animation
const pulseUpAnimation = `
  @keyframes pulseUp {
    0% { transform: translateY(100%); opacity: 0.3; }
    50% { opacity: 0.2; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
`;

// Stats sections data
const statsSections = [
  { 
    id: 1, 
    title: 'Donor Statistics',
    description: 'Active donors across Bangladesh',
    icon: <Users className="h-6 w-6" />,
    value: '5,000+',
    subValue: '+12.5% from last month',
    chart: [20, 35, 50, 45, 60, 70, 65] // percentage values for the chart
  },
  { 
    id: 2, 
    title: 'Lives Saved',
    description: 'Through successful donations',
    icon: <Heart className="h-6 w-6" />,
    value: '7,500+',
    subValue: '+8.3% from last quarter',
    chart: [30, 45, 65, 80, 75, 90, 85] // percentage values for the chart
  },
  { 
    id: 3, 
    title: 'Response Rate',
    description: 'Average urgent request fulfillment',
    icon: <AlertCircle className="h-6 w-6" />,
    value: '92%',
    subValue: '2.5 hour average response time',
    chart: [50, 70, 85, 80, 90, 95, 92] // percentage values for the chart
  },
  { 
    id: 4, 
    title: 'Coverage',
    description: 'Districts with active donors',
    icon: <MapPin className="h-6 w-6" />,
    value: '64',
    subValue: '100% of Bangladesh districts',
    chart: [40, 55, 75, 85, 95, 100, 100] // percentage values for the chart
  }
];

const HeroStats = () => {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [defaultHoverSection, setDefaultHoverSection] = useState<number>(0);

  // Add animation style to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = pulseUpAnimation;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Set a random section to be in hover state by default
  useEffect(() => {
    const randomSectionId = Math.floor(Math.random() * statsSections.length) + 1;
    setDefaultHoverSection(randomSectionId);
    setHoveredSection(randomSectionId);
    
    // Periodically change the default hovered section
    const interval = setInterval(() => {
      let newRandomId;
      do {
        newRandomId = Math.floor(Math.random() * statsSections.length) + 1;
      } while (newRandomId === defaultHoverSection);
      
      setDefaultHoverSection(newRandomId);
      setHoveredSection(newRandomId);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (sectionId: number) => {
    setHoveredSection(sectionId);
  };

  const handleMouseLeave = () => {
    setHoveredSection(defaultHoverSection);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 w-full md:w-11/12 mx-auto">
      {statsSections.map((section) => (
        <div
          key={section.id}
          className={cn(
            "bg-secondary/40 rounded-xl p-3 sm:p-5 shadow-md border",
            "transition-all duration-300 cursor-pointer overflow-hidden relative",
            hoveredSection === section.id ? 
              "border-primary shadow-glow" : 
              "border-secondary/50 hover:border-primary/30"
          )}
          onMouseEnter={() => handleMouseEnter(section.id)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header section with icon and title */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left justify-between mb-2 sm:mb-4 gap-2 sm:gap-3">
            <div className={cn(
              "p-1.5 sm:p-2.5 rounded-lg transition-colors duration-300 order-2 sm:order-1",
              hoveredSection === section.id ? 
                "bg-primary/20 text-primary" : 
                "bg-secondary text-gray-400"
            )}>
              {React.cloneElement(section.icon, { className: "h-4 w-4 sm:h-6 sm:w-6" })}
            </div>
            
            <div className="flex-1 order-1 sm:order-2">
              <h3 className={cn(
                "font-bold text-sm sm:text-lg transition-colors duration-300",
                hoveredSection === section.id ? 
                  "text-primary text-glow-primary" : 
                  "text-white"
              )}>
                {section.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {section.description}
              </p>
            </div>
          </div>
          
          {/* Value section */}
          <div className="mb-3 sm:mb-6 text-center sm:text-left">
            <div className={cn(
              "text-xl sm:text-3xl font-bold", 
              hoveredSection === section.id ? 
                "text-primary text-glow-primary" : 
                "text-white"
            )}>
              {section.value}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
              {section.subValue}
            </div>
          </div>
          
          {/* Chart visualization with increased height */}
          <div className="h-8 sm:h-14 flex items-end space-x-0.5 sm:space-x-1">
            {section.chart.map((value, index) => (
              <div 
                key={index} 
                className={cn(
                  "w-full rounded-t transition-colors duration-300 relative overflow-hidden",
                  hoveredSection === section.id ? 
                    "bg-primary" : 
                    "bg-primary/30"
                )}
                style={{ 
                  height: hoveredSection === section.id 
                    ? `${value}%` 
                    : `${Math.max(value * 0.7, 10)}%`,
                  transition: hoveredSection === section.id 
                    ? 'height 0.5s ease-in-out, background-color 0.3s' 
                    : 'height 0.3s, background-color 0.3s' 
                }}
              >
                {hoveredSection === section.id && (
                  <div 
                    className="absolute inset-0 bg-white/20 w-full"
                    style={{
                      animation: 'pulseUp 1.5s infinite',
                      animationDelay: `${index * 0.1}s`
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroStats; 