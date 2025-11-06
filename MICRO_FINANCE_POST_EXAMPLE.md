# Micro-Finance & Lending Template - POST Command Examples

This document provides examples of how to create a new Micro-Finance & Lending business and add content to it.

## Step 1: Create the Business

First, create a new business with the micro-finance template:

```bash
curl -X POST http://localhost:3000/api/businesses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Micro-Finance",
    "slug": "abc-microfinance",
    "description": "Empowering small businesses and entrepreneurs with flexible lending solutions.",
    "industry": "financial-services",
    "template": "micro-finance",
    "status": "active",
    "contact": {
      "phone": "+1 (234) 567-8900",
      "email": "info@abc-microfinance.com",
      "address": "123 Financial Street, City, State 12345"
    },
    "branding": {
      "primaryColor": "#10b981",
      "secondaryColor": "#059669"
    },
    "seo": {
      "metaTitle": "ABC Micro-Finance - Flexible Lending Solutions",
      "metaDescription": "Accessible micro-finance solutions for small businesses and entrepreneurs. Fast approvals, competitive rates.",
      "keywords": ["microfinance", "lending", "business loans", "small business financing"]
    },
    "socialMedia": {
      "facebook": "https://facebook.com/abc-microfinance",
      "twitter": "https://twitter.com/abc-microfinance"
    }
  }'
```

