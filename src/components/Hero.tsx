
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, BarChart2, Settings } from 'lucide-react';

const Hero = () => {
  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your <span className="gradient-text">Confident Voice</span> with AI Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Analyze your voice, receive personalized feedback, and track your improvement over time with our advanced AI tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/auth?register=true">
                <Button size="lg" className="gradient-bg">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 bg-white rounded-xl shadow-xl p-6 border">
            <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center p-6">
                <div className="waveform-container mb-6">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="waveform-bar"
                      style={{
                        height: `${Math.sin(i / 2) * 50 + 50}%`,
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: `${0.8 + Math.random() * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                <Button size="lg" className="rounded-full h-16 w-16 gradient-bg">
                  <Mic size={24} />
                </Button>
                <p className="mt-4 text-muted-foreground">Click to record your voice</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center text-center">
                <Mic className="h-6 w-6 text-accent1 mb-2" />
                <h3 className="font-medium">Record</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center text-center">
                <BarChart2 className="h-6 w-6 text-accent2 mb-2" />
                <h3 className="font-medium">Analyze</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center text-center">
                <Settings className="h-6 w-6 text-brand-500 mb-2" />
                <h3 className="font-medium">Improve</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
