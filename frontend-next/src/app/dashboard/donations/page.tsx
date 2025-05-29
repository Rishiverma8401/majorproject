'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Dummy donations data
const dummyDonations = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    amount: 10000,
    date: '2023-12-15',
    project: 'Rural Education Initiative',
    status: 'completed',
    paymentMethod: 'UPI',
    receipt: 'REC-10001',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    amount: 25000,
    date: '2023-12-10',
    project: 'Clean Water Project',
    status: 'completed',
    paymentMethod: 'Credit Card',
    receipt: 'REC-10002',
  },
  {
    id: '3',
    name: 'Amit Singh',
    email: 'amit.singh@example.com',
    amount: 5000,
    date: '2023-12-05',
    project: 'Tree Plantation Drive',
    status: 'completed',
    paymentMethod: 'NetBanking',
    receipt: 'REC-10003',
  },
  {
    id: '4',
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    amount: 15000,
    date: '2023-11-28',
    project: 'Women Empowerment Workshop',
    status: 'completed',
    paymentMethod: 'UPI',
    receipt: 'REC-10004',
  },
  {
    id: '5',
    name: 'Vikram Reddy',
    email: 'vikram.r@example.com',
    amount: 30000,
    date: '2023-11-15',
    project: 'Rural Education Initiative',
    status: 'completed',
    paymentMethod: 'Credit Card',
    receipt: 'REC-10005',
  },
  {
    id: '6',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@example.com',
    amount: 7500,
    date: '2023-11-10',
    project: 'Community Health Camp',
    status: 'completed',
    paymentMethod: 'UPI',
    receipt: 'REC-10006',
  },
  {
    id: '7',
    name: 'Ajay Kumar',
    email: 'ajay.kumar@example.com',
    amount: 12000,
    date: '2023-11-05',
    project: 'Clean Water Project',
    status: 'completed',
    paymentMethod: 'NetBanking',
    receipt: 'REC-10007',
  },
];

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter donations based on search term
  const filteredDonations = searchTerm 
    ? dummyDonations.filter(donation => 
        donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.project.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dummyDonations;
  
  // Calculate total donations
  const totalDonations = dummyDonations.reduce((sum, donation) => sum + donation.amount, 0);
  
  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date in Indian format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
          <p className="text-muted-foreground">
            Track and manage all donations received
          </p>
        </div>
        <Button className="sm:w-auto">Generate Report</Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDonations)}</div>
            <p className="text-xs text-muted-foreground">
              From {dummyDonations.length} donors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalDonations / dummyDonations.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per donation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Supported Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">Rural Education Initiative</div>
            <p className="text-xs text-muted-foreground">
              40% of total donations
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Donations</h2>
          <div className="w-full max-w-xs">
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div className="font-medium">{donation.name}</div>
                        <div className="text-xs text-muted-foreground">{donation.email}</div>
                      </TableCell>
                      <TableCell>{donation.project}</TableCell>
                      <TableCell>{formatDate(donation.date)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(donation.amount)}</TableCell>
                      <TableCell>{donation.paymentMethod}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
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
                            className="h-4 w-4 mr-1"
                          >
                            <rect width="16" height="16" x="4" y="4" rx="2" />
                            <path d="M8 10h8" />
                            <path d="M8 14h4" />
                          </svg>
                          {donation.receipt}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 