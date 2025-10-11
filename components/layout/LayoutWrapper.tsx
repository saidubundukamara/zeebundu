"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current route is an admin route
  const isAdminRoute = pathname.startsWith("/admin");
  
  // For admin routes, just render children without navigation/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // For public routes, render with navigation and footer
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}