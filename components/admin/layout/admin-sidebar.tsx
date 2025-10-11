"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  Settings,
  PaintBucket,
  Images,
  HelpCircle,
  BarChart3,
  Globe,
  Shield,
  Database,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  isDropdown?: boolean;
  dropdownItems?: {
    name: string;
    href: string;
    current: boolean;
  }[];
  badge?: string;
}

interface NavigationSection {
  name: string;
  items: NavigationItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  const navigation: NavigationSection[] = [
    {
      name: "MAIN",
      items: [
        {
          name: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          current: pathname === "/admin/dashboard",
        },
        {
          name: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
          current: pathname.startsWith("/admin/analytics"),
        },
      ],
    },
    {
      name: "BUSINESS",
      items: [
        {
          name: "Businesses",
          href: "/admin/businesses",
          icon: Building2,
          current: pathname.startsWith("/admin/businesses"),
          badge: "12",
        },
        {
          name: "Templates",
          href: "/admin/templates",
          icon: PaintBucket,
          current: pathname.startsWith("/admin/templates"),
        },
        {
          name: "Domains",
          href: "/admin/domains",
          icon: Globe,
          current: pathname.startsWith("/admin/domains"),
        },
      ],
    },
    {
      name: "CONTENT",
      items: [
        {
          name: "Media Library",
          href: "/admin/media",
          icon: Images,
          current: pathname.startsWith("/admin/media"),
        },
        {
          name: "Content Pages",
          href: "/admin/content",
          icon: FileText,
          current: pathname.startsWith("/admin/content"),
        },
      ],
    },
    {
      name: "MANAGEMENT",
      items: [
        {
          name: "System",
          href: "/admin/system",
          icon: Database,
          current: pathname.startsWith("/admin/system"),
        },
        {
          name: "Settings",
          href: "/admin/settings",
          icon: Settings,
          current: pathname.startsWith("/admin/settings"),
        },
        {
          name: "Help",
          href: "/admin/help",
          icon: HelpCircle,
          current: pathname.startsWith("/admin/help"),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-gray-800 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded transform rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform -rotate-45"></div>
          </div>
          <h1 className="ml-3 text-xl font-bold text-white">ZeeBundu Admin</h1>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {admin?.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">
              {admin?.name || 'Admin'}
            </div>
            <div className="text-xs text-gray-300">Administrator</div>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {navigation.map((section) => (
          <div key={section.name} className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.name}
            </h3>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => (
                <div key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ) : (
                    <div className="px-3 py-2 text-sm font-medium text-gray-400">
                      <item.icon className="mr-3 h-5 w-5 inline" />
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={logout}
        >
          <span className="mr-3">🚪</span>
          Logout
        </Button>
      </div>
    </div>
  );
}