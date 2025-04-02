import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "sonner";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get('register') === 'true';
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would connect to your authentication backend
      // For now, we'll simulate a successful login/registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isRegister) {
        toast.success('Registration successful! Welcome to VoiceHub!');
      } else {
        toast.success('Login successful! Welcome back!');
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isRegister ? 'Create an Account' : 'Sign In'}</CardTitle>
        <CardDescription>
          {isRegister 
            ? 'Create your account to start analyzing your voice.' 
            : 'Sign in to access your voice analysis dashboard.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="Enter your name" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="Enter your email" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              placeholder="Enter your password" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          {!isRegister && (
            <div className="text-right">
              <a href="#" className="text-sm text-brand-500 hover:underline">
                Forgot your password?
              </a>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <Button 
            type="submit" 
            className="w-full gradient-bg" 
            disabled={isLoading}
          >
            {isLoading 
              ? 'Processing...' 
              : (isRegister ? 'Create Account' : 'Sign In')}
          </Button>
          
          <div className="mt-4 text-center text-sm">
            {isRegister 
              ? 'Already have an account? ' 
              : "Don't have an account? "}
            <a 
              href={isRegister ? '/auth' : '/auth?register=true'} 
              className="text-brand-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate(isRegister ? '/auth' : '/auth?register=true');
              }}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
