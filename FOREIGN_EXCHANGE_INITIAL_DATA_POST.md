# Foreign Exchange Template - Initial Data POST Request

Use this POST request to populate the initial data for a Foreign Exchange business in the admin panel.

## Base URL
```
POST /api/businesses/{businessId}/content
```

Replace `{businessId}` with your actual MongoDB ObjectId.

## Complete Initial Data POST Request

```bash
curl -X POST http://localhost:3000/api/businesses/{businessId}/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "hero",
        "content": {
          "title": "Professional Currency",
          "subtitle": "Exchange Services",
          "description": "Trusted foreign exchange and international remittance services through our network of 7 licensed FX bureaus and authorized vendor partners across the region.",
          "badges": ["Licensed & Regulated FX Bureau"],
          "ctaButtons": [
            {
              "text": "Learn More",
              "link": "#services",
              "style": "primary"
            },
            {
              "text": "View Exchange Rates",
              "link": "#exchange-rates",
              "style": "secondary"
            }
          ],
          "backgroundImage": "",
          "overlay": {
            "enabled": true,
            "color": "#000000",
            "opacity": 50
          },
          "textAlign": "center",
          "style": {
            "titleSize": "lg",
            "titleColor": "#ffffff",
            "descriptionColor": "#e5e7eb",
            "backgroundColor": "#1f2937"
          }
        }
      },
      {
        "type": "exchangeRates",
        "content": {
          "title": "Today'\''s Rates",
          "description": "Competitive foreign exchange rates available at all our bureau locations. Visit us for the most current rates and personalized service.",
          "currencies": [
            {
              "currency": "US Dollar",
              "code": "USD",
              "flag": "🇺🇸",
              "buyRate": "19.50",
              "sellRate": "19.80",
              "change": "+0.15"
            },
            {
              "currency": "Euro",
              "code": "EUR",
              "flag": "🇪🇺",
              "buyRate": "21.20",
              "sellRate": "21.55",
              "change": "+0.08"
            },
            {
              "currency": "British Pound",
              "code": "GBP",
              "flag": "🇬🇧",
              "buyRate": "24.80",
              "sellRate": "25.20",
              "change": "-0.12"
            },
            {
              "currency": "Nigerian Naira",
              "code": "NGN",
              "flag": "🇳🇬",
              "buyRate": "0.025",
              "sellRate": "0.028",
              "change": "+0.001"
            },
            {
              "currency": "Ghanaian Cedi",
              "code": "GHS",
              "flag": "🇬🇭",
              "buyRate": "1.65",
              "sellRate": "1.72",
              "change": "+0.03"
            },
            {
              "currency": "CFA Franc",
              "code": "XOF",
              "flag": "🌍",
              "buyRate": "0.032",
              "sellRate": "0.035",
              "change": "+0.001"
            }
          ]
        }
      },
      {
        "type": "services",
        "content": {
          "title": "What We Offer",
          "description": "Comprehensive foreign exchange and international remittance services through our established network of licensed bureaus and authorized partners.",
          "services": [
            {
              "name": "Currency Exchange",
              "title": "Currency Exchange",
              "description": "Buy and sell foreign currencies at competitive rates across our 7 bureau locations",
              "icon": "DollarSign"
            },
            {
              "name": "Money Remittance",
              "title": "Money Remittance",
              "description": "Send money internationally through our secure remittance network",
              "icon": "Globe"
            },
            {
              "name": "Licensed Operations",
              "title": "Licensed Operations",
              "description": "Fully licensed and regulated FX bureau services with complete compliance",
              "icon": "Shield"
            },
            {
              "name": "Vendor Network",
              "title": "Vendor Network",
              "description": "Extended access through our network of licensed subcontracted vendors",
              "icon": "TrendingUp"
            }
          ]
        }
      },
      {
        "type": "stats",
        "content": {
          "title": "Our Statistics",
          "description": "",
          "stats": [
            {
              "value": "Different",
              "label": "Currencies Available"
            },
            {
              "value": "10K+",
              "label": "Monthly Exchanges"
            },
            {
              "value": "Licensed",
              "label": "& Regulated"
            }
          ]
        }
      },
      {
        "type": "contact",
        "content": {
          "title": "Contact Our Experts",
          "description": "Experience personalized service at any of our licensed FX bureau locations. Contact us for current rates and professional assistance with your currency exchange needs.",
          "phone": "+1 (234) 567-8900",
          "email": "info@fxbureau.com",
          "hours": "Available Monday - Friday, 9 AM - 6 PM",
          "address": ""
        }
      }
    ]
  }'
```

