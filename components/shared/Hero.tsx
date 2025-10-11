'use client';

import Link from 'next/link';
import { ChevronRight, Play, Star } from 'lucide-react';

export interface HeroButton {
  text: string;
  href: string;
  style: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  backgroundVideo?: string;
  buttons?: HeroButton[];
  badges?: string[];
  gradient?: string;
  theme?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export function Hero({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundVideo,
  buttons = [],
  badges = [],
  gradient = 'from-black/50 via-transparent to-black/30',
  theme = 'bg-blue-500',
  stats = []
}: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Primary gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme}`}></div>
        
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        
        {/* Background video */}
        {backgroundVideo && (
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        )}
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 mb-4 font-light">
            {subtitle}
          </p>
        )}

        {/* Main title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.href}
                className={`
                  inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg
                  transition-all duration-300 transform hover:scale-105
                  ${button.style === 'primary' 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 backdrop-blur-sm'
                  }
                `}
              >
                {button.icon}
                {button.text}
                <ChevronRight className="w-5 h-5" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll down</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}