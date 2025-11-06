'use client';

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Dog,
  Cat,
  Bird,
  Fish,
  Star,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Users,
  TreePine,
  Home,
  Award,
  Shield,
  Truck,
  Egg,
  Beef,
  Factory,
  LucideIcon,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Business, BusinessTemplate } from "@/lib/types";

interface LivestockPageProps {
  business: Business;
  content: any;
  template: BusinessTemplate;
  preview?: boolean;
}

// Icon mapping for service/product icons
const iconMap: Record<string, LucideIcon> = {
  Home,
  Heart,
  Shield,
  Truck,
  Award,
  Users,
  Egg,
  Beef,
  Star,
  Factory,
  TreePine,
  Clock,
  Phone,
  Mail,
};

export function LivestockTemplate({ business, content, template, preview = false }: LivestockPageProps) {
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
  const operationsContent = content?.operations || (content?.sections && content.sections.find((s: any) => s.type === 'operations')?.content);
  const livestockCategoriesContent = content?.livestockCategories || (content?.sections && content.sections.find((s: any) => s.type === 'livestockCategories')?.content);
  const servicesContent = content?.services || (content?.sections && content.sections.find((s: any) => s.type === 'services')?.content);
  const regionalImpactContent = content?.regionalImpact || (content?.sections && content.sections.find((s: any) => s.type === 'regionalImpact')?.content);
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
      return heroContent.stats.map((s: any) => {
        const iconName = s.icon || s.iconName || 'Award';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || Award)
          : (iconName || Award);
        return {
          icon: IconComponent,
          title: s.title || '',
          description: s.description || '',
          value: s.value || s.number || '',
        };
      });
    }
    return [];
  }, [heroContent]);

  // Extract cattle products from operations - NO FALLBACKS
  const cattleProducts = useMemo(() => {
    if (operationsContent?.products && Array.isArray(operationsContent.products) && operationsContent.products.length > 0) {
      return operationsContent.products.map((p: any) => {
        const iconName = p.icon || p.iconName || 'Beef';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || Beef)
          : (iconName || Beef);
        return {
          icon: IconComponent,
          name: p.name || p.title || '',
          category: p.category || '',
          image: p.image?.url || p.image || '',
          description: p.description || '',
          price: p.price || '',
          features: Array.isArray(p.features) ? p.features : [],
        };
      });
    }
    return [];
  }, [operationsContent]);

  // Extract operations info - NO FALLBACKS
  const hasOperations = operationsContent?.title || cattleProducts.length > 0;
  const operationsTitle = operationsContent?.title;
  const operationsDescription = operationsContent?.description;
  const operationsSubtitle = operationsContent?.subtitle;
  const operationsStats = operationsContent?.stats || [];

  // Extract livestock categories - NO FALLBACKS
  const livestockCategories = useMemo(() => {
    if (livestockCategoriesContent?.categories && Array.isArray(livestockCategoriesContent.categories) && livestockCategoriesContent.categories.length > 0) {
      return livestockCategoriesContent.categories.map((c: any) => {
        const iconName = c.icon || c.iconName || 'Home';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || Home)
          : (iconName || Home);
        return {
          icon: IconComponent,
          name: c.name || c.title || '',
          image: c.image?.url || c.image || '',
          description: c.description || '',
          breeds: Array.isArray(c.breeds) ? c.breeds : [],
          specialty: c.specialty || '',
          features: Array.isArray(c.features) ? c.features : [],
        };
      });
    }
    return [];
  }, [livestockCategoriesContent]);

  const hasLivestockCategories = livestockCategories.length > 0;
  const livestockCategoriesTitle = livestockCategoriesContent?.title;
  const livestockCategoriesDescription = livestockCategoriesContent?.description;

  // Extract services - NO FALLBACKS
  const services = useMemo(() => {
    if (servicesContent?.services && Array.isArray(servicesContent.services) && servicesContent.services.length > 0) {
      return servicesContent.services.map((s: any) => {
        const iconName = s.icon || s.iconName || 'Heart';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || Heart)
          : (iconName || Heart);
        return {
          icon: IconComponent,
          title: s.title || s.name || '',
          description: s.description || '',
          features: Array.isArray(s.features) ? s.features : [],
        };
      });
    }
    return [];
  }, [servicesContent]);

  const hasServices = services.length > 0;
  const servicesTitle = servicesContent?.title;
  const servicesDescription = servicesContent?.description;

  // Extract regional impact - NO FALLBACKS
  const hasRegionalImpact = regionalImpactContent?.title || regionalImpactContent?.description;
  const regionalImpactTitle = regionalImpactContent?.title;
  const regionalImpactDescription = regionalImpactContent?.description;
  const foodSecurityPoints = regionalImpactContent?.foodSecurityPoints || [];
  const processingPartnershipPoints = regionalImpactContent?.processingPartnershipPoints || [];
  const impactStats = regionalImpactContent?.stats || [];

  // Extract contact data - NO FALLBACKS
  const hasContactContent = contactContent?.phone || contactContent?.email || business?.contact?.phone || business?.contact?.email;
  const contactPhone = contactContent?.phone || business?.contact?.phone;
  const contactEmail = contactContent?.email || business?.contact?.email;
  const contactHours = contactContent?.hours || contactContent?.businessHours;
  const contactTitle = contactContent?.title;
  const contactDescription = contactContent?.description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navigation theme="light" bgColor="bg-white" />

      {/* Modern Ranch Hero Section - Only render if data exists */}
      {hasHeroContent && (
      <section className="flex overflow-hidden relative justify-center items-center min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          {heroBackgroundImage && (
          <img
              src={heroBackgroundImage}
            alt="Ranch landscape"
            className="object-cover w-full h-full"
          />
          )}
          <div className="absolute inset-0 bg-gradient-to-r to-transparent from-black/60 via-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-white max-sm:pt-24">
              {heroBadge && (
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full backdrop-blur-sm bg-white/10">
                <Home className="mr-2" size={20} />
                <span className="text-sm font-medium">
                    {heroBadge}
                </span>
              </div>
              )}

              {heroTitle && (
              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
                  {heroTitle}
                  {heroSubtitle && (
                    <span className="block text-red-500">{heroSubtitle}</span>
                  )}
              </h1>
              )}

              {heroDescription && (
              <p className="mb-8 text-xl leading-relaxed text-gray-200">
                  {heroDescription}
              </p>
              )}

              {heroButtons.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row">
                  {heroButtons.map((button: any, index: number) => (
                    <a 
                      key={index}
                      href={button.link || button.href || '#'} 
                      className="inline-block"
                    >
                      <button className={`px-8 py-4 font-semibold text-white rounded-xl transition-all duration-300 hover:scale-105 ${
                        button.style === 'secondary' || index > 0
                          ? 'border backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/30'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}>
                        {button.text || button.label || 'Learn More'}
                  </button>
                </a>
                  ))}
              </div>
              )}
            </div>

            {/* Right Stats - Only render if stats exist */}
            {heroStats.length > 0 && (
            <div className="grid grid-cols-2 gap-6 max-sm:pb-8">
                {heroStats.map((stat: any, index: number) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-6 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 bg-white/10 hover:bg-white/20"
                  >
                    <IconComponent className="mb-4 text-red-500" size={32} />
                      {stat.value && (
                    <div className="mb-2 text-3xl font-bold">{stat.value}</div>
                      )}
                      {stat.title && (
                    <div className="mb-1 text-lg font-semibold">
                      {stat.title}
                    </div>
                      )}
                      {stat.description && (
                    <div className="text-sm text-gray-300">
                      {stat.description}
                    </div>
                      )}
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Farm Operations Section - Only render if data exists */}
      {hasOperations && (
      <section id="operations" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-red-500 bg-red-100 rounded-full">
              <Shield className="mr-2 w-4 h-4" />
              Premium Farm Operations
            </div>
            {operationsTitle && (
            <h2 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
                {operationsTitle}
                {operationsSubtitle && (
                  <span className="block text-red-500">{operationsSubtitle}</span>
                )}
            </h2>
            )}
            {operationsDescription && (
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600">
                {operationsDescription}
            </p>
            )}
          </div>

          {/* Asymmetric Layout for Farm Operations */}
          {cattleProducts.length > 0 && (
          <div className="space-y-32">
            {/* Cattle Farming Section - Right Aligned */}
            <div className="grid gap-16 items-center lg:grid-cols-12">
              <div className="order-2 lg:col-span-7 lg:order-1">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {cattleProducts.slice(0, 3).map((product: any, index: number) => {
                    const IconComponent = product.icon;
                    return (
                      <div
                        key={index}
                        className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                          index === 2 ? "md:col-span-2 h-64" : "h-48"
                        }`}
                      >
                          {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                          )}
                        <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/70 via-black/20"></div>
                        <div className="absolute right-0 bottom-0 left-0 p-6">
                          <div className="flex justify-between items-center mb-2">
                              {product.name && (
                            <h4 className="text-lg font-bold text-white">
                              {product.name}
                            </h4>
                              )}
                            <div className="p-2 rounded-full backdrop-blur-sm bg-white/20">
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                          </div>
                            {product.description && (
                          <p className="text-sm text-white/90">
                            {product.description.slice(0, 80)}...
                          </p>
                            )}
                          <div className="flex justify-between items-center mt-3">
                              {product.price && (
                            <span className="font-bold text-red-300">
                              {product.price}
                            </span>
                              )}
                              {product.category && (
                            <span className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                              {product.category}
                            </span>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="order-1 lg:col-span-5 lg:order-2">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-3xl opacity-20 blur-xl"></div>
                  <div className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-xl">
                    <div className="flex items-center mb-6">
                      <div className="flex justify-center items-center mr-4 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl">
                        <Beef className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {operationsContent?.farmName || 'Cattle Farm'}
                        </h3>
                        <p className="font-medium text-red-600">
                            {operationsContent?.farmType || 'Premium Beef & Dairy'}
                        </p>
                      </div>
                    </div>

                      {operationsDescription && (
                    <p className="mb-8 text-lg leading-relaxed text-gray-600">
                          {operationsDescription}
                    </p>
                      )}

                      {operationsStats.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                          {operationsStats.map((stat: any, index: number) => (
                            <div key={index} className="p-4 text-center bg-red-50 rounded-xl">
                        <div className="text-2xl font-bold text-red-600">
                                {stat.value || stat.number || ''}
                        </div>
                        <div className="text-sm text-gray-600">
                                {stat.label || stat.title || ''}
                        </div>
                      </div>
                          ))}
                        </div>
                      )}

                    <a href="#contact" className="inline-block w-full">
                      <button className="px-6 py-4 w-full font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-xl shadow-lg transition-all duration-300 transform hover:from-red-600 hover:to-rose-600 hover:scale-105">
                          {operationsContent?.ctaText || 'Explore Cattle Products'}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>
      )}

      {/* Livestock Categories Section - Only render if data exists */}
      {hasLivestockCategories && (
      <section id="livestock" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-red-500 bg-red-100 rounded-full">
              <Shield className="mr-2 w-4 h-4" />
              Premium Livestock Collection
            </div>
            {livestockCategoriesTitle && (
            <h2 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
                {livestockCategoriesTitle}
            </h2>
            )}
            {livestockCategoriesDescription && (
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600">
                {livestockCategoriesDescription}
            </p>
            )}
          </div>

          {/* Livestock Cards - Two Side by Side */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {livestockCategories.map((category: any, index: number) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden border border-gray-200 hover:border-red-300 ${
                  visibleSections.has("livestock")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Hero Image Section */}
                <div className="overflow-hidden relative h-80">
                  {category.image && (
                  <img
                      src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                  />
                  )}

                  {/* Sophisticated Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br via-transparent from-black/60 to-red-900/40" />

                  {/* Floating Specialty Badge */}
                  {category.specialty && (
                  <div className="absolute top-6 right-6 px-5 py-3 text-sm font-bold text-red-600 rounded-2xl border border-red-100 shadow-xl backdrop-blur-md bg-white/95">
                    {category.specialty}
                  </div>
                  )}

                  {/* Title Section */}
                  <div className="absolute right-0 bottom-0 left-0 p-8 bg-gradient-to-t to-transparent from-black/90">
                    <h3 className="mb-3 text-3xl font-bold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-1 bg-red-500 rounded-full" />
                      <div className="w-6 h-1 bg-red-300 rounded-full" />
                      <div className="w-3 h-1 bg-red-200 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <p className="mb-6 text-lg font-medium leading-relaxed text-gray-700">
                    {category.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {category.features.map((feature: string, featureIndex: number) => (
                      <div
                        key={featureIndex}
                        className="p-3 text-center bg-red-50 rounded-xl border border-red-100"
                      >
                        <div className="text-xs font-semibold tracking-wide text-red-600 uppercase">
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Breed Showcase */}
                  {category.breeds.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-bold tracking-wide text-gray-800 uppercase">
                      Premium Breeds
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {category.breeds.map((breed: string, breedIndex: number) => (
                        <span
                          key={breedIndex}
                          className="px-3 py-2 text-sm font-medium text-center text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border border-gray-300 transition-all duration-300 cursor-pointer hover:from-red-100 hover:to-red-200 hover:text-red-800 hover:border-red-300"
                        >
                          {breed}
                        </span>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Action Button */}
                  <a href="#contact" className="inline-block w-full">
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl group-hover:shadow-red-500/30 flex items-center justify-center gap-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 transform -translate-x-full -skew-x-12 via-white/20 group-hover:translate-x-full" />
                      <span className="relative z-10">
                        Explore {category.name}
                      </span>
                      <svg
                        className="relative z-10 w-5 h-5 transition-transform transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Ranch Services Section - Only render if data exists */}
      {hasServices && (
      <section id="services" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-800 ${
              visibleSections.has("services")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {servicesTitle && (
            <h2 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
                {servicesTitle}
            </h2>
            )}
            <div className="mx-auto mb-6 w-24 h-1 bg-red-600"></div>
            {servicesDescription && (
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
                {servicesDescription}
            </p>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service: any, index: number) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className={`group p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-red-200 hover:-translate-y-1 ${
                    visibleSections.has("services")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center items-center mb-6 w-16 h-16 bg-red-50 rounded-xl transition-colors duration-300 group-hover:bg-red-100">
                    <IconComponent className="text-red-600" size={32} />
                  </div>

                  {service.title && (
                  <h3 className="mb-4 text-xl font-bold text-gray-800">
                    {service.title}
                  </h3>
                  )}
                  {service.description && (
                  <p className="mb-6 text-base leading-relaxed text-gray-600">
                    {service.description}
                  </p>
                  )}

                  {service.features.length > 0 && (
                  <div className="space-y-3">
                      {service.features.map((feature: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <div className="flex-shrink-0 mr-3 w-2 h-2 bg-red-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  )}

                  <a href="#contact" className="inline-block w-full">
                    <button className="py-3 mt-6 w-full text-base font-semibold text-red-600 bg-red-50 rounded-xl transition-colors duration-300 hover:bg-red-100">
                      Learn More
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Regional Impact Section - Only render if data exists */}
      {hasRegionalImpact && (
      <section
        id="regional-impact"
        data-section
        className="overflow-hidden relative py-24 text-white bg-gradient-to-br from-red-900 via-red-800 to-red-900"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-transparent via-red-600/20"></div>
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl bg-red-400/20"></div>
          <div className="absolute right-20 bottom-20 w-48 h-48 rounded-full blur-2xl bg-red-300/20"></div>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-800 ${
              visibleSections.has("regional-impact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {regionalImpactTitle && (
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {regionalImpactTitle}
            </h2>
            )}
            <div className="mx-auto mb-6 w-24 h-1 bg-gradient-to-r from-red-400 to-red-300"></div>
            {regionalImpactDescription && (
            <p className="mx-auto max-w-4xl text-xl text-red-100">
                {regionalImpactDescription}
            </p>
            )}
          </div>

          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Food Security Content */}
            {foodSecurityPoints.length > 0 && (
            <div
              className={`transition-all duration-800 ${
                visibleSections.has("regional-impact")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="p-8 rounded-3xl border backdrop-blur-sm bg-white/10 border-red-300/20">
                <div className="flex items-center mb-6">
                  <div className="flex justify-center items-center mr-4 w-12 h-12 rounded-xl bg-red-400/20">
                    <Shield className="text-red-300" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-red-100">
                      {regionalImpactContent?.foodSecurityTitle || 'Food Security Impact'}
                  </h3>
                </div>

                <div className="space-y-4">
                    {foodSecurityPoints.map((point: any, index: number) => (
                      <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                          {point.title && (
                            <strong className="text-white">{point.title}:</strong>
                          )}{' '}
                          {point.description || point.text || point}
                    </p>
                  </div>
                    ))}
                  </div>
                  </div>
                </div>
            )}

            {/* Processing Industry Content */}
            {processingPartnershipPoints.length > 0 && (
            <div
              className={`transition-all duration-800 ${
                visibleSections.has("regional-impact")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="p-8 rounded-3xl border backdrop-blur-sm bg-white/10 border-red-300/20">
                <div className="flex items-center mb-6">
                  <div className="flex justify-center items-center mr-4 w-12 h-12 rounded-xl bg-red-400/20">
                    <Factory className="text-red-300" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-red-100">
                      {regionalImpactContent?.processingTitle || 'Local Processing Partnership'}
                  </h3>
                </div>

                <div className="space-y-4">
                    {processingPartnershipPoints.map((point: any, index: number) => (
                      <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                          {point.title && (
                            <strong className="text-white">{point.title}:</strong>
                          )}{' '}
                          {point.description || point.text || point}
                    </p>
                  </div>
                    ))}
                  </div>
                  </div>
                </div>
            )}
          </div>

          {/* Impact Statistics */}
          {impactStats.length > 0 && (
          <div
            className={`mt-16 transition-all duration-800 ${
              visibleSections.has("regional-impact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {impactStats.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-300">
                      {stat.value || stat.number || stat.label || ''}
                </div>
                <div className="text-sm tracking-wide text-red-100 uppercase">
                      {stat.title || stat.description || ''}
                </div>
              </div>
                ))}
                </div>
                </div>
          )}
        </div>
      </section>
      )}

      {/* Contact Section - Only render if data exists */}
      {hasContactContent && (
      <section id="contact" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-800 ${
              visibleSections.has("contact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-16 text-center">
              {contactTitle && (
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                  {contactTitle}
              </h2>
              )}
              <div className="mx-auto mb-6 w-24 h-1 bg-red-600"></div>
              {contactDescription && (
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                  {contactDescription}
              </p>
              )}
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Phone Contact */}
              {contactPhone && (
              <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 group hover:shadow-xl hover:border-red-200">
                <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full transition-colors duration-300 group-hover:bg-red-200">
                  <Phone className="text-red-600" size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-center text-gray-900">
                  Call Us
                </h3>
                <p className="mb-4 text-center text-gray-600">
                  Speak directly with our ranch specialists
                </p>
                <div className="text-center">
                  <a
                      href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    className="text-lg font-semibold text-red-600 transition-colors duration-300 hover:text-red-700"
                  >
                      {contactPhone}
                  </a>
                </div>
              </div>
              )}

              {/* Email Contact */}
              {contactEmail && (
              <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 group hover:shadow-xl hover:border-red-200">
                <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full transition-colors duration-300 group-hover:bg-red-200">
                  <Mail className="text-red-600" size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-center text-gray-900">
                  Email Us
                </h3>
                <p className="mb-4 text-center text-gray-600">
                  Send us your questions and order requests
                </p>
                <div className="text-center">
                  <a
                      href={`mailto:${contactEmail}`}
                    className="text-lg font-semibold text-red-600 transition-colors duration-300 hover:text-red-700"
                  >
                      {contactEmail}
                  </a>
                </div>
              </div>
              )}

              {/* Business Hours */}
              {contactHours && (
              <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 group hover:shadow-xl hover:border-red-200 md:col-span-2 lg:col-span-1">
                <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full transition-colors duration-300 group-hover:bg-red-200">
                  <Clock className="text-red-600" size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-center text-gray-900">
                  Business Hours
                </h3>
                <div className="space-y-2 text-center text-gray-600">
                    {typeof contactHours === 'string' ? (
                      <p className="text-sm">{contactHours}</p>
                    ) : Array.isArray(contactHours) ? (
                      contactHours.map((hour: any, index: number) => (
                        <div key={index}>
                          <p className="font-medium">{hour.label || hour.day || ''}</p>
                          <p className="text-sm">{hour.hours || hour.time || ''}</p>
                </div>
                      ))
                    ) : (
                      <p className="text-sm">{contactHours}</p>
                    )}
              </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <Footer />
    </div>
  );
}

export default LivestockTemplate;
