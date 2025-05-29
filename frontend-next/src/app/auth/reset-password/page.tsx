'use client';

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthService from '@/lib/auth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if token exists
    if (!token) {
      setIsValidToken(false);
      return;
    }

    // Validate token with backend
    const validateToken = async () => {
      try {
        // Try to validate the token with the backend
        const isValid = await AuthService.validateResetToken(token);
        setIsValidToken(isValid);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValidToken === null) {
    // Loading state
    return (
      <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-full max-w-md">
          <Card className="w-full max-w-md mx-auto shadow-xl border-gray-100 dark:border-gray-800">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Verifying reset link...</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    // Invalid or missing token
    return (
      <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-full max-w-md">
          <Card className="w-full max-w-md mx-auto shadow-xl border-gray-100 dark:border-gray-800">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-red-600 dark:text-red-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Invalid Reset Link</CardTitle>
              <CardDescription className="text-center">
                The password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Please request a new password reset link.
              </p>
              <Button
                className="mx-auto mt-2 rounded-full"
                asChild
              >
                <Link href="/auth/forgot-password">Request new link</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Valid token, show the form
  return (
    <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
} 