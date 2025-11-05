'use client';

import React, { useState, useEffect } from 'react';
import {
  Building,
  Truck,
  MapPin,
  Phone,
  Mail,
  Hammer,
  Shield,
  Clock,
  Users,
  Award,
  Layers,
  Wrench,
  Zap,
  ChevronRight,
} from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Business } from '@/lib/types/business';
import { BusinessTemplate } from '@/lib/types/template';

interface ConstructionMaterialsPageProps {
  business: Business;
  content: {
    hero?: any;
    services?: any;
    about?: any;
    contact?: any;
    materials?: any;
    stats?: any;
  };
  template: BusinessTemplate;
  preview?: boolean;
}

export function ConstructionMaterialsTemplate({
  business,
  content,
  template,
  preview = false
}: ConstructionMaterialsPageProps) {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Set CSS custom properties for business branding with construction theme defaults
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', business.branding?.primaryColor || '#ea580c');
      root.style.setProperty('--brand-secondary', business.branding?.secondaryColor || '#f97316');
    }
  }, [business.branding]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-section]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Default materials if not provided in content
  const defaultMaterials = [
    {
      category: "Steel & Metal",
      icon: Shield,
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
      description:
        "Premium structural steel, reinforcement bars, and metal components engineered for durability and strength in commercial and residential construction projects.",
      products: ["Steel Beams", "Rebar", "Metal Sheets", "Fasteners"],
    },
    {
      category: "Concrete & Masonry",
      icon: Hammer,
      image:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description:
        "High-grade concrete mixes, cement, and masonry materials designed for superior performance in foundations, walls, and structural applications.",

      products: ["Ready Mix", "Cement", "Blocks", "Aggregates"],
    },
    {
      category: "Electrical Systems",
      icon: Zap,
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      description:
        "Complete electrical solutions including wiring, panels, conduits, and smart home systems for modern construction and renovation projects.",

      products: ["Wiring", "Panels", "Conduits", "Smart Systems"],
    },
    {
      category: "Tools & Equipment",
      icon: Wrench,
      image:
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description:
        "Professional-grade construction tools, heavy machinery, and specialized equipment for rent or purchase to keep your project moving efficiently.",
      price: "$125/day",
      products: ["Power Tools", "Excavators", "Cranes", "Safety Gear"],
      projects: "650+ projects",
    },
  ];

  // Get materials from content or use defaults
  const materials = content.materials?.categories || defaultMaterials;

  const defaultServices = [
    {
      icon: Truck,
      name: 'Same-Day Delivery',
      description: 'Fast delivery to your construction site within 24 hours for urgent projects',
    },
    {
      icon: Users,
      name: 'Contractor Support',
      description: 'Dedicated account managers and technical support for professional builders',
    },
    {
      icon: Clock,
      name: 'Bulk Pricing',
      description: 'Competitive wholesale rates and flexible payment terms for large projects',
    },
    {
      icon: Shield,
      name: 'Quality Assurance',
      description: 'All materials tested and certified with comprehensive warranty coverage',
    },
  ];

  const services = content.services?.services || defaultServices;

  const defaultStats = [
    { value: '5K+', label: 'Projects Completed', icon: <Building className="w-6 h-6" /> },
    { value: '250+', label: 'Skilled Professionals', icon: <Users className="w-6 h-6" /> },
    { value: '35+', label: 'Industry Excellence', icon: <Award className="w-6 h-6" /> },
    { value: '1M+', label: 'Tons of Materials', icon: <Layers className="w-6 h-6" /> },
  ];

  const stats = content.stats?.stats || content.about?.stats || defaultStats;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section data-section id="hero" className="flex overflow-hidden relative justify-center items-center h-screen">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t via-transparent from-black/50 to-black/30"></div>
        </div>

        <div className="absolute z-20 mt-[580px] left-0">
          <img src="/hero-tx.png" alt="Hero TX" className="w-[700px] h-auto" />
        </div>

        <div className="relative z-10 px-4 mx-auto mb-24 max-w-5xl text-center text-white">
          <div className={`transform transition-all duration-1000 ${
            visibleSections.has("hero")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}>
            <h1 className="mb-8 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 md:text-7xl">
              {business.name || 'Construction Materials'}
            </h1>
            <p className="mb-4 text-xl leading-relaxed text-gray-100 md:text-xl">
              {content.hero?.description || business.description || 'Supply of high-quality construction materials including cement, steel, timber, and plumbing materials'}
            </p>
          </div>
        </div>
      </section>

      <section data-section id="about" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto w-4/5">
          <div className="flex flex-col gap-8 mb-12 lg:flex-row lg:justify-between lg:gap-40">
            <div className="lg:w-1/3">
              <span className="block mb-6 text-lg font-semibold text-orange-500 lg:mb-12">
                About Us
              </span>
              <p className="text-lg text-gray-600">
                Innovative Solutions for Modern Construction
              </p>
            </div>

            <div className="lg:w-2/3 lg:mr-[-230px] text-left">
              <h2 className="text-2xl leading-tight text-gray-900 lg:text-3xl">
                Committed to Redefining Construction Standards
              </h2>
              <h2 className="text-2xl leading-tight text-gray-900 lg:text-3xl">
                with Innovation, Expertise, and Unwavering
              </h2>
              <h2 className="text-2xl leading-tight text-gray-900 lg:text-3xl">
                Dedication to Excellence
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
            <div className="relative">
              <div className="overflow-hidden relative rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop&crop=center"
                  alt="Construction site with scaffolding"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.slice(0, 4).map((stat: any, index: number) => (
                  <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex gap-3 justify-between items-center mb-3">
                      <span className="text-3xl font-bold text-gray-900">
                        {stat.value || stat.number}
                      </span>
                      {stat.icon || <Building className="w-8 h-8 text-orange-500" />}
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {stat.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stat.description || 'Providing exceptional service and quality'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-section id="materials" className="overflow-hidden relative py-32 bg-gradient-to-br via-gray-900 from-slate-900 to-stone-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute right-20 bottom-20 w-80 h-80 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl delay-1000 animate-pulse"></div>
        </div>

        <div className="container relative z-10 px-6 mx-auto w-4/5">
          {/* Header */}
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-6xl font-black text-white lg:text-7xl">
              Construction
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 animate-pulse">
                Materials
              </span>
            </h2>

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
              Industry-leading materials and equipment delivered directly to
              your project site.
              <span className="block mt-2 font-semibold text-orange-400">
                Ready when you are.
              </span>
            </p>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-12">
            {materials.map((material: any, index: number) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10 ${
                  activeCategory === index ? "ring-2 ring-orange-400/50" : ""
                }`}
              >
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-all duration-700 from-orange-500/10 to-amber-500/10 group-hover:opacity-100"></div>

                {/* Image Section */}
                <div className="overflow-hidden relative h-72">
                  <img
                    src={material.image}
                    alt={material.category}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/80 via-black/30"></div>

                  {/* Category Title */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-r rounded-2xl border backdrop-blur-sm from-orange-500/20 to-amber-500/20 border-white/30">
                        <material.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">
                          {material.category}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <p className="mb-8 text-lg leading-relaxed text-gray-300">
                    {material.description}
                  </p>

                  {/* Price and CTA */}
                  <div className="flex justify-end items-center mb-8">
                    <div className="flex justify-end space-x-3">
                      <div className="relative px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl transition-all duration-300 group/btn hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105 active:scale-95">
                        <span className="flex relative z-10 items-center">
                          Get Quote
                          <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {material.products.map((product: any, idx: number) => (
                      <div
                        key={idx}
                        className="relative px-4 py-4 text-center text-orange-400 bg-gradient-to-r rounded-xl border transition-all duration-300 cursor-pointer group/product from-orange-500/10 to-amber-500/10 border-orange-500/20 hover:shadow-md hover:scale-105 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-amber-500/20"
                      >
                        <span className="text-sm font-semibold">{product}</span>
                        <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-orange-500/5 to-amber-500/5 group-hover/product:opacity-100"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        data-section
        id="services"
        className="overflow-hidden relative py-32 bg-white"
      >
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full blur-3xl"></div>
          <div className="absolute right-20 bottom-20 w-80 h-80 bg-gradient-to-r from-gray-200 rounded-full blur-3xl to-slate-200"></div>
        </div>

        <div className="relative z-10 px-6 mx-auto w-4/5">
          {/* Enhanced Header */}
          <div className="mb-20 text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-6 py-3 text-sm font-bold tracking-wider text-orange-600 uppercase bg-orange-50 rounded-full border border-orange-200">
                <span className="mr-3 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Professional Services
              </span>
            </div>
            <h2 className="mb-6 text-5xl font-black leading-tight text-gray-900 lg:text-6xl">
              Why Choose
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Zeebundu Construction?
              </span>
            </h2>
            <div className="mx-auto mb-8 w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600">
              Comprehensive support services designed specifically for
              contractors, developers, and professional builders.
              <span className="block mt-2 font-semibold text-orange-600">
                Excellence delivered, every time.
              </span>
            </p>
          </div>

          {/* Modern Services Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden relative bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-500 group hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-3"
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 from-orange-50/50 to-amber-50/50 group-hover:opacity-100"></div>

                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="flex justify-center items-center mx-auto w-20 h-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                      <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-0 transition-all duration-500 animate-pulse group-hover:opacity-100"></div>
                  </div>

                  {/* Service Title */}
                  <h3 className="mb-4 text-xl font-bold text-center text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 leading-relaxed text-center text-gray-600">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400 transition-transform duration-500 transform scale-x-0 group-hover:scale-x-100"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        data-section
        id="contact"
        className="overflow-hidden relative py-24 bg-gradient-to-br from-gray-50 to-white"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute right-10 bottom-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-400 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
              <span className="mr-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Ready to Start Building
            </div>
            <h2 className="mb-6 text-5xl font-bold leading-tight text-gray-900">
              Let's Build Your
              <span className="block text-orange-600">Dream Project</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
              Connect with our construction material experts for personalized quotes, 
              professional consultation, and premium building solutions.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="flex justify-center mb-16">
            <div className="grid gap-6 max-w-2xl md:grid-cols-2">
              {/* Phone Contact */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-25 blur transition-opacity duration-300 group-hover:opacity-40"></div>
                <a
                  href={`tel:${content.contact?.phone || business.contact?.phone || '+1 (234) 567-890'}`}
                  className="flex relative flex-col items-center p-6 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  <div className="flex justify-center items-center mb-3 w-12 h-12 bg-orange-100 rounded-full transition-colors duration-300 group-hover:bg-orange-500">
                    <Phone className="w-6 h-6 text-orange-600 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">Call for Quote</h3>
                  <p className="mb-3 text-sm text-center text-gray-600">Speak directly with our experts</p>
                  <span className="text-sm font-semibold text-orange-600 group-hover:text-orange-700">{content.contact?.phone || business.contact?.phone || '+1 (234) 567-890'}</span>
                </a>
              </div>

              {/* Email Contact */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-25 blur transition-opacity duration-300 group-hover:opacity-40"></div>
                <a
                  href={`mailto:${content.contact?.email || business.contact?.email || 'materials@bundu.com'}`}
                  className="flex relative flex-col items-center p-6 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  <div className="flex justify-center items-center mb-3 w-12 h-12 bg-orange-100 rounded-full transition-colors duration-300 group-hover:bg-orange-500">
                    <Mail className="w-6 h-6 text-orange-600 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">Email Us</h3>
                  <p className="mb-3 text-sm text-center text-gray-600">Get detailed project information</p>
                  <span className="text-sm font-semibold text-orange-600 group-hover:text-orange-700">{content.contact?.email || business.contact?.email || 'materials@bundu.com'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex flex-wrap gap-8 justify-center items-center mb-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Expert Guidance</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Quality Guaranteed</span>
              </div>
            </div>
    
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ConstructionMaterialsTemplate;
