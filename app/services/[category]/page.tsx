import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Business } from '@/lib/types';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

interface CategoryPageData {
  businesses: Business[];
  category: string;
  categoryTitle: string;
}

// Category mapping for better display names
const CATEGORY_MAPPINGS: Record<string, string> = {
  'automotive': 'Automotive Services',
  'retail': 'Retail Stores',
  'restaurants': 'Restaurants & Food',
  'food': 'Restaurants & Food',
  'real-estate': 'Real Estate',
  'hospitality': 'Hotels & Hospitality',
  'healthcare': 'Healthcare & Pharmacy',
  'agriculture': 'Agriculture & Farming',
  'farming': 'Agriculture & Farming',
  'gas-stations': 'Gas Stations',
  'hotels': 'Hotels & Resorts'
};

async function getCategoryBusinesses(category: string): Promise<CategoryPageData | null> {
  try {
    // Fetch from API instead of direct database access
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/businesses?status=active`, {
      cache: 'no-store' // Ensure fresh data on each request
    });
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return null;
    }

    // Filter businesses by industry or template that matches the category
    const filteredBusinesses = result.data.filter((business: Business) => {
      const normalizedCategory = category.toLowerCase().replace('-', ' ');
      const normalizedIndustry = business.industry.toLowerCase().replace(' ', '-');
      const normalizedTemplate = business.template.toLowerCase();
      
      // Match by industry, template, or category name variations
      return (
        normalizedIndustry === category ||
        normalizedTemplate === category ||
        normalizedIndustry.includes(normalizedCategory) ||
        normalizedTemplate.includes(normalizedCategory) ||
        business.industry.toLowerCase().includes(normalizedCategory) ||
        (category === 'restaurants' && business.industry.toLowerCase().includes('food')) ||
        (category === 'food' && business.industry.toLowerCase().includes('restaurant')) ||
        (category === 'gas-stations' && business.template === 'gas-station') ||
        (category === 'hotels' && (business.template === 'hotel' || business.template === 'hotel-resort'))
      );
    });

    const categoryTitle = CATEGORY_MAPPINGS[category] || 
                         category.split('-').map(word => 
                           word.charAt(0).toUpperCase() + word.slice(1)
                         ).join(' ');

    return {
      businesses: JSON.parse(JSON.stringify(filteredBusinesses)),
      category,
      categoryTitle
    };
  } catch (error) {
    console.error('Error fetching category businesses:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const data = await getCategoryBusinesses(category);
  
  if (!data) {
    return {
      title: 'Category Not Found',
      description: 'The requested service category could not be found.'
    };
  }
  
  const { categoryTitle, businesses } = data;
  
  return {
    title: `${categoryTitle} - ZeeBundu Business Directory`,
    description: `Discover ${businesses.length} exceptional ${categoryTitle.toLowerCase()} businesses. Find premium services and top-rated providers in your area.`,
    keywords: [categoryTitle.toLowerCase(), 'business directory', 'services', 'local businesses'].join(', '),
    openGraph: {
      title: `${categoryTitle} - ZeeBundu`,
      description: `${businesses.length} ${categoryTitle.toLowerCase()} businesses available`,
      type: 'website',
    }
  };
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const data = await getCategoryBusinesses(category);
  
  if (!data || data.businesses.length === 0) {
    notFound();
  }
  
  const { businesses, categoryTitle } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900/50 to-purple-900/50">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                {categoryTitle}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Discover {businesses.length} exceptional {categoryTitle.toLowerCase()} businesses 
              committed to excellence and innovation.
            </p>

            {/* Category Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{businesses.length}</div>
                <div className="text-sm text-white/70">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {new Set(businesses.map(b => b.template)).size}
                </div>
                <div className="text-sm text-white/70">Service Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.8★</div>
                <div className="text-sm text-white/70">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {businesses.map((business, index) => (
              <Link
                key={business.slug}
                href={`/business/${business.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Business Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      {business.industry}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white mb-1">{business.name}</h3>
                    <p className="text-sm text-white/80 capitalize">{business.template.replace('-', ' ')}</p>
                  </div>
                </div>
                
                {/* Business Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {business.description}
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {business.contact.phone && (
                      <p className="text-sm text-gray-500">📞 {business.contact.phone}</p>
                    )}
                    {business.contact.address && (
                      <p className="text-sm text-gray-500">📍 {business.contact.address}</p>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Learn More
                    </span>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300">
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back to Categories */}
          <div className="text-center mt-16">
            <Link 
              href="/#businesses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}