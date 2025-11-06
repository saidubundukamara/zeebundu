'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Fuel, Hotel, Wheat, Pill, ShoppingBag, Car, Coffee, Building,
  Heart, Sparkles, Globe
} from 'lucide-react';
import { Business as DatabaseBusiness } from '@/lib/types';

interface BusinessCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  description: string;
  gradient: string;
  borderColor: string;
  backgroundImage: string;
  size: 'large' | 'medium' | 'tall';
  industry: string;
}

// Helper function to get icon based on template/industry
function getBusinessIcon(template: string, industry: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    'gas-station': <Fuel className="w-8 h-8" />,
    'hotel': <Hotel className="w-8 h-8" />,
    'hotel-resort': <Hotel className="w-8 h-8" />,
    'farming': <Wheat className="w-8 h-8" />,
    'agriculture': <Wheat className="w-8 h-8" />,
    'pharmacy': <Pill className="w-8 h-8" />,
    'healthcare': <Pill className="w-8 h-8" />,
    'retail': <ShoppingBag className="w-8 h-8" />,
    'automotive': <Car className="w-8 h-8" />,
    'restaurant': <Coffee className="w-8 h-8" />,
    'food': <Coffee className="w-8 h-8" />,
    'real-estate': <Building className="w-8 h-8" />,
    'hospitality': <Hotel className="w-8 h-8" />
  };
  
  return iconMap[template] || iconMap[industry.toLowerCase().replace(' ', '-')] || <Building className="w-8 h-8" />;
}

// Helper function to get gradient based on template/industry
function getBusinessGradient(template: string, industry: string): string {
  const gradientMap: Record<string, string> = {
    'gas-station': 'from-blue-500 to-cyan-500',
    'hotel': 'from-emerald-500 to-teal-500',
    'hotel-resort': 'from-emerald-500 to-teal-500',
    'farming': 'from-green-500 to-emerald-500',
    'agriculture': 'from-green-500 to-emerald-500',
    'pharmacy': 'from-red-500 to-pink-500',
    'healthcare': 'from-red-500 to-pink-500',
    'retail': 'from-purple-500 to-indigo-500',
    'automotive': 'from-orange-500 to-red-500',
    'restaurant': 'from-amber-500 to-orange-500',
    'food': 'from-amber-500 to-orange-500',
    'real-estate': 'from-slate-600 to-slate-800',
    'hospitality': 'from-emerald-500 to-teal-500'
  };
  
  return gradientMap[template] || gradientMap[industry.toLowerCase().replace(' ', '-')] || 'from-blue-500 to-cyan-500';
}

// Helper function to get icon color class based on gradient
function getIconColorClass(gradient: string): string {
  if (gradient.includes('blue')) return 'text-blue-600';
  if (gradient.includes('emerald') || gradient.includes('teal')) return 'text-emerald-600';
  if (gradient.includes('green')) return 'text-green-600';
  if (gradient.includes('red') || gradient.includes('pink')) return 'text-red-600';
  if (gradient.includes('purple') || gradient.includes('indigo')) return 'text-purple-600';
  if (gradient.includes('orange') || gradient.includes('amber')) return 'text-orange-600';
  if (gradient.includes('slate')) return 'text-slate-600';
  return 'text-blue-600';
}

// Helper function to get border color based on template/industry  
function getBusinessBorderColor(template: string, industry: string): string {
  const borderColorMap: Record<string, string> = {
    'gas-station': 'border-blue-500/20',
    'hotel': 'border-emerald-500/20',
    'hotel-resort': 'border-emerald-500/20',
    'farming': 'border-green-500/20',
    'agriculture': 'border-green-500/20',
    'pharmacy': 'border-red-500/20',
    'healthcare': 'border-red-500/20',
    'retail': 'border-purple-500/20',
    'automotive': 'border-orange-500/20',
    'restaurant': 'border-amber-500/20',
    'food': 'border-amber-500/20',
    'real-estate': 'border-slate-500/20',
    'hospitality': 'border-emerald-500/20'
  };
  
  return borderColorMap[template] || borderColorMap[industry.toLowerCase().replace(' ', '-')] || 'border-blue-500/20';
}

