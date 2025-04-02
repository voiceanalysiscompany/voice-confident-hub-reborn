
import React from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/dashboard/Dashboard';
import Footer from '@/components/Footer';

const DashboardPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
