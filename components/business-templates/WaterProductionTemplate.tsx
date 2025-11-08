'use client';

import React, { useState, useEffect, useMemo } from "react";
import {
  Droplets,
  Truck,
  Shield,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Zap,
  LucideIcon,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Business, BusinessTemplate } from "@/lib/types";

interface WaterProductionPageProps {
  business: Business;
  content: any;
  template: BusinessTemplate;
  preview?: boolean;
}

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  Droplets,
  Truck,
  Shield,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Zap,
};

export function WaterProductionTemplate({ business, content, template, preview = false }: WaterProductionPageProps) {
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

  // Extract content sections from database - NO FALLBACKS
  const heroContent = content?.hero || (content?.sections && content.sections.find((s: any) => s.type === 'hero')?.content);
  const productsContent = content?.products || (content?.sections && content.sections.find((s: any) => s.type === 'products')?.content);
  const servicesContent = content?.services || (content?.sections && content.sections.find((s: any) => s.type === 'services')?.content);
  const processContent = content?.process || (content?.sections && content.sections.find((s: any) => s.type === 'process')?.content);
  const contactContent = content?.contact || (content?.sections && content.sections.find((s: any) => s.type === 'contact')?.content);

  // Extract hero data - NO FALLBACKS
  const hasHeroContent = heroContent?.title || heroContent?.description;
  const heroTitle = heroContent?.title;
  const heroSubtitle = heroContent?.subtitle;
  const heroDescription = heroContent?.description;
  const heroBadge = heroContent?.badge || heroContent?.badges?.[0];
  const heroBackgroundImage = heroContent?.backgroundImage?.url || heroContent?.backgroundImage;
  const heroButtons = heroContent?.ctaButtons || heroContent?.buttons || [];
  const heroStats = useMemo(() => {
    if (heroContent?.stats && Array.isArray(heroContent.stats) && heroContent.stats.length > 0) {
      return heroContent.stats.map((s: any) => ({
        number: s.number || s.value || '',
        label: s.label || s.title || '',
      }));
    }
    return [];
  }, [heroContent]);

  // Extract products - NO FALLBACKS
  const products = useMemo(() => {
    if (productsContent?.products && Array.isArray(productsContent.products) && productsContent.products.length > 0) {
      return productsContent.products.map((p: any) => {
        const iconName = p.icon || p.iconName || 'Droplets';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || Droplets)
          : (iconName || Droplets);
        return {
          category: p.category || p.name || '',
          image: p.image?.url || p.image || '',
          description: p.description || '',
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          icon: IconComponent,
        };
      });
    }
    return [];
  }, [productsContent]);

  const hasProducts = products.length > 0;
  const productsTitle = productsContent?.title;
  const productsDescription = productsContent?.description;
  const productsSubtitle = productsContent?.subtitle;

  // Extract services - NO FALLBACKS
  const services = useMemo(() => {
    if (servicesContent?.services && Array.isArray(servicesContent.services) && servicesContent.services.length > 0) {
      return servicesContent.services.map((s: any) => {
        const iconName = s.icon || s.iconName || 'Truck';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || Truck)
          : (iconName || Truck);
        return {
          icon: IconComponent,
          name: s.name || s.title || '',
          description: s.description || '',
        };
      });
    }
    return [];
  }, [servicesContent]);

  const hasServices = services.length > 0;
  const servicesTitle = servicesContent?.title;
  const servicesDescription = servicesContent?.description;

  // Extract process steps - NO FALLBACKS
  const processSteps = useMemo(() => {
    if (processContent?.steps && Array.isArray(processContent.steps) && processContent.steps.length > 0) {
      return processContent.steps.map((step: any) => {
        const iconName = step.icon || step.iconName || 'Droplets';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || Droplets)
          : (iconName || Droplets);
        return {
          number: step.number || step.stepNumber || '',
          title: step.title || '',
          description: step.description || '',
          subtitle: step.subtitle || '',
          icon: IconComponent,
        };
      });
    }
    return [];
  }, [processContent]);

  const hasProcess = processSteps.length > 0;
  const processTitle = processContent?.title;
  const processDescription = processContent?.description;

  // Extract contact data - NO FALLBACKS
  const hasContactContent = contactContent?.phone || contactContent?.email || business?.contact?.phone || business?.contact?.email;
  const contactPhone = contactContent?.phone || business?.contact?.phone;
  const contactEmail = contactContent?.email || business?.contact?.email;
  const contactTitle = contactContent?.title;
  const contactDescription = contactContent?.description;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Only render if data exists */}
      {hasHeroContent && (
      <section className="overflow-hidden relative min-h-screen bg-gradient-to-br via-blue-900 to-cyan-900 from-slate-900">
        {/* Background Image if provided */}
        {heroBackgroundImage && (
        <div className="absolute inset-0">
          <img
            src={heroBackgroundImage}
            alt="Water Production Facility"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-br via-blue-900/80 to-cyan-900/80 from-slate-900/80"></div>
        </div>
        )}

        {/* Industrial Background Elements (if no background image) */}
        {!heroBackgroundImage && (
        <div className="absolute inset-0">
          {/* Water Production Facility Silhouette */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20">
            <svg viewBox="0 0 1200 400" className="w-full h-full">
              <defs>
                <linearGradient
                  id="facilityGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect x="50" y="200" width="80" height="200" fill="url(#facilityGradient)" />
              <rect x="150" y="150" width="100" height="250" fill="url(#facilityGradient)" />
              <circle cx="300" cy="250" r="60" fill="url(#facilityGradient)" />
              <rect x="400" y="180" width="120" height="220" fill="url(#facilityGradient)" />
              <circle cx="600" cy="220" r="80" fill="url(#facilityGradient)" />
              <rect x="750" y="160" width="90" height="240" fill="url(#facilityGradient)" />
              <rect x="900" y="190" width="110" height="210" fill="url(#facilityGradient)" />
              <circle cx="1100" cy="280" r="70" fill="url(#facilityGradient)" />
            </svg>
          </div>

          {/* Animated Water Flow Lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 1200 800">
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,300 Q300,250 600,300 T1200,300" stroke="url(#flowGradient)" strokeWidth="3" fill="none" className="animate-pulse" />
              <path d="M0,400 Q400,350 800,400 T1200,400" stroke="url(#flowGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: "1s" }} />
              <path d="M0,500 Q200,450 400,500 T800,500" stroke="url(#flowGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: "2s" }} />
            </svg>
          </div>

          {/* Particle System - Water Molecules */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => {
              // Deterministic pseudo-random values based on index to avoid hydration mismatch
              const seed = i * 0.618033988749895; // Golden ratio for better distribution
              const left = ((seed * 100) % 100).toFixed(2);
              const top = (((seed * 137.508) % 100)).toFixed(2); // Golden angle
              const delay = ((seed * 3) % 3).toFixed(2);
              const duration = (2 + (seed * 2) % 2).toFixed(2);
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-pulse bg-blue-300/30"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
        )}

        {/* Main Content */}
        <div className="flex relative z-10 items-center px-4 min-h-screen">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
              {/* Left Side - Content */}
              <div className="space-y-8">
                {/* Company Badge */}
                {heroBadge && (
                <div className="animate-fade-in-up">
                  <span className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-200 rounded-full border backdrop-blur-sm bg-blue-500/20 border-blue-400/30">
                    <Droplets className="mr-3 w-4 h-4 text-blue-400" />
                    {heroBadge}
                  </span>
                </div>
                )}

                {/* Main Heading */}
                {heroTitle && (
                <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <h1 className="text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                    {heroSubtitle ? (
                      <>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">
                          {heroTitle}
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">
                          {heroSubtitle}
                    </span>
                      </>
                    ) : (
                      <span className="block text-white">{heroTitle}</span>
                    )}
                  </h1>
                </div>
                )}

                {/* Description */}
                {heroDescription && (
                <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                  <p className="max-w-2xl text-xl font-light leading-relaxed text-blue-100 md:text-2xl">
                    {heroDescription}
                  </p>
                </div>
                )}

                {/* Production Stats */}
                {heroStats.length > 0 && (
                <div className="grid grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                  {heroStats.map((stat: any, index: number) => (
                    <div key={index} className="text-center">
                    <div className="text-3xl font-black text-blue-300 md:text-4xl">
                        {stat.number}
                    </div>
                    <div className="text-sm font-medium text-blue-200/80">
                        {stat.label}
                    </div>
                  </div>
                  ))}
                    </div>
                )}

                {/* CTA Buttons */}
                {heroButtons.length > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                  {heroButtons.map((button: any, index: number) => {
                    const iconName = button.icon || button.iconName;
                    const ButtonIcon = typeof iconName === 'string' 
                      ? (iconMap[iconName] || null)
                      : (iconName || null);
                    return (
                    <a
                      key={index}
                      href={button.link || button.href || '#'}
                      className={`overflow-hidden relative px-8 py-4 text-lg font-bold text-white rounded-xl shadow-2xl transition-all duration-300 group hover:scale-105 ${
                        button.style === 'secondary' || index > 0
                          ? 'border-2 backdrop-blur-sm bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-blue-500/50'
                      }`}
                    >
                      {button.style !== 'secondary' && index === 0 && (
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                      )}
                    <span className="flex relative items-center">
                        {ButtonIcon && <ButtonIcon className="mr-3 w-5 h-5" />}
                        {button.text || button.label || 'Learn More'}
                    </span>
                    </a>
                    );
                  })}
                </div>
                )}
              </div>

              {/* Right Side - Production Visualization */}
              <div
                className="relative animate-fade-in-up"
                style={{ animationDelay: "1s" }}
              >
                <div className="relative mx-auto w-full max-w-lg">
                  {/* Main Production Tank */}
                  <div className="relative mx-auto w-80 h-96">
                    <div className="absolute inset-0 bg-gradient-to-b rounded-3xl border-2 backdrop-blur-sm from-blue-500/20 to-cyan-500/30 border-blue-400/30">
                      {/* Water Level Animation */}
                      <div className="absolute right-0 bottom-0 left-0 h-3/4 bg-gradient-to-t rounded-3xl animate-pulse from-cyan-400/40 to-blue-400/20">
                        <div className="absolute top-0 right-0 left-0 h-8 bg-gradient-to-b to-transparent rounded-t-3xl animate-bounce from-white/20"></div>
                      </div>

                      {/* Filtration Layers */}
                      <div className="absolute right-4 bottom-4 left-4 space-y-2">
                        <div className="h-2 rounded-full bg-blue-300/50"></div>
                        <div className="h-2 rounded-full bg-cyan-300/50"></div>
                        <div className="h-2 rounded-full bg-teal-300/50"></div>
                      </div>

                      {/* Quality Indicators */}
                      <div className="flex absolute top-4 right-4 left-4 justify-between">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                      </div>
                    </div>

                    {/* Pipes and Connections */}
                    <div className="absolute -right-8 top-1/2 w-16 h-4 bg-gradient-to-r to-transparent rounded-r-full from-blue-400/30"></div>
                    <div className="absolute -left-8 top-1/3 w-16 h-4 bg-gradient-to-l to-transparent rounded-l-full from-cyan-400/30"></div>

                    {/* Output Flow */}
                    <div className="absolute bottom-8 -right-12 w-8 h-20 bg-gradient-to-b rounded-full animate-pulse from-blue-400/40 to-cyan-400/60"></div>
                  </div>

                  {/* Floating Quality Metrics */}
                  <div className="absolute -top-4 -left-4 p-4 rounded-xl border backdrop-blur-sm bg-blue-500/20 border-blue-400/30">
                    <div className="text-lg font-bold text-blue-300">
                      ISO 9001
                    </div>
                    <div className="text-sm text-blue-200/70">Certified</div>
                  </div>

                  <div className="absolute -right-4 -bottom-4 p-4 rounded-xl border backdrop-blur-sm bg-cyan-500/20 border-cyan-400/30">
                    <div className="text-lg font-bold text-cyan-300">HACCP</div>
                    <div className="text-sm text-cyan-200/70">Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 animate-bounce transform -translate-x-1/2">
          <div className="flex justify-center w-8 h-12 rounded-full border-2 border-white/30">
            <div className="mt-2 w-1 h-4 rounded-full animate-pulse bg-white/50"></div>
          </div>
        </div>
      </section>
      )}

      {/* Products Section - Only render if data exists */}
      {hasProducts && (
      <section
        data-section
        id="products"
        className="overflow-hidden relative py-20 bg-white"
      >
        {/* Clean Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="productGrid"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="1" fill="#3b82f6" opacity="0.3" />
                  <rect
                    x="5"
                    y="5"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="0.5"
                    opacity="0.2"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#productGrid)" />
            </svg>
          </div>

          {/* Floating Production Elements */}
          <div className="absolute left-10 top-20 w-16 h-16 rounded-full animate-pulse bg-blue-500/5"></div>
          <div
            className="absolute right-10 bottom-20 w-20 h-20 rounded-full animate-pulse bg-blue-600/5"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full animate-pulse bg-blue-400/5"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            {productsSubtitle && (
            <div className="mb-6">
              <span className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-200">
                <Droplets className="mr-3 w-4 h-4 text-blue-500" />
                {productsSubtitle}
              </span>
            </div>
            )}
            {productsTitle && (
            <h2 className="mb-6 text-5xl font-black leading-tight text-gray-900 md:text-6xl">
              {productsTitle}
            </h2>
            )}
            {productsDescription && (
            <p className="mx-auto max-w-4xl text-xl font-light leading-relaxed text-gray-600 md:text-2xl">
              {productsDescription}
            </p>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {products.map((product: any, index: number) => {
              const ProductIcon = product.icon;
              return (
              <div
                key={index}
                className="overflow-hidden relative bg-white rounded-3xl border border-gray-200 transition-all duration-500 group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 hover:scale-105"
              >
                {/* Product Header with Real Images */}
                {product.image && (
                <div className="overflow-hidden relative h-64">
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.category}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60 via-black/20"></div>

                  {/* Product Icon and Category */}
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex justify-center items-center w-12 h-12 rounded-xl border backdrop-blur-sm bg-white/90 border-white/20">
                        {ProductIcon && <ProductIcon className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                          {product.category}
                        </h3>
                        <div className="mt-1 w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  </div>
                )}

                {/* Product Details */}
                <div className="p-8">
                  {product.description && (
                  <p className="mb-6 text-lg leading-relaxed text-gray-600">
                    {product.description}
                  </p>
                  )}

                  {/* Available Sizes with Clean Design */}
                  {product.sizes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                      Available Formats
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {product.sizes.map((size: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative px-4 py-3 text-center bg-blue-50 rounded-xl border border-blue-200 transition-all duration-300 group/size hover:bg-blue-100 hover:border-blue-300"
                        >
                          <span className="text-sm font-medium text-blue-700 transition-colors duration-300 group-hover/size:text-blue-800">
                            {size}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-blue-100/0 via-blue-100/50 to-blue-100/0 group-hover/size:opacity-100"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Production Specs */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          99.9%
                        </div>
                        <div className="text-xs text-gray-500">Purity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          ISO
                        </div>
                        <div className="text-xs text-gray-500">Certified</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          24/7
                        </div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                    </div>

                    <a
                      href="#contact"
                      className="inline-block px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      Order Now
                    </a>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br rounded-3xl transition-all duration-500 pointer-events-none from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/30 group-hover:to-blue-100/30"></div>
              </div>
              );
            })}
          </div>

        </div>
      </section>
      )}

      {/* Services Section - Only render if data exists */}
      {hasServices && (
      <section
        data-section
        id="services"
        className="overflow-hidden relative py-20 bg-gradient-to-br via-blue-50 to-cyan-50 from-slate-50"
      >
        {/* Animated Water Bubbles Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => {
            // Deterministic pseudo-random values based on index to avoid hydration mismatch
            const seed = i * 0.618033988749895; // Golden ratio for better distribution
            const left = ((seed * 100) % 100).toFixed(2);
            const top = (((seed * 137.508) % 100)).toFixed(2); // Golden angle
            const delay = ((seed * 3) % 3).toFixed(2);
            const duration = (3 + (seed * 2) % 2).toFixed(2);
            return (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full animate-pulse bg-blue-200/30"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>

        {/* Flowing Water Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 Q300,150 600,200 T1200,200"
              stroke="url(#waterFlow)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M0,400 Q400,350 800,400 T1200,400"
              stroke="url(#waterFlow)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <path
              d="M0,600 Q200,550 400,600 T1200,600"
              stroke="url(#waterFlow)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </svg>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            {servicesTitle && (
            <div className="inline-flex gap-3 items-center mb-4">
              <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {servicesTitle}
              </h2>
            </div>
            )}
            {servicesDescription && (
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
              {servicesDescription}
            </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service: any, index: number) => {
              const ServiceIcon = service.icon;
              return (
              <div
                key={index}
                className="relative p-8 text-center rounded-2xl border border-blue-100 backdrop-blur-sm transition-all duration-500 group bg-white/80 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-300"
              >
                {/* Water Drop Animation */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:animate-bounce" />

                {/* Service Icon with Water Effect */}
                <div className="relative mx-auto mb-6">
                  <div className="flex justify-center items-center mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/30 group-hover:scale-110">
                    {ServiceIcon && <ServiceIcon className="w-10 h-10 text-white" />}
                  </div>
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 mx-auto w-20 h-20 rounded-full opacity-0 animate-ping bg-blue-400/20 group-hover:opacity-100" />
                </div>

                <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                  {service.name}
                </h3>
                <p className="leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {service.description}
                </p>

                {/* Water Level Indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-b-2xl transition-transform duration-500 transform origin-left scale-x-0 group-hover:scale-x-100" />

                {/* Floating Particles */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                        animationDelay: `${i * 0.5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              );
            })}
          </div>

        </div>
      </section>
      )}

      {/* Process Section - Only render if data exists */}
      {hasProcess && (
      <section
        data-section
        id="process"
        className="overflow-hidden relative py-20 bg-gradient-to-b from-gray-50 via-blue-50 to-cyan-50"
      >
        {/* Floating Water Droplets */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute left-16 top-32 w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "4s" }}
          />
          <div
            className="absolute right-24 top-64 w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s", animationDuration: "3s" }}
          />
          <div
            className="absolute top-96 left-1/3 w-4 h-4 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "2.5s", animationDuration: "5s" }}
          />
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            {processTitle && (
            <div className="inline-flex gap-4 items-center mb-6">
              <div className="flex justify-center items-center w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full shadow-xl">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {processTitle}
              </h2>
            </div>
            )}
            {processDescription && (
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">
              {processDescription}
            </p>
            )}
          </div>

          {/* Descending Steps Container */}
          <div className="relative mx-auto max-w-4xl">
            {processSteps.map((step: any, index: number) => {
              const marginLeft = index * 16; // 0, 16, 32, 48...
              const isEven = index % 2 === 0;
              const colors = isEven 
                ? { from: 'from-blue-500', to: 'to-cyan-500', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:shadow-blue-500/25' }
                : { from: 'from-cyan-500', to: 'to-blue-500', border: 'border-cyan-200', text: 'text-cyan-600', hover: 'hover:shadow-cyan-500/25' };
              const StepIcon = step.icon;
              
              return (
                <div
                  key={index}
                  className={`relative mb-8 ${index > 0 ? `ml-${marginLeft}` : ''}`}
                  style={{ animation: `stepDown 0.8s ease-out ${0.2 + index * 0.2}s both` }}
                >
                  <div className={`overflow-hidden relative rounded-2xl border-2 ${colors.border} shadow-xl backdrop-blur-sm transition-all duration-500 bg-white/95 hover:shadow-2xl ${colors.hover} group`}>
                {/* Step Number Badge */}
                    <div className={`flex absolute -top-4 -left-4 z-10 justify-center items-center w-12 h-12 text-lg font-bold text-white bg-gradient-to-br ${colors.from} ${colors.to} rounded-full shadow-lg`}>
                      {String(step.number || index + 1).padStart(2, '0')}
                </div>

                {/* Water Flow Line */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.from} ${colors.to} transition-transform duration-1000 transform origin-left scale-x-0 group-hover:scale-x-100`} />

                <div className="p-8">
                  <div className="flex gap-6 items-center mb-6">
                    <div className="relative">
                          <div className={`flex justify-center items-center w-16 h-16 bg-gradient-to-br ${colors.from} ${colors.to} rounded-full shadow-lg transition-all duration-500 group-hover:shadow-xl ${colors.hover}`}>
                            {StepIcon && <StepIcon className="w-8 h-8 text-white" />}
                      </div>
                      <div className="absolute inset-0 w-16 h-16 rounded-full opacity-0 animate-ping bg-blue-400/30 group-hover:opacity-100" />
                    </div>
                    <div className="flex-1">
                          {step.title && (
                            <h3 className={`text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:${colors.text}`}>
                              {step.title}
                      </h3>
                          )}
                          {step.subtitle && (
                            <p className={`font-medium ${colors.text}`}>{step.subtitle}</p>
                          )}
                    </div>
                  </div>
                      {step.description && (
                  <p className="leading-relaxed text-gray-600">
                          {step.description}
                        </p>
                      )}
                </div>
              </div>
            </div>
              );
            })}

            {/* Connecting Flow Lines */}
            <div className="absolute top-24 left-8 w-0.5 h-full bg-gradient-to-b from-blue-300 via-cyan-300 to-blue-400 opacity-30">
              <div
                className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"
                style={{ animation: "flowDown 4s ease-in-out infinite" }}
              />
            </div>
          </div>

          {/* Completion Badge */}
          <div
            className="mt-16 text-center"
            style={{ animation: "fadeInUp 1s ease-out 1s both" }}
          >
            <div className="inline-flex gap-3 items-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-xl transition-all duration-500 hover:shadow-blue-500/40 hover:scale-105">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Production Complete - Premium Water Ready</span>
            </div>
          </div>
        </div>

        {/* Custom Animation Keyframes */}
        <style>{`
          @keyframes stepDown {
            0% { transform: translateY(-50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes flowDown {
            0% { transform: translateY(-100%); opacity: 0; }
            25% { transform: translateY(0%); opacity: 1; }
            75% { transform: translateY(200%); opacity: 1; }
            100% { transform: translateY(300%); opacity: 0; }
          }
          @keyframes fadeInUp {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </section>
      )}

      {/* Contact Section - Only render if data exists */}
      {hasContactContent && (
      <section
        data-section
        id="contact"
        className="overflow-hidden relative py-20 bg-gradient-to-b from-gray-900 via-blue-900 to-cyan-900"
      >
        {/* Floating Water Bubbles Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 left-20 w-6 h-6 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "4s" }}
          />
          <div
            className="absolute right-32 top-40 w-4 h-4 bg-cyan-300 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "5s" }}
          />
          <div
            className="absolute top-60 left-1/3 w-8 h-8 bg-blue-300 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "3s" }}
          />
          <div
            className="absolute right-20 bottom-40 w-5 h-5 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s", animationDuration: "4.5s" }}
          />
          <div
            className="absolute left-16 bottom-60 w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
          />
        </div>

        {/* Animated Water Waves */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              fill="url(#waveGradient)"
              className="animate-pulse"
            />
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-6xl text-center sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="mb-16">
            {contactTitle && (
            <div className="inline-flex gap-4 items-center mb-6">
              <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-2xl">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300">
                {contactTitle}
              </h2>
            </div>
            )}
            {contactDescription && (
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-300">
              {contactDescription}
            </p>
            )}
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
            {/* Phone Contact */}
            {contactPhone && (
            <div className="group">
              <div className="overflow-hidden relative p-8 rounded-2xl border shadow-2xl backdrop-blur-sm transition-all duration-500 bg-white/10 border-blue-400/30 hover:shadow-blue-500/25 hover:scale-105 hover:bg-white/15">
                {/* Water Flow Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transition-transform duration-1000 transform origin-left scale-x-0 group-hover:scale-x-100" />

                <div className="relative">
                  <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/40">
                    <Phone className="w-10 h-10 text-white" />
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 w-20 h-20 rounded-full opacity-0 animate-ping bg-blue-400/30 group-hover:opacity-100" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-300">
                    Call for Delivery
                  </h3>
                  <a
                    href={`tel:${contactPhone}`}
                    className="inline-flex gap-3 items-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>
            )}

            {/* Email Contact */}
            {contactEmail && (
            <div className="group">
              <div className="overflow-hidden relative p-8 rounded-2xl border shadow-2xl backdrop-blur-sm transition-all duration-500 bg-white/10 border-cyan-400/30 hover:shadow-cyan-500/25 hover:scale-105 hover:bg-white/15">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transition-transform duration-1000 transform origin-left scale-x-0 group-hover:scale-x-100" />

                <div className="relative">
                  <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/40">
                    <Mail className="w-10 h-10 text-white" />
                    <div className="absolute inset-0 w-20 h-20 rounded-full opacity-0 animate-ping bg-cyan-400/30 group-hover:opacity-100" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
                    Email Inquiries
                  </h3>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex gap-3 items-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{contactEmail}</span>
                  </a>
                </div>
              </div>
            </div>
            )}
          </div>

        </div>
      </section>
      )}

    </div>
  );
}

export default WaterProductionTemplate;