// Helper function to get background image based on template/industry
function getBusinessBackgroundImage(template: string, industry: string): string {
  const imageMap: Record<string, string> = {
    'gas-station': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'hotel': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'hotel-resort': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'farming': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'agriculture': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'pharmacy': 'https://images.squarespace-cdn.com/content/v1/5efa0fe78713d718e5a23e0d/1607942729498-WN51MEZMIPW4R5NEWCFI/pharma-1600-px.jpg',
    'healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'food': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'hospitality': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };
  
  return imageMap[template] || imageMap[industry.toLowerCase().replace(' ', '-')] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
}

// Helper function to assign sizes in a pattern
function getBusinessSize(index: number): 'large' | 'medium' | 'tall' {
  const patterns = ['large', 'large', 'medium', 'medium', 'tall', 'medium', 'medium', 'tall'];
  return patterns[index % patterns.length] as 'large' | 'medium' | 'tall';
}

// Helper function to transform database business to display format
function transformBusinessForDisplay(businesses: DatabaseBusiness[]): BusinessCard[] {
  return businesses.map((business, index) => ({
    id: business.slug,
    title: business.name,
    icon: getBusinessIcon(business.template, business.industry),
    path: `/business/${business.slug}`,
    description: business.description,
    gradient: getBusinessGradient(business.template, business.industry),
    borderColor: getBusinessBorderColor(business.template, business.industry),
    backgroundImage: getBusinessBackgroundImage(business.template, business.industry),
    size: getBusinessSize(index),
    industry: business.industry
  }));
}

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [businesses, setBusinesses] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch businesses from API
  useEffect(() => {
    async function fetchBusinesses() {
      try {
        setLoading(true);
        const response = await fetch('/api/businesses?status=active');
        const result = await response.json();
        
        if (result.success && result.data) {
          const transformedBusinesses = transformBusinessForDisplay(result.data);
          setBusinesses(transformedBusinesses);
        } else {
          setError(result.error || 'Failed to load businesses');
        }
      } catch (err) {
        setError('Failed to load businesses');
        console.error('Error fetching businesses:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinesses();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section') || '';
            setVisibleSections(prev => new Set([...prev, id]));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Discover Exceptional Businesses</span>
            </div>
          </div>

          <h1 className="mb-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-tight">
            <span className="text-white">Welcome to</span>{" "}
            <span className="inline-block relative">
              <span 
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r animate-pulse"
                style={{
                  backgroundImage: 'linear-gradient(to right, #E07A5F, #81B29A, #E07A5F)'
                }}
              >
                Zeebundu
              </span>
              <div 
                className="absolute left-0 right-0 -bottom-2 h-1 rounded-full"
                style={{
                  background: 'linear-gradient(to right, #E07A5F, #81B29A)'
                }}
              ></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Your gateway to exceptional businesses across multiple industries. From automotive services to luxury hospitality, 
            sustainable farming to healthcare excellence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {!loading ? `${businesses.length}+` : '...'}
              </div>
              <div className="text-sm text-white/70">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {!loading ? `${new Set(businesses.map(b => b.industry)).size}+` : '...'}
              </div>
              <div className="text-sm text-white/70">Industries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-white/70">Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-sm text-white/70">Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('businesses')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <Globe className="w-5 h-5" />
              Explore Businesses
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/20 font-semibold rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
            >
              <Heart className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Directory */}
      <section 
        id="businesses" 
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
        data-section="businesses"
      >
        <div className="container mx-auto px-4">
          <div 
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has('businesses') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Business Portfolio
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our diverse range of exceptional businesses, each committed to excellence and innovation in their respective industries.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading businesses...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Business Cards Masonry */}
          {!loading && !error && businesses.length > 0 && (
            <div className="max-w-7xl mx-auto relative">
              {/* Decorative Background Elements */}
              <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 relative z-10">
                {businesses.map((business, index) => {
                  // Varied image heights for visual interest
                  const imageHeight = index % 3 === 0 ? 'h-72' : index % 3 === 1 ? 'h-64' : 'h-80';
                  
                  return (
                    <Link
                      key={business.id}
                      href={business.path}
                      className={`
                        group relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8
                        break-inside-avoid inline-block w-full
                        transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02]
                        border border-gray-100/50
                        ${visibleSections.has('businesses') 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                        }
                      `}
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        transform: visibleSections.has('businesses') ? 'translateY(0)' : 'translateY(32px)'
                      }}
                    >
                      {/* Decorative Corner */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${business.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full`}></div>
                      
                      {/* Image Container */}
                      <div className={`relative ${imageHeight} overflow-hidden`}>
                        {/* Subtle Pattern Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                          }}></div>
                        </div>
                        
                        <img
                          src={business.backgroundImage}
                          alt={business.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${business.gradient} opacity-50 group-hover:opacity-60 transition-opacity duration-500`}></div>
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        {/* Icon Badge */}
                        <div className="absolute top-4 left-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <div className="p-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 group-hover:shadow-2xl">
                            <div className={getIconColorClass(business.gradient)}>
                              {business.icon}
                            </div>
                          </div>
                        </div>

                        {/* Industry Badge */}
                        <div className="absolute top-4 right-4 transform transition-all duration-500 group-hover:scale-105">
                          <span className="px-3 py-1.5 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                            {business.industry}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 relative">
                        {/* Decorative Dot Pattern */}
                        <div className="absolute top-0 left-6 w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 relative">
                          {business.title}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></span>
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                          {business.description}
                        </p>

                        {/* CTA Button */}
                        <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300">
                          <span className="relative">
                            Explore Business
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                          </span>
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Gradient Accent Line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${business.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Floating Particles Effect on Hover */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && businesses.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600">Check back later for new business listings.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="py-20 bg-slate-900"
        data-section="about"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[80vw] mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              className={`transition-all duration-700 delay-200 ${
                visibleSections.has('about') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Building Excellence Across Industries
              </h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                ZeeBundu represents a diverse portfolio of exceptional businesses, each committed to excellence and innovation. 
                From automotive services that keep you moving to luxury hospitality that creates unforgettable experiences, 
                we bring together the best in every industry.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {!loading ? `${new Set(businesses.map(b => b.industry)).size}+` : '...'}
                  </div>
                  <div className="text-sm text-gray-400">Business Sectors</div>
                </div>
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {!loading ? `${businesses.length}+` : '...'}
                  </div>
                  <div className="text-sm text-gray-400">Businesses</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                  View All Services
                </button>
                <button className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                  Contact Us
                </button>
              </div>
            </div>

            <div 
              className={`transition-all duration-700 delay-400 ${
                visibleSections.has('about') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Business Excellence"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}