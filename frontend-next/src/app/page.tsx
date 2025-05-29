'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import AuthService, { User } from '@/lib/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 filter blur-3xl"></div>
            <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-orange-500/20 filter blur-3xl"></div>
          </div>
          
          <div className="container relative px-4 md:px-6 z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-blue-400">
                    Connecting NGOs, Donors and Volunteers Across India
                  </h1>
                  <p className="text-muted-foreground md:text-xl max-w-[600px]">
                    NGO Connect brings together changemakers to address critical social issues in education, healthcare, environment, and rural development throughout India.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
                    <Link href="/auth/register">Join the Movement</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="rounded-full border-primary">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto max-w-md overflow-hidden rounded-2xl shadow-2xl">
                <div className="relative h-[350px] w-full">
        <Image
          src="/next.svg"
                    alt="Indian children education NGO project"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-2xl p-8 bg-white dark:bg-gray-800"
          priority
        />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Numbers section */}
        <section className="w-full py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-primary">500+</span>
                <span className="text-sm mt-1 text-muted-foreground">NGOs Connected</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-primary">₹2.5Cr+</span>
                <span className="text-sm mt-1 text-muted-foreground">Donations Facilitated</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-primary">20K+</span>
                <span className="text-sm mt-1 text-muted-foreground">Volunteers Engaged</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-primary">15+</span>
                <span className="text-sm mt-1 text-muted-foreground">States Impacted</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[800px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                  Our Platform Features
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  NGO Connect offers a comprehensive suite of tools designed specifically for the Indian NGO ecosystem.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-200">
                <div className="p-3 bg-primary/10 rounded-full">
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
                    className="h-6 w-6 text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">NGO Management</h3>
                <p className="text-center text-muted-foreground">
                  Comprehensive tools for NGOs to manage projects, members, resources, and track impact across India.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-200">
                <div className="p-3 bg-primary/10 rounded-full">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Donation Platform</h3>
                <p className="text-center text-muted-foreground">
                  Secure and transparent donation system with UPI, NetBanking, and international payment options.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-200">
                <div className="p-3 bg-primary/10 rounded-full">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M16 22h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-8.5a4 4 0 0 0-4 4v16a2 2 0 0 0 2 2h2" />
                    <path d="M9 22h6" />
                    <path d="M14 22v-5.5a2.5 2.5 0 0 0-5 0V22" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Resource Exchange</h3>
                <p className="text-center text-muted-foreground">
                  Connect with NGOs across India to share resources, knowledge, and best practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NGO Spotlight section */}
        <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
                  NGO Spotlight
                </h2>
                <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                  Meet some of the incredible organizations making a difference across India
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* NGO Card 1 */}
              <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
                <div className="h-48 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">Education First</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Providing quality education to underprivileged children in rural Maharashtra and Gujarat.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Education
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/ngos/education-first">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* NGO Card 2 */}
              <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
                <div className="h-48 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">Green India Foundation</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Working on reforestation and sustainable living practices across Karnataka and Tamil Nadu.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                      Environment
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/ngos/green-india">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* NGO Card 3 */}
              <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
                <div className="h-48 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-500 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">Healthier Tomorrow</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Providing healthcare services to remote villages in Rajasthan and Uttar Pradesh.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300 px-2 py-1 rounded-full">
                      Healthcare
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/ngos/healthier-tomorrow">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-indigo-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="space-y-4 max-w-[600px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Join the Movement for a Better India
                </h2>
                <p className="text-white/90 md:text-xl">
                  Whether you're an NGO, donor, or volunteer, be part of India's largest network of changemakers.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="rounded-full shadow-xl" asChild>
                  <Link href="/auth/register">Sign Up Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
        </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  Email: connect@ngoconnect.org
                </li>
                <li className="text-sm text-muted-foreground">
                  Phone: +91 98765 43210
                </li>
                <li className="text-sm text-muted-foreground">
                  Address: 123 MG Road, Bangalore, India
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl font-bold text-primary mr-2">NGO Connect</span>
              <span className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} NGO Connect India. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
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
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
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
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
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
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