The response will include the business `_id` (or `id`). Save this ID for the next step.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "ABC Micro-Finance",
    "slug": "abc-microfinance",
    ...
  },
  "message": "Business created successfully"
}
```

## Step 2: Add Content to the Business

Now use the business ID from Step 1 to add content:

## Base URL
```
POST /api/businesses/{businessId}/content
```

Replace `{businessId}` with the ID from Step 1 (e.g., `507f1f77bcf86cd799439011`).

## Example: Save All Sections

```bash
curl -X POST http://localhost:3000/api/businesses/{businessId}/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "hero",
        "content": {
          "title": "Accessible Micro-Finance",
          "subtitle": "Solutions for Your Business",
          "description": "Empowering small businesses and entrepreneurs with flexible lending solutions. Fast approvals, competitive rates, and personalized service to help you grow.",
          "badge": "Licensed Financial Institution",
          "ctaButtons": [
            {
              "text": "Apply Now",
              "link": "#borrowing-process",
              "style": "primary"
            },
            {
              "text": "Learn More",
              "link": "#loan-products",
              "style": "secondary"
            }
          ],
          "stats": [
            {
              "number": "24hrs",
              "label": "Quick Approval"
            },
            {
              "number": "5%",
              "label": "Interest Rate"
            },
            {
              "number": "10K+",
              "label": "Happy Clients"
            }
          ]
        }
      },
      {
        "type": "borrowingProcess",
        "content": {
          "title": "Simple Application Process",
          "description": "Get your loan approved in just a few easy steps. Our streamlined process ensures quick decisions and fast funding.",
          "steps": [
            {
              "number": "1",
              "title": "Submit Application",
              "description": "Fill out our simple online application form with your basic information and loan requirements.",
              "icon": "FileText"
            },
            {
              "number": "2",
              "title": "Document Review",
              "description": "Our team reviews your documents and application. We'll contact you within 24 hours.",
              "icon": "CheckCircle"
            },
            {
              "number": "3",
              "title": "Approval & Terms",
              "description": "Receive your loan approval with transparent terms and conditions. No hidden fees.",
              "icon": "Shield"
            },
            {
              "number": "4",
              "title": "Receive Funds",
              "description": "Get your funds transferred directly to your account within 24-48 hours after approval.",
              "icon": "DollarSign"
            }
          ]
        }
      },
      {
        "type": "requirements",
        "content": {
          "title": "Requirements to Meet Before Lending",
          "description": "To ensure a smooth application process, please ensure you have the following documents and meet these requirements:",
          "requirements": [
            {
              "title": "Age Requirement",
              "description": "Applicant must be at least 18 years old and not more than 65 years at loan maturity.",
              "required": true,
              "documents": [
                "Valid National ID or Passport",
                "Birth Certificate (if available)"
              ]
            },
            {
              "title": "Proof of Income",
              "description": "Demonstrate your ability to repay the loan with consistent income.",
              "required": true,
              "documents": [
                "Bank statements (last 3-6 months)",
                "Pay slips or employment letter",
                "Business registration documents (for business loans)",
                "Tax returns (if applicable)"
              ]
            },
            {
              "title": "Business Registration",
              "description": "For business loans, your enterprise must be legally registered.",
              "required": true,
              "documents": [
                "Business registration certificate",
                "Operating license",
                "Business permit",
                "Tax identification number"
              ]
            },
            {
              "title": "Credit History",
              "description": "We review your credit history to assess loan eligibility.",
              "required": true,
              "documents": [
                "Credit report (if available)",
                "References from previous lenders",
                "Trade references"
              ]
            },
            {
              "title": "Collateral Documentation",
              "description": "Depending on loan amount, collateral may be required.",
              "required": false,
              "documents": [
                "Property title deeds",
                "Vehicle registration documents",
                "Asset valuation reports",
                "Guarantor documentation"
              ]
            },
            {
              "title": "Residential Address",
              "description": "Proof of your current residential address.",
              "required": true,
              "documents": [
                "Utility bills (electricity, water, etc.)",
                "Rental agreement or property ownership documents",
                "Recent bank statement with address"
              ]
            }
          ]
        }
      },
      {
        "type": "loanDuration",
        "content": {
          "title": "Flexible Loan Duration Options",
          "description": "Choose the repayment period that best fits your financial situation and business needs.",
          "options": [
            {
              "duration": "3 Months",
              "description": "Short-term loans for immediate business needs. Quick repayment with minimal interest.",
              "interestRate": "5% per month",
              "minAmount": "$500",
              "maxAmount": "$5,000"
            },
            {
              "duration": "6 Months",
              "description": "Medium-term financing for business expansion or working capital needs.",
              "interestRate": "4.5% per month",
              "minAmount": "$1,000",
              "maxAmount": "$10,000"
            },
            {
              "duration": "12 Months",
              "description": "Long-term loans for major investments. Lower monthly payments with extended repayment.",
              "interestRate": "4% per month",
              "minAmount": "$2,000",
              "maxAmount": "$25,000"
            },
            {
              "duration": "24 Months",
              "description": "Extended repayment terms for larger business investments and capital projects.",
              "interestRate": "3.5% per month",
              "minAmount": "$5,000",
              "maxAmount": "$50,000"
            }
          ]
        }
      },
      {
        "type": "paymentMethods",
        "content": {
          "title": "Convenient Payment Methods",
          "description": "We offer multiple flexible payment options to make loan repayment easy and convenient for you.",
          "methods": [
            {
              "name": "Bank Transfer",
              "description": "Direct bank transfer from your account to ours. Fast and secure.",
              "icon": "CreditCard",
              "features": [
                "Online banking",
                "Mobile banking",
                "ATM transfer",
                "24/7 availability"
              ]
            },
            {
              "name": "Mobile Money",
              "description": "Pay using popular mobile money platforms like M-Pesa, Airtel Money, or MTN Mobile Money.",
              "icon": "CreditCard",
              "features": [
                "M-Pesa",
                "Airtel Money",
                "MTN Mobile Money",
                "Instant processing"
              ]
            },
            {
              "name": "Cash Payment",
              "description": "Visit our office to make cash payments. Our staff will assist you with the process.",
              "icon": "DollarSign",
              "features": [
                "Office payment",
                "Receipt provided",
                "Same-day processing",
                "Personal assistance"
              ]
            },
            {
              "name": "Automatic Debit",
              "description": "Set up automatic monthly deductions from your bank account. Never miss a payment.",
              "icon": "Clock",
              "features": [
                "Auto-debit setup",
                "Monthly reminders",
                "No late fees",
                "Peace of mind"
              ]
            }
          ]
        }
      },
      {
        "type": "loanProducts",
        "content": {
          "title": "Our Loan Products",
          "description": "We offer a variety of loan products designed to meet different business and personal financial needs.",
          "products": [
            {
              "name": "Business Startup Loan",
              "description": "Perfect for new businesses looking to get started. Minimal requirements and fast approval.",
              "interestRate": "4.5% per month",
              "minAmount": "$500",
              "maxAmount": "$10,000",
              "features": [
                "No collateral required (for small amounts)",
                "Quick approval within 24 hours",
                "Flexible repayment terms",
                "Business advisory support"
              ]
            },
            {
              "name": "Working Capital Loan",
              "description": "Boost your business cash flow with our working capital financing solutions.",
              "interestRate": "4% per month",
              "minAmount": "$1,000",
              "maxAmount": "$25,000",
              "features": [
                "Flexible repayment options",
                "No early repayment penalties",
                "Renewable credit line",
                "Competitive interest rates"
              ]
            },
            {
              "name": "Equipment Finance",
              "description": "Finance your business equipment purchases with our specialized equipment loans.",
              "interestRate": "3.5% per month",
              "minAmount": "$2,000",
              "maxAmount": "$50,000",
              "features": [
                "Equipment as collateral",
                "Extended repayment terms",
                "Tax benefits",
                "Flexible down payment"
              ]
            },
            {
              "name": "Personal Loan",
              "description": "For personal financial needs including education, medical expenses, or home improvements.",
              "interestRate": "5% per month",
              "minAmount": "$500",
              "maxAmount": "$15,000",
              "features": [
                "No collateral required",
                "Fast processing",
                "Flexible use",
                "Competitive rates"
              ]
            }
          ]
        }
      },
      {
        "type": "terms",
        "content": {
          "title": "Terms and Conditions",
          "description": "Please read and understand our terms and conditions before applying for a loan.",
          "terms": [
            "All loan applications are subject to credit assessment and approval. Approval is not guaranteed.",
            "Interest rates are fixed for the duration of the loan and will be clearly stated in your loan agreement.",
            "Late payment fees may apply if payments are not made on time. Please contact us if you anticipate any payment difficulties.",
            "Early repayment is allowed without penalty. Contact us to arrange early settlement.",
            "All loan amounts and terms are subject to our lending policies and regulatory requirements.",
            "We reserve the right to request additional documentation or information during the application process.",
            "Loan disbursement typically occurs within 24-48 hours after approval and signing of loan agreement.",
            "Default on loan payments may result in legal action and reporting to credit bureaus.",
            "All personal and business information provided will be kept confidential and used solely for loan assessment purposes.",
            "We are committed to responsible lending and will only approve loans that we believe you can afford to repay.",
            "Interest is calculated on a reducing balance basis for monthly repayment loans.",
            "For secured loans, assets provided as collateral must be properly valued and insured.",
            "Changes to loan terms after approval may incur administrative fees. All fees will be disclosed upfront.",
            "We offer financial counseling services to help you manage your loan effectively."
          ]
        }
      },
      {
        "type": "contact",
        "content": {
          "title": "Get in Touch",
          "description": "Our loan specialists are ready to help you find the right financing solution for your needs.",
          "phone": "+1 (234) 567-8900",
          "email": "loans@microfinance.com",
          "hours": [
            {
              "day": "Monday - Friday",
              "time": "8:00 AM - 6:00 PM"
            },
            {
              "day": "Saturday",
              "time": "9:00 AM - 2:00 PM"
            },
            {
              "day": "Sunday",
              "time": "Closed"
            }
          ]
        }
      }
    ]
  }'
