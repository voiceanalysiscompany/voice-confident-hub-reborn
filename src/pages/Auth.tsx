
import React from 'react';
import Navigation from '@/components/Navigation';
import AuthForm from '@/components/auth/AuthForm';
import Footer from '@/components/Footer';

const Auth = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <AuthForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
