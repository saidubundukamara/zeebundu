'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Images, 
  Settings,
  Users,
  BarChart3,
  Globe
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Businesses',
    href: '/admin/businesses',
    icon: Building2,
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
  },
  {
    name: 'Media Library',
    href: '/admin/media',
    icon: Images,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <Globe className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ZeeBundu</span>
            </div>
            
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Quick Actions */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <Link
              href="/"
              target="_blank"
              className="group flex w-full items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
            >
              <Globe className="w-4 h-4 mr-2" />
              View Website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}