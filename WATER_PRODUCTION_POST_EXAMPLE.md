# Water Production Template - POST Command Example

This document shows how to send data to the database for the Water Production template. All sections are optional - if no data is provided, the section will not appear on the page.

**NEW**: The `products` and `process` sections are now available in the admin panel! You can edit them directly from `/admin/businesses/{businessId}/content`.

## API Endpoint

```
POST /api/businesses/{businessId}/content
```

Replace `{businessId}` with your actual business ID.

## Complete Example

```bash
curl -X POST http://localhost:3000/api/businesses/YOUR_BUSINESS_ID/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "hero",
        "content": {
          "title": "CRYSTAL PURE",
          "subtitle": "Water Production",
          "description": "State-of-the-art water purification and bottling facility delivering premium quality water through advanced filtration technology and rigorous quality control.",
          "badge": "Premium Water Production Facility",
          "backgroundImage": {
            "url": "https://example.com/hero-background.jpg"
          },
          "ctaButtons": [
            {
              "text": "Order Water Supply",
              "link": "#contact",
              "style": "primary",
              "icon": "Truck"
            },
            {
              "text": "Quality Certification",
              "link": "#process",
              "style": "secondary",
              "icon": "Shield"
            }
          ],
          "stats": [
            {
              "number": "50K+",
              "label": "Liters/Day"
            },
            {
              "number": "99.9%",
              "label": "Purity Level"
            },
            {
              "number": "24/7",
              "label": "Production"
            }
          ]
        }
      },
      {
        "type": "products",
        "content": {
          "title": "PREMIUM WATER SOLUTIONS",
          "subtitle": "Production Line Portfolio",
          "description": "Advanced purification technology meets diverse market demands through our comprehensive product range",
          "products": [
            {
              "category": "Bottled Water",
              "name": "Bottled Water",
              "description": "Pure, refreshing bottled water in various sizes",
              "image": {
                "url": "https://www.coldist.com/wp-content/uploads/2021/11/Bottled-water.jpg"
              },
              "sizes": [
                "500ml Bottles",
                "1L Bottles",
                "1.5L Bottles",
                "5L Containers"
              ],
              "icon": "Droplets"
            },
            {
              "category": "Bulk Water Supply",
              "name": "Bulk Water Supply",
              "description": "Large volume water supply for businesses and events",
              "image": {
                "url": "https://media.istockphoto.com/id/1096008526/photo/many-packaged-blue-mineral-water-bottles.jpg"
              },
              "sizes": [
                "20L Dispensers",
                "200L Drums",
                "Tanker Delivery",
                "Custom Volumes"
              ],
              "icon": "Truck"
            },
            {
              "category": "Purified Water",
              "name": "Purified Water",
              "description": "Advanced purification for premium quality water",
              "image": {
                "url": "https://alexasprings.com/wp-content/uploads/2016/11/purified-vs-spring.jpg"
              },
              "sizes": [
                "Reverse Osmosis",
                "UV Treated",
                "Mineral Enhanced",
                "Alkaline Water"
              ],
              "icon": "Shield"
            },
            {
              "category": "Custom Solutions",
              "name": "Custom Solutions",
              "description": "Tailored water solutions for specific industry needs",
              "image": {
                "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6yCRWmrVh2WTRFWolhWRGIqPwt555VYxvtw&s"
              },
              "sizes": [
                "Private Labeling",
                "Custom Packaging",
                "Special Formulations",
                "Delivery Plans"
              ],
              "icon": "Users"
            }
          ]
        }
      },
      {
        "type": "services",
        "content": {
          "title": "Premium Services",
          "description": "Experience excellence in water production with our comprehensive suite of industrial-grade services and quality assurance",
          "services": [
            {
              "name": "Delivery Service",
              "title": "Delivery Service",
              "description": "Reliable water delivery to homes, offices, and businesses",
              "icon": "Truck"
            },
            {
              "name": "Quality Testing",
              "title": "Quality Testing",
              "description": "Regular quality control and purity testing for all products",
              "icon": "Shield"
            },
            {
              "name": "Bulk Orders",
              "title": "Bulk Orders",
              "description": "Special pricing and scheduling for large volume orders",
              "icon": "Users"
            },
            {
              "name": "Subscription Service",
              "title": "Subscription Service",
              "description": "Regular delivery subscriptions for consistent water supply",
              "icon": "Clock"
            }
          ]
        }
      },
      {
        "type": "process",
        "content": {
          "title": "Production Steps",
          "description": "Follow our step-by-step process as each stage descends through our precision production line",
          "steps": [
            {
              "number": "01",
              "stepNumber": 1,
              "title": "Source Water Collection",
              "subtitle": "First Step",
              "description": "Premium source water from protected aquifers and natural springs, ensuring the purest foundation for our production process.",
              "icon": "Droplets"
            },
            {
              "number": "02",
              "stepNumber": 2,
              "title": "Advanced Purification",
              "subtitle": "Second Step",
              "description": "Advanced multi-stage filtration and purification technology removes impurities while preserving essential minerals.",
              "icon": "Shield"
            },
            {
              "number": "03",
              "stepNumber": 3,
              "title": "Quality Assurance",
              "subtitle": "Third Step",
              "description": "Rigorous testing protocols and quality assurance ensure every drop meets our premium standards.",
              "icon": "Star"
            },
            {
              "number": "04",
              "stepNumber": 4,
              "title": "Final Packaging",
              "subtitle": "Final Step",
              "description": "Automated bottling and sealing in sterile environment preserves freshness and quality until delivery.",
              "icon": "Zap"
            }
          ]
        }
      },
      {
        "type": "contact",
        "content": {
          "title": "Pure Water, Delivered Fresh",
          "description": "Experience premium water delivery services, bulk orders, or visit our state-of-the-art production facility",
          "phone": "+1234567890",
          "email": "water@bundu.com"
        }
      }
    ]
  }'
```

