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
          <div className="relative h-24 w-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 bg-white/10 rounded-full"></div>
              <Leaf className="h-12 w-12 text-white relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">Welcome to NatureCert</h1>
          <p className="text-neutral-600 mb-6">
            Your guide to understanding environmental certifications and their impact on our planet.
            Join us in creating a more sustainable future.
          </p>
        </div>
        
        <Button 
          size="lg" 
          className="w-full py-6 text-lg font-bold rounded-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={goToLogin}
        >
          <div className="inline-flex items-center">
            <div className="relative mr-3">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <Leaf className="h-6 w-6 relative z-10" />
            </div>
            Go Green
          </div>
        </Button>
        
        <p className="mt-6 text-sm text-neutral-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}