# Livestock Template POST Command Example

This document shows how to POST all the current template data to the database for a livestock business.

## Endpoint
```
POST /api/businesses/{businessId}/content
```

## Example POST Request

```bash
curl -X POST http://localhost:3000/api/businesses/YOUR_BUSINESS_ID/content \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
[
  {
    "type": "hero",
    "content": {
      "title": "Cattle",
      "subtitle": "Farm",
      "description": "Three generations of sustainable livestock farming. We raise premium cattle, dairy cows, sheep, and poultry with the highest standards of animal welfare.",
      "badge": "Premium Livestock Ranch",
      "backgroundImage": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&h=1080&fit=crop",
      "ctaButtons": [
        {
          "text": "Schedule Ranch Tour",
          "link": "#contact",
          "style": "primary"
        },
        {
          "text": "View Our Animals",
          "link": "#livestock",
          "style": "secondary"
        }
      ],
      "stats": [
        {
          "icon": "Award",
          "title": "Premium Quality",
          "description": "Carefully selected livestock for superior products",
          "value": "Grade A"
        },
        {
          "icon": "Heart",
          "title": "Animal Care",
          "description": "Ethical and humane livestock management",
          "value": "Priority"
        },
        {
          "icon": "Shield",
          "title": "Fresh Products",
          "description": "Farm-to-table freshness guaranteed",
          "value": "Daily"
        },
        {
          "icon": "Users",
          "title": "Local Business",
          "description": "Supporting the community with quality livestock",
          "value": "Trusted"
        }
      ]
    }
  },
  {
    "type": "operations",
    "content": {
      "title": "Sustainable Livestock Excellence",
      "subtitle": "Livestock",
      "description": "Livestock farming for beef and dairy production, supporting regional food security and contributing to local meat processing industries.",
      "farmName": "Cattle Farm",
      "farmType": "Premium Beef & Dairy",
      "ctaText": "Explore Cattle Products",
      "products": [
        {
          "name": "Premium Beef Cuts",
          "category": "Beef Products",
          "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400",
          "description": "High-quality beef from grass-fed cattle supporting regional food security",
          "price": "$18/lb",
          "icon": "Beef",
          "features": ["Grass-Fed", "Local Processing", "Premium Cuts"]
        },
        {
          "name": "Fresh Dairy Products",
          "category": "Dairy",
          "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
          "description": "Farm-fresh milk and dairy products from our healthy cattle herd",
          "price": "$6/gallon",
          "icon": "Heart",
          "features": ["Raw Milk Available", "Hormone-Free", "Daily Fresh"]
        },
        {
          "name": "Breeding Stock",
          "category": "Livestock",
          "image": "https://agtech.folio3.com/wp-content/uploads/2023/04/livestock-breeding.png",
          "description": "Quality breeding cattle for expanding livestock operations",
          "price": "Contact for pricing",
          "icon": "Award",
          "features": ["Registered Stock", "Health Certified", "Genetic Testing"]
        }
      ],
      "stats": [
        {
          "value": "200+",
          "label": "Head of Cattle"
        },
        {
          "value": "100%",
          "label": "Grass Fed"
        }
      ]
    }
  },
  {
    "type": "livestockCategories",
    "content": {
      "title": "Heritage Livestock Excellence",
      "description": "Premium breeds raised with care in natural environments for optimal health and quality, supporting sustainable agriculture.",
      "categories": [
        {
          "name": "Beef Cattle",
          "image": "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
          "description": "Premium beef cattle raised with sustainable farming practices for exceptional meat quality and taste",
          "breeds": ["Angus", "Hereford", "Charolais", "Simmental"],
          "specialty": "Grass-Fed Beef",
          "features": ["Grass-Fed", "Open Pasture", "USDA Certified"],
          "icon": "Home"
        },
        {
          "name": "Dairy Cattle",
          "image": "https://www.allaboutfeed.net/app/uploads/2020/12/001_723_IMG_shutterstock_web.jpg",
          "description": "High-quality dairy cattle focused on milk production with superior animal welfare standards",
          "breeds": ["Holstein", "Jersey", "Guernsey", "Brown Swiss"],
          "specialty": "Fresh Dairy",
          "features": ["Hormone-Free", "Daily Milking", "Quality Tested"],
          "icon": "Heart"
        }
      ]
    }
  },
  {
    "type": "services",
    "content": {
      "title": "Our Services",
      "description": "Comprehensive livestock services from breeding to processing, ensuring quality at every step.",
      "services": [
        {
          "title": "Beef Production",
          "description": "Premium beef cattle farming supporting regional food security and local meat processing industries",
          "icon": "Heart",
          "features": ["Grass-Fed Cattle", "Quality Genetics", "Sustainable Practices"]
        },
        {
          "title": "Dairy Production",
          "description": "High-quality dairy farming operations contributing to regional food security and local dairy processing",
          "icon": "Shield",
          "features": ["Fresh Daily Milk", "Hormone-Free", "Quality Standards"]
        },
        {
          "title": "Regional Food Security",
          "description": "Supporting local communities with reliable livestock production for sustained food supply",
          "icon": "TreePine",
          "features": ["Local Supply Chain", "Community Partnership", "Food Safety"]
        },
        {
          "title": "Meat Processing Support",
          "description": "Contributing to local meat processing industries with consistent, high-quality livestock supply",
          "icon": "Truck",
          "features": ["Industry Partnership", "Quality Assurance", "Timely Delivery"]
        }
      ]
    }
  },
  {
    "type": "regionalImpact",
    "content": {
      "title": "Supporting Regional Food Security",
      "description": "Our livestock operations play a vital role in strengthening regional food systems and contributing to local meat processing industries, ensuring sustainable food security for our communities.",
      "foodSecurityTitle": "Food Security Impact",
      "processingTitle": "Local Processing Partnership",
      "foodSecurityPoints": [
        {
          "title": "Local Supply Chain",
          "description": "Reducing dependency on distant suppliers by providing fresh, high-quality meat products directly to regional markets and communities."
        },
        {
          "title": "Sustainable Practices",
          "description": "Implementing environmentally responsible farming methods that ensure long-term food production capabilities."
        },
        {
          "title": "Community Resilience",
          "description": "Building stronger local food systems that can withstand supply chain disruptions and economic challenges."
        }
      ],
      "processingPartnershipPoints": [
        {
          "title": "Industry Support",
          "description": "Partnering with local meat processing facilities to create jobs and strengthen the regional agricultural economy."
        },
        {
          "title": "Quality Standards",
          "description": "Maintaining the highest processing standards to ensure safe, premium meat products for consumers."
        },
        {
          "title": "Economic Growth",
          "description": "Contributing to local economic development through direct partnerships and supporting related businesses in the supply chain."
        }
      ],
      "stats": [
        {
          "value": "Premium",
          "title": "Quality Standards"
        },
        {
          "value": "Fresh",
          "title": "Daily Products"
        },
        {
          "value": "Local",
          "title": "Community Focus"
        },
        {
          "value": "Trusted",
          "title": "Service Provider"
        }
      ]
    }
  },
  {
    "type": "contact",
    "content": {
      "title": "Contact Us",
      "description": "Ready to experience premium livestock products? Get in touch with our team for orders, inquiries, or ranch visits.",
      "phone": "+1 (555) 321-6547",
      "email": "ranch@bundufarms.com",
      "hours": [
        {
          "label": "Ranch Tours",
          "hours": "Saturdays: 10:00 AM - 3:00 PM"
        },
        {
          "label": "Farm Store",
          "hours": "Daily: 8:00 AM - 6:00 PM"
        }
      ]
    }
  }
]
EOF
```

