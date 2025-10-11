'use client';

import React, { useState, useEffect } from 'react';
import { 
  Fuel, Car, Zap, Clock, Shield, Star, MapPin, Phone, Mail, ArrowRight, 
  Gauge, Droplets, Wind, CreditCard, Coffee, ShoppingCart 
} from 'lucide-react';
import { Hero } from '@/components/shared/Hero';
import { Services } from '@/components/shared/Services';
import { About } from '@/components/shared/About';
import { Contact } from '@/components/shared/Contact';
import { Business, BusinessContent, BusinessTemplate, Location } from '@/lib/types';

interface GasStationTemplateProps {
  business: Business;
  content: {
    hero?: any;
    services?: any;
    about?: any;
    contact?: any;
    locations?: any;
    stats?: any;
  };
  template: BusinessTemplate;
  preview?: boolean;
}

export function GasStationTemplate({
  business,
  content,
  template,
  preview = false
}: GasStationTemplateProps) {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());

  // Set CSS custom properties for business branding
  useEffect(() => {
    if (typeof document !== 'undefined' && business.branding) {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', business.branding.primaryColor);
      root.style.setProperty('--brand-secondary', business.branding.secondaryColor);
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

  // Default fuel types if not provided in content
  const defaultFuelTypes = [
    {
      name: 'Regular 87',
      price: '$3.49',
      icon: <Fuel className="w-6 h-6" />,
      description: 'Standard unleaded gasoline',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Plus 89',
      price: '$3.69',
      icon: <Gauge className="w-6 h-6" />,
      description: 'Mid-grade unleaded gasoline',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Premium 93',
      price: '$3.89',
      icon: <Zap className="w-6 h-6" />,
      description: 'High-octane premium fuel',
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Diesel',
      price: '$3.99',
      icon: <Droplets className="w-6 h-6" />,
      description: 'Ultra-low sulfur diesel',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  // Get fuel types from content or use defaults
  const fuelTypes = content.services?.services?.find((s: any) => s.category === 'fuel')?.pricing 
    ? Object.entries(content.services.services.find((s: any) => s.category === 'fuel').pricing).map(([name, price], index) => ({
        name,
        price: typeof price === 'string' ? price : `$${price}`,
        icon: defaultFuelTypes[index]?.icon || <Fuel className="w-6 h-6" />,
        description: defaultFuelTypes[index]?.description || 'Premium fuel',
        color: defaultFuelTypes[index]?.color || 'from-blue-500 to-cyan-500'
      }))
    : defaultFuelTypes;

  // Transform services for the Services component
  const transformedServices = content.services?.services?.map((service: any, index: number) => ({
    title: service.title,
    description: service.description,
    icon: getServiceIcon(service.icon || service.title),
    features: service.features || [],
    category: service.category,
    image: service.image
  })) || [
    {
      title: 'Convenience Store',
      icon: <ShoppingCart className="w-8 h-8" />,
      description: 'Snacks, drinks, and essentials',
      features: ['24/7 Access', 'Fresh Food', 'Hot Coffee']
    },
    {
      title: 'Car Wash',
      icon: <Car className="w-8 h-8" />,
      description: 'Professional car cleaning services',
      features: ['Touchless Wash', 'Wax Protection', 'Interior Cleaning']
    },
    {
      title: 'Payment Options',
      icon: <CreditCard className="w-8 h-8" />,
      description: 'Multiple payment methods accepted',
      features: ['Credit Cards', 'Mobile Pay', 'Fleet Cards']
    },
    {
      title: 'Quick Service',
      icon: <Coffee className="w-8 h-8" />,
      description: 'Fast food and beverages',
      features: ['Fresh Coffee', 'Hot Food', 'Cold Drinks']
    }
  ];

  // Get service icon based on string identifier
  function getServiceIcon(iconName: string) {
    const iconMap: Record<string, React.ReactNode> = {
      'ShoppingCart': <ShoppingCart className="w-8 h-8" />,
      'Car': <Car className="w-8 h-8" />,
      'CreditCard': <CreditCard className="w-8 h-8" />,
      'Coffee': <Coffee className="w-8 h-8" />,
      'Fuel': <Fuel className="w-8 h-8" />,
      'convenience': <ShoppingCart className="w-8 h-8" />,
      'car wash': <Car className="w-8 h-8" />,
      'payment': <CreditCard className="w-8 h-8" />,
      'food': <Coffee className="w-8 h-8" />
    };
    
    return iconMap[iconName] || iconMap[iconName.toLowerCase()] || <Fuel className="w-8 h-8" />;
  }

  // Transform hero content
  const heroProps = {
    title: content.hero?.title || `${business.name}`,
    subtitle: content.hero?.subtitle || 'Premium Fuel Station',
    description: content.hero?.description || business.description,
    backgroundImage: content.hero?.backgroundImage || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    backgroundVideo: content.hero?.backgroundVideo,
    theme: `from-blue-900 to-gray-900 via-slate-800`,
    gradient: 'from-blue-900/80 via-transparent to-gray-900/60',
    badges: content.hero?.badges || ['Premium Fuel Station'],
    buttons: content.hero?.ctaButtons?.map((btn: any) => ({
      text: btn.text,
      href: btn.link,
      style: btn.style,
      icon: btn.icon === 'MapPin' ? <MapPin className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />
    })) || [
      {
        text: 'Find Station',
        href: '#locations',
        style: 'primary' as const,
        icon: <MapPin className="w-5 h-5" />
      },
      {
        text: 'View Services',
        href: '#services',
        style: 'secondary' as const,
        icon: <ArrowRight className="w-5 h-5" />
      }
    ]
  };

  // Transform about content
  const aboutProps = {
    title: content.about?.title || 'About Us',
    story: content.about?.description || 'Experience premium fuel quality, exceptional service, and modern convenience at our state-of-the-art gas stations.',
    mission: content.about?.mission,
    vision: content.about?.vision,
    values: content.about?.values || [],
    stats: content.about?.stats || content.stats?.stats || [
      { value: '15+', label: 'Locations', icon: <MapPin className="w-6 h-6" /> },
      { value: '24/7', label: 'Always Open', icon: <Clock className="w-6 h-6" /> },
      { value: '100%', label: 'Certified Staff', icon: <Shield className="w-6 h-6" /> },
      { value: '4.8', label: 'Customer Rating', icon: <Star className="w-6 h-6" /> }
    ],
    theme: 'from-blue-500 to-cyan-500'
  };

  // Transform contact content
  const contactProps = {
    title: content.contact?.title || 'Get in Touch',
    description: content.contact?.description || 'Have questions about our services or need assistance? We\'re here to help 24/7.',
    contactInfo: {
      phone: content.contact?.phone || business.contact?.phone || '+1 (555) 123-FUEL',
      email: content.contact?.email || business.contact?.email || 'support@bundugasstations.com',
      address: content.contact?.address || business.contact?.address || 'Multiple locations nationwide',
      hours: content.contact?.hours ? [{ days: 'Daily', hours: content.contact.hours }] : [
        { days: 'Daily', hours: '24/7 - Always Open' }
      ]
    },
    theme: 'from-blue-500 to-cyan-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Fuel Prices Overlay */}
      <div className="relative">
        <Hero {...heroProps} />
        
        {/* Fuel Prices Overlay - positioned over hero */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 hidden lg:block">
          <div className="p-8 rounded-2xl border backdrop-blur-xl bg-white/10 border-white/20 max-w-sm">
            <h3 className="mb-6 text-2xl font-bold text-center text-white">Today's Fuel Prices</h3>
            
            <div className="space-y-4">
              {fuelTypes.map((fuel, index) => (
                <div key={index} className="p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/5 border-white/10 hover:bg-white/10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`bg-gradient-to-r ${fuel.color} p-3 rounded-lg mr-4`}>
                        {fuel.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{fuel.name}</h4>
                        <p className="text-sm text-gray-400">{fuel.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{fuel.price}</div>
                      <div className="text-sm text-gray-400">per gallon</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="mb-4 text-sm text-gray-400">Prices updated daily • Subject to change</p>
              <button className="py-3 w-full font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl transition-all duration-300 hover:shadow-lg">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" data-section>
        <Services 
          {...{
            title: content.services?.title || 'Station Services',
            description: content.services?.description || 'More than just fuel - discover our comprehensive range of services designed for your convenience',
            services: transformedServices,
            theme: 'from-blue-500 to-cyan-500',
            showFeatures: true,
            columns: 4 as const
          }}
        />
      </section>

      {/* Locations Section */}
      {(content.locations?.locations || business.contact) && (
        <section id="locations" data-section className="py-20 bg-gray-50">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-800 ${
              visibleSections.has('locations') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Find Your Nearest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Station</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                {content.locations?.description || 'Conveniently located stations with 24/7 service and modern amenities'}
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(content.locations?.locations || [
                {
                  name: 'Downtown Station',
                  address: '123 Main Street, Downtown District',
                  phone: '+1 (555) 123-4567',
                  hours: '24/7 - Always Open',
                  image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Car Wash', 'Convenience Store', 'ATM']
                },
                {
                  name: 'Highway Express',
                  address: '456 Highway 101, Mile Marker 45',
                  phone: '+1 (555) 234-5678',
                  hours: '24/7 - Always Open',
                  image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Fast Food', 'Truck Parking', 'Restrooms']
                },
                {
                  name: 'Suburban Center',
                  address: '789 Oak Avenue, Suburban Plaza',
                  phone: '+1 (555) 345-6789',
                  hours: '5:00 AM - 11:00 PM Daily',
                  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Coffee Shop', 'Electric Charging', 'WiFi']
                }
              ]).map((location: any, index: number) => (
                <div
                  key={index}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                    visibleSections.has('locations') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="overflow-hidden relative h-48">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/50"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
                        {location.hours}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                        <MapPin className="text-white" size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                    </div>
                    
                    <p className="flex items-center mb-2 text-gray-600">
                      <MapPin className="mr-2 text-gray-400" size={16} />
                      {location.address}
                    </p>
                    
                    {location.phone && (
                      <p className="flex items-center mb-4 text-gray-600">
                        <Phone className="mr-2 text-gray-400" size={16} />
                        {location.phone}
                      </p>
                    )}
                    
                    {location.amenities && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold text-gray-900">Amenities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {location.amenities.map((amenity: string, amenityIndex: number) => (
                            <span key={amenityIndex} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-lg">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button className="py-3 w-full font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl transition-all duration-300 hover:shadow-lg group-hover:scale-105">
                      Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" data-section>
        <About {...aboutProps} />
      </section>

      {/* Contact Section */}
      <section id="contact" data-section className="bg-gradient-to-br via-blue-900 from-slate-900 to-slate-900">
        <Contact {...contactProps} />
      </section>
    </div>
  );
}

export default GasStationTemplate;