```

## Complete Example: Create Business + Add Content (JavaScript/TypeScript)

This example shows how to create a new business and add all content in one workflow:

```javascript
// Step 1: Create the business
const createBusinessResponse = await fetch('/api/businesses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'ABC Micro-Finance',
    slug: 'abc-microfinance',
    description: 'Empowering small businesses and entrepreneurs with flexible lending solutions.',
    industry: 'financial-services',
    template: 'micro-finance',
    status: 'active',
    contact: {
      phone: '+1 (234) 567-8900',
      email: 'info@abc-microfinance.com',
      address: '123 Financial Street, City, State 12345'
    },
    branding: {
      primaryColor: '#10b981',
      secondaryColor: '#059669'
    },
    seo: {
      metaTitle: 'ABC Micro-Finance - Flexible Lending Solutions',
      metaDescription: 'Accessible micro-finance solutions for small businesses and entrepreneurs. Fast approvals, competitive rates.',
      keywords: ['microfinance', 'lending', 'business loans', 'small business financing']
    },
    socialMedia: {
      facebook: 'https://facebook.com/abc-microfinance',
      twitter: 'https://twitter.com/abc-microfinance'
    }
  })
});

const businessResult = await createBusinessResponse.json();

if (!businessResult.success) {
  console.error('Failed to create business:', businessResult.error);
  return;
}

// Extract business ID from response
const businessId = businessResult.data._id || businessResult.data.id;
console.log('Business created with ID:', businessId);

