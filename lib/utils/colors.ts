/**
 * Custom color palette from merged configuration
 * These colors can be used with Tailwind classes or as CSS custom properties
 */
export const customColors = {
  terracotta: '#E07A5F',
  sage: '#81B29A',
  warmBrown: '#A0522D',
  cream: '#F7F3E9',
} as const;

/**
 * Brand color combinations for different business templates
 */
export const brandPalettes = {
  terracotta: {
    primary: customColors.terracotta,
    secondary: customColors.cream,
    accent: customColors.warmBrown,
  },
  sage: {
    primary: customColors.sage,
    secondary: customColors.cream,
    accent: customColors.warmBrown,
  },
  warmBrown: {
    primary: customColors.warmBrown,
    secondary: customColors.cream,
    accent: customColors.sage,
  },
} as const;

/**
 * Generate Tailwind class names for custom colors
 */
export const getColorClasses = (color: keyof typeof customColors) => ({
  bg: `bg-${color.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
  text: `text-${color.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
  border: `border-${color.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
  hover: {
    bg: `hover:bg-${color.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
    text: `hover:text-${color.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
  },
  focus: {
    border: `focus:border-${color.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
    ring: `focus:ring-${color.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
  },
});

/**
 * Animation class names for dynamic usage
 */
export const animationClasses = {
  fadeInUp: 'animate-fade-in-up',
  slideInRight: 'animate-slide-in-right',
  bounce: 'animate-bounce',
} as const;

/**
 * Brand utility class names
 */
export const brandClasses = {
  terracotta: 'brand-terracotta',
  sage: 'brand-sage',
  warmBrown: 'brand-warm-brown',
} as const;