## JavaScript/TypeScript Fetch Example

```javascript
const businessId = 'YOUR_BUSINESS_ID_HERE';

const response = await fetch(`/api/businesses/${businessId}/content`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sections: [
      {
        type: 'hero',
        content: {
          title: 'Professional Currency',
          subtitle: 'Exchange Services',
          description: 'Trusted foreign exchange and international remittance services through our network of 7 licensed FX bureaus and authorized vendor partners across the region.',
          badges: ['Licensed & Regulated FX Bureau'],
          ctaButtons: [
            {
              text: 'Learn More',
              link: '#services',
              style: 'primary'
            },
            {
              text: 'View Exchange Rates',
              link: '#exchange-rates',
              style: 'secondary'
            }
          ],
          backgroundImage: '',
          overlay: {
            enabled: true,
            color: '#000000',
            opacity: 50
          },
          textAlign: 'center',
          style: {
            titleSize: 'lg',
            titleColor: '#ffffff',
            descriptionColor: '#e5e7eb',
            backgroundColor: '#1f2937'
          }
        }
      },
      {
        type: 'exchangeRates',
        content: {
          title: "Today's Rates",
          description: 'Competitive foreign exchange rates available at all our bureau locations. Visit us for the most current rates and personalized service.',
          currencies: [
            {
              currency: 'US Dollar',
              code: 'USD',
              flag: '🇺🇸',
              buyRate: '19.50',
              sellRate: '19.80',
              change: '+0.15'
            },
            {
              currency: 'Euro',
              code: 'EUR',
              flag: '🇪🇺',
              buyRate: '21.20',
              sellRate: '21.55',
              change: '+0.08'
            },
            {
              currency: 'British Pound',
              code: 'GBP',
              flag: '🇬🇧',
              buyRate: '24.80',
              sellRate: '25.20',
              change: '-0.12'
            },
            {
              currency: 'Nigerian Naira',
              code: 'NGN',
              flag: '🇳🇬',
              buyRate: '0.025',
              sellRate: '0.028',
              change: '+0.001'
            },
            {
              currency: 'Ghanaian Cedi',
              code: 'GHS',
              flag: '🇬🇭',
              buyRate: '1.65',
              sellRate: '1.72',
              change: '+0.03'
            },
            {
              currency: 'CFA Franc',
              code: 'XOF',
              flag: '🌍',
              buyRate: '0.032',
              sellRate: '0.035',
              change: '+0.001'
            }
          ]
        }
      },
      {
        type: 'services',
        content: {
          title: 'What We Offer',
          description: 'Comprehensive foreign exchange and international remittance services through our established network of licensed bureaus and authorized partners.',
          services: [
            {
              name: 'Currency Exchange',
              title: 'Currency Exchange',
              description: 'Buy and sell foreign currencies at competitive rates across our 7 bureau locations',
              icon: 'DollarSign'
            },
            {
              name: 'Money Remittance',
              title: 'Money Remittance',
              description: 'Send money internationally through our secure remittance network',
              icon: 'Globe'
            },
            {
              name: 'Licensed Operations',
              title: 'Licensed Operations',
              description: 'Fully licensed and regulated FX bureau services with complete compliance',
              icon: 'Shield'
            },
            {
              name: 'Vendor Network',
              title: 'Vendor Network',
              description: 'Extended access through our network of licensed subcontracted vendors',
              icon: 'TrendingUp'
            }
          ]
        }
      },
      {
        type: 'stats',
        content: {
          title: 'Our Statistics',
          description: '',
          stats: [
            {
              value: 'Different',
              label: 'Currencies Available'
            },
            {
              value: '10K+',
              label: 'Monthly Exchanges'
            },
            {
              value: 'Licensed',
              label: '& Regulated'
            }
          ]
        }
      },
      {
        type: 'contact',
        content: {
          title: 'Contact Our Experts',
          description: 'Experience personalized service at any of our licensed FX bureau locations. Contact us for current rates and professional assistance with your currency exchange needs.',
          phone: '+1 (234) 567-8900',
          email: 'info@fxbureau.com',
          hours: 'Available Monday - Friday, 9 AM - 6 PM',
          address: ''
        }
      }
    ]
  })
});

const result = await response.json();
console.log('Content saved:', result);
```