// Step 2: Add content to the business

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
          title: 'Accessible Micro-Finance',
          subtitle: 'Solutions for Your Business',
          description: 'Empowering small businesses and entrepreneurs with flexible lending solutions. Fast approvals, competitive rates, and personalized service to help you grow.',
          badge: 'Licensed Financial Institution',
          ctaButtons: [
            {
              text: 'Apply Now',
              link: '#borrowing-process',
              style: 'primary'
            },
            {
              text: 'Learn More',
              link: '#loan-products',
              style: 'secondary'
            }
          ],
          stats: [
            {
              number: '24hrs',
              label: 'Quick Approval'
            },
            {
              number: '5%',
              label: 'Interest Rate'
            },
            {
              number: '10K+',
              label: 'Happy Clients'
            }
          ]
        }
      },
      {
        type: 'borrowingProcess',
        content: {
          title: 'Simple Application Process',
          description: 'Get your loan approved in just a few easy steps. Our streamlined process ensures quick decisions and fast funding.',
          steps: [
            {
              number: '1',
              title: 'Submit Application',
              description: 'Fill out our simple online application form with your basic information and loan requirements.',
              icon: 'FileText'
            },
            {
              number: '2',
              title: 'Document Review',
              description: 'Our team reviews your documents and application. We\'ll contact you within 24 hours.',
              icon: 'CheckCircle'
            },
            {
              number: '3',
              title: 'Approval & Terms',
              description: 'Receive your loan approval with transparent terms and conditions. No hidden fees.',
              icon: 'Shield'
            },
            {
              number: '4',
              title: 'Receive Funds',
              description: 'Get your funds transferred directly to your account within 24-48 hours after approval.',
              icon: 'DollarSign'
            }
          ]
        }
      },
      {
        type: 'requirements',
        content: {
          title: 'Requirements to Meet Before Lending',
          description: 'To ensure a smooth application process, please ensure you have the following documents and meet these requirements:',
          requirements: [
            {
              title: 'Age Requirement',
              description: 'Applicant must be at least 18 years old and not more than 65 years at loan maturity.',
              required: true,
              documents: [
                'Valid National ID or Passport',
                'Birth Certificate (if available)'
              ]
            },
            {
              title: 'Proof of Income',
              description: 'Demonstrate your ability to repay the loan with consistent income.',
              required: true,
              documents: [
                'Bank statements (last 3-6 months)',
                'Pay slips or employment letter',
                'Business registration documents (for business loans)',
                'Tax returns (if applicable)'
              ]
            },
            {
              title: 'Business Registration',
              description: 'For business loans, your enterprise must be legally registered.',
              required: true,
              documents: [
                'Business registration certificate',
                'Operating license',
                'Business permit',
                'Tax identification number'
              ]
            },
            {
              title: 'Credit History',
              description: 'We review your credit history to assess loan eligibility.',
              required: true,
              documents: [
                'Credit report (if available)',
                'References from previous lenders',
                'Trade references'
              ]
            },
            {
              title: 'Collateral Documentation',
              description: 'Depending on loan amount, collateral may be required.',
              required: false,
              documents: [
                'Property title deeds',
                'Vehicle registration documents',
                'Asset valuation reports',
                'Guarantor documentation'
              ]
            },
            {
              title: 'Residential Address',
              description: 'Proof of your current residential address.',
              required: true,
              documents: [
                'Utility bills (electricity, water, etc.)',
                'Rental agreement or property ownership documents',
                'Recent bank statement with address'
              ]
            }
          ]
        }
      },
      {
        type: 'loanDuration',
        content: {
          title: 'Flexible Loan Duration Options',
          description: 'Choose the repayment period that best fits your financial situation and business needs.',
          options: [
            {
              duration: '3 Months',
              description: 'Short-term loans for immediate business needs. Quick repayment with minimal interest.',
              interestRate: '5% per month',
              minAmount: '$500',
              maxAmount: '$5,000'
            },
            {
              duration: '6 Months',
              description: 'Medium-term financing for business expansion or working capital needs.',
              interestRate: '4.5% per month',
              minAmount: '$1,000',
              maxAmount: '$10,000'
            },
            {
              duration: '12 Months',
              description: 'Long-term loans for major investments. Lower monthly payments with extended repayment.',
              interestRate: '4% per month',
              minAmount: '$2,000',
              maxAmount: '$25,000'
            },
            {
              duration: '24 Months',
              description: 'Extended repayment terms for larger business investments and capital projects.',
              interestRate: '3.5% per month',
              minAmount: '$5,000',
              maxAmount: '$50,000'
            }
          ]
        }
      },
      {
        type: 'paymentMethods',
        content: {
          title: 'Convenient Payment Methods',
          description: 'We offer multiple flexible payment options to make loan repayment easy and convenient for you.',
          methods: [
            {
              name: 'Bank Transfer',
              description: 'Direct bank transfer from your account to ours. Fast and secure.',
              icon: 'CreditCard',
              features: [
                'Online banking',
                'Mobile banking',
                'ATM transfer',
                '24/7 availability'
              ]
            },
            {
              name: 'Mobile Money',
              description: 'Pay using popular mobile money platforms like M-Pesa, Airtel Money, or MTN Mobile Money.',
              icon: 'CreditCard',
              features: [
                'M-Pesa',
                'Airtel Money',
                'MTN Mobile Money',
                'Instant processing'
              ]
            },
            {
              name: 'Cash Payment',
              description: 'Visit our office to make cash payments. Our staff will assist you with the process.',
              icon: 'DollarSign',
              features: [
                'Office payment',
                'Receipt provided',
                'Same-day processing',
                'Personal assistance'
              ]
            },
            {
              name: 'Automatic Debit',
              description: 'Set up automatic monthly deductions from your bank account. Never miss a payment.',
              icon: 'Clock',
              features: [
                'Auto-debit setup',
                'Monthly reminders',
                'No late fees',
                'Peace of mind'
              ]
            }
          ]
        }
      },
      {
        type: 'loanProducts',
        content: {
          title: 'Our Loan Products',
          description: 'We offer a variety of loan products designed to meet different business and personal financial needs.',
          products: [
            {
              name: 'Business Startup Loan',
              description: 'Perfect for new businesses looking to get started. Minimal requirements and fast approval.',
              interestRate: '4.5% per month',
              minAmount: '$500',
              maxAmount: '$10,000',
              features: [
                'No collateral required (for small amounts)',
                'Quick approval within 24 hours',
                'Flexible repayment terms',
                'Business advisory support'
              ]
            },
            {
              name: 'Working Capital Loan',
              description: 'Boost your business cash flow with our working capital financing solutions.',
              interestRate: '4% per month',
              minAmount: '$1,000',
              maxAmount: '$25,000',
              features: [
                'Flexible repayment options',
                'No early repayment penalties',
                'Renewable credit line',
                'Competitive interest rates'
              ]
            },
            {
              name: 'Equipment Finance',
              description: 'Finance your business equipment purchases with our specialized equipment loans.',
              interestRate: '3.5% per month',
              minAmount: '$2,000',
              maxAmount: '$50,000',
              features: [
                'Equipment as collateral',
                'Extended repayment terms',
                'Tax benefits',
                'Flexible down payment'
              ]
            },
            {
              name: 'Personal Loan',
              description: 'For personal financial needs including education, medical expenses, or home improvements.',
              interestRate: '5% per month',
              minAmount: '$500',
              maxAmount: '$15,000',
              features: [
                'No collateral required',
                'Fast processing',
                'Flexible use',
                'Competitive rates'
              ]
            }
          ]
        }
      },
      {
        type: 'terms',
        content: {
          title: 'Terms and Conditions',
          description: 'Please read and understand our terms and conditions before applying for a loan.',
          terms: [
            'All loan applications are subject to credit assessment and approval. Approval is not guaranteed.',
            'Interest rates are fixed for the duration of the loan and will be clearly stated in your loan agreement.',
            'Late payment fees may apply if payments are not made on time. Please contact us if you anticipate any payment difficulties.',
            'Early repayment is allowed without penalty. Contact us to arrange early settlement.',
            'All loan amounts and terms are subject to our lending policies and regulatory requirements.',
            'We reserve the right to request additional documentation or information during the application process.',
            'Loan disbursement typically occurs within 24-48 hours after approval and signing of loan agreement.',
            'Default on loan payments may result in legal action and reporting to credit bureaus.',
            'All personal and business information provided will be kept confidential and used solely for loan assessment purposes.',
            'We are committed to responsible lending and will only approve loans that we believe you can afford to repay.',
            'Interest is calculated on a reducing balance basis for monthly repayment loans.',
            'For secured loans, assets provided as collateral must be properly valued and insured.',
            'Changes to loan terms after approval may incur administrative fees. All fees will be disclosed upfront.',
            'We offer financial counseling services to help you manage your loan effectively.'
          ]
        }
      },
      {
        type: 'contact',
        content: {
          title: 'Get in Touch',
          description: 'Our loan specialists are ready to help you find the right financing solution for your needs.',
          phone: '+1 (234) 567-8900',
          email: 'loans@microfinance.com',
          hours: [
            {
              day: 'Monday - Friday',
              time: '8:00 AM - 6:00 PM'
            },
            {
              day: 'Saturday',
              time: '9:00 AM - 2:00 PM'
            },
            {
              day: 'Sunday',
              time: 'Closed'
            }
          ]
        }
      }
    ]
  })
});

