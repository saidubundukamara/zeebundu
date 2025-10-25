import { z } from "zod";

// Validation schemas for different content types
export const HeroContentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  subtitle: z.string().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  backgroundImage: z
    .object({
      _id: z.string(),
      url: z.string().url(),
      alt: z.string().optional(),
    })
    .optional(),
  backgroundVideo: z
    .object({
      _id: z.string(),
      url: z.string().url(),
    })
    .optional(),
  overlay: z.object({
    enabled: z.boolean(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    opacity: z.number().min(0).max(100),
  }),
  textAlign: z.enum(["left", "center", "right"]),
  buttons: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, "Button text is required"),
      link: z.string().min(1, "Button link is required"),
      style: z.enum(["primary", "secondary", "outline"]),
      isVisible: z.boolean(),
    })
  ),
  style: z.object({
    titleSize: z.enum(["sm", "md", "lg", "xl"]),
    titleColor: z.string().regex(/^#[0-9A-F]{6}$/i),
    descriptionColor: z.string().regex(/^#[0-9A-F]{6}$/i),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  }),
});

export const GalleryContentSchema = z.object({
  title: z.string().min(1, "Gallery title is required"),
  description: z.string().optional(),
  layout: z.enum(["grid", "masonry", "carousel", "lightbox"]),
  columns: z.number().min(1).max(5),
  images: z.array(
    z.object({
      id: z.string(),
      media: z.object({
        _id: z.string(),
        url: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
        alt: z.string().optional(),
        originalName: z.string(),
        mimeType: z.string(),
        dimensions: z
          .object({
            width: z.number(),
            height: z.number(),
          })
          .optional(),
      }),
      caption: z.string().optional(),
      alt: z.string().optional(),
      isVisible: z.boolean(),
      order: z.number(),
    })
  ),
});

export const AboutContentSchema = z.object({
  title: z.string().min(1, "About title is required"),
  description: z.string().min(1, "About description is required"),
  features: z.array(z.string()).optional(),
  stats: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const ServicesContentSchema = z.object({
  title: z.string().min(1, "Services title is required"),
  description: z.string().optional(),
  services: z.array(
    z.object({
      name: z.string().min(1, "Service name is required"),
      description: z.string().min(1, "Service description is required"),
      icon: z.string().optional(),
      features: z.array(z.string()).optional(),
      price: z.string().optional(),
    })
  ),
});

export const ContactContentSchema = z
  .object({
    title: z.string().min(1, "Contact title is required"),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    hours: z.record(z.string(), z.string()).optional(),
    socialMedia: z
      .object({
        facebook: z.string().url().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().url().optional(),
      })
      .optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: "At least one contact method (phone or email) is required",
  });

export const TestimonialsContentSchema = z.object({
  title: z.string().min(1, "Testimonials title is required"),
  testimonials: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Customer name is required"),
      rating: z.number().min(1).max(5),
      comment: z.string().min(1, "Comment is required"),
      date: z.string(),
      avatar: z.string().url().optional(),
      position: z.string().optional(),
      company: z.string().optional(),
    })
  ),
});

// Main content validation function
export function validateSectionContent(
  sectionType: string,
  content: any
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    switch (sectionType) {
      case "hero":
        HeroContentSchema.parse(content);
        // Additional business logic validations
        if (content.buttons && content.buttons.length === 0) {
          warnings.push("Consider adding at least one call-to-action button");
        }
        if (!content.backgroundImage && !content.backgroundVideo) {
          warnings.push(
            "Consider adding a background image or video for visual impact"
          );
        }
        break;

      case "gallery":
        GalleryContentSchema.parse(content);
        if (content.images.length === 0) {
          warnings.push(
            "Gallery is empty - add some images to showcase your business"
          );
        }
        if (content.images.length > 0) {
          const imagesWithoutAlt = content.images.filter(
            (img: any) => !img.alt || !img.media.alt
          );
          if (imagesWithoutAlt.length > 0) {
            warnings.push(
              `${imagesWithoutAlt.length} images missing alt text for accessibility`
            );
          }
        }
        break;

      case "about":
        AboutContentSchema.parse(content);
        if (content.description.length < 100) {
          warnings.push(
            "About description is quite short - consider adding more detail"
          );
        }
        break;

      case "services":
        ServicesContentSchema.parse(content);
        if (content.services.length === 0) {
          warnings.push("No services listed - add your business offerings");
        }
        break;

      case "contact":
        ContactContentSchema.parse(content);
        if (!content.address) {
          warnings.push("Consider adding your business address");
        }
        if (!content.hours) {
          warnings.push("Consider adding your business hours");
        }
        break;

      case "testimonials":
        TestimonialsContentSchema.parse(content);
        if (content.testimonials.length === 0) {
          warnings.push("No testimonials added - customer reviews build trust");
        }
        break;

      default:
        warnings.push(`Unknown section type: ${sectionType}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(
        ...error.issues.map((err) => `${err.path.join(".")}: ${err.message}`)
      );
    } else {
      errors.push("Validation failed");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Template-specific validation
export function validateTemplateContent(
  templateType: string,
  sections: Array<{ type: string; content: any; isActive: boolean }>
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requiredSections: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Define required sections per template
  const templateRequirements: Record<string, string[]> = {
    "gas-station": ["hero", "services", "about", "contact"],
    hotel: ["hero", "services", "gallery", "contact"],
    pharmacy: ["hero", "services", "about", "contact"],
    farming: ["hero", "services", "about", "gallery", "contact"],
    default: ["hero", "about", "contact"],
  };

  const requiredSections =
    templateRequirements[templateType] || templateRequirements.default;
  const activeSections = sections.filter((s) => s.isActive).map((s) => s.type);

  // Check for missing required sections
  const missingSections = requiredSections.filter(
    (required) => !activeSections.includes(required)
  );

  if (missingSections.length > 0) {
    errors.push(`Missing required sections: ${missingSections.join(", ")}`);
  }

  // Validate each active section
  const sectionValidations = sections
    .filter((s) => s.isActive)
    .map((section) => ({
      type: section.type,
      ...validateSectionContent(section.type, section.content),
    }));

  // Collect all errors and warnings
  sectionValidations.forEach((validation) => {
    if (!validation.isValid) {
      errors.push(
        ...validation.errors.map((err) => `${validation.type}: ${err}`)
      );
    }
    warnings.push(
      ...validation.warnings.map((warning) => `${validation.type}: ${warning}`)
    );
  });

  // Template-specific recommendations
  if (templateType === "hotel" && !activeSections.includes("gallery")) {
    warnings.push(
      "Hotels should showcase their facilities with a gallery section"
    );
  }

  if (templateType === "gas-station" && !activeSections.includes("services")) {
    warnings.push(
      "Gas stations should highlight their fuel types and services"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    requiredSections,
  };
}

// SEO content analysis
export function analyzeSEOContent(
  sections: Array<{ type: string; content: any; isActive: boolean }>
) {
  const recommendations: string[] = [];
  let seoScore = 100;

  const heroSection = sections.find((s) => s.type === "hero" && s.isActive);
  if (heroSection) {
    // Title length check
    if (!heroSection.content.title || heroSection.content.title.length < 30) {
      recommendations.push(
        "Hero title should be at least 30 characters for better SEO"
      );
      seoScore -= 10;
    }
    if (heroSection.content.title && heroSection.content.title.length > 60) {
      recommendations.push(
        "Hero title is too long for search engine snippets (>60 chars)"
      );
      seoScore -= 5;
    }

    // Description length check
    if (
      !heroSection.content.description ||
      heroSection.content.description.length < 120
    ) {
      recommendations.push(
        "Hero description should be at least 120 characters for better SEO"
      );
      seoScore -= 10;
    }
  } else {
    recommendations.push("Hero section is required for SEO");
    seoScore -= 20;
  }

  // Check for alt text on images
  const gallerySection = sections.find(
    (s) => s.type === "gallery" && s.isActive
  );
  if (gallerySection && gallerySection.content.images) {
    const imagesWithoutAlt = gallerySection.content.images.filter(
      (img: any) => !img.alt && !img.media.alt
    );
    if (imagesWithoutAlt.length > 0) {
      recommendations.push(
        `${imagesWithoutAlt.length} images missing alt text for SEO and accessibility`
      );
      seoScore -= Math.min(15, imagesWithoutAlt.length * 3);
    }
  }

  // Check for contact information
  const contactSection = sections.find(
    (s) => s.type === "contact" && s.isActive
  );
  if (!contactSection) {
    recommendations.push("Contact section is important for local SEO");
    seoScore -= 15;
  } else {
    if (!contactSection.content.address) {
      recommendations.push("Business address is important for local SEO");
      seoScore -= 10;
    }
    if (!contactSection.content.phone) {
      recommendations.push("Phone number helps with local business SEO");
      seoScore -= 5;
    }
  }

  return {
    score: Math.max(0, seoScore),
    recommendations,
    grade:
      seoScore >= 90
        ? "A"
        : seoScore >= 80
        ? "B"
        : seoScore >= 70
        ? "C"
        : seoScore >= 60
        ? "D"
        : "F",
  };
}
