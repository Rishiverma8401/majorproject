'use client';

import { useState, useEffect } from 'react';
import AuthService, { User } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data
    const currentUser = AuthService.getCurrentUser();
    const dummyUser = {
      id: 'user123',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@ngoconnect.in',
      organization: 'Education First NGO',
      role: 'NGO_ADMIN' as const
    };
    
    if (currentUser) {
      setUser({
        ...currentUser,
        ...dummyUser
      });
    } else {
      setUser(dummyUser);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Calculate today's date in Indian format
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user.name}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your NGO Connect dashboard - {today}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,000</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +7 new registrations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              In the next 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fundraising Goals</CardTitle>
          <CardDescription>Track your progress toward current campaign goals</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Clean Water Initiative - Maharashtra
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹3,20,000 of ₹5,00,000 goal
                  </p>
                </div>
                <div className="text-sm text-right">64%</div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Education Supplies for Rural Schools
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹1,75,000 of ₹2,00,000 goal
                  </p>
                </div>
                <div className="text-sm text-right">88%</div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Women's Empowerment Program - Delhi
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹85,000 of ₹3,50,000 goal
                  </p>
                </div>
                <div className="text-sm text-right">24%</div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 h-full overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-xs text-muted-foreground">
                    Welcome to NGO Connect India
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Donation Received</p>
                  <p className="text-xs text-muted-foreground">
                    ₹10,000 donation from Rahul Sharma
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  2 days ago
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Project Created</p>
                  <p className="text-xs text-muted-foreground">
                    Rural Education Initiative in Maharashtra
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  1 week ago
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Volunteer</p>
                  <p className="text-xs text-muted-foreground">
                    Anita Sharma joined as a volunteer
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  3 days ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for NGO administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <line x1="12" x2="12" y1="9" y2="15" />
                    <line x1="9" x2="15" y1="12" y2="12" />
                  </svg>
                </div>
                <span className="text-xs font-medium">New Project</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="M6 8h.01" />
                    <path d="M22 13.3c-.8-3.31-3.7-5.3-7-5.3s-6.2 2-7 5.3" />
                    <path d="M9 16h.01" />
                    <path d="M15 16h.01" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Create Event</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Add Volunteer</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                    <path d="M9 22h9a2 2 0 0 0 2-2v-7" />
                    <path d="M10.5 7.5h3" />
                    <path d="M10.5 10.5h6" />
                    <path d="M10.5 13.5h6" />
                    <path d="M15 19l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Compliance</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-full">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to set up your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Create an account</p>
                  <p className="text-xs text-muted-foreground">
                    Your account has been created successfully.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary">
                  <span className="text-xs">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Complete NGO verification</p>
                  <p className="text-xs text-muted-foreground">
                    Submit required documents for NGO verification and FCRA compliance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border text-muted-foreground">
                  <span className="text-xs">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Create your first project</p>
                  <p className="text-xs text-muted-foreground">
                    Start a fundraising campaign or volunteer initiative in your region.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3 h-full">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your scheduled events and campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-14 bg-primary/10 rounded-md text-primary font-medium">
                  <span className="text-xs uppercase">June</span>
                  <span className="text-lg">5</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">World Environment Day</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tree planting initiative in Delhi NCR
                  </p>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-muted-foreground mr-1"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-xs text-muted-foreground">9:00 AM - 1:00 PM</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-14 bg-primary/10 rounded-md text-primary font-medium">
                  <span className="text-xs uppercase">June</span>
                  <span className="text-lg">21</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">International Yoga Day</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Yoga session for community wellness in Mumbai
                  </p>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-muted-foreground mr-1"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-xs text-muted-foreground">6:00 AM - 8:00 AM</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-14 bg-primary/10 rounded-md text-primary font-medium">
                  <span className="text-xs uppercase">July</span>
                  <span className="text-lg">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Doctors' Day Health Camp</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free medical checkups in rural Maharashtra
                  </p>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-muted-foreground mr-1"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-xs text-muted-foreground">10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 