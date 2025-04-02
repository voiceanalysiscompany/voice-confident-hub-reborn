
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-foreground hover:text-brand-500 transition-colors">
        Home
      </Link>
      <Link to="/dashboard" className="text-foreground hover:text-brand-500 transition-colors">
        Dashboard
      </Link>
      <Link to="/settings" className="text-foreground hover:text-brand-500 transition-colors">
        Settings
      </Link>
    </>
  );

  return (
    <nav className="w-full py-4 bg-background/80 backdrop-blur-sm fixed top-0 z-50 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="font-bold text-xl">Voice<span className="text-brand-500">Hub</span></span>
        </Link>

        {isMobile ? (
          <>
            <Button variant="ghost" onClick={toggleMenu} size="icon">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            
            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-background z-40 p-4 flex flex-col space-y-6 text-lg font-medium">
                <NavLinks />
                <div className="flex flex-col space-y-4 pt-4">
                  <Link to="/auth">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/auth?register=true">
                    <Button className="w-full gradient-bg">Get Started</Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex space-x-8 items-center">
              <NavLinks />
            </div>
            <div className="flex space-x-4 items-center">
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth?register=true">
                <Button className="gradient-bg">Get Started</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
