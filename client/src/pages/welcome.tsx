import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function Welcome() {
  const [, setLocation] = useLocation();
  
  const goToLogin = () => {
    setLocation('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-8">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">Welcome to NatureCert</h1>
          <p className="text-neutral-600 mb-6">
            Your guide to understanding environmental certifications and their impact on our planet.
            Join us in creating a more sustainable future.
          </p>
        </div>
        
        <Button 
          size="lg" 
          className="w-full py-6 text-lg rounded-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          onClick={goToLogin}
        >
          <Leaf className="mr-2 h-5 w-5" />
          Go Green
        </Button>
        
        <p className="mt-6 text-sm text-neutral-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}