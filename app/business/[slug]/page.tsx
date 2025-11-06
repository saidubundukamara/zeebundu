import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BusinessService } from '@/lib/services/BusinessService';
import { ContentRepository } from '@/lib/repositories/ContentRepository';
import { Business, BusinessContent } from '@/lib/types';

// Business template components
import { GasStationTemplate } from '@/components/business-templates/GasStationTemplate';
import { HotelTemplate } from '@/components/business-templates/HotelTemplate';
import { FarmingTemplate } from '@/components/business-templates/FarmingTemplate';
import { PharmacyTemplate } from '@/components/business-templates/PharmacyTemplate';
import { ConstructionMaterialsTemplate } from '@/components/business-templates/ConstructionMaterialsTemplate';
import { ForeignExchangTemplate } from '@/components/business-templates/ForeignExchangeTemplate';
import { LivestockTemplate } from '@/components/business-templates/LivestockTemplate';
import { SalonTemplate } from '@/components/business-templates/SalonTemplate';
import { WaterProductionTemplate } from '@/components/business-templates/WaterProductionTemplate';
import { MicroFinanceTemplate } from '@/components/business-templates/MicroFinanceTemplate';
import { ComingSoonOverlay } from '@/components/shared/ComingSoonOverlay';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface BusinessPageData {
  business: Business;
  content: BusinessContent;
}

async function getBusinessData(slug: string): Promise<BusinessPageData | null> {
  try {
    const businessService = new BusinessService();
    const contentRepository = new ContentRepository();
    
    // Get business by slug (only active businesses for public access)
    const businessResult = await businessService.getBusinessBySlug(slug);
    
    if (!businessResult.success || !businessResult.data) {
      return null;
    }
    
    const business = businessResult.data;
    
    // Get business content
    const contentStructure = await contentRepository.getBusinessContentStructure(business._id!);
    
    return {
      business: JSON.parse(JSON.stringify(business)),
      content: JSON.parse(JSON.stringify(contentStructure))
    };
  } catch (error) {
    console.error('Error fetching business data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBusinessData(slug);
  
  if (!data) {
    return {
      title: 'Business Not Found',
      description: 'The requested business page could not be found.'
    };
  }
  
  const { business } = data;
  
  return {
    title: business.seo?.metaTitle || `${business.name} - Professional Services`,
    description: business.seo?.metaDescription || business.description,
    keywords: business.seo?.keywords?.join(', ') || undefined,
    openGraph: {
      title: business.seo?.metaTitle || business.name,
      description: business.seo?.metaDescription || business.description,
      type: 'website',
      images: business.seo?.ogImage ? [business.seo.ogImage] : undefined,
    },
    alternates: {
      canonical: business.seo?.canonicalUrl,
    }
  };
}

function getTemplateComponent(templateName: string) {
  const templates = {
    'gas-station': GasStationTemplate,
    'hotel': HotelTemplate,
    'hotel-resort': HotelTemplate,
    'farming': FarmingTemplate,
    'agriculture': FarmingTemplate,
    'pharmacy': PharmacyTemplate,
    'healthcare': PharmacyTemplate,
    'construction': ConstructionMaterialsTemplate,
    'livestock': LivestockTemplate,
    'foreign-exchange': ForeignExchangTemplate,
    'salon': SalonTemplate,
    'water-production': WaterProductionTemplate,
    'micro-finance': MicroFinanceTemplate,
    'lending': MicroFinanceTemplate,
    'microfinance': MicroFinanceTemplate,
  };
  
  return templates[templateName as keyof typeof templates];
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBusinessData(slug);
  
  if (!data) {
    notFound();
  }
  
  const { business, content } = data;
  
  // Get the appropriate template component
  const TemplateComponent = getTemplateComponent(business.template);
  
  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <p className="text-gray-600">
            The template "{business.template}" is not yet available.
          </p>
        </div>
      </div>
    );
  }
  
  // Apply business branding via CSS custom properties
  const brandingStyles = {
    '--brand-primary': business.branding?.primaryColor || '#3B82F6',
    '--brand-secondary': business.branding?.secondaryColor || '#06B6D4',
  } as React.CSSProperties;
  
  const isComingSoon = business.status === 'coming-soon';
  
  return (
    <main style={brandingStyles} className={isComingSoon ? 'relative' : ''}>
      {isComingSoon && (
        <ComingSoonOverlay businessName={business.name} />
      )}
      <div className={isComingSoon ? 'blur-[2px] pointer-events-none' : ''}>
        <TemplateComponent 
          business={business}
          content={content as any}
          template={{
            name: business.template,
            slug: business.template,
            component: TemplateComponent.name,
            displayName: business.template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Template for ${business.industry} businesses`,
            category: business.industry,
            isActive: true,
            sections: [],
            colorScheme: 'default',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any}
        />
      </div>
    </main>
  );
}