const result = await response.json();
console.log('Content saved:', result);
```

## Individual Section Updates

You can also update individual sections using the specific section endpoint:

```bash
# Update only borrowing process
curl -X PUT http://localhost:3000/api/businesses/{businessId}/content/borrowingProcess \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "title": "Simple Application Process",
      "description": "Get your loan approved in just a few easy steps.",
      "steps": [
        {
          "number": "1",
          "title": "Submit Application",
          "description": "Fill out our simple online application form.",
          "icon": "FileText"
        }
      ]
    }
  }'
```

## Available Icon Names

When setting the `icon` field, use one of these values:
- `CreditCard`
- `Clock`
- `Shield`
- `CheckCircle`
- `FileText`
- `DollarSign`
- `ArrowRight`
- `Phone`
- `Mail`
- `MapPin`
- `Calendar`
- `Users`
- `TrendingUp`
- `Award`
- `AlertCircle`

## Complete curl Example (Two-Step Process)

### Step 1: Create Business
```bash
curl -X POST http://localhost:3000/api/businesses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Micro-Finance",
    "slug": "abc-microfinance",
    "description": "Empowering small businesses and entrepreneurs with flexible lending solutions.",
    "industry": "financial-services",
    "template": "micro-finance",
    "status": "active",
    "contact": {
      "phone": "+1 (234) 567-8900",
      "email": "info@abc-microfinance.com",
      "address": "123 Financial Street, City, State 12345"
    },
    "branding": {
      "primaryColor": "#10b981",
      "secondaryColor": "#059669"
    }
  }'
