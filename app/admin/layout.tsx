"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isLoading, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current route is the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Only enforce authentication for protected admin routes
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router, isLoginPage]);

  // Show loading spinner for protected routes
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // For login page, just render children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For protected routes, check authentication
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}