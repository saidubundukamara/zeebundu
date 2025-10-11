'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Star, MapPin, Clock, Users, Award, TrendingUp, 
  Fuel, Hotel, Wheat, Pill, ShoppingBag, Car, Coffee, Building,
  Heart, Shield, Zap, Sparkles, Globe, Phone, Mail
} from 'lucide-react';

interface Business {
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

const businesses: Business[] = [
  {
    id: 'gas-stations',
    title: 'Gas Stations',
    icon: <Fuel className="w-8 h-8" />,
    path: '/business/bluefuel-gas-station',
    description: 'Premium fuel and automotive services',
    gradient: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'large',
    industry: 'Automotive'
  },
  {
    id: 'hotels-resorts',
    title: 'Hotels & Resorts',
    icon: <Hotel className="w-8 h-8" />,
    path: '/business/grand-resort-spa',
    description: 'Luxury accommodations and spa experiences',
    gradient: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'large',
    industry: 'Hospitality'
  },
  {
    id: 'farming',
    title: 'Organic Farming',
    icon: <Wheat className="w-8 h-8" />,
    path: '/business/green-valley-organic-farm',
    description: 'Sustainable agriculture and fresh produce',
    gradient: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'medium',
    industry: 'Agriculture'
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy & Healthcare',
    icon: <Pill className="w-8 h-8" />,
    path: '/business/healthcare-plus-pharmacy',
    description: 'Professional pharmaceutical services',
    gradient: 'from-red-500 to-pink-500',
    borderColor: 'border-red-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'medium',
    industry: 'Healthcare'
  },
  {
    id: 'retail',
    title: 'Retail Stores',
    icon: <ShoppingBag className="w-8 h-8" />,
    path: '/services/retail',
    description: 'Modern shopping experiences',
    gradient: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'tall',
    industry: 'Retail'
  },
  {
    id: 'automotive',
    title: 'Auto Services',
    icon: <Car className="w-8 h-8" />,
    path: '/services/automotive',
    description: 'Complete automotive care',
    gradient: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'medium',
    industry: 'Automotive'
  },
  {
    id: 'restaurants',
    title: 'Restaurants',
    icon: <Coffee className="w-8 h-8" />,
    path: '/services/restaurants',
    description: 'Culinary excellence and dining',
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'medium',
    industry: 'Food & Beverage'
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    icon: <Building className="w-8 h-8" />,
    path: '/services/real-estate',
    description: 'Property management and sales',
    gradient: 'from-slate-600 to-slate-800',
    borderColor: 'border-slate-500/20',
    backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: 'tall',
    industry: 'Real Estate'
  }
];

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());

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

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              ZeeBundu
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Your gateway to exceptional businesses across multiple industries. From automotive services to luxury hospitality, 
            sustainable farming to healthcare excellence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-sm text-white/70">Business Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-sm text-white/70">Locations</div>
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

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {businesses.map((business, index) => (
              <Link
                key={business.id}
                href={business.path}
                className={`
                  group relative overflow-hidden rounded-2xl border ${business.borderColor} backdrop-blur-xl
                  transition-all duration-500 transform hover:scale-105 hover:shadow-2xl
                  ${business.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                  ${business.size === 'tall' ? 'md:row-span-2' : ''}
                  ${visibleSections.has('businesses') 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                  }
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={business.backgroundImage}
                    alt={business.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${business.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className={`relative z-10 p-6 h-full flex flex-col justify-between ${business.size === 'large' ? 'md:p-8' : ''}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                        {business.icon}
                      </div>
                      <span className="text-sm font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">
                        {business.industry}
                      </span>
                    </div>
                    
                    <h3 className={`font-bold text-white mb-3 ${business.size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {business.title}
                    </h3>
                    
                    <p className={`text-white/80 leading-relaxed ${business.size === 'large' ? 'text-lg' : 'text-sm'}`}>
                      {business.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="py-20 bg-slate-900"
        data-section="about"
      >
        <div className="container mx-auto px-4">
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
                  <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                  <div className="text-sm text-gray-400">Business Sectors</div>
                </div>
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
                  <div className="text-sm text-gray-400">Locations</div>
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
      </section>
    </div>
  );
}