```

**Save the `_id` from the response, then use it in Step 2.**

### Step 2: Add Content
```bash
# Replace BUSINESS_ID_HERE with the _id from Step 1
curl -X POST http://localhost:3000/api/businesses/BUSINESS_ID_HERE/content \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "type": "hero",
        "content": {
          "title": "Accessible Micro-Finance",
          "subtitle": "Solutions for Your Business",
          "description": "Empowering small businesses and entrepreneurs with flexible lending solutions.",
          "badge": "Licensed Financial Institution",
          "ctaButtons": [
            {
              "text": "Apply Now",
              "link": "#borrowing-process",
              "style": "primary"
            }
          ],
          "stats": [
            {
              "number": "24hrs",
              "label": "Quick Approval"
            },
            {
              "number": "5%",
              "label": "Interest Rate"
            },
            {
              "number": "10K+",
              "label": "Happy Clients"
            }
          ]
        }
      }
    ]
  }'
```

## Admin Panel Support

All sections are now available in the admin panel! When you create a business with the `micro-finance` template, the following sections will automatically appear in the content editor:

- ✅ **Hero Section** - Header with stats and CTAs
- ✅ **Borrowing Process** - Step-by-step application process
- ✅ **Requirements** - Requirements and documents needed
- ✅ **Loan Duration** - Flexible repayment period options
- ✅ **Payment Methods** - Available payment options
- ✅ **Loan Products** - Different loan product offerings
- ✅ **Terms and Conditions** - Terms and conditions list
- ✅ **Contact** - Contact information

You can edit all these sections directly in the admin panel at `/admin/businesses/{businessId}/content` without needing to use POST requests.

## Notes

1. **For new businesses**: You must create the business first (Step 1) before adding content (Step 2)
2. **Admin Panel**: All sections are now editable in the admin panel - no need to use POST requests if you prefer the UI
3. Replace `BUSINESS_ID_HERE` with the actual MongoDB ObjectId from the business creation response
4. All interest rates are stored as strings to preserve formatting
5. The API will automatically handle versioning and create/update operations
6. Loan amounts can be in any currency format (USD, local currency, etc.)
7. Documents arrays can be empty for requirements that don't need specific documents
8. Payment methods can be customized based on your available payment channels
9. Terms and conditions can be simple strings or objects with title/description fields
10. The `template` field must be set to `"micro-finance"` when creating the business
11. The `industry` field should be set to `"financial-services"` for micro-finance businesses
12. When you access the content editor for a micro-finance business, all sections will be automatically created if they don't exist

