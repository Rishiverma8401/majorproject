import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - NGO Connect',
  description: 'Login to your NGO Connect account',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
} 