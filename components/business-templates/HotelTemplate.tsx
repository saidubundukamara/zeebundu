'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, Star, Phone, Mail, ArrowRight, Calendar, Users, Wifi, Car, Coffee, 
  Waves, Mountain, Sun, Camera, Award, Clock, Shield, Bed, Bath, Utensils,
  Dumbbell, TreePalm, Building, Bell
} from 'lucide-react';
import { Hero } from '@/components/shared/Hero';
import { Services } from '@/components/shared/Services';
import { About } from '@/components/shared/About';
import { Contact } from '@/components/shared/Contact';
import { Business, BusinessContent, BusinessTemplate, Location } from '@/lib/types';

interface HotelTemplateProps {
  business: Business;
  content: {
    hero?: any;
    services?: any;
    about?: any;
    contact?: any;
    rooms?: any;
    amenities?: any;
    locations?: any;
    stats?: any;
    gallery?: any;
  };
  template: BusinessTemplate;
  preview?: boolean;
}

export function HotelTemplate({
  business,
  content,
  template,
  preview = false
}: HotelTemplateProps) {
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

  // Default room types if not provided in content
  const defaultRooms = [
    {
      name: 'Mountain Retreat Suite',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=500&fit=crop&crop=center',
      price: 'From $450/night',
      rating: 4.9,
      features: ['Ski Access', 'Spa & Wellness', 'Fine Dining', 'Mountain Views'],
      amenities: ['King Bed', 'Mountain View', 'Fireplace', 'Balcony'],
      maxGuests: 2
    },
    {
      name: 'Tropical Paradise Villa',
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=500&fit=crop&crop=center',
      price: 'From $650/night',
      rating: 4.8,
      features: ['Private Beach', 'Water Sports', 'Overwater Villa', 'Coral Reef'],
      amenities: ['Ocean View', 'Private Pool', 'Butler Service', 'Water Access'],
      maxGuests: 4
    },
    {
      name: 'Desert Oasis Suite',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop&crop=center',
      price: 'From $320/night',
      rating: 4.7,
      features: ['Camel Trekking', 'Stargazing', 'Traditional Cuisine', 'Desert Safari'],
      amenities: ['Desert View', 'Traditional Decor', 'Stargazing Deck', 'Cultural Tours'],
      maxGuests: 3
    }
  ];

  // Default amenities if not provided in content
  const defaultAmenities = [
    {
      icon: Wifi,
      name: 'High-Speed WiFi',
      description: 'Complimentary high-speed internet throughout the property',
      category: 'connectivity'
    },
    {
      icon: Car,
      name: 'Valet Parking',
      description: 'Secure valet parking service available 24/7',
      category: 'transportation'
    },
    {
      icon: Utensils,
      name: 'Fine Dining',
      description: '24-hour room service with gourmet dining options',
      category: 'dining'
    },
    {
      icon: Waves,
      name: 'Spa & Wellness',
      description: 'Full-service spa with massage and wellness treatments',
      category: 'wellness'
    },
    {
      icon: Dumbbell,
      name: 'Fitness Center',
      description: 'State-of-the-art fitness facilities and personal training',
      category: 'fitness'
    },
    {
      icon: Sun,
      name: 'Pool & Recreation',
      description: 'Multiple pools, fitness center, and recreational facilities',
      category: 'recreation'
    }
  ];

  // Get rooms from content or use defaults
  const rooms = content.rooms?.rooms || defaultRooms;

  // Get amenities from content or use defaults
  const amenities = content.amenities?.amenities || defaultAmenities;

  // Transform services for the Services component
  const transformedServices = content.services?.services?.map((service: any) => ({
    title: service.title,
    description: service.description,
    icon: getServiceIcon(service.icon || service.title),
    features: service.features || [],
    category: service.category,
    image: service.image
  })) || [
    {
      title: 'Accommodation',
      icon: <Bed className="w-8 h-8" />,
      description: 'Luxury rooms and suites with premium amenities',
      features: ['Premium Bedding', 'Room Service', 'Climate Control', 'Safe'],
      category: 'accommodation'
    },
    {
      title: 'Dining Experience',
      icon: <Utensils className="w-8 h-8" />,
      description: 'World-class restaurants and culinary experiences',
      features: ['Fine Dining', 'Room Service', 'Bar & Lounge', 'Local Cuisine'],
      category: 'dining'
    },
    {
      title: 'Spa & Wellness',
      icon: <Waves className="w-8 h-8" />,
      description: 'Rejuvenating spa treatments and wellness programs',
      features: ['Massage Therapy', 'Wellness Programs', 'Beauty Treatments', 'Relaxation'],
      category: 'wellness'
    },
    {
      title: 'Recreation',
      icon: <TreePalm className="w-8 h-8" />,
      description: 'Adventure activities and recreational facilities',
      features: ['Pool Access', 'Adventure Tours', 'Sports Facilities', 'Entertainment'],
      category: 'recreation'
    }
  ];

  // Get service icon based on string identifier
  function getServiceIcon(iconName: string) {
    const iconMap: Record<string, React.ReactNode> = {
      'Bed': <Bed className="w-8 h-8" />,
      'Utensils': <Utensils className="w-8 h-8" />,
      'Waves': <Waves className="w-8 h-8" />,
      'TreePalm': <TreePalm className="w-8 h-8" />,
      'Wifi': <Wifi className="w-8 h-8" />,
      'Car': <Car className="w-8 h-8" />,
      'Coffee': <Coffee className="w-8 h-8" />,
      'Dumbbell': <Dumbbell className="w-8 h-8" />,
      'accommodation': <Bed className="w-8 h-8" />,
      'dining': <Utensils className="w-8 h-8" />,
      'wellness': <Waves className="w-8 h-8" />,
      'recreation': <TreePalm className="w-8 h-8" />
    };
    
    return iconMap[iconName] || iconMap[iconName.toLowerCase()] || <Building className="w-8 h-8" />;
  }

  // Transform hero content
  const heroProps = {
    title: content.hero?.title || `${business.name}`,
    subtitle: content.hero?.subtitle || 'Luxury Hotel & Resort',
    description: content.hero?.description || business.description,
    backgroundImage: content.hero?.backgroundImage || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    backgroundVideo: content.hero?.backgroundVideo,
    theme: 'from-emerald-900 via-emerald-800 to-emerald-900',
    gradient: 'from-emerald-900/80 via-transparent to-emerald-900/60',
    badges: content.hero?.badges || ['Luxury Hotel & Resort'],
    buttons: content.hero?.ctaButtons?.map((btn: any) => ({
      text: btn.text,
      href: btn.link,
      style: btn.style,
      icon: btn.icon === 'Calendar' ? <Calendar className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />
    })) || [
      {
        text: 'Book Your Stay',
        href: '#rooms',
        style: 'primary' as const,
        icon: <Calendar className="w-5 h-5" />
      },
      {
        text: 'Explore Resort',
        href: '#amenities',
        style: 'secondary' as const,
        icon: <ArrowRight className="w-5 h-5" />
      }
    ]
  };

  // Transform about content
  const aboutProps = {
    title: content.about?.title || 'About Our Resort',
    story: content.about?.description || 'Experience unparalleled luxury and comfort at our world-class resort, where exceptional service meets breathtaking destinations.',
    mission: content.about?.mission,
    vision: content.about?.vision,
    values: content.about?.values || [],
    stats: content.about?.stats || content.stats?.stats || [
      { value: '12+', label: 'Luxury Properties', icon: <Building className="w-6 h-6" /> },
      { value: '500+', label: 'Guest Rooms', icon: <Bed className="w-6 h-6" /> },
      { value: '4.8', label: 'Average Rating', icon: <Star className="w-6 h-6" /> },
      { value: '24/7', label: 'Concierge Service', icon: <Phone className="w-6 h-6" /> }
    ],
    theme: 'from-emerald-500 to-teal-500'
  };

  // Transform contact content
  const contactProps = {
    title: content.contact?.title || 'Ready to Experience Luxury?',
    description: content.contact?.description || 'Contact our reservations team to book your perfect getaway and create unforgettable memories.',
    contactInfo: {
      phone: content.contact?.phone || business.contact?.phone || '+1 (555) 123-STAY',
      email: content.contact?.email || business.contact?.email || 'reservations@luxury-resort.com',
      address: content.contact?.address || business.contact?.address || 'Luxury destinations worldwide',
      hours: content.contact?.hours ? [{ days: 'Daily', hours: content.contact.hours }] : [
        { days: 'Reservations', hours: '24/7 - Always Available' }
      ]
    },
    theme: 'from-emerald-500 to-teal-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative">
        <Hero {...heroProps} />
      </div>

      {/* Rooms & Suites Section */}
      <section id="rooms" data-section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-800 ${
            visibleSections.has('rooms') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content.rooms?.title || 'Luxury Rooms & Suites'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.rooms?.description || 'Discover our collection of luxury accommodations in stunning destinations worldwide'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room: any, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  visibleSections.has('rooms') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{room.rating}</span>
                  </div>
                  {room.maxGuests && (
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white rounded-full px-3 py-1 flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-semibold">{room.maxGuests}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                  
                  {room.amenities && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">{room.price}</span>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" data-section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-800 ${
            visibleSections.has('amenities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content.amenities?.title || 'World-Class Amenities'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.amenities?.description || 'Experience luxury and comfort with our comprehensive range of premium amenities'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity: any, index: number) => (
              <div
                key={index}
                className={`text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 ${
                  visibleSections.has('amenities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <amenity.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{amenity.name}</h3>
                <p className="text-gray-600">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" data-section className="bg-gradient-to-br from-emerald-50 to-white">
        <Services 
          {...{
            title: content.services?.title || 'Hotel Services',
            description: content.services?.description || 'Indulge in our comprehensive range of luxury services designed to exceed your expectations',
            services: transformedServices,
            theme: 'from-emerald-500 to-teal-500',
            showFeatures: true,
            columns: 4 as const
          }}
        />
      </section>

      {/* Locations Section */}
      {(content.locations?.locations || business.contact) && (
        <section id="locations" data-section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-800 ${
              visibleSections.has('locations') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Locations</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {content.locations?.description || 'Discover our luxury properties in breathtaking destinations around the world'}
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(content.locations?.locations || [
                {
                  name: 'Mountain Resort',
                  address: 'Swiss Alps, Switzerland',
                  phone: '+41 (0)27 123 4567',
                  hours: '24/7 Check-in Available',
                  image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Ski Access', 'Spa', 'Fine Dining', 'ConciergeBell']
                },
                {
                  name: 'Tropical Paradise',
                  address: 'Maldives Islands',
                  phone: '+960 123 4567',
                  hours: '24/7 Butler Service',
                  image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Overwater Villas', 'Water Sports', 'Private Beach', 'Diving']
                },
                {
                  name: 'Desert Oasis',
                  address: 'Sahara Desert, Morocco',
                  phone: '+212 123 456 789',
                  hours: '24/7 Desert Experience',
                  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Camel Trekking', 'Stargazing', 'Traditional Cuisine', 'Cultural Tours']
                }
              ]).map((location: any, index: number) => (
                <div
                  key={index}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                    visibleSections.has('locations') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {location.hours}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                    </div>
                    
                    <p className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {location.address}
                    </p>
                    
                    {location.phone && (
                      <p className="flex items-center text-gray-600 mb-4">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {location.phone}
                      </p>
                    )}
                    
                    {location.amenities && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {location.amenities.map((amenity: string, amenityIndex: number) => (
                            <span key={amenityIndex} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-xs font-medium">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg group-hover:scale-105">
                      Book This Location
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
      <section id="contact" data-section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
        <Contact {...contactProps} />
      </section>
    </div>
  );
}

export default HotelTemplate;