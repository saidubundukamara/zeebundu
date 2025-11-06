'use client';

import React, { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Clock,
  Shield,
  CheckCircle,
  FileText,
  DollarSign,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Business, BusinessTemplate } from "@/lib/types";

interface MicroFinancePageProps {
  business: Business;
  content: any;
  template: BusinessTemplate;
  preview?: boolean;
}

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  Clock,
  Shield,
  CheckCircle,
  FileText,
  DollarSign,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Award,
  AlertCircle,
};

export function MicroFinanceTemplate({ business, content, template, preview = false }: MicroFinancePageProps) {
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

  // Extract content sections from database
  const heroContent = content?.hero || (content?.sections && content.sections.find((s: any) => s.type === 'hero')?.content);
  const borrowingProcessContent = content?.borrowingProcess || (content?.sections && content.sections.find((s: any) => s.type === 'borrowingProcess')?.content);
  const termsContent = content?.terms || (content?.sections && content.sections.find((s: any) => s.type === 'terms')?.content);
  const loanDurationContent = content?.loanDuration || (content?.sections && content.sections.find((s: any) => s.type === 'loanDuration')?.content);
  const paymentMethodsContent = content?.paymentMethods || (content?.sections && content.sections.find((s: any) => s.type === 'paymentMethods')?.content);
  const requirementsContent = content?.requirements || (content?.sections && content.sections.find((s: any) => s.type === 'requirements')?.content);
  const loanProductsContent = content?.loanProducts || (content?.sections && content.sections.find((s: any) => s.type === 'loanProducts')?.content);
  const contactContent = content?.contact || (content?.sections && content.sections.find((s: any) => s.type === 'contact')?.content);

  // Extract hero data
  const hasHeroContent = heroContent?.title || heroContent?.description;
  const heroTitle = heroContent?.title;
  const heroSubtitle = heroContent?.subtitle;
  const heroDescription = heroContent?.description;
  const heroBadge = heroContent?.badge || heroContent?.badges?.[0];
  const heroBackgroundImage = heroContent?.backgroundImage?.url || heroContent?.backgroundImage;
  const heroButtons = heroContent?.ctaButtons || heroContent?.buttons || [];
  const heroStats = useMemo(() => {
    if (heroContent?.stats && Array.isArray(heroContent.stats) && heroContent.stats.length > 0) {
      return heroContent.stats.map((s: any) => ({
        number: s.number || s.value || '',
        label: s.label || s.title || '',
      }));
    }
    return [];
  }, [heroContent]);

  // Extract borrowing process steps
  const processSteps = useMemo(() => {
    if (borrowingProcessContent?.steps && Array.isArray(borrowingProcessContent.steps) && borrowingProcessContent.steps.length > 0) {
      return borrowingProcessContent.steps.map((step: any) => {
        const iconName = step.icon || step.iconName || 'CheckCircle';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || CheckCircle)
          : (iconName || CheckCircle);
        return {
          number: step.number || step.stepNumber || '',
          title: step.title || '',
          description: step.description || '',
          icon: IconComponent,
        };
      });
    }
    return [];
  }, [borrowingProcessContent]);

  const hasBorrowingProcess = processSteps.length > 0;
  const borrowingProcessTitle = borrowingProcessContent?.title;
  const borrowingProcessDescription = borrowingProcessContent?.description;

  // Extract terms and conditions
  const hasTerms = termsContent?.title || termsContent?.terms?.length > 0;
  const termsTitle = termsContent?.title;
  const termsDescription = termsContent?.description;
  const termsList = termsContent?.terms || [];

  // Extract loan duration options
  const loanDurations = useMemo(() => {
    if (loanDurationContent?.options && Array.isArray(loanDurationContent.options) && loanDurationContent.options.length > 0) {
      return loanDurationContent.options.map((option: any) => ({
        duration: option.duration || option.period || '',
        description: option.description || '',
        interestRate: option.interestRate || '',
        maxAmount: option.maxAmount || '',
        minAmount: option.minAmount || '',
      }));
    }
    return [];
  }, [loanDurationContent]);

  const hasLoanDuration = loanDurations.length > 0;
  const loanDurationTitle = loanDurationContent?.title;
  const loanDurationDescription = loanDurationContent?.description;

  // Extract payment methods
  const paymentMethods = useMemo(() => {
    if (paymentMethodsContent?.methods && Array.isArray(paymentMethodsContent.methods) && paymentMethodsContent.methods.length > 0) {
      return paymentMethodsContent.methods.map((method: any) => {
        const iconName = method.icon || method.iconName || 'CreditCard';
        const IconComponent = typeof iconName === 'string' 
          ? (iconMap[iconName] || CreditCard)
          : (iconName || CreditCard);
        return {
          icon: IconComponent,
          name: method.name || method.title || '',
          description: method.description || '',
          features: Array.isArray(method.features) ? method.features : [],
        };
      });
    }
    return [];
  }, [paymentMethodsContent]);

  const hasPaymentMethods = paymentMethods.length > 0;
  const paymentMethodsTitle = paymentMethodsContent?.title;
  const paymentMethodsDescription = paymentMethodsContent?.description;

  // Extract requirements
  const requirements = useMemo(() => {
    if (requirementsContent?.requirements && Array.isArray(requirementsContent.requirements) && requirementsContent.requirements.length > 0) {
      return requirementsContent.requirements.map((req: any) => ({
        title: req.title || req.name || '',
        description: req.description || '',
        required: req.required !== false,
        documents: Array.isArray(req.documents) ? req.documents : [],
      }));
    }
    return [];
  }, [requirementsContent]);

  const hasRequirements = requirements.length > 0;
  const requirementsTitle = requirementsContent?.title;
  const requirementsDescription = requirementsContent?.description;

  // Extract loan products
  const loanProducts = useMemo(() => {
    if (loanProductsContent?.products && Array.isArray(loanProductsContent.products) && loanProductsContent.products.length > 0) {
      return loanProductsContent.products.map((product: any) => ({
        name: product.name || product.title || '',
        description: product.description || '',
        interestRate: product.interestRate || '',
        maxAmount: product.maxAmount || '',
        minAmount: product.minAmount || '',
        features: Array.isArray(product.features) ? product.features : [],
      }));
    }
    return [];
  }, [loanProductsContent]);

  const hasLoanProducts = loanProducts.length > 0;
  const loanProductsTitle = loanProductsContent?.title;
  const loanProductsDescription = loanProductsContent?.description;

  // Extract contact data
  const hasContactContent = contactContent?.phone || contactContent?.email || business?.contact?.phone || business?.contact?.email;
  const contactPhone = contactContent?.phone || business?.contact?.phone;
  const contactEmail = contactContent?.email || business?.contact?.email;
  const contactTitle = contactContent?.title;
  const contactDescription = contactContent?.description;
  const contactHours = contactContent?.hours || contactContent?.businessHours;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      {hasHeroContent && (
      <section className="relative overflow-hidden pt-24 pb-16 min-h-[90vh] bg-[#0052CC]">
        {/* Background Image */}
        {heroBackgroundImage && (
        <div className="absolute inset-0">
          <img
            src={heroBackgroundImage}
            alt="Microfinance Services"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-[#0052CC]/85"></div>
        </div>
        )}

        {/* Content */}
        <div className="flex relative z-10 items-center px-4 min-h-[90vh]">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
              {/* Left Side - Content */}
              <div className="space-y-6 text-white">
                {/* Badge */}
                {heroBadge && (
                <div className="inline-flex items-center px-4 py-2 text-xs font-semibold text-[#0052CC] bg-[#E8F3FF] rounded-full border border-[#0052CC]/20">
                  <Shield className="mr-2 w-3 h-3" />
                  {heroBadge}
                </div>
                )}

                {/* Main Heading */}
                {heroTitle && (
                <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  {heroSubtitle ? (
                    <>
                      <span className="block text-white">{heroTitle}</span>
                      <span className="block text-[#E8F3FF]">{heroSubtitle}</span>
                    </>
                  ) : (
                    <span className="block text-white">{heroTitle}</span>
                  )}
                </h1>
                )}

                {/* Description */}
                {heroDescription && (
                <p className="max-w-2xl text-base font-normal leading-relaxed text-[#E8F3FF] md:text-lg">
                  {heroDescription}
                </p>
                )}

                {/* Stats */}
                {heroStats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {heroStats.map((stat: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white md:text-3xl">
                        {stat.number}
                      </div>
                      <div className="text-xs font-medium text-[#E8F3FF]/90">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                )}

                {/* CTA Buttons */}
                {heroButtons.length > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row pt-4">
                  {heroButtons.map((button: any, index: number) => (
                    <a
                      key={index}
                      href={button.link || button.href || '#'}
                      className={`px-6 py-3 text-base font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 ${
                        button.style === 'secondary' || index > 0
                          ? 'border-2 backdrop-blur-sm bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 text-white'
                          : 'bg-white text-[#0052CC] hover:bg-[#E8F3FF]'
                      }`}
                    >
                      {button.text || button.label || 'Apply Now'}
                    </a>
                  ))}
                </div>
                )}
              </div>

              {/* Right Side - Hero Image */}
              <div className="relative">
                {heroBackgroundImage ? (
                  <div className="relative mx-auto w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={heroBackgroundImage}
                      alt="Microfinance Services"
                      className="object-cover w-full h-96"
                    />
                  </div>
                ) : (
                  <div className="relative mx-auto w-full max-w-lg">
                    <div className="p-8 rounded-2xl border-2 backdrop-blur-sm bg-white/10 border-white/20">
                      <div className="flex justify-center items-center mb-6 w-20 h-20 mx-auto bg-white rounded-full">
                        <DollarSign className="w-10 h-10 text-[#0052CC]" />
                      </div>
                      <div className="text-center text-white">
                        <div className="mb-2 text-2xl font-bold">Quick & Easy</div>
                        <div className="text-base text-[#E8F3FF]">Loan Application Process</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Borrowing Process Section */}
      {hasBorrowingProcess && (
      <section id="borrowing-process" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-[#0052CC] bg-[#E8F3FF] rounded-full border border-[#0052CC]/20">
              <ArrowRight className="mr-3 w-4 h-4" />
              Simple Application Process
            </div>
            {borrowingProcessTitle && (
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-[#0052CC]">
              {borrowingProcessTitle}
            </h2>
            )}
            {borrowingProcessDescription && (
            <p className="mx-auto max-w-3xl text-lg text-[#777777]">
              {borrowingProcessDescription}
            </p>
            )}
          </div>

          {/* Process Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-12 left-0 right-0 hidden h-0.5 bg-[#E8F3FF] md:block"></div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step: any, index: number) => {
                const StepIcon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Step Number Badge */}
                    <div className="flex absolute -top-4 left-1/2 z-10 justify-center items-center w-12 h-12 text-lg font-bold text-white bg-[#0052CC] rounded-full transform -translate-x-1/2 border-4 border-white">
                      {String(step.number || index + 1)}
                    </div>

                    {/* Step Card */}
                    <div className="overflow-hidden relative p-8 bg-white rounded-2xl border-2 border-gray-100 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-[#0052CC] hover:-translate-y-2">
                      <div className="flex justify-center items-center mb-6 w-16 h-16 mx-auto bg-[#E8F3FF] rounded-full">
                        <StepIcon className="w-8 h-8 text-[#0052CC]" />
                      </div>
                      {step.title && (
                      <h3 className="mb-4 text-xl font-bold text-center text-[#0052CC]">
                        {step.title}
                      </h3>
                      )}
                      {step.description && (
                      <p className="text-center text-[#777777]">
                        {step.description}
                      </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Requirements Section */}
      {hasRequirements && (
      <section id="requirements" data-section className="py-24 bg-[#E8F3FF]">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-[#0052CC] bg-white rounded-full border border-[#0052CC]/20">
              <FileText className="mr-3 w-4 h-4" />
              What You Need
            </div>
            {requirementsTitle && (
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-[#0052CC]">
              {requirementsTitle}
            </h2>
            )}
            {requirementsDescription && (
            <p className="mx-auto max-w-3xl text-lg text-[#777777]">
              {requirementsDescription}
            </p>
            )}
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {requirements.map((req: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden relative p-8 bg-white rounded-2xl border border-[#0052CC]/20 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-[#0052CC]"
              >
                <div className="flex items-center mb-4">
                  {req.required !== false && (
                  <AlertCircle className="mr-3 w-6 h-6 text-red-500" />
                  )}
                  <h3 className="text-xl font-bold text-[#0052CC]">
                    {req.title}
                  </h3>
                </div>
                {req.description && (
                <p className="mb-6 text-[#777777]">
                  {req.description}
                </p>
                )}
                {req.documents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-[#0052CC]">Required Documents:</div>
                  {req.documents.map((doc: string, docIndex: number) => (
                    <div key={docIndex} className="flex items-center text-sm text-[#777777]">
                      <CheckCircle className="mr-2 w-4 h-4 text-[#0052CC]" />
                      {doc}
                    </div>
                  ))}
                </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Loan Duration Section */}
      {hasLoanDuration && (
      <section id="loan-duration" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-[#0052CC] bg-[#E8F3FF] rounded-full border border-[#0052CC]/20">
              <Clock className="mr-3 w-4 h-4" />
              Flexible Terms
            </div>
            {loanDurationTitle && (
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-[#0052CC]">
              {loanDurationTitle}
            </h2>
            )}
            {loanDurationDescription && (
            <p className="mx-auto max-w-3xl text-lg text-[#777777]">
              {loanDurationDescription}
            </p>
            )}
          </div>

          {/* Loan Duration Options */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loanDurations.map((option: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden relative p-8 bg-[#E8F3FF] rounded-2xl border-2 border-[#0052CC]/20 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-[#0052CC] hover:scale-105"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-[#0052CC]">
                    {option.duration}
                  </h3>
                  {option.interestRate && (
                  <div className="px-4 py-2 text-sm font-semibold text-[#0052CC] bg-white rounded-full">
                    {option.interestRate}
                  </div>
                  )}
                </div>
                {option.description && (
                <p className="mb-6 text-[#777777]">
                  {option.description}
                </p>
                )}
                <div className="space-y-2 pt-4 border-t border-[#0052CC]/20">
                  {option.minAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#777777]">Min. Amount:</span>
                    <span className="font-semibold text-[#0052CC]">{option.minAmount}</span>
                  </div>
                  )}
                  {option.maxAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#777777]">Max. Amount:</span>
                    <span className="font-semibold text-[#0052CC]">{option.maxAmount}</span>
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Payment Methods Section */}
      {hasPaymentMethods && (
      <section id="payment-methods" data-section className="py-24 bg-[#E8F3FF]">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-[#0052CC] bg-white rounded-full border border-[#0052CC]/20">
              <CreditCard className="mr-3 w-4 h-4" />
              Payment Options
            </div>
            {paymentMethodsTitle && (
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-[#0052CC]">
              {paymentMethodsTitle}
            </h2>
            )}
            {paymentMethodsDescription && (
            <p className="mx-auto max-w-3xl text-lg text-[#777777]">
              {paymentMethodsDescription}
            </p>
            )}
          </div>

          {/* Payment Methods Grid - Only 3 methods */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {paymentMethods.map((method: any, index: number) => {
              const MethodIcon = method.icon;
              return (
                <div
                  key={index}
                  className="overflow-hidden relative p-8 bg-white rounded-2xl border border-[#0052CC]/20 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-[#0052CC] hover:-translate-y-2"
                >
                  <div className="flex justify-center items-center mb-6 w-16 h-16 mx-auto bg-[#E8F3FF] rounded-full">
                    <MethodIcon className="w-8 h-8 text-[#0052CC]" />
                  </div>
                  {method.name && (
                  <h3 className="mb-4 text-xl font-bold text-center text-[#0052CC]">
                    {method.name}
                  </h3>
                  )}
                  {method.description && (
                  <p className="mb-6 text-center text-[#777777]">
                    {method.description}
                  </p>
                  )}
                  {method.features.length > 0 && (
                  <div className="space-y-2">
                    {method.features.map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-center text-sm text-[#777777]">
                        <CheckCircle className="mr-2 w-4 h-4 text-[#0052CC]" />
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
      )}

      {/* Loan Products Section */}
      {hasLoanProducts && (
      <section id="loan-products" data-section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-[#0052CC] bg-[#E8F3FF] rounded-full border border-[#0052CC]/20">
              <DollarSign className="mr-3 w-4 h-4" />
              Loan Solutions
            </div>
            {loanProductsTitle && (
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-[#0052CC]">
              {loanProductsTitle}
            </h2>
            )}
            {loanProductsDescription && (
            <p className="mx-auto max-w-3xl text-lg text-[#777777]">
              {loanProductsDescription}
            </p>
            )}
          </div>

          {/* Loan Products Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loanProducts.map((product: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden relative p-8 bg-[#0052CC] rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 text-white"
              >
                <h3 className="mb-4 text-2xl font-bold">
                  {product.name}
                </h3>
                {product.description && (
                <p className="mb-6 text-[#E8F3FF]">
                  {product.description}
                </p>
                )}
                <div className="space-y-3 mb-6">
                  {product.interestRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#E8F3FF]">Interest Rate:</span>
                    <span className="text-xl font-bold">{product.interestRate}</span>
                  </div>
                  )}
                  {product.minAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#E8F3FF]">Min. Amount:</span>
                    <span className="font-semibold">{product.minAmount}</span>
                  </div>
                  )}
                  {product.maxAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#E8F3FF]">Max. Amount:</span>
                    <span className="font-semibold">{product.maxAmount}</span>
                  </div>
                  )}
                </div>
                {product.features.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-[#E8F3FF]/30">
                  {product.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center text-sm text-[#E8F3FF]">
                      <CheckCircle className="mr-2 w-4 h-4" />
                      {feature}
                    </div>
                  ))}
                </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Terms and Conditions Section */}
      {hasTerms && (
      <section id="terms" data-section className="py-24 bg-[#E8F3FF]">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-6 py-3 mb-6 text-sm font-semibold text-[#0052CC] bg-white rounded-full border border-[#0052CC]/20">
              <FileText className="mr-3 w-4 h-4" />
              Important Information
            </div>
            {termsTitle && (
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-[#0052CC]">
              {termsTitle}
            </h2>
            )}
            {termsDescription && (
            <p className="mx-auto max-w-3xl text-lg text-[#777777]">
              {termsDescription}
            </p>
            )}
          </div>

          {/* Terms Grid - Two Column Layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {termsList.map((term: any, index: number) => (
              <div
                key={index}
                className="group relative p-6 bg-white rounded-xl border border-[#0052CC]/20 shadow-md transition-all duration-300 hover:shadow-xl hover:border-[#0052CC] hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex justify-center items-center w-10 h-10 bg-[#E8F3FF] rounded-lg">
                      <FileText className="w-5 h-5 text-[#0052CC]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {typeof term === 'string' ? (
                      <p className="text-[#777777] leading-relaxed text-sm">{term}</p>
                    ) : (
                      <>
                        {term.title && (
                        <h3 className="mb-2 text-base font-bold text-[#0052CC] leading-tight">
                          {term.title}
                        </h3>
                        )}
                        {term.description && (
                        <p className="text-[#777777] leading-relaxed text-sm">
                          {term.description}
                        </p>
                        )}
                        {term.text && (
                        <p className="text-[#777777] leading-relaxed text-sm">
                          {term.text}
                        </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Contact Section */}
      {hasContactContent && (
      <section id="contact" data-section className="py-24 bg-[#0052CC]">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            {contactTitle && (
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              {contactTitle}
            </h2>
            )}
            {contactDescription && (
            <p className="mx-auto max-w-3xl text-lg text-[#E8F3FF]">
              {contactDescription}
            </p>
            )}
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Phone Contact */}
            {contactPhone && (
            <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl transition-all duration-500 hover:bg-white/20">
              <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-white rounded-full">
                <Phone className="w-8 h-8 text-[#0052CC]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-center text-white">
                Call Us
              </h3>
              <p className="mb-6 text-center text-[#E8F3FF]">
                Speak directly with our loan specialists
              </p>
              <div className="text-center">
                <a
                  href={`tel:${contactPhone.replace(/\s/g, '')}`}
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[#0052CC] bg-white rounded-xl transition-all duration-300 hover:bg-[#E8F3FF] hover:scale-105"
                >
                  <Phone className="mr-3 w-5 h-5" />
                  {contactPhone}
                </a>
              </div>
            </div>
            )}

            {/* Email Contact */}
            {contactEmail && (
            <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl transition-all duration-500 hover:bg-white/20">
              <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 bg-white rounded-full">
                <Mail className="w-8 h-8 text-[#0052CC]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-center text-white">
                Email Us
              </h3>
              <p className="mb-6 text-center text-[#E8F3FF]">
                Send us your questions and application requests
              </p>
              <div className="text-center">
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[#0052CC] bg-white rounded-xl transition-all duration-300 hover:bg-[#E8F3FF] hover:scale-105"
                >
                  <Mail className="mr-3 w-5 h-5" />
                  {contactEmail}
                </a>
              </div>
            </div>
            )}
          </div>

          {/* Business Hours */}
          {contactHours && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Clock className="mr-3 w-4 h-4" />
              {typeof contactHours === 'string' ? (
                <span>{contactHours}</span>
              ) : Array.isArray(contactHours) ? (
                <div className="space-y-1">
                  {contactHours.map((hour: any, index: number) => (
                    <div key={index}>
                      {hour.label || hour.day || ''}: {hour.hours || hour.time || ''}
                    </div>
                  ))}
                </div>
              ) : (
                <span>{contactHours}</span>
              )}
            </div>
          </div>
          )}
        </div>
      </section>
      )}

    </div>
  );
}

export default MicroFinanceTemplate;

