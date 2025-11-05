'use client';

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Dog,
  Cat,
  Bird,
  Fish,
  Star,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Users,
  TreePine,
  Home,
  Award,
  Shield,
  Truck,
  Egg,
  Beef,
  Factory,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Business, BusinessTemplate } from "@/lib/types";

interface LivestockPageProps {
  business: Business;
  content: any;
  template: BusinessTemplate;
  preview?: boolean;
}

export function LivestockTemplate({ business, content, template, preview = false }: LivestockPageProps) {
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

  const poultryProducts = [
    {
      name: "Premium Free-Range Eggs",
      category: "Fresh Eggs",
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
      description:
        "Farm-fresh eggs from pasture-raised chickens with access to open fields",
      price: "$8/dozen",
      features: ["Omega-3 Rich", "Cage-Free", "Organic Feed"],
      icon: Egg,
    },
    {
      name: "Organic Chicken Meat",
      category: "Poultry Meat",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400",
      description:
        "High-quality chicken meat from birds raised with sustainable practices",
      price: "$12/lb",
      features: ["Antibiotic-Free", "Hormone-Free", "Free-Range"],
      icon: Heart,
    },
    {
      name: "Turkey & Specialty Birds",
      category: "Specialty Poultry",
      image:
        "https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?w=400",
      description:
        "Premium turkey and specialty poultry for restaurants and retailers",
      price: "$15/lb",
      features: ["Heritage Breeds", "Seasonal", "Custom Orders"],
      icon: Star,
    },
  ];

  const cattleProducts = [
    {
      name: "Premium Beef Cuts",
      category: "Beef Products",
      image:
        "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400",
      description:
        "High-quality beef from grass-fed cattle supporting regional food security",
      price: "$18/lb",
      features: ["Grass-Fed", "Local Processing", "Premium Cuts"],
      icon: Beef,
    },
    {
      name: "Fresh Dairy Products",
      category: "Dairy",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
      description:
        "Farm-fresh milk and dairy products from our healthy cattle herd",
      price: "$6/gallon",
      features: ["Raw Milk Available", "Hormone-Free", "Daily Fresh"],
      icon: Heart,
    },
    {
      name: "Breeding Stock",
      category: "Livestock",
      image:
        "https://agtech.folio3.com/wp-content/uploads/2023/04/livestock-breeding.png",
      description: "Quality breeding cattle for expanding livestock operations",
      price: "Contact for pricing",
      features: ["Registered Stock", "Health Certified", "Genetic Testing"],
      icon: Award,
    },
  ];

  const livestockCategories = [
    {
      name: "Beef Cattle",
      icon: Home,
      image:
        "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
      description:
        "Premium beef cattle raised with sustainable farming practices for exceptional meat quality and taste",
      breeds: ["Angus", "Hereford", "Charolais", "Simmental"],
      specialty: "Grass-Fed Beef",
      features: ["Grass-Fed", "Open Pasture", "USDA Certified"],
    },
    {
      name: "Dairy Cattle",
      icon: Heart,
      image:
        "https://www.allaboutfeed.net/app/uploads/2020/12/001_723_IMG_shutterstock_web.jpg",
      description:
        "High-quality dairy cattle focused on milk production with superior animal welfare standards",
      breeds: ["Holstein", "Jersey", "Guernsey", "Brown Swiss"],
      specialty: "Fresh Dairy",
      features: ["Hormone-Free", "Daily Milking", "Quality Tested"],
    },
  ];

  const ranchServices = [
    {
      title: "Beef Production",
      icon: Heart,
      description:
        "Premium beef cattle farming supporting regional food security and local meat processing industries",
      features: [
        "Grass-Fed Cattle",
        "Quality Genetics",
        "Sustainable Practices",
      ],
    },
    {
      title: "Dairy Production",
      icon: Shield,
      description:
        "High-quality dairy farming operations contributing to regional food security and local dairy processing",
      features: ["Fresh Daily Milk", "Hormone-Free", "Quality Standards"],
    },
    {
      title: "Regional Food Security",
      icon: TreePine,
      description:
        "Supporting local communities with reliable livestock production for sustained food supply",
      features: ["Local Supply Chain", "Community Partnership", "Food Safety"],
    },
    {
      title: "Meat Processing Support",
      icon: Truck,
      description:
        "Contributing to local meat processing industries with consistent, high-quality livestock supply",
      features: [
        "Industry Partnership",
        "Quality Assurance",
        "Timely Delivery",
      ],
    },
  ];

  const ranchStats = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Carefully selected livestock for superior products",
      value: "Grade A",
    },
    {
      icon: Heart,
      title: "Animal Care",
      description: "Ethical and humane livestock management",
      value: "Priority",
    },
    {
      icon: Shield,
      title: "Fresh Products",
      description: "Farm-to-table freshness guaranteed",
      value: "Daily",
    },
    {
      icon: Users,
      title: "Local Business",
      description: "Supporting the community with quality livestock",
      value: "Trusted",
    },
  ];

  // Function to get updated high-quality images for livestock categories
  const getUpdatedImage = (categoryName: string) => {
    const imageMap: { [key: string]: string } = {
      "Beef Cattle":
        "https://www.americandairy.com/wp-content/uploads/2024/11/Jersey-1.png",
      "Dairy Cattle":
        "https://www.allaboutfeed.net/app/uploads/2020/12/001_723_IMG_shutterstock_web.jpg",
      Sheep:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center",
      Poultry:
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop&crop=center",
    };
    return (
      imageMap[categoryName] ||
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop&crop=center"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navigation theme="light" bgColor="bg-white" />

      {/* Modern Ranch Hero Section */}
      <section className="flex overflow-hidden relative justify-center items-center min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&h=1080&fit=crop"
            alt="Ranch landscape"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r to-transparent from-black/60 via-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-white max-sm:pt-24">
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full backdrop-blur-sm bg-white/10">
                <Home className="mr-2" size={20} />
                <span className="text-sm font-medium">
                  Premium Livestock Ranch
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
                Cattle
                <span className="block text-red-500">Farm</span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-200">
                Three generations of sustainable livestock farming. We raise
                premium cattle, dairy cows, sheep, and poultry with the highest
                standards of animal welfare.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#contact" className="inline-block">
                  <button className="px-8 py-4 font-semibold text-white bg-red-600 rounded-xl transition-all duration-300 hover:bg-red-700 hover:scale-105">
                    Schedule Ranch Tour
                  </button>
                </a>
                <a href="#livestock" className="inline-block">
                  <button className="px-8 py-4 font-semibold text-white rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/10 hover:bg-white/20 border-white/30">
                    View Our Animals
                  </button>
                </a>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-6 max-sm:pb-8">
              {ranchStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-6 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 bg-white/10 hover:bg-white/20"
                  >
                    <IconComponent className="mb-4 text-red-500" size={32} />
                    <div className="mb-2 text-3xl font-bold">{stat.value}</div>
                    <div className="mb-1 text-lg font-semibold">
                      {stat.title}
                    </div>
                    <div className="text-sm text-gray-300">
                      {stat.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Farm Operations Section */}
      <section id="operations" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-red-500 bg-red-100 rounded-full">
              <Shield className="mr-2 w-4 h-4" />
              Premium Farm Operations
            </div>
            <h2 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Sustainable <span className="text-red-500">Livestock</span>
              <br />
              Excellence
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600">
              Livestock farming for beef and dairy production, supporting
              regional food security and contributing to local meat processing
              industries.
            </p>
          </div>

          {/* Asymmetric Layout for Farm Operations */}
          <div className="space-y-32">
            {/* Cattle Farming Section - Right Aligned */}
            <div className="grid gap-16 items-center lg:grid-cols-12">
              <div className="order-2 lg:col-span-7 lg:order-1">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {cattleProducts.slice(0, 3).map((product, index) => {
                    const IconComponent = product.icon;
                    return (
                      <div
                        key={index}
                        className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                          index === 2 ? "md:col-span-2 h-64" : "h-48"
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/70 via-black/20"></div>
                        <div className="absolute right-0 bottom-0 left-0 p-6">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-bold text-white">
                              {product.name}
                            </h4>
                            <div className="p-2 rounded-full backdrop-blur-sm bg-white/20">
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <p className="text-sm text-white/90">
                            {product.description.slice(0, 80)}...
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-red-300">
                              {product.price}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="order-1 lg:col-span-5 lg:order-2">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-3xl opacity-20 blur-xl"></div>
                  <div className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-xl">
                    <div className="flex items-center mb-6">
                      <div className="flex justify-center items-center mr-4 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl">
                        <Beef className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">
                          Cattle Farm
                        </h3>
                        <p className="font-medium text-red-600">
                          Premium Beef & Dairy
                        </p>
                      </div>
                    </div>

                    <p className="mb-8 text-lg leading-relaxed text-gray-600">
                      Our livestock farming operations focus on beef and dairy
                      production, supporting regional food security and
                      contributing to local meat processing industries with
                      sustainable practices and quality standards.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 text-center bg-red-50 rounded-xl">
                        <div className="text-2xl font-bold text-red-600">
                          200+
                        </div>
                        <div className="text-sm text-gray-600">
                          Head of Cattle
                        </div>
                      </div>
                      <div className="p-4 text-center bg-rose-50 rounded-xl">
                        <div className="text-2xl font-bold text-rose-600">
                          100%
                        </div>
                        <div className="text-sm text-gray-600">Grass Fed</div>
                      </div>
                    </div>

                    <a href="#contact" className="inline-block w-full">
                      <button className="px-6 py-4 w-full font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-xl shadow-lg transition-all duration-300 transform hover:from-red-600 hover:to-rose-600 hover:scale-105">
                        Explore Cattle Products
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Livestock Categories Section */}
      <section id="livestock" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-red-500 bg-red-100 rounded-full">
              <Shield className="mr-2 w-4 h-4" />
              Premium Livestock Collection
            </div>
            <h2 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Heritage <span className="text-red-500">Livestock</span>
              <br />
              Excellence
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600">
              Premium breeds raised with care in natural environments for
              optimal health and quality, supporting sustainable agriculture.
            </p>
          </div>

          {/* Livestock Cards - Two Side by Side */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {livestockCategories.map((category, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden border border-gray-200 hover:border-red-300 ${
                  visibleSections.has("livestock")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Hero Image Section */}
                <div className="overflow-hidden relative h-80">
                  <img
                    src={getUpdatedImage(category.name)}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Sophisticated Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br via-transparent from-black/60 to-red-900/40" />

                  {/* Floating Specialty Badge */}
                  <div className="absolute top-6 right-6 px-5 py-3 text-sm font-bold text-red-600 rounded-2xl border border-red-100 shadow-xl backdrop-blur-md bg-white/95">
                    {category.specialty}
                  </div>

                  {/* Title Section */}
                  <div className="absolute right-0 bottom-0 left-0 p-8 bg-gradient-to-t to-transparent from-black/90">
                    <h3 className="mb-3 text-3xl font-bold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-1 bg-red-500 rounded-full" />
                      <div className="w-6 h-1 bg-red-300 rounded-full" />
                      <div className="w-3 h-1 bg-red-200 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <p className="mb-6 text-lg font-medium leading-relaxed text-gray-700">
                    {category.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {category.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="p-3 text-center bg-red-50 rounded-xl border border-red-100"
                      >
                        <div className="text-xs font-semibold tracking-wide text-red-600 uppercase">
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Breed Showcase */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-bold tracking-wide text-gray-800 uppercase">
                      Premium Breeds
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.breeds.map((breed, breedIndex) => (
                        <span
                          key={breedIndex}
                          className="px-3 py-2 text-sm font-medium text-center text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border border-gray-300 transition-all duration-300 cursor-pointer hover:from-red-100 hover:to-red-200 hover:text-red-800 hover:border-red-300"
                        >
                          {breed}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <a href="#contact" className="inline-block w-full">
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl group-hover:shadow-red-500/30 flex items-center justify-center gap-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 transform -translate-x-full -skew-x-12 via-white/20 group-hover:translate-x-full" />
                      <span className="relative z-10">
                        Explore {category.name}
                      </span>
                      <svg
                        className="relative z-10 w-5 h-5 transition-transform transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranch Services Section */}
      <section id="services" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-800 ${
              visibleSections.has("services")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
              Our <span className="text-red-600">Services</span>
            </h2>
            <div className="mx-auto mb-6 w-24 h-1 bg-red-600"></div>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Comprehensive livestock services from breeding to processing,
              ensuring quality at every step.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {ranchServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className={`group p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-red-200 hover:-translate-y-1 ${
                    visibleSections.has("services")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center items-center mb-6 w-16 h-16 bg-red-50 rounded-xl transition-colors duration-300 group-hover:bg-red-100">
                    <IconComponent className="text-red-600" size={32} />
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-gray-800">
                    {service.title}
                  </h3>
                  <p className="mb-6 text-base leading-relaxed text-gray-600">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    {service.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <div className="flex-shrink-0 mr-3 w-2 h-2 bg-red-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <a href="#contact" className="inline-block w-full">
                    <button className="py-3 mt-6 w-full text-base font-semibold text-red-600 bg-red-50 rounded-xl transition-colors duration-300 hover:bg-red-100">
                      Learn More
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regional Impact Section */}
      <section
        id="regional-impact"
        data-section
        className="overflow-hidden relative py-24 text-white bg-gradient-to-br from-red-900 via-red-800 to-red-900"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-transparent via-red-600/20"></div>
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl bg-red-400/20"></div>
          <div className="absolute right-20 bottom-20 w-48 h-48 rounded-full blur-2xl bg-red-300/20"></div>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-800 ${
              visibleSections.has("regional-impact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Supporting{" "}
              <span className="text-red-300">Regional Food Security</span>
            </h2>
            <div className="mx-auto mb-6 w-24 h-1 bg-gradient-to-r from-red-400 to-red-300"></div>
            <p className="mx-auto max-w-4xl text-xl text-red-100">
              Our livestock operations play a vital role in strengthening
              regional food systems and contributing to local meat processing
              industries, ensuring sustainable food security for our
              communities.
            </p>
          </div>

          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Food Security Content */}
            <div
              className={`transition-all duration-800 ${
                visibleSections.has("regional-impact")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="p-8 rounded-3xl border backdrop-blur-sm bg-white/10 border-red-300/20">
                <div className="flex items-center mb-6">
                  <div className="flex justify-center items-center mr-4 w-12 h-12 rounded-xl bg-red-400/20">
                    <Shield className="text-red-300" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-red-100">
                    Food Security Impact
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                      <strong className="text-white">
                        Local Supply Chain:
                      </strong>{" "}
                      Reducing dependency on distant suppliers by providing
                      fresh, high-quality meat products directly to regional
                      markets and communities.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                      <strong className="text-white">
                        Sustainable Practices:
                      </strong>{" "}
                      Implementing environmentally responsible farming methods
                      that ensure long-term food production capabilities.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                      <strong className="text-white">
                        Community Resilience:
                      </strong>{" "}
                      Building stronger local food systems that can withstand
                      supply chain disruptions and economic challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Industry Content */}
            <div
              className={`transition-all duration-800 ${
                visibleSections.has("regional-impact")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="p-8 rounded-3xl border backdrop-blur-sm bg-white/10 border-red-300/20">
                <div className="flex items-center mb-6">
                  <div className="flex justify-center items-center mr-4 w-12 h-12 rounded-xl bg-red-400/20">
                    <Factory className="text-red-300" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-red-100">
                    Local Processing Partnership
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                      <strong className="text-white">Industry Support:</strong>{" "}
                      Partnering with local meat processing facilities to create
                      jobs and strengthen the regional agricultural economy.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                      <strong className="text-white">Quality Standards:</strong>{" "}
                      Maintaining the highest processing standards to ensure
                      safe, premium meat products for consumers.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-2 mr-4 w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="leading-relaxed text-red-100">
                      <strong className="text-white">Economic Growth:</strong>{" "}
                      Contributing to local economic development through direct
                      partnerships and supporting related businesses in the
                      supply chain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Statistics */}
          <div
            className={`mt-16 transition-all duration-800 ${
              visibleSections.has("regional-impact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-300">
                  Premium
                </div>
                <div className="text-sm tracking-wide text-red-100 uppercase">
                  Quality Standards
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-300">
                  Fresh
                </div>
                <div className="text-sm tracking-wide text-red-100 uppercase">
                  Daily Products
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-300">
                  Local
                </div>
                <div className="text-sm tracking-wide text-red-100 uppercase">
                  Community Focus
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-300">
                  Trusted
                </div>
                <div className="text-sm tracking-wide text-red-100 uppercase">
                  Service Provider
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-800 ${
              visibleSections.has("contact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Contact <span className="text-red-600">Us</span>
              </h2>
              <div className="mx-auto mb-6 w-24 h-1 bg-red-600"></div>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Ready to experience premium livestock products? Get in touch
                with our team for orders, inquiries, or ranch visits.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Phone Contact */}
              <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 group hover:shadow-xl hover:border-red-200">
                <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full transition-colors duration-300 group-hover:bg-red-200">
                  <Phone className="text-red-600" size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-center text-gray-900">
                  Call Us
                </h3>
                <p className="mb-4 text-center text-gray-600">
                  Speak directly with our ranch specialists
                </p>
                <div className="text-center">
                  <a
                    href="tel:+15553216547"
                    className="text-lg font-semibold text-red-600 transition-colors duration-300 hover:text-red-700"
                  >
                    +1 (555) 321-6547
                  </a>
                </div>
              </div>

              {/* Email Contact */}
              <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 group hover:shadow-xl hover:border-red-200">
                <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full transition-colors duration-300 group-hover:bg-red-200">
                  <Mail className="text-red-600" size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-center text-gray-900">
                  Email Us
                </h3>
                <p className="mb-4 text-center text-gray-600">
                  Send us your questions and order requests
                </p>
                <div className="text-center">
                  <a
                    href="mailto:ranch@bundufarms.com"
                    className="text-lg font-semibold text-red-600 transition-colors duration-300 hover:text-red-700"
                  >
                    ranch@bundufarms.com
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 group hover:shadow-xl hover:border-red-200 md:col-span-2 lg:col-span-1">
                <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full transition-colors duration-300 group-hover:bg-red-200">
                  <Clock className="text-red-600" size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-center text-gray-900">
                  Business Hours
                </h3>
                <div className="space-y-2 text-center text-gray-600">
                  <p className="font-medium">Ranch Tours</p>
                  <p className="text-sm">Saturdays: 10:00 AM - 3:00 PM</p>
                  <p className="mt-3 font-medium">Farm Store</p>
                  <p className="text-sm">Daily: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <Footer />
    </div>
  );
}

export default LivestockTemplate;
