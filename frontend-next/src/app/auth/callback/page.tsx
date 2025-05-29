'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthService from '@/lib/auth';
import { toast } from 'sonner';

export default function SocialCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const provider = searchParams.get('provider');
        const code = searchParams.get('code');
        
        if (!provider || !code) {
          setError('Missing provider or code parameters');
          return;
        }
        
        // Handle the social login callback
        await AuthService.handleSocialCallback(provider, code);
        toast.success('Login successful');
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Social login callback error:', error);
        setError(error.message || 'Failed to authenticate. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router]);
  
  if (error) {
    return (
      <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-xl border-gray-100 dark:border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Authentication Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-red-500">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-primary text-white rounded-full"
              onClick={() => router.push('/auth/login')}
            >
              Return to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-xl border-gray-100 dark:border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Authenticating...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    </div>
  );
} 