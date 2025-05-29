import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register - NGO Connect',
  description: 'Create an account for NGO Connect',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10 md:py-16 flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
} 