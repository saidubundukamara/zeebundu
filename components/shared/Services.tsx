'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Clock, DollarSign, Star } from 'lucide-react';

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  price?: string;
  duration?: string;
  features?: string[];
  category?: string;
  rating?: number;
  isPopular?: boolean;
}

export interface ServicesProps {
  title?: string;
  description?: string;
  services: ServiceItem[];
  layout?: 'grid' | 'list' | 'cards';
  theme?: string;
  showPricing?: boolean;
  showFeatures?: boolean;
  columns?: 2 | 3 | 4;
}

export function Services({
  title = 'Our Services',
  description,
  services,
  layout = 'grid',
  theme = 'from-blue-500 to-cyan-500',
  showPricing = false,
  showFeatures = false,
  columns = 3
}: ServicesProps) {
  const [visibleItems, setVisibleItems] = useState(new Set<number>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-service-item]').forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'md:grid-cols-2';
      case 4: return 'md:grid-cols-2 lg:grid-cols-4';
      default: return 'md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Services Grid/List */}
        <div className={`grid ${getGridCols()} gap-8`}>
          {services.map((service, index) => (
            <div
              key={index}
              data-service-item
              data-index={index}
              className={`
                group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl
                transition-all duration-500 transform hover:-translate-y-2
                ${visibleItems.has(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
                }
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Popular badge */}
              {service.isPopular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 bg-gradient-to-r ${theme} text-white text-sm font-semibold rounded-full`}>
                    Popular
                  </span>
                </div>
              )}

              {/* Service Image */}
              {service.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme} opacity-20`}></div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${theme} rounded-lg flex items-center justify-center text-white`}>
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    {service.category && (
                      <span className="text-sm text-gray-500 font-medium">
                        {service.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                {showFeatures && service.features && service.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pricing and Duration */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {showPricing && service.price && (
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{service.price}</span>
                      </div>
                    )}
                    {service.duration && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Rating */}
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">
                        {service.rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button className={`
                  w-full mt-6 px-6 py-3 bg-gradient-to-r ${theme} text-white font-semibold rounded-lg
                  transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  flex items-center justify-center gap-2
                `}>
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}