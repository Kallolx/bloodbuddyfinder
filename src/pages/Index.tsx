
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import EmergencyRequests from '@/components/home/EmergencyRequests';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CallToAction from '@/components/home/CallToAction';
import LocationSelector from '@/components/home/LocationSelector';

const Index = () => {
  return (
    <Layout>
      <div className="bg-grid-pattern">
        <HeroSection />
        <EmergencyRequests />
        <StatsSection />
        <TestimonialsSection />
        <CallToAction />
        <LocationSelector />
      </div>
    </Layout>
  );
};

export default Index;
