'use client';

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Business, BusinessTemplate } from "@/lib/types";

interface ForeignExchangePageProps {
  business: Business;
  content: any;
  template: BusinessTemplate;
  preview?: boolean;
}

export function ForeignExchangTemplate({ business, content, template, preview = false }: ForeignExchangePageProps) {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const currencies = [
    {
      currency: "US Dollar",
      code: "USD",
      flag: "🇺🇸",
      buyRate: "19.50",
      sellRate: "19.80",
      change: "+0.15",
    },
    {
      currency: "Euro",
      code: "EUR",
      flag: "🇪🇺",
      buyRate: "21.20",
      sellRate: "21.55",
      change: "+0.08",
    },
    {
      currency: "British Pound",
      code: "GBP",
      flag: "🇬🇧",
      buyRate: "24.80",
      sellRate: "25.20",
      change: "-0.12",
    },
    {
      currency: "Nigerian Naira",
      code: "NGN",
      flag: "🇳🇬",
      buyRate: "0.025",
      sellRate: "0.028",
      change: "+0.001",
    },
    {
      currency: "Ghanaian Cedi",
      code: "GHS",
      flag: "🇬🇭",
      buyRate: "1.65",
      sellRate: "1.72",
      change: "+0.03",
    },
    {
      currency: "CFA Franc",
      code: "XOF",
      flag: "🌍",
      buyRate: "0.032",
      sellRate: "0.035",
      change: "+0.001",
    },
  ];

  const services = [
    {
      icon: DollarSign,
      name: "Currency Exchange",
      description:
        "Buy and sell foreign currencies at competitive rates across our 7 bureau locations",
    },
    {
      icon: Globe,
      name: "Money Remittance",
      description:
        "Send money internationally through our secure remittance network",
    },
    {
      icon: Shield,
      name: "Licensed Operations",
      description:
        "Fully licensed and regulated FX bureau services with complete compliance",
    },
    {
      icon: TrendingUp,
      name: "Vendor Network",
      description:
        "Extended access through our network of licensed subcontracted vendors",
    },
  ];

  const stats = [
    { number: "Different", label: "Currencies Available" },
    { number: "10K+", label: "Monthly Exchanges" },
    { number: "Licensed", label: "& Regulated" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Main Container with Professional Background */}
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative text-white bg-gradient-to-br max-sm:pt-32 from-slate-800 to-slate-900">
          <div className="flex justify-center items-center px-4 mx-auto max-w-7xl min-h-screen sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 mb-8 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full border border-amber-200">
                <span className="mr-3 w-2 h-2 bg-green-500 rounded-full"></span>
                Licensed & Regulated FX Bureau
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                Professional Currency
                <span className="block text-amber-400">Exchange Services</span>
              </h1>

              {/* Description */}
              <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-300">
                Trusted foreign exchange and international remittance services
                through our network of 7 licensed FX bureaus and authorized
                vendor partners across the region.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
                <a
                  href="#services"
                  className="px-8 py-4 font-semibold text-white bg-amber-600 rounded-lg shadow-lg transition-colors duration-300 hover:bg-amber-700"
                >
                  Learn More
                </a>
                <a
                  href="#exchange-rates"
                  className="px-8 py-4 font-semibold text-white rounded-lg border-2 border-white transition-colors duration-300 hover:bg-white hover:text-slate-800"
                >
                  View Exchange Rates
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-6 pt-16 mb-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2 text-2xl font-bold text-amber-400 sm:text-3xl">
                      {stat.number}
                    </div>
                    <div className="text-xs text-gray-300 sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Rates Section */}
        <section id="exchange-rates" className="py-20 bg-white">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full border border-amber-200">
                <span className="mr-3 w-2 h-2 bg-green-500 rounded-full"></span>
                Current Exchange Rates
              </div>
              <h2 className="mb-6 text-4xl font-bold md:text-5xl text-slate-800">
                Today's Rates
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-slate-600">
                Competitive foreign exchange rates available at all our bureau
                locations. Visit us for the most current rates and personalized
                service.
              </p>
              <div className="flex justify-center items-center mt-6">
                <div className="mr-2 w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-600">
                  Updated Daily
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {currencies.map((currency, index) => (
                <div
                  key={index}
                  className="relative p-6 bg-gradient-to-br rounded-2xl border backdrop-blur-sm transition-all duration-500 group from-slate-800 to-slate-900 border-amber-500/20 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2"
                >
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 transition-opacity duration-500 from-amber-500/10 to-amber-600/10 group-hover:opacity-100"></div>

                  {/* Currency Header */}

                  <div className="flex justify-between items-center mb-6 space-x-4">
                    <div>
                      <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-amber-300">
                        {currency.code}
                      </h3>
                      <p className="text-sm text-amber-200/70">
                        {currency.currency}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full opacity-50 blur transition-opacity duration-300 group-hover:opacity-75"></div>
                      <div className="flex relative justify-center items-center w-12 h-12 bg-gradient-to-br rounded-full border from-slate-700 to-slate-800 border-amber-400/30">
                        <span className="text-2xl">{currency.flag}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rates Display */}
                  <div className="grid relative grid-cols-2 gap-6">
                    <div className="p-4 text-center bg-gradient-to-br rounded-xl border from-green-500/10 to-emerald-500/10 border-green-400/20">
                      <p className="mb-2 text-sm font-medium tracking-wide text-green-300 uppercase">
                        We Buy
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        {currency.buyRate}
                      </p>
                    </div>
                    <div className="p-4 text-center bg-gradient-to-br rounded-xl border from-amber-500/10 to-amber-600/10 border-amber-400/20">
                      <p className="mb-2 text-sm font-medium tracking-wide text-amber-300 uppercase">
                        We Sell
                      </p>
                      <p className="text-2xl font-bold text-amber-400">
                        {currency.sellRate}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-20 text-center">
              <div className="inline-flex items-center px-6 py-3 mb-8 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full border border-amber-200">
                <span className="mr-3 w-2 h-2 bg-amber-600 rounded-full"></span>
                Professional FX Services
              </div>
              <h2 className="mb-8 text-4xl font-bold md:text-5xl text-slate-800">
                What We Offer
              </h2>
              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-slate-600">
                Comprehensive foreign exchange and international remittance
                services through our established network of licensed bureaus and
                authorized partners.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              {services.map((service, index) => (
                <div key={index} className="relative group">
                  <div className="flex items-start p-8 space-x-6 bg-gradient-to-br rounded-2xl border transition-all duration-500 from-slate-50 to-slate-100/50 border-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
                    {/* Icon Container */}
                    <div className="flex-shrink-0">
                      <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-4 text-2xl font-bold transition-colors duration-300 text-slate-800 group-hover:text-slate-900">
                        {service.name}
                      </h3>
                      <p className="text-lg leading-relaxed transition-colors duration-300 text-slate-600 group-hover:text-slate-700">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtle accent line */}
                  <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="overflow-hidden relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
          </div>

          <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-20 text-center">
              <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-amber-800 bg-amber-100 rounded-full border border-amber-200">
                <span className="mr-2 w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
                Contact Our Experts
              </div>
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Visit Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Licensed
                </span>{" "}
                Bureaus
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Experience personalized service at any of our licensed FX bureau
                locations. Contact us for current rates and professional
                assistance with your currency exchange needs.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid gap-8 mx-auto max-w-5xl lg:grid-cols-2">
              {/* Phone Contact */}
              <div className="relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500 group bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-500/10">
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-2xl opacity-0 transition-opacity duration-500 from-amber-500/5 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex justify-center items-center mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Phone className="w-10 h-10 text-white" />
                  </div>

                  <div className="text-center">
                    <h3 className="mb-4 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-amber-400">
                      Call Our Specialists
                    </h3>
                    <p className="mb-8 text-lg transition-colors duration-300 text-slate-300 group-hover:text-slate-200">
                      Speak directly with our licensed FX specialists for
                      immediate assistance and current exchange rates
                    </p>

                    <div className="space-y-4">
                      <a
                        href="tel:+1234567890"
                        className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-amber-400 rounded-xl transition-all duration-300 text-slate-900 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-1"
                      >
                        <Phone className="mr-3 w-5 h-5" />
                        +1 (234) 567-8900
                      </a>
                      <p className="text-sm text-slate-400">
                        Available Monday - Friday, 9 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              {/* Email Contact */}
              <div className="relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500 group bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-500/10">
                <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-2xl opacity-0 transition-opacity duration-500 from-amber-500/5 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex justify-center items-center mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Mail className="w-10 h-10 text-white" />
                  </div>

                  <div className="text-center">
                    <h3 className="mb-4 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-amber-400">
                      Email Inquiries
                    </h3>
                    <p className="mb-8 text-lg transition-colors duration-300 text-slate-300 group-hover:text-slate-200">
                      Get detailed information about rates, services, and bureau
                      locations via email
                    </p>

                    <div className="space-y-4">
                      <a
                        href="mailto:info@fxbureau.com"
                        className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-amber-400 rounded-xl transition-all duration-300 text-slate-900 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-1"
                      >
                        <Mail className="mr-3 w-5 h-5" />
                        info@fxbureau.com
                      </a>
                      <p className="text-sm text-slate-400">
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default ForeignExchangTemplate;