## Available Icon Names

The following icon names can be used in the `icon` field:
- `Home`
- `Heart`
- `Shield`
- `Truck`
- `Award`
- `Users`
- `Egg`
- `Beef`
- `Star`
- `Factory`
- `TreePine`
- `Clock`
- `Phone`
- `Mail`

## Important Notes

1. **No Fallbacks**: All sections will only render if data exists in the database. If a section has no data, it will not appear on the page.

2. **Section Types**: The template supports these section types:
   - `hero` - Hero section with title, description, background image, buttons, and stats
   - `operations` - Farm operations section with products and farm information
   - `livestockCategories` - Livestock categories with breeds and features
   - `services` - Ranch services section
   - `regionalImpact` - Regional impact section with food security and processing partnership info
   - `contact` - Contact information section

3. **Image URLs**: Images can be provided as:
   - Direct URL strings: `"https://example.com/image.jpg"`
   - MediaAsset objects: `{"url": "https://example.com/image.jpg", "originalName": "image.jpg"}`

4. **Required Fields**: 
   - Each section only needs the fields you want to display
   - Empty arrays or missing fields will result in those elements not rendering
   - At minimum, provide a `title` or `description` for a section to appear

5. **Business Contact Fallback**: The contact section will fall back to `business.contact.phone` and `business.contact.email` if not provided in the content section.

## Using with JavaScript/TypeScript

```typescript
const businessId = 'YOUR_BUSINESS_ID';

const response = await fetch(`/api/businesses/${businessId}/content`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify([
    {
      type: 'hero',
      content: {
        title: 'Cattle',
        subtitle: 'Farm',
        // ... rest of hero content
      }
    },
    // ... other sections
  ])
});

const result = await response.json();
console.log(result);
```