## Quick Copy-Paste cURL (Single Line)

Replace `{businessId}` with your actual business ID:

```bash
curl -X POST http://localhost:3000/api/businesses/{businessId}/content -H "Content-Type: application/json" -d '{"sections":[{"type":"hero","content":{"title":"Professional Currency","subtitle":"Exchange Services","description":"Trusted foreign exchange and international remittance services through our network of 7 licensed FX bureaus and authorized vendor partners across the region.","badges":["Licensed & Regulated FX Bureau"],"ctaButtons":[{"text":"Learn More","link":"#services","style":"primary"},{"text":"View Exchange Rates","link":"#exchange-rates","style":"secondary"}]}},{"type":"exchangeRates","content":{"title":"Today'\''s Rates","description":"Competitive foreign exchange rates available at all our bureau locations. Visit us for the most current rates and personalized service.","currencies":[{"currency":"US Dollar","code":"USD","flag":"🇺🇸","buyRate":"19.50","sellRate":"19.80","change":"+0.15"},{"currency":"Euro","code":"EUR","flag":"🇪🇺","buyRate":"21.20","sellRate":"21.55","change":"+0.08"},{"currency":"British Pound","code":"GBP","flag":"🇬🇧","buyRate":"24.80","sellRate":"25.20","change":"-0.12"},{"currency":"Nigerian Naira","code":"NGN","flag":"🇳🇬","buyRate":"0.025","sellRate":"0.028","change":"+0.001"},{"currency":"Ghanaian Cedi","code":"GHS","flag":"🇬🇭","buyRate":"1.65","sellRate":"1.72","change":"+0.03"},{"currency":"CFA Franc","code":"XOF","flag":"🌍","buyRate":"0.032","sellRate":"0.035","change":"+0.001"}]}},{"type":"services","content":{"title":"What We Offer","description":"Comprehensive foreign exchange and international remittance services through our established network of licensed bureaus and authorized partners.","services":[{"name":"Currency Exchange","title":"Currency Exchange","description":"Buy and sell foreign currencies at competitive rates across our 7 bureau locations","icon":"DollarSign"},{"name":"Money Remittance","title":"Money Remittance","description":"Send money internationally through our secure remittance network","icon":"Globe"},{"name":"Licensed Operations","title":"Licensed Operations","description":"Fully licensed and regulated FX bureau services with complete compliance","icon":"Shield"},{"name":"Vendor Network","title":"Vendor Network","description":"Extended access through our network of licensed subcontracted vendors","icon":"TrendingUp"}]}},{"type":"stats","content":{"title":"Our Statistics","description":"","stats":[{"value":"Different","label":"Currencies Available"},{"value":"10K+","label":"Monthly Exchanges"},{"value":"Licensed","label":"& Regulated"}]}},{"type":"contact","content":{"title":"Contact Our Experts","description":"Experience personalized service at any of our licensed FX bureau locations. Contact us for current rates and professional assistance with your currency exchange needs.","phone":"+1 (234) 567-8900","email":"info@fxbureau.com","hours":"Available Monday - Friday, 9 AM - 6 PM","address":""}}]}'
```

## What This Includes

1. **Hero Section**: Title, subtitle, description, badges, and CTA buttons
2. **Exchange Rates Section**: 6 sample currencies with buy/sell rates
3. **Services Section**: 4 FX services with descriptions
4. **Stats Section**: 3 business statistics
5. **Contact Section**: Phone, email, and hours

## After Running This

1. Go to your admin panel: `/admin/businesses/{businessId}/content`
2. You should see all sections populated with this data
3. You can edit any section through the admin interface
4. The Exchange Rates tab will show 6 currencies ready to edit

## Notes

- Replace `{businessId}` with your actual MongoDB ObjectId
- Update the phone, email, and other contact details to match your business
- Adjust currency rates to match your actual rates
- Modify service descriptions as needed
- All data will be editable through the admin panel after saving

