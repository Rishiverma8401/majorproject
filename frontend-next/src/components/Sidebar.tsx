'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Landmark, 
  Heart, 
  HelpCircle, 
  Settings, 
  LogOut, 
  RefreshCcw, 
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: UserType | null;
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Define navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    const commonItems = [
      { 
        title: 'Dashboard', 
        href: '/dashboard', 
        icon: <LayoutDashboard className="h-5 w-5" /> 
      },
      { 
        title: 'Profile', 
        href: '/profile', 
        icon: <User className="h-5 w-5" /> 
      },
    ];

    if (user.role === 'NGO_ADMIN') {
      return [
        ...commonItems,
        { 
          title: 'Members', 
          href: '/dashboard/members', 
          icon: <Users className="h-5 w-5" /> 
        },
        { 
          title: 'Projects', 
          href: '/dashboard/projects', 
          icon: <FileText className="h-5 w-5" /> 
        },
        { 
          title: 'Donations', 
          href: '/dashboard/donations', 
          icon: <Landmark className="h-5 w-5" /> 
        },
        { 
          title: 'Resources', 
          href: '/dashboard/resources', 
          icon: <RefreshCcw className="h-5 w-5" /> 
        },
        { 
          title: 'Settings', 
          href: '/dashboard/settings', 
          icon: <Settings className="h-5 w-5" /> 
        },
      ];
    }

    if (user.role === 'DONOR') {
      return [
        ...commonItems,
        { 
          title: 'My Donations', 
          href: '/dashboard/donations', 
          icon: <Heart className="h-5 w-5" /> 
        },
        { 
          title: 'NGOs', 
          href: '/dashboard/ngos', 
          icon: <Users className="h-5 w-5" /> 
        },
      ];
    }

    // Default for volunteer or any other role
    return [
      ...commonItems,
      { 
        title: 'Resources', 
        href: '/dashboard/resources', 
        icon: <RefreshCcw className="h-5 w-5" /> 
      },
      { 
        title: 'NGOs', 
        href: '/dashboard/ngos', 
        icon: <Users className="h-5 w-5" /> 
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-card text-card-foreground h-screen flex flex-col border-r border-border">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">NGO Connect</span>
        </Link>
      </div>
      
      <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="space-y-1">
          <Link
            href="/help"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="ml-3">Help & Support</span>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm px-2" 
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
} 