## Individual Section Examples

### Hero Section Only

```bash
curl -X POST http://localhost:3000/api/businesses/YOUR_BUSINESS_ID/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "hero",
        "content": {
          "title": "CRYSTAL PURE",
          "subtitle": "Water Production",
          "description": "State-of-the-art water purification and bottling facility.",
          "badge": "Premium Water Production Facility",
          "ctaButtons": [
            {
              "text": "Order Now",
              "link": "#contact",
              "style": "primary"
            }
          ],
          "stats": [
            {
              "number": "50K+",
              "label": "Liters/Day"
            }
          ]
        }
      }
    ]
  }'
```

### Products Section Only

```bash
curl -X POST http://localhost:3000/api/businesses/YOUR_BUSINESS_ID/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "products",
        "content": {
          "title": "Our Products",
          "products": [
            {
              "category": "Bottled Water",
              "description": "Pure, refreshing bottled water",
              "image": {
                "url": "https://example.com/image.jpg"
              },
              "sizes": ["500ml", "1L", "1.5L"],
              "icon": "Droplets"
            }
          ]
        }
      }
    ]
  }'
```

### Services Section Only

```bash
curl -X POST http://localhost:3000/api/businesses/YOUR_BUSINESS_ID/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "services",
        "content": {
          "title": "Our Services",
          "services": [
            {
              "name": "Delivery Service",
              "description": "Reliable water delivery",
              "icon": "Truck"
            }
          ]
        }
      }
    ]
  }'
```

### Process Section Only

```bash
curl -X POST http://localhost:3000/api/businesses/YOUR_BUSINESS_ID/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "process",
        "content": {
          "title": "Our Process",
          "steps": [
            {
              "number": "01",
              "title": "Step One",
              "description": "Description of step one",
              "icon": "Droplets"
            }
          ]
        }
      }
    ]
  }'
```

### Contact Section Only

```bash
curl -X POST http://localhost:3000/api/businesses/YOUR_BUSINESS_ID/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "contact",
        "content": {
          "title": "Contact Us",
          "description": "Get in touch with us",
          "phone": "+1234567890",
          "email": "contact@example.com"
        }
      }
    ]
  }'
```

## Available Icons

The following icons are available for use:
- `Droplets`
- `Truck`
- `Shield`
- `Users`
- `Phone`
- `Mail`
- `MapPin`
- `Clock`
- `Star`
- `Zap`

## Notes

1. **All sections are optional** - If a section is not included in the POST request, it will not appear on the page.

2. **Images** - Images can be provided as:
   - `{ "url": "https://example.com/image.jpg" }` (object with url property)
   - `"https://example.com/image.jpg"` (direct URL string)

3. **Icons** - Icons should be specified as strings matching the icon names listed above.

4. **Contact Information** - If contact information is not provided in the content, the template will fall back to `business.contact.phone` and `business.contact.email` from the business record.

5. **Empty Arrays** - If arrays (products, services, steps) are empty or not provided, the section will not render.

6. **Multiple Sections** - You can send multiple sections in a single POST request, or send them individually.

## Example with JavaScript/Fetch

```javascript
const businessId = 'YOUR_BUSINESS_ID';

const contentData = {
  sections: [
    {
      type: 'hero',
      content: {
        title: 'CRYSTAL PURE',
        subtitle: 'Water Production',
        description: 'State-of-the-art water purification...',
        badge: 'Premium Water Production Facility',
        ctaButtons: [
          {
            text: 'Order Water Supply',
            link: '#contact',
            style: 'primary',
            icon: 'Truck'
          }
        ],
        stats: [
          { number: '50K+', label: 'Liters/Day' },
          { number: '99.9%', label: 'Purity Level' }
        ]
      }
    },
    {
      type: 'products',
      content: {
        title: 'PREMIUM WATER SOLUTIONS',
        products: [
          {
            category: 'Bottled Water',
            description: 'Pure, refreshing bottled water',
            image: { url: 'https://example.com/image.jpg' },
            sizes: ['500ml', '1L'],
            icon: 'Droplets'
          }
        ]
      }
    }
  ]
};

fetch(`/api/businesses/${businessId}/content`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(contentData)
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

