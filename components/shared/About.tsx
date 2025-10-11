'use client';

import { useState, useEffect } from 'react';
import { Award, Users, MapPin, Clock, Star, TrendingUp } from 'lucide-react';

export interface Stat {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface AboutProps {
  title?: string;
  subtitle?: string;
  story: string;
  mission?: string;
  vision?: string;
  values?: string[];
  stats?: Stat[];
  teamMembers?: TeamMember[];
  achievements?: string[];
  image?: string;
  theme?: string;
  layout?: 'default' | 'split' | 'centered';
}

export function About({
  title = 'About Us',
  subtitle,
  story,
  mission,
  vision,
  values = [],
  stats = [],
  teamMembers = [],
  achievements = [],
  image,
  theme = 'from-blue-500 to-cyan-500',
  layout = 'default'
}: AboutProps) {
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

  const defaultStats = [
    { value: '10+', label: 'Years Experience', icon: <Clock className="w-6 h-6" /> },
    { value: '1000+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
    { value: '5', label: 'Locations', icon: <MapPin className="w-6 h-6" /> },
    { value: '4.9', label: 'Rating', icon: <Star className="w-6 h-6" /> }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has('header') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          data-section="header"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className={`${layout === 'split' ? 'grid lg:grid-cols-2 gap-16 items-center' : ''} mb-16`}>
          {/* Story Section */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              visibleSections.has('story') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
            data-section="story"
          >
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {story}
              </p>
              
              {mission && (
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {mission}
                  </p>
                </div>
              )}

              {vision && (
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {vision}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Image Section */}
          {image && layout === 'split' && (
            <div 
              className={`transition-all duration-700 delay-300 ${
                visibleSections.has('image') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
              }`}
              data-section="image"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={image}
                  alt="About us"
                  className="w-full h-96 object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${theme} opacity-20`}></div>
              </div>
            </div>
          )}
        </div>

        {/* Values Section */}
        {values.length > 0 && (
          <div 
            className={`mb-16 transition-all duration-700 delay-400 ${
              visibleSections.has('values') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            data-section="values"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${theme} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{value}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div 
          className={`mb-16 transition-all duration-700 delay-500 ${
            visibleSections.has('stats') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          data-section="stats"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${theme} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon || <TrendingUp className="w-8 h-8 text-white" />}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div 
            className={`mb-16 transition-all duration-700 delay-600 ${
              visibleSections.has('achievements') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            data-section="achievements"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Achievements</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${theme} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {teamMembers.length > 0 && (
          <div 
            className={`transition-all duration-700 delay-700 ${
              visibleSections.has('team') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            data-section="team"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="text-center group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative mb-4 mx-auto w-32 h-32">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    />
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-t ${theme} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-gray-600 mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}