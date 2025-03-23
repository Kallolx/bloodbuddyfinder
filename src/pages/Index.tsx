import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import EmergencyRequests from '@/components/home/EmergencyRequests';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background bg-grid-dark-pattern">
        <HeroSection />
        <EmergencyRequests />
      </div>
    </Layout>
  );
};

export default Index;
