'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import AuthService, { User } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      toast.error('Please login to view your profile');
      router.push('/auth/login');
      return;
    }
    
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      toast.error('User profile not found');
      router.push('/auth/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center sm:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user?.role.replace('_', ' ')}
                  </span>
                  {user?.organization && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
                      {user.organization}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    defaultValue={user?.name}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    defaultValue={user?.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="role">
                    Role
                  </label>
                  <Input
                    id="role"
                    placeholder="Role"
                    defaultValue={user?.role.replace('_', ' ')}
                    disabled
                  />
                </div>
                {user?.organization && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="organization">
                      Organization
                    </label>
                    <Input
                      id="organization"
                      placeholder="Organization"
                      defaultValue={user.organization}
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button>
                Edit Profile
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 