import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - NGO Connect',
  description: 'Reset your NGO Connect account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
} 