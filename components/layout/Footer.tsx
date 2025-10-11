'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const Footer: React.FC = () => {
  const getCurrentYear = () => new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log('Newsletter subscription submitted');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="overflow-hidden relative bg-gradient-to-br from-gray-900 to-black via-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta/20 to-sage/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-20 w-32 h-32 bg-gradient-to-br rounded-full blur-2xl animate-pulse from-terracotta/10 to-sage/10"></div>
        <div
          className="absolute right-10 bottom-20 w-40 h-40 bg-gradient-to-br rounded-full blur-2xl animate-pulse from-sage/10 to-terracotta/10"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex justify-center items-center mr-3 w-12 h-12 bg-gradient-to-br rounded-xl from-terracotta to-sage">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-sage">
                    Zeebundu
                  </div>
                </div>
                <p className="mb-6 leading-relaxed text-gray-400">
                  Building tomorrow's success stories through diverse business
                  ventures rooted in quality, sustainability, and community
                  growth.
                </p>

                {/* Social Media */}
                <div className="flex space-x-4">
                  {[
                    { icon: '📘', label: 'Facebook', href: '#' },
                    { icon: '🐦', label: 'Twitter', href: '#' },
                    { icon: '💼', label: 'LinkedIn', href: '#' },
                    { icon: '📷', label: 'Instagram', href: '#' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="flex justify-center items-center w-10 h-10 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Our Ventures */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">
                Our Ventures
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Gas Stations', href: '/business/gas-stations' },
                  { name: 'Hotels & Resorts', href: '/business/hotels-resorts' },
                  { name: 'Farming Operations', href: '/business/farming' },
                  { name: 'Fish Farming', href: '/business/fish-farming' },
                  { name: 'Water Production', href: '/business/water-production' },
                  { name: 'Natural Juices', href: '/business/natural-juices' },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="inline-block text-gray-400 transition-colors duration-300 hover:text-terracotta hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">
                Services
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Petroleum Services', href: '/business/petroleum-services' },
                  {
                    name: 'Construction Materials',
                    href: '/business/construction-materials',
                  },
                  { name: 'Cosmetics Salon', href: '/business/cosmetics-salon' },
                  { name: 'Beverages', href: '/business/beverages' },
                  { name: 'Foreign Exchange', href: '/business/foreign-exchange' },
                  { name: 'Zeemart Shopping', href: '/business/zeemart' },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="inline-block text-gray-400 transition-colors duration-300 hover:text-sage hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">
                Stay Connected
              </h3>

              {/* Contact Info */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-4 h-4 text-terracotta" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4 text-sage" />
                  <span>hello@zeebundu.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4 text-terracotta" />
                  <span>Global Operations</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="p-4 rounded-2xl border backdrop-blur-xl bg-white/5 border-white/10">
                <h4 className="mb-3 text-sm font-semibold text-white">
                  Newsletter
                </h4>
                <p className="mb-4 text-xs text-gray-400">
                  Get updates on our latest ventures and opportunities.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-3 py-2 text-sm placeholder-gray-500 text-white rounded-lg border backdrop-blur-sm bg-white/10 border-white/20 focus:outline-none focus:border-terracotta"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r rounded-lg transition-all duration-300 from-terracotta to-sage hover:shadow-lg hover:scale-105"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col justify-between items-center space-y-4 md:flex-row md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                &copy; {getCurrentYear()} Zeebundu. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                Crafted with care for communities worldwide.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="absolute top-8 right-8">
          <button
            onClick={scrollToTop}
            className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-r rounded-full backdrop-blur-sm transition-all duration-300 from-terracotta to-sage hover:shadow-lg hover:scale-110"
            aria-label="Back to top"
          >
            <ChevronDown className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;