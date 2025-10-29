"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavigationProps {
  theme?: "light" | "dark";
  bgColor?: string;
  minimal?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  theme = "light",
  bgColor = "bg-white",
  minimal = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [services, setServices] = useState<{ name: string; path: string }[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);
  const pathname = usePathname();

  const mainNavItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Services", path: "#", hasDropdown: true },
  ];

  useEffect(() => {
    let isCancelled = false;
    async function loadServices() {
      try {
        setServicesLoading(true);
        const response = await fetch('/api/businesses?status=active');
        const result = await response.json();
        if (!isCancelled && result?.success && Array.isArray(result.data)) {
          const items = result.data.map((b: { name: string; slug: string }) => ({
            name: b.name,
            path: `/business/${b.slug}`,
          }));
          setServices(items);
        }
      } catch (_err) {
        // ignore; dropdown will simply be empty on failure
      } finally {
        if (!isCancelled) setServicesLoading(false);
      }
    }
    loadServices();
    return () => { isCancelled = true; };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToSection("about");
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToSection("contact");
    }
  };

  if (minimal) {
    return (
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 backdrop-blur-md bg-white/95">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 transition-colors hover:text-gray-700"
            >
              Zeebundu
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 backdrop-blur-md bg-white/95">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 transition-colors hover:text-gray-700"
          >
            Zeebundu
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-12 lg:flex">
            {mainNavItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="flex gap-1 items-center py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900"
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Services Dropdown */}
                    <div
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ${
                        isServicesOpen
                          ? "visible opacity-100 translate-y-0"
                          : "invisible opacity-0 -translate-y-2"
                      }`}
                    >
                      <div className="overflow-y-auto py-2 max-h-96">
                        {servicesLoading && (
                          <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                        )}
                        {!servicesLoading && services.length === 0 && (
                          <div className="px-4 py-2 text-sm text-gray-500">No services available</div>
                        )}
                        {!servicesLoading && services.map((service) => (
                          <Link
                            key={service.path}
                            href={service.path}
                            className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : item.name === "About" ? (
                  <a
                    href={item.path}
                    onClick={handleAboutClick}
                    className="text-gray-700 hover:text-gray-900 font-medium text-base transition-colors duration-200 py-2"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.path}
                    className={`text-gray-700 hover:text-gray-900 font-medium text-base transition-colors duration-200 py-2 ${
                      pathname === item.path ? "text-gray-900" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="/#contact"
              onClick={handleContactClick}
              className="px-6 py-3 font-medium text-white bg-gray-900 rounded-lg transition-colors duration-200 hover:bg-gray-800"
            >
              Contact
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="bg-white border-t border-gray-200 lg:hidden">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {mainNavItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        className="block flex justify-between items-center py-2 w-full text-base font-medium text-left text-gray-700"
                      >
                        {item.name}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            isServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isServicesOpen && (
                        <div className="overflow-y-auto absolute right-0 left-0 top-full z-50 mt-1 max-h-80 bg-white rounded-lg border border-gray-200 shadow-lg">
                          <div className="py-2">
                            {servicesLoading && (
                              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                            )}
                            {!servicesLoading && services.length === 0 && (
                              <div className="px-4 py-2 text-sm text-gray-500">No services available</div>
                            )}
                            {!servicesLoading && services.map((service) => (
                              <Link
                                key={service.path}
                                href={service.path}
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setIsServicesOpen(false);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-50"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : item.name === "About" ? (
                    <a
                      href={item.path}
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        handleAboutClick(e);
                      }}
                      className="block text-gray-700 font-medium text-base py-2 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-gray-700 font-medium text-base py-2 hover:text-gray-900 transition-colors ${
                        pathname === item.path ? "text-gray-900" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200">
                <a
                  href="/#contact"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    handleContactClick(e);
                  }}
                  className="block px-6 py-3 w-full font-medium text-center text-white bg-gray-900 rounded-lg transition-colors duration-200 hover:bg-gray-800"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;