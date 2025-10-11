"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { admin, logout } = useAdminAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Breadcrumb */}
          <div className="hidden lg:block">
            <AdminBreadcrumb />
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search businesses, users, or content..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">New business created</p>
                    <p className="text-xs text-muted-foreground">
                      "Sunset Coffee" template applied - 2 minutes ago
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">System backup completed</p>
                    <p className="text-xs text-muted-foreground">
                      All data backed up successfully - 1 hour ago
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">
                      john@example.com joined - 3 hours ago
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Actions */}
            <Button variant="outline" size="sm">
              + New Business
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {admin?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {admin?.name || 'Admin'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {admin?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit text-xs mt-1">
                      Administrator
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}