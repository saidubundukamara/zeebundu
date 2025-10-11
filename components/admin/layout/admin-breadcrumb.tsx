"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    
    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: "/admin/dashboard",
      isActive: pathname === "/admin/dashboard",
    });
    
    // Skip "admin" segment and process the rest
    const relevantSegments = pathSegments.slice(1);
    
    for (let i = 0; i < relevantSegments.length; i++) {
      const segment = relevantSegments[i];
      const href = "/admin/" + relevantSegments.slice(0, i + 1).join("/");
      const isLast = i === relevantSegments.length - 1;
      
      // Format the label
      let label = segment;
      
      // Handle specific route formatting
      switch (segment) {
        case "businesses":
          label = "Businesses";
          break;
        case "templates":
          label = "Templates";
          break;
        case "media":
          label = "Media Library";
          break;
        case "users":
          label = "Users";
          break;
        case "admins":
          label = "Admins";
          break;
        case "settings":
          label = "Settings";
          break;
        case "analytics":
          label = "Analytics";
          break;
        case "create":
          label = "Create";
          break;
        case "edit":
          label = "Edit";
          break;
        default:
          // Capitalize first letter and handle IDs (keep as is if all numbers/alphanumeric)
          if (/^[a-zA-Z0-9]+$/.test(segment) && segment.length > 10) {
            label = segment; // Likely an ID
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
      }
      
      breadcrumbs.push({
        label,
        href,
        isActive: isLast,
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            <BreadcrumbItem>
              {crumb.isActive ? (
                <BreadcrumbPage className="font-medium">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {index === 0 && (
                      <Home className="h-4 w-4 mr-1 inline" />
                    )}
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}