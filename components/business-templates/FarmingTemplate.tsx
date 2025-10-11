'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, Star, Phone, Mail, ArrowRight, Calendar, Users, Leaf, Sun, 
  Wheat, Sprout, TreePine, Heart, Award, Clock, Shield, Tractor,
  Package, Droplets, Thermometer, Truck, CheckCircle
} from 'lucide-react';
import { Hero } from '@/components/shared/Hero';
import { Services } from '@/components/shared/Services';
import { About } from '@/components/shared/About';
import { Contact } from '@/components/shared/Contact';
import { Business, BusinessContent, BusinessTemplate, Location } from '@/lib/types';

interface FarmingTemplateProps {
  business: Business;
  content: {
    hero?: any;
    services?: any;
    about?: any;
    contact?: any;
    products?: any;
    practices?: any;
    locations?: any;
    stats?: any;
    gallery?: any;
    certifications?: any;
  };
  template: BusinessTemplate;
  preview?: boolean;
}

export function FarmingTemplate({
  business,
  content,
  template,
  preview = false
}: FarmingTemplateProps) {
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

  // Default farm products if not provided in content
  const defaultProducts = [
    {
      name: 'Organic Vegetables',
      category: 'Fresh Produce',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=center',
      description: 'Farm-fresh organic vegetables grown with sustainable practices',
      price: 'From $3/lb',
      season: 'Year-round',
      features: ['100% Organic', 'Non-GMO', 'Locally Grown', 'Pesticide Free']
    },
    {
      name: 'Heritage Grains',
      category: 'Grains & Seeds',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center',
      description: 'Ancient grain varieties preserved through traditional farming',
      price: 'From $8/lb',
      season: 'Fall Harvest',
      features: ['Heritage Varieties', 'Stone Ground', 'Whole Grain', 'Traditional Methods']
    },
    {
      name: 'Free-Range Eggs',
      category: 'Dairy & Eggs',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&crop=center',
      description: 'Fresh eggs from pasture-raised, happy chickens',
      price: '$6/dozen',
      season: 'Daily Fresh',
      features: ['Free Range', 'Pasture Raised', 'No Antibiotics', 'Farm Fresh']
    },
    {
      name: 'Seasonal Fruits',
      category: 'Fresh Produce',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop&crop=center',
      description: 'Tree-ripened fruits harvested at peak freshness',
      price: 'From $4/lb',
      season: 'Seasonal',
      features: ['Tree Ripened', 'Peak Freshness', 'Natural Sugars', 'Vine Fresh']
    }
  ];

  // Default farming practices if not provided in content
  const defaultPractices = [
    {
      icon: Leaf,
      title: 'Organic Farming',
      description: 'Certified organic practices without synthetic pesticides or fertilizers',
      benefit: '100% Chemical-Free',
      features: ['Certified Organic', 'Soil Health Focus', 'Natural Pest Control', 'Biodiversity']
    },
    {
      icon: Sun,
      title: 'Solar Powered',
      description: 'Renewable energy systems powering our farm operations',
      benefit: 'Carbon Neutral',
      features: ['Solar Panels', 'Clean Energy', 'Reduced Carbon Footprint', 'Sustainable Power']
    },
    {
      icon: Heart,
      title: 'Regenerative Agriculture',
      description: 'Practices that restore soil health and biodiversity',
      benefit: 'Soil Restoration',
      features: ['Cover Crops', 'Composting', 'Water Conservation', 'Wildlife Habitat']
    },
    {
      icon: Users,
      title: 'Community Supported',
      description: 'Direct partnerships with local families and restaurants',
      benefit: 'Local Impact',
      features: ['CSA Programs', 'Local Partnerships', 'Farm Tours', 'Educational Programs']
    }
  ];

  // Default certifications
  const defaultCertifications = [
    { name: 'USDA Organic', icon: Shield },
    { name: 'Non-GMO Project', icon: Leaf },
    { name: 'Regenerative Organic', icon: Heart },
    { name: 'Animal Welfare Approved', icon: Award }
  ];

  // Get content or use defaults
  const farmProducts = content.products?.products || defaultProducts;
  const farmingPractices = content.practices?.practices || defaultPractices;
  const certifications = content.certifications?.certifications || defaultCertifications;

  // Transform services for the Services component
  const transformedServices = content.services?.services?.map((service: any) => ({
    title: service.title,
    description: service.description,
    icon: getServiceIcon(service.icon || service.title),
    features: service.features || [],
    category: service.category,
    image: service.image,
    price: service.price
  })) || [
    {
      title: 'Fresh Produce',
      icon: <Sprout className="w-8 h-8" />,
      description: 'Seasonal organic vegetables and fruits grown with care',
      features: ['Organic Certified', 'Seasonal Varieties', 'Peak Freshness', 'Local Delivery'],
      category: 'produce'
    },
    {
      title: 'Sustainable Practices',
      icon: <Leaf className="w-8 h-8" />,
      description: 'Environmentally conscious farming methods that restore the land',
      features: ['Regenerative Agriculture', 'Water Conservation', 'Soil Health', 'Biodiversity'],
      category: 'practices'
    },
    {
      title: 'Farm Education',
      icon: <Users className="w-8 h-8" />,
      description: 'Educational tours and workshops about sustainable farming',
      features: ['Farm Tours', 'Workshops', 'School Programs', 'Hands-on Learning'],
      category: 'education'
    },
    {
      title: 'CSA Program',
      icon: <Package className="w-8 h-8" />,
      description: 'Community Supported Agriculture with weekly produce boxes',
      features: ['Weekly Boxes', 'Seasonal Variety', 'Member Benefits', 'Local Pickup'],
      category: 'csa'
    }
  ];

  // Get service icon based on string identifier
  function getServiceIcon(iconName: string) {
    const iconMap: Record<string, React.ReactNode> = {
      'Sprout': <Sprout className="w-8 h-8" />,
      'Leaf': <Leaf className="w-8 h-8" />,
      'Users': <Users className="w-8 h-8" />,
      'Package': <Package className="w-8 h-8" />,
      'Wheat': <Wheat className="w-8 h-8" />,
      'Tractor': <Tractor className="w-8 h-8" />,
      'Sun': <Sun className="w-8 h-8" />,
      'Heart': <Heart className="w-8 h-8" />,
      'produce': <Sprout className="w-8 h-8" />,
      'practices': <Leaf className="w-8 h-8" />,
      'education': <Users className="w-8 h-8" />,
      'csa': <Package className="w-8 h-8" />
    };
    
    return iconMap[iconName] || iconMap[iconName.toLowerCase()] || <Wheat className="w-8 h-8" />;
  }

  // Transform hero content
  const heroProps = {
    title: content.hero?.title || `Fresh from ${business.name}`,
    subtitle: content.hero?.subtitle || 'Sustainable Farm & Local Agriculture',
    description: content.hero?.description || business.description || 'Experience the finest organic produce grown with regenerative farming practices. From our fields to your table, we\'re cultivating a healthier tomorrow.',
    backgroundImage: content.hero?.backgroundImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&crop=center',
    backgroundVideo: content.hero?.backgroundVideo,
    theme: 'from-green-900 via-emerald-800 to-green-700',
    gradient: 'from-green-900/80 via-transparent to-emerald-900/60',
    badges: content.hero?.badges || ['Certified Organic Farm'],
    buttons: content.hero?.ctaButtons?.map((btn: any) => ({
      text: btn.text,
      href: btn.link,
      style: btn.style,
      icon: btn.icon === 'Calendar' ? <Calendar className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />
    })) || [
      {
        text: 'Shop Fresh Produce',
        href: '#products',
        style: 'primary' as const,
        icon: <Package className="w-5 h-5" />
      },
      {
        text: 'Schedule Farm Tour',
        href: '#contact',
        style: 'secondary' as const,
        icon: <MapPin className="w-5 h-5" />
      }
    ],
    stats: content.stats?.stats || [
      { value: '500+', label: 'Acres Farmed' },
      { value: '50+', label: 'Crop Varieties' },
      { value: '15', label: 'Years Experience' },
      { value: '1000+', label: 'Happy Customers' }
    ]
  };

  // Transform about content
  const aboutProps = {
    title: content.about?.title || 'About Our Farm',
    story: content.about?.description || 'Our commitment to sustainable farming practices drives everything we do. We believe in working with nature to produce the highest quality organic food while caring for the land that sustains us.',
    mission: content.about?.mission,
    vision: content.about?.vision,
    values: content.about?.values || ['Sustainability', 'Quality', 'Community', 'Transparency', 'Environmental Stewardship'],
    stats: content.about?.stats || content.stats?.stats || [
      { value: '500+', label: 'Acres Farmed', icon: <MapPin className="w-6 h-6" /> },
      { value: '50+', label: 'Crop Varieties', icon: <Sprout className="w-6 h-6" /> },
      { value: '15', label: 'Years Experience', icon: <Clock className="w-6 h-6" /> },
      { value: '4.9', label: 'Customer Rating', icon: <Star className="w-6 h-6" /> }
    ],
    theme: 'from-green-500 to-emerald-500'
  };

  // Transform contact content
  const contactProps = {
    title: content.contact?.title || 'Ready to Harvest?',
    description: content.contact?.description || 'Connect with us to learn more about our sustainable farming practices, schedule a farm tour, or order fresh organic produce.',
    contactInfo: {
      phone: content.contact?.phone || business.contact?.phone || '+1 (555) HARVEST',
      email: content.contact?.email || business.contact?.email || 'hello@bundufarm.com',
      address: content.contact?.address || business.contact?.address || 'Sustainable Farm Location',
      hours: content.contact?.hours ? [{ days: 'Farm Store', hours: content.contact.hours }] : [
        { days: 'Mon-Fri', hours: '8:00 AM - 6:00 PM' },
        { days: 'Saturday', hours: '8:00 AM - 4:00 PM' },
        { days: 'Sunday', hours: '10:00 AM - 2:00 PM' }
      ]
    },
    theme: 'from-green-500 to-emerald-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float opacity-20">
          <Wheat className="text-green-300" size={60} />
        </div>
        <div className="absolute bottom-32 right-16 animate-float opacity-15" style={{ animationDelay: '1s' }}>
          <Sprout className="text-emerald-300" size={50} />
        </div>
        <div className="absolute top-1/3 right-20 animate-float opacity-10" style={{ animationDelay: '2s' }}>
          <TreePine className="text-green-400" size={40} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <Hero {...heroProps} />
      </div>

      {/* Farm Products Section */}
      <section id="products" data-section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-800 ${
            visibleSections.has('products') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">Harvest</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.products?.description || 'Discover our premium selection of organic produce, grown with care and harvested at peak freshness.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {farmProducts.map((product: any, index: number) => (
              <div
                key={index}
                className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 ${
                  visibleSections.has('products') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {product.season}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
                  
                  {product.features && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.slice(0, 2).map((feature: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farming Practices Section */}
      <section id="practices" data-section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-800 ${
            visibleSections.has('practices') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sustainable <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">Practices</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.practices?.description || 'Our commitment to environmental stewardship drives every decision we make on the farm.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {farmingPractices.map((practice: any, index: number) => {
              const IconComponent = practice.icon;
              return (
                <div
                  key={index}
                  className={`group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 ${
                    visibleSections.has('practices') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-green-600" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{practice.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{practice.description}</p>
                  
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                    <span className="text-green-700 font-medium text-sm">{practice.benefit}</span>
                  </div>

                  {practice.features && (
                    <div className="mt-4 space-y-2">
                      {practice.features.slice(0, 3).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" data-section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-800 ${
            visibleSections.has('certifications') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">Certifications</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.certifications?.description || 'We maintain the highest standards and certifications in organic and sustainable farming.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {certifications.map((cert: any, index: number) => {
              const IconComponent = cert.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 bg-gray-50 rounded-xl px-6 py-4 hover:shadow-lg transition-all duration-300 ${
                    visibleSections.has('certifications') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{cert.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" data-section className="bg-gradient-to-br from-emerald-50 to-white">
        <Services 
          {...{
            title: content.services?.title || 'Farm Services',
            description: content.services?.description || 'Discover our comprehensive range of sustainable farming services and community programs',
            services: transformedServices,
            theme: 'from-green-500 to-emerald-500',
            showFeatures: true,
            columns: 4 as const
          }}
        />
      </section>

      {/* About Section */}
      <section id="about" data-section>
        <About {...aboutProps} />
      </section>

      {/* Contact Section */}
      <section id="contact" data-section className="bg-gradient-to-br from-green-900 via-emerald-800 to-green-700">
        <Contact {...contactProps} />
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default FarmingTemplate;