import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Registration form validation schema
export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['NGO_ADMIN', 'DONOR', 'VOLUNTEER'], {
    required_error: 'Please select a role',
  }),
  organization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Donation form validation schema
export const donationSchema = z.object({
  amount: z.string().min(1, { message: 'Please enter an amount' }),
  currency: z.string().default('USD'),
  ngoId: z.string().min(1, { message: 'Please select an NGO' }),
  message: z.string().optional(),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

// Resource form validation schema
export const resourceSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  type: z.enum(['REQUEST', 'OFFER'], {
    required_error: 'Please select a type',
  }),
  category: z.string().min(1, { message: 'Please select a category' }),
  quantity: z.string().min(1, { message: 'Please enter a quantity' }),
  location: z.string().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>; 