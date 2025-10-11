'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pill, Heart, Shield, Users, Plus, Clock, MapPin, Phone, Mail, Star,
  Stethoscope, UserCheck, Calendar, AlertCircle, CheckCircle2,
  Package, Activity, Thermometer, CreditCard, ArrowRight, Gauge, Droplets
} from 'lucide-react';
import { Hero } from '@/components/shared/Hero';
import { Services } from '@/components/shared/Services';
import { About } from '@/components/shared/About';
import { Contact } from '@/components/shared/Contact';
import { Business, BusinessTemplate } from '@/lib/types';

interface PharmacyTemplateProps {
  business: Business;
  content: {
    hero?: any;
    services?: any;
    about?: any;
    contact?: any;
    medications?: any;
    locations?: any;
    stats?: any;
  };
  template: BusinessTemplate;
  preview?: boolean;
}

export function PharmacyTemplate({
  business,
  content,
  template,
  preview = false
}: PharmacyTemplateProps) {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());

  // Set CSS custom properties for business branding with pharmacy theme defaults
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', business.branding?.primaryColor || '#dc2626');
      root.style.setProperty('--brand-secondary', business.branding?.secondaryColor || '#991b1b');
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

  // Default medication categories if not provided in content
  const defaultMedications = [
    {
      category: 'Prescription Medications',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      description: 'Licensed prescription drugs with professional consultation',
      services: [
        'Doctor Prescriptions',
        'Medication Reviews',
        'Drug Interactions',
        'Dosage Guidance'
      ],
      icon: Pill,
      color: 'from-red-500 to-red-600'
    },
    {
      category: 'Over-the-Counter',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      description: 'Common medications for everyday health needs',
      services: ['Pain Relief', 'Cold & Flu', 'Vitamins', 'First Aid'],
      icon: Heart,
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'Health & Wellness',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop',
      description: 'Supplements and wellness products for healthy living',
      services: [
        'Vitamins & Minerals',
        'Herbal Supplements',
        'Protein Powders',
        'Health Monitors'
      ],
      icon: Shield,
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'Personal Care',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      description: 'Personal hygiene and beauty care products',
      services: ['Skincare', 'Oral Care', 'Hair Care', 'Baby Care'],
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Get medications from content or use defaults
  const medications = content.medications?.categories || defaultMedications;

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
      title: 'Prescription Services',
      icon: <Plus className="w-8 h-8" />,
      description: 'Professional prescription filling and medication management',
      features: ['New Prescriptions', 'Refills', 'Transfer Prescriptions', 'Medication Sync']
    },
    {
      title: 'Health Consultations',
      icon: <Stethoscope className="w-8 h-8" />,
      description: 'Free health screenings and medication consultations',
      features: ['Blood Pressure Checks', 'Diabetes Screening', 'Cholesterol Testing', 'Immunizations']
    },
    {
      title: 'Extended Hours',
      icon: <Clock className="w-8 h-8" />,
      description: 'Open extended hours including weekends for your convenience',
      features: ['Early Morning Hours', 'Late Evening Service', 'Weekend Availability', 'Holiday Hours']
    },
    {
      title: 'Insurance Accepted',
      icon: <CreditCard className="w-8 h-8" />,
      description: 'We accept most major insurance plans and offer competitive pricing',
      features: ['Major Insurance Plans', 'Medicare/Medicaid', 'HSA/FSA Accepted', 'Discount Programs']
    }
  ];

  // Get service icon based on string identifier
  function getServiceIcon(iconName: string) {
    const iconMap: Record<string, React.ReactNode> = {
      'Plus': <Plus className="w-8 h-8" />,
      'Stethoscope': <Stethoscope className="w-8 h-8" />,
      'Clock': <Clock className="w-8 h-8" />,
      'CreditCard': <CreditCard className="w-8 h-8" />,
      'Pill': <Pill className="w-8 h-8" />,
      'Heart': <Heart className="w-8 h-8" />,
      'Shield': <Shield className="w-8 h-8" />,
      'UserCheck': <UserCheck className="w-8 h-8" />,
      'prescription': <Plus className="w-8 h-8" />,
      'consultation': <Stethoscope className="w-8 h-8" />,
      'hours': <Clock className="w-8 h-8" />,
      'insurance': <CreditCard className="w-8 h-8" />
    };
    
    return iconMap[iconName] || iconMap[iconName.toLowerCase()] || <Pill className="w-8 h-8" />;
  }

  // Transform hero content
  const heroProps = {
    title: content.hero?.title || `${business.name}`,
    subtitle: content.hero?.subtitle || 'Your Trusted Healthcare Partner',
    description: content.hero?.description || business.description,
    backgroundImage: content.hero?.backgroundImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    backgroundVideo: content.hero?.backgroundVideo,
    theme: `from-red-900 to-red-700 via-red-800`,
    gradient: 'from-red-900/80 via-transparent to-red-700/60',
    badges: content.hero?.badges || ['Licensed Pharmacy', 'Professional Care'],
    buttons: content.hero?.ctaButtons?.map((btn: any) => ({
      text: btn.text,
      href: btn.link,
      style: btn.style,
      icon: btn.icon === 'MapPin' ? <MapPin className="w-5 h-5" /> : <Plus className="w-5 h-5" />
    })) || [
      {
        text: 'Find Medications',
        href: '#medications',
        style: 'primary' as const,
        icon: <Pill className="w-5 h-5" />
      },
      {
        text: 'Contact Pharmacist',
        href: '#contact',
        style: 'secondary' as const,
        icon: <Phone className="w-5 h-5" />
      }
    ]
  };

  // Transform about content
  const aboutProps = {
    title: content.about?.title || 'About Our Pharmacy',
    story: content.about?.description || 'Providing trusted healthcare services and quality medications to our community with professional pharmaceutical care and personalized attention.',
    mission: content.about?.mission,
    vision: content.about?.vision,
    values: content.about?.values || [],
    stats: content.about?.stats || content.stats?.stats || [
      { value: '10,000+', label: 'Medications Available', icon: <Package className="w-6 h-6" /> },
      { value: '8', label: 'Pharmacy Locations', icon: <MapPin className="w-6 h-6" /> },
      { value: '24/7', label: 'Emergency Service', icon: <Clock className="w-6 h-6" /> },
      { value: '99%', label: 'Customer Satisfaction', icon: <Star className="w-6 h-6" /> }
    ],
    theme: 'from-red-500 to-red-600'
  };

  // Transform contact content
  const contactProps = {
    title: content.contact?.title || 'Contact Your Pharmacist',
    description: content.contact?.description || 'Need pharmaceutical assistance? Contact our licensed pharmacists for professional healthcare guidance.',
    contactInfo: {
      phone: content.contact?.phone || business.contact?.phone || '+1 (555) 123-MEDS',
      email: content.contact?.email || business.contact?.email || 'pharmacy@bunduhealthcare.com',
      address: content.contact?.address || business.contact?.address || 'Multiple pharmacy locations',
      hours: content.contact?.hours ? [{ days: 'Daily', hours: content.contact.hours }] : [
        { days: 'Mon-Fri', hours: '8:00 AM - 9:00 PM' },
        { days: 'Saturday', hours: '9:00 AM - 8:00 PM' },
        { days: 'Sunday', hours: '10:00 AM - 6:00 PM' }
      ]
    },
    theme: 'from-red-500 to-red-600'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section data-section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-900"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div
            className={`transform transition-all duration-1000 ${
              visibleSections.has("hero")
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              {business.name || 'Bundu Pharmacy'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              {heroProps.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {heroProps.buttons.map((button: any, index: number) => (
                <a
                  key={index}
                  href={button.href}
                  className={`${button.style === 'primary' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-transparent border-2 border-red-600 hover:bg-red-600'
                  } text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2`}
                >
                  {button.icon}
                  <span>{button.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Medication Categories Section */}
      <section id="medications" data-section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has('medications') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Medication <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Categories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content.medications?.description || 'Comprehensive pharmaceutical services for all your health and wellness needs'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {medications.map((medication: any, index: number) => {
              const IconComponent = medication.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48">
                    <img
                      src={medication.image}
                      alt={medication.category}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <IconComponent className="w-8 h-8 mb-2" />
                      <h3 className="text-xl font-bold">{medication.category}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{medication.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {medication.services.map((service: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium text-center"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section data-section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pharmacy Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional pharmaceutical care with personalized attention to your health needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transformedServices.map((service: any, index: number) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-section id="stats" className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutProps.stats.map((stat: any, index: number) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-red-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Services Section */}
      <section id="health-services" data-section className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has('health-services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Additional Health Services
            </h2>
            <p className="text-lg text-red-100 max-w-3xl mx-auto leading-relaxed">
              Beyond medications, we offer comprehensive health services to keep you and your family healthy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Activity className="w-8 h-8" />,
                title: 'Health Screenings',
                description: 'Blood pressure, cholesterol, and diabetes screenings'
              },
              {
                icon: <UserCheck className="w-8 h-8" />,
                title: 'Immunizations',
                description: 'Flu shots, travel vaccines, and routine immunizations'
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: 'Medication Sync',
                description: 'Synchronize all your medications for convenience'
              },
              {
                icon: <Thermometer className="w-8 h-8" />,
                title: 'Health Monitoring',
                description: 'Blood glucose testing and health consultations'
              }
            ].map((service, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ${
                  visibleSections.has('health-services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-red-100">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance & Payment Section */}
      <section id="insurance" data-section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has('insurance') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Insurance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Payment Options</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We accept most major insurance plans and offer various payment options for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center transition-all duration-700 ${
              visibleSections.has('insurance') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Insurance Accepted</h3>
              <ul className="text-gray-700 space-y-2">
                <li>Most Major Insurance Plans</li>
                <li>Medicare & Medicaid</li>
                <li>Workers' Compensation</li>
                <li>Military Insurance</li>
              </ul>
            </div>

            <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center transition-all duration-700 delay-100 ${
              visibleSections.has('insurance') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Methods</h3>
              <ul className="text-gray-700 space-y-2">
                <li>Cash & Credit Cards</li>
                <li>HSA/FSA Accepted</li>
                <li>GoodRx & Discount Cards</li>
                <li>Payment Plans Available</li>
              </ul>
            </div>

            <div className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center transition-all duration-700 delay-200 ${
              visibleSections.has('insurance') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Insurance?</h3>
              <ul className="text-gray-700 space-y-2">
                <li>Discount Programs Available</li>
                <li>Generic Alternatives</li>
                <li>Patient Assistance Programs</li>
                <li>Competitive Cash Pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      {(content.locations?.locations || business.contact) && (
        <section id="locations" data-section className="py-20 bg-gray-50">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Find Your Nearest <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Pharmacy</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                {content.locations?.description || 'Conveniently located pharmacies with professional service and modern amenities'}
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(content.locations?.locations || [
                {
                  name: 'Downtown Pharmacy',
                  address: '123 Main Street, Downtown District',
                  phone: '+1 (555) 123-4567',
                  hours: 'Mon-Fri: 8AM-9PM, Sat: 9AM-8PM, Sun: 10AM-6PM',
                  image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Drive-Thru', 'Prescription Delivery', 'Health Screenings']
                },
                {
                  name: 'Medical Center Pharmacy',
                  address: '456 Healthcare Avenue, Medical District',
                  phone: '+1 (555) 234-5678',
                  hours: 'Mon-Fri: 7AM-10PM, Sat: 8AM-9PM, Sun: 9AM-7PM',
                  image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Immunizations', 'Consultation Services', 'Medicare Accepted']
                },
                {
                  name: 'Community Pharmacy',
                  address: '789 Oak Avenue, Suburban Plaza',
                  phone: '+1 (555) 345-6789',
                  hours: 'Mon-Fri: 8AM-8PM, Sat: 9AM-7PM, Sun: 10AM-5PM',
                  image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  amenities: ['Compounding Services', 'Health Products', 'Insurance Processing']
                }
              ]).map((location: any, index: number) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="overflow-hidden relative h-48">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/50"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full">
                        Open Today
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                        <MapPin className="text-white" size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                    </div>
                    
                    <p className="flex items-center mb-2 text-gray-600">
                      <MapPin className="mr-2 text-gray-400" size={16} />
                      {location.address}
                    </p>
                    
                    {location.phone && (
                      <p className="flex items-center mb-2 text-gray-600">
                        <Phone className="mr-2 text-gray-400" size={16} />
                        {location.phone}
                      </p>
                    )}

                    <p className="flex items-center mb-4 text-gray-600">
                      <Clock className="mr-2 text-gray-400" size={16} />
                      {location.hours}
                    </p>
                    
                    {location.amenities && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold text-gray-900">Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {location.amenities.map((amenity: string, amenityIndex: number) => (
                            <span key={amenityIndex} className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-lg">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button className="py-3 w-full font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl transition-all duration-300 hover:shadow-lg group-hover:scale-105">
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
      <section
        data-section
        id="contact"
        className="py-20 bg-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Need Pharmaceutical Assistance?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Contact our licensed pharmacists for professional healthcare guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`tel:${contactProps.contactInfo.phone}`}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors duration-300"
            >
              <Phone className="w-5 h-5" />
              <span>Call Pharmacy</span>
            </a>
            <a
              href={`mailto:${contactProps.contactInfo.email}`}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Email Pharmacist</span>
            </a>
            <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors duration-300">
              <MapPin className="w-5 h-5" />
              <span>Find Locations</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PharmacyTemplate;