'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Dummy project data
const dummyProjects = [
  {
    id: '1',
    title: 'Rural Education Initiative',
    description: 'Providing educational resources to rural schools in Maharashtra',
    status: 'active',
    progress: 65,
    location: 'Maharashtra',
    fundingGoal: 200000,
    fundingRaised: 130000,
    volunteers: 18,
    startDate: '2023-10-15',
    endDate: '2024-06-30',
  },
  {
    id: '2',
    title: 'Clean Water Project',
    description: 'Installing water purification systems in villages with contaminated water sources',
    status: 'active',
    progress: 40,
    location: 'Gujarat',
    fundingGoal: 350000,
    fundingRaised: 140000,
    volunteers: 12,
    startDate: '2023-12-01',
    endDate: '2024-12-01',
  },
  {
    id: '3',
    title: 'Women Empowerment Workshop',
    description: 'Training and skill development for women from underprivileged backgrounds',
    status: 'planning',
    progress: 10,
    location: 'Delhi NCR',
    fundingGoal: 150000,
    fundingRaised: 15000,
    volunteers: 5,
    startDate: '2024-03-15',
    endDate: '2024-09-15',
  },
  {
    id: '4',
    title: 'Community Health Camp',
    description: 'Free health checkups and awareness programs in underserved communities',
    status: 'completed',
    progress: 100,
    location: 'Tamil Nadu',
    fundingGoal: 100000,
    fundingRaised: 105000,
    volunteers: 25,
    startDate: '2023-05-10',
    endDate: '2023-11-10',
  },
  {
    id: '5',
    title: 'Tree Plantation Drive',
    description: 'Planting 10,000 trees in urban areas to improve air quality',
    status: 'active',
    progress: 75,
    location: 'Bengaluru',
    fundingGoal: 80000,
    fundingRaised: 60000,
    volunteers: 40,
    startDate: '2023-08-01',
    endDate: '2024-02-28',
  }
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  
  // Filter projects based on status
  const filteredProjects = filter === 'all' 
    ? dummyProjects 
    : dummyProjects.filter(project => project.status === filter);
  
  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your NGO's projects and initiatives
          </p>
        </div>
        <Button className="sm:w-auto" asChild>
          <Link href="/dashboard/projects/new">Create New Project</Link>
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Projects
        </Button>
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'} 
          onClick={() => setFilter('active')}
          size="sm"
        >
          Active
        </Button>
        <Button 
          variant={filter === 'planning' ? 'default' : 'outline'} 
          onClick={() => setFilter('planning')}
          size="sm"
        >
          Planning
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'} 
          onClick={() => setFilter('completed')}
          size="sm"
        >
          Completed
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{project.title}</CardTitle>
                <Badge className={`${getStatusColor(project.status)} capitalize`}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Funding Progress</span>
                    <span className="text-sm">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(project.fundingRaised)} raised
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Goal: {formatCurrency(project.fundingGoal)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="text-sm font-medium">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Volunteers:</span>
                    <span className="text-sm font-medium">{project.volunteers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Timeline:</span>
                    <span className="text-sm font-medium">
                      {new Date(project.startDate).toLocaleDateString('en-IN')} - 
                      {new Date(project.endDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm">View Details</Button>
              {project.status !== 'completed' && (
                <Button size="sm">Manage</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 