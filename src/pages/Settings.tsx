
import React from 'react';
import Navigation from '@/components/Navigation';
import ApiSettings from '@/components/settings/ApiSettings';
import Footer from '@/components/Footer';

const Settings = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="max-w-4xl mx-auto">
          <ApiSettings />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
