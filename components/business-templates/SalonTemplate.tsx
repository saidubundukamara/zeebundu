'use client';

import React, { useState, useEffect } from "react";
import {
  Scissors,
  Star,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Users,
  Calendar,
  Award,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Play,
  ChevronRight,
  Check,
  Heart,
  Sparkles,
  Crown,
  Gift,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Business, BusinessTemplate } from "@/lib/types";

interface SalonPageProps {
  business: Business;
  content: any;
  template: BusinessTemplate;
  preview?: boolean;
}

export function SalonTemplate({ business, content, template, preview = false }: SalonPageProps) {
  const [activeService, setActiveService] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const hero = (content && (content as any).hero) || null;
  const statsContent = (content && (content as any).stats) || null;
  const servicesContent = (content && (content as any).services) || null;
  const featuresContent = (content && (content as any).features) || null;
  const contactContent = (content && (content as any).contact) || null;
  const galleryContent = (content && (content as any).gallery) || null;

  const services = Array.isArray(servicesContent?.services)
    ? servicesContent.services.map((s: any) => ({
        name: s.title || s.name || '',
        price: s.price || '',
        duration: s.duration || '',
        description: s.description || '',
        image: s.image || '',
        features: Array.isArray(s.features) ? s.features : [],
      }))
    : [];

  useEffect(() => {
    // Clamp active index when services length changes
    if (activeService >= services.length) {
      setActiveService(0);
    }
  }, [services.length]);

  const stats = (statsContent?.stats && statsContent.stats.length > 0)
    ? statsContent.stats.map((s: any) => ({ number: s.value, label: s.label }))
    : [
    { number: "15+", label: "Happy Patients" },
    { number: "10+", label: "Premium Products" },
    { number: "15+", label: "Beauty Experts" },
    { number: "10+", label: "Years Experience" },
  ];

  const brands = [
    "BeautyBox",
    "Beautify",
    "ULTA",
    "Sephora",
    "Purple",
    "NYKAA",
  ];

  const testimonials = [
    { rating: "2k+", label: "Happy Clients" },
    { rating: "10+", label: "Years Experience" },
    { rating: "24+", label: "Premium Products" },
    { rating: "15+", label: "Beauty Experts" },
  ];

  const stylists = [
    {
      name: "Emma Rodriguez",
      specialty: "Color Specialist",
      experience: "8 years",
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop&crop=center",
      rating: 4.9,
    },
    {
      name: "Sarah Chen",
      specialty: "Hair Stylist",
      experience: "6 years",
      image:
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&crop=face",
      rating: 4.8,
    },
    {
      name: "Maria Santos",
      specialty: "Nail Artist",
      experience: "5 years",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Responsive Design */}
      <section
        className="relative"
        style={{ background: "#f3e6dd" }}
        data-section
      >
        <div className="relative px-4 pt-16 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 lg:gap-0 items-start min-h-[480px] relative mb-0 pt-6 sm:pt-10">
            {/* Left Section */}
            <div className="flex flex-col order-2 gap-4 sm:gap-6 lg:order-1">
              <h1 className="mb-4 text-3xl font-bold tracking-tight leading-tight text-center sm:mb-8 sm:text-4xl lg:text-5xl text-slate-700 lg:text-left">
                {hero?.title || 'Enhancing your beauty to let you shine'}
              </h1>

              <div className="flex justify-center items-center mx-auto mb-3 w-10 h-10 text-lg font-bold text-white bg-gray-800 rounded-full lg:justify-start sm:mb-5 lg:mx-0"></div>

              <div className="hidden lg:block">
                <div
                  className="overflow-hidden mx-auto w-48 h-48 shadow-xl xl:w-64 xl:h-64 lg:mx-0"
                  style={{
                    borderRadius: "120px 120px 30px 30px",
                    background: "linear-gradient(135deg, #f8d7da, #f5c6cb)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <img
                    src={hero?.backgroundImage || "https://www.snow.edu/academics/bat/cosmetology/images/salon-service.jpg"}
                    alt="Beauty treatment"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Center Section - Large Semi-Oval */}
            <div className="flex relative flex-col order-1 gap-6 items-center lg:order-2">
              <div
                className="w-72 sm:w-80 lg:w-[350px] xl:w-[400px] h-96 sm:h-[450px] lg:h-[500px] xl:h-[580px] overflow-hidden relative mx-auto"
                style={{
                  borderRadius: "150px 150px 40px 40px",
                  background: "linear-gradient(135deg, #f8d7da, #f5c6cb)",
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
                }}
              >
                <img
                  src={hero?.backgroundImage || "https://www.snow.edu/academics/bat/cosmetology/images/salon-service.jpg"}
                  alt="Woman applying skincare"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col order-3 gap-4 sm:gap-6">
              <div className="hidden lg:block">
                <div
                  className="w-48 xl:w-[240px] h-56 xl:h-[280px] overflow-hidden mx-auto lg:mx-0"
                  style={{
                    borderRadius: "120px 120px 30px 30px",
                    background: "linear-gradient(135deg, #f8d7da, #f5c6cb)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <img
                    src={hero?.backgroundImage || "https://www.snow.edu/academics/bat/cosmetology/images/salon-service.jpg"}
                    alt="Woman with flowers"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div
                className="p-6 mx-auto mb-4 max-w-sm text-sm rounded-3xl sm:p-8 lg:p-9 lg:mx-0 lg:max-w-none"
                style={{
                  backdropFilter: "blur(15px)",
                }}
              >
                <h2 className="mb-1 text-2xl font-bold text-center sm:text-3xl text-slate-700 lg:text-left">
                  Our Story
                </h2>
                <p className="mb-3 text-sm text-center text-gray-600 lg:text-left">
                  {hero?.description || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Floating Statistics Section - Responsive */}
          <div className="absolute -bottom-16 left-1/2 z-20 px-4 pt-6 w-full max-w-6xl transform -translate-x-1/2 sm:-bottom-20 sm:pt-10">
            <div
              className="grid grid-cols-2 gap-4 items-center px-4 py-6 rounded-t-3xl sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 sm:px-6 sm:py-8 sm:rounded-t-8xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 244, 240, 0.95))",
                backdropFilter: "blur(25px)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div className="relative px-2 text-center sm:px-4">
                <div className="mb-1 text-2xl font-extrabold sm:mb-2 sm:text-3xl lg:text-4xl text-slate-700">
                  {stats[0]?.number}
                </div>
                <div className="text-xs font-semibold tracking-wide text-gray-600 sm:text-sm">
                  {stats[0]?.label}
                </div>
              </div>

              <div className="relative px-2 text-center sm:px-4">
                <div className="mb-1 text-2xl font-extrabold sm:mb-2 sm:text-3xl lg:text-4xl text-slate-700">
                  {stats[1]?.number}
                </div>
                <div className="text-xs font-semibold tracking-wide text-gray-600 sm:text-sm">
                  {stats[1]?.label}
                </div>
              </div>

              <div className="flex order-last col-span-2 justify-center sm:col-span-1 sm:order-none">
                <div
                  className="flex relative flex-col justify-center items-center mx-auto w-20 h-20 rounded-full border-2 border-red-400 sm:w-24 sm:h-24 sm:border-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 107, 107, 0.1))",
                    boxShadow: "0 15px 30px rgba(255, 107, 107, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="mb-1 text-xs tracking-wide leading-tight text-center text-gray-500 uppercase">
                    Beauty
                    <br />
                    Wellness
                  </div>
                  <div className="text-sm font-bold text-red-400 animate-bounce sm:text-lg">
                    ↓
                  </div>
                </div>
              </div>

              <div className="relative px-2 text-center sm:px-4">
                <div className="mb-1 text-2xl font-extrabold sm:mb-2 sm:text-3xl lg:text-4xl text-slate-700">
                  {stats[2]?.number}
                </div>
                <div className="text-xs font-semibold tracking-wide text-gray-600 sm:text-sm">
                  {stats[2]?.label}
                </div>
              </div>

              <div className="relative px-2 text-center sm:px-4">
                <div className="mb-1 text-2xl font-extrabold sm:mb-2 sm:text-3xl lg:text-4xl text-slate-700">
                  {stats[3]?.number}
                </div>
                <div className="text-xs font-semibold tracking-wide text-gray-600 sm:text-sm">
                  {stats[3]?.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 pt-32 pb-24 bg-white" data-section>
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-black">
              Why Choose Our Salon?
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
              Experience the difference with our premium services, expert
              stylists, and commitment to your beauty journey.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(featuresContent?.features) && featuresContent.features.length > 0 ? (
              featuresContent.features.slice(0, 6).map((feat: string, idx: number) => (
                <div key={idx} className={`p-8 text-center ${idx % 2 === 0 ? 'bg-[#f3e6dd]' : 'bg-white'} rounded-3xl transition-all duration-300 group hover:shadow-xl hover:-translate-y-2`}>
                  <div className="inline-flex justify-center items-center mb-6 w-16 h-16 bg-black rounded-2xl">
                    {idx % 3 === 0 ? <Star className="w-8 h-8 text-white" /> : idx % 3 === 1 ? <Scissors className="w-8 h-8 text-white" /> : <Clock className="w-8 h-8 text-white" />}
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-black">{feat}</h3>
                  <p className="leading-relaxed text-gray-600">{business?.description || 'We provide premium salon services tailored to you.'}</p>
                </div>
              ))
            ) : (
              <>
            <div className="p-8 text-center bg-[#f3e6dd] rounded-3xl transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="inline-flex justify-center items-center mb-6 w-16 h-16 bg-black rounded-2xl">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">
                Expert Stylists
              </h3>
              <p className="leading-relaxed text-gray-600">
                Our certified professionals have years of experience and stay
                updated with the latest trends and techniques.
              </p>
            </div>
            <div className="p-8 text-center bg-white rounded-3xl transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="inline-flex justify-center items-center mb-6 w-16 h-16 bg-black rounded-2xl">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">
                Premium Products
              </h3>
              <p className="leading-relaxed text-gray-600">
                We use only the finest, salon-grade products that nourish your
                hair while delivering stunning results.
              </p>
            </div>
            <div className="p-8 text-center bg-[#f3e6dd] rounded-3xl transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="inline-flex justify-center items-center mb-6 w-16 h-16 bg-black rounded-2xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">
                Personalized Care
              </h3>
              <p className="leading-relaxed text-gray-600">
                Every client receives individual attention with customized
                treatments tailored to their unique needs.
              </p>
            </div>
            <div className="p-8 text-center bg-white rounded-3xl transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="inline-flex justify-center items-center mb-6 w-16 h-16 bg-black rounded-2xl">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">
                Luxury Experience
              </h3>
              <p className="leading-relaxed text-gray-600">
                Relax in our modern, comfortable environment designed to make
                your visit a truly pampering experience.
              </p>
            </div>
            <div className="p-8 text-center bg-[#f3e6dd] rounded-3xl transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="inline-flex justify-center items-center mb-6 w-16 h-16 bg-black rounded-2xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">
                Flexible Scheduling
              </h3>
              <p className="leading-relaxed text-gray-600">
                Book appointments that fit your busy lifestyle with our
                convenient online booking system.
              </p>
            </div>
            <div className="p-8 text-center bg-white rounded-3xl transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="inline-flex justify-center items-center mb-6 w-16 h-16 bg-black rounded-2xl">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">
                Satisfaction Guarantee
              </h3>
              <p className="leading-relaxed text-gray-600">
                We're committed to your happiness and will work with you until
                you love your new look.
              </p>
            </div>
              </>
            )}
          </div>

          {/* Call to Action */}
          {/* <div className="mt-16 text-center">
            <button className="inline-flex gap-2 items-center px-8 py-4 font-semibold text-black rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105" style={{backgroundColor: '#f3e6dd'}}>
              Book Your Appointment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div> */}
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 py-24 bg-white" data-section>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-black">
              {servicesContent?.title}
            </h2>
          </div>

          {services.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Side - Service List */}
            <div className="space-y-6">
              {services.map((service: any, index: number) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeService === index
                      ? "shadow-lg border-l-4 border-black"
                      : "hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor:
                      activeService === index ? "#f3e6dd" : "white",
                  }}
                  onClick={() => setActiveService(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-black">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black">
                        {service.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Active Service Panel (stable layout) */}
            <div className="relative h-96">
              {services[activeService] && services[activeService].image ? (
                <img
                  src={services[activeService].image}
                  alt={services[activeService].name}
                  className="object-cover w-full h-full rounded-3xl shadow-lg"
                />
              ) : (
                <div
                  className="w-full h-full rounded-3xl shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(243,230,221,1) 0%, rgba(250,245,241,1) 100%)",
                  }}
                />
              )}
              {services[activeService] && (
                <div className="absolute bottom-6 left-6 p-4 max-w-[85%] rounded-2xl backdrop-blur-sm bg-white/90">
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto pr-1">
                    {[
                      "Professional Stylists",
                      "Personalized Care",
                      "Attention to Detail",
                    ].map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs text-white bg-black rounded-full whitespace-nowrap"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section
        className="px-4 py-24"
        style={{ backgroundColor: "#f3e6dd" }}
        data-section
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-black">
              What Our Clients
              <span className="block text-black">Say About Us</span>
            </h2>
          </div>

          <div className="grid gap-8 mb-16 md:grid-cols-2 lg:grid-cols-4">
                {(stats && stats.length >= 4 ? stats.slice(0,4) : testimonials).map((item: any, index: number) => (
              <div key={index} className="p-6 text-center bg-white rounded-2xl">
                <div className="mb-2 text-3xl font-bold text-black">
                  {(item as any).rating || (item as any).number}
                </div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 text-center">
              <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-black rounded-2xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-black">
                {(featuresContent?.features && featuresContent.features[0]) || 'Premium Quality'}
              </h3>
              <p className="text-gray-600">
                {business?.description || 'Top-tier products and services for the best results'}
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-black rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-black">
                {(featuresContent?.features && featuresContent.features[1]) || 'Expert Team'}
              </h3>
              <p className="text-gray-600">
                {business?.description || 'Skilled and certified beauty professionals'}
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-black rounded-2xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-black">
                {(featuresContent?.features && featuresContent.features[2]) || 'Personalized Care'}
              </h3>
              <p className="text-gray-600">
                {business?.description || 'Customized treatments for your unique needs'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {/* <section className="px-4 py-24 bg-white" data-section>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-black">
              {galleryContent?.title || 'Our Gallery'}
            </h2>
          </div>

          {galleryContent?.images && galleryContent.images.length > 0 && (
            <div className="grid gap-8 md:grid-cols-3">
              {galleryContent.images.slice(0, 6).map((item: any, index: number) => (
                <div
                  key={index}
                  className="overflow-hidden bg-white rounded-3xl shadow-lg transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={item.url || item}
                      alt={item.alt || item.caption || `Gallery image ${index + 1}`}
                      className="object-cover w-full h-64"
                    />
                  </div>

                  {item.caption && (
                    <div className="p-6">
                      <p className="text-sm text-gray-600 truncate">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section> */}

<section className="px-4 py-24 bg-white" data-section>
  <div className="mx-auto max-w-7xl">
    <div className="mb-16 text-center">
      <h2 className="mb-6 text-4xl font-bold text-black">
        {galleryContent?.title || 'Our Gallery'}
      </h2>
    </div>

    {galleryContent?.images && galleryContent.images.length > 0 && (
      <div className="grid gap-8 md:grid-cols-3">
        {galleryContent.images.slice(0, 6).map((item: any, index: number) => (
          <div
            key={index}
            className="overflow-hidden bg-white rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl"
            style={{
              border: '2px solid #f3e6dd', // Brown border color matching the page theme
              borderRadius: '1rem' // 16px border radius
            }}
          >
            <div className="relative aspect-[4/3] p-2">
              <img
                src={item.url || item}
                alt={item.alt || item.caption || `Gallery image ${index + 1}`}
                className="object-cover w-full h-full"
                style={{
                  borderRadius: '0.75rem', // 12px border radius for the actual image
                  border: 'none'
                }}
              />
            </div>

            {item.caption && (
              <div className="p-6">
                <p className="text-sm text-gray-600 truncate">
                  {item.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</section>

      {/* Get Beauty Treatments Section */}
      <section
        className="px-4 py-24"
        style={{ backgroundColor: "#f3e6dd" }}
        data-section
      >
        <div className="grid gap-16 items-center mx-auto max-w-7xl lg:grid-cols-2">
          {/* Left Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop&crop=center"
              alt="Beauty Treatments"
              className="object-cover w-full h-80 rounded-3xl shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="mb-6 text-4xl font-bold text-black">
              Get Beauty Treatments
              <span className="block text-black">Here Now</span>
            </h2>
            <p className="mb-8 leading-relaxed text-gray-600">
              Transform your look with our premium beauty treatments. Our expert
              team uses the latest techniques and high-quality products to
              ensure you get the best results.
            </p>

            <div className="mb-8 space-y-4">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-6 h-6 bg-black rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">
                  Professional certified beauticians
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-6 h-6 bg-black rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Premium quality products</span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-6 h-6 bg-black rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">
                  Personalized treatment plans
                </span>
              </div>
            </div>

            {/* <button className="flex gap-3 items-center px-8 py-4 font-medium text-white bg-black rounded-full transition-colors hover:bg-gray-800">
              Book Treatment
              <ArrowRight className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="px-4 py-24"
        style={{ backgroundColor: "#ffff" }}
        data-section
      >
        <div className="mx-auto max-w-7xl">
          {/* Contact Content - Full Width */}
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-black">
              Ready to Transform
              <span className="block text-black">Your Look?</span>
            </h2>
            <p className="mb-12 text-xl text-gray-700">
              Book your appointment today and experience the difference our
              expert team can make.
            </p>

            <div className="grid gap-8 mb-12 md:grid-cols-3">
              <div className="p-6 rounded-2xl shadow-lg bg-[#f3e6dd]">
                <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-white rounded-full">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="mb-2 text-lg font-semibold text-black">
                    Call Us
                  </div>
                  <div className="text-gray-600">{contactContent?.phone || business?.contact?.phone || '+1 (555) BEAUTY'}</div>
                </div>
              </div>

              <div className="p-6 bg-[#f3e6dd] rounded-2xl shadow-lg">
                <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-white rounded-full">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="mb-2 text-lg font-semibold text-black">
                    Email Us
                  </div>
                  <div className="text-gray-600">{contactContent?.email || business?.contact?.email || 'hello@bundusalon.com'}</div>
                </div>
              </div>

              <div className="p-6 bg-[#f3e6dd] rounded-2xl shadow-lg">
                <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-white rounded-full">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="mb-2 text-lg font-semibold text-black">
                    Visit Us
                  </div>
                  <div className="text-gray-600">
                    {contactContent?.address || business?.contact?.address || '123 Beauty Street, City Center'}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-center">
              <button className="flex gap-3 items-center px-8 py-4 font-medium text-white bg-black rounded-full transition-colors hover:bg-gray-800">
                Book Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex gap-3 items-center px-8 py-4 font-medium text-black bg-white rounded-full transition-colors hover:bg-gray-100">
                View Gallery
                <ArrowRight className="w-5 h-5" />
              </button>
            </div> */}
          </div>

          {/* Commented out booking form */}
          {/* 
          <div className="p-8 bg-gray-800 rounded-3xl">
            <h3 className="mb-6 text-2xl font-semibold">Book Appointment</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="px-4 py-3 placeholder-gray-400 text-white bg-gray-700 rounded-xl border border-gray-600 focus:outline-none"
                    style={{'--tw-ring-color': '#f3e6dd'} as React.CSSProperties}
                    onFocus={(e) => e.target.style.borderColor = '#f3e6dd'}
                    onBlur={(e) => e.target.style.borderColor = '#4b5563'}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="px-4 py-3 placeholder-gray-400 text-white bg-gray-700 rounded-xl border border-gray-600 focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#f3e6dd'}
                  onBlur={(e) => e.target.style.borderColor = '#4b5563'}
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-3 w-full placeholder-gray-400 text-white bg-gray-700 rounded-xl border border-gray-600 focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#f3e6dd'}
                onBlur={(e) => e.target.style.borderColor = '#4b5563'}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="px-4 py-3 w-full placeholder-gray-400 text-white bg-gray-700 rounded-xl border border-gray-600 focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#f3e6dd'}
                onBlur={(e) => e.target.style.borderColor = '#4b5563'}
              />
              <select className="px-4 py-3 w-full text-white bg-gray-700 rounded-xl border border-gray-600 focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#f3e6dd'}
                onBlur={(e) => e.target.style.borderColor = '#4b5563'}>
                <option>Select Service</option>
                <option>Hair Styling</option>
                <option>Facial Treatments</option>
                <option>Nail Care</option>
                <option>Bridal Package</option>
              </select>
              <textarea
                placeholder="Special requests..."
                rows={3}
                className="px-4 py-3 w-full placeholder-gray-400 text-white bg-gray-700 rounded-xl border border-gray-600 resize-none focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#f3e6dd'}
                onBlur={(e) => e.target.style.borderColor = '#4b5563'}
              ></textarea>
              <button
                type="submit"
                className="py-4 w-full font-medium text-black rounded-xl transition-colors hover:opacity-80"
                style={{backgroundColor: '#f3e6dd'}}
              >
                Book Appointment
              </button>
            </form>
          </div>
          */}
        </div>
      </section>

    </div>
  );
}

export default SalonTemplate;
