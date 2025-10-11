import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Dynamic color classes for business templates and branding
    'bg-slate-800',
    'bg-slate-600',
    'bg-slate-50',
    'text-slate-800',
    'text-slate-600',
    'bg-emerald-800',
    'bg-emerald-600',
    'bg-emerald-50',
    'text-emerald-800',
    'text-emerald-600',
    'bg-green-800',
    'bg-green-600',
    'bg-green-50',
    'text-green-800',
    'text-green-600',
    'bg-amber-800',
    'bg-amber-600',
    'bg-amber-50',
    'text-amber-800',
    'text-amber-600',
    'bg-blue-800',
    'bg-blue-600',
    'bg-blue-50',
    'text-blue-800',
    'text-blue-600',
    'bg-pink-800',
    'bg-pink-600',
    'bg-pink-50',
    'text-pink-800',
    'text-pink-600',
    
    // Custom color classes
    'bg-terracotta',
    'bg-sage',
    'bg-warm-brown',
    'bg-cream',
    'text-terracotta',
    'text-sage',
    'text-warm-brown',
    'text-cream',
    'border-terracotta',
    'border-sage',
    'border-warm-brown',
    'border-cream',
    
    // Hover states for custom colors
    'hover:bg-terracotta',
    'hover:bg-sage',
    'hover:bg-warm-brown',
    'hover:bg-cream',
    'hover:text-terracotta',
    'hover:text-sage',
    'hover:text-warm-brown',
    'hover:text-cream',
    
    // Focus states for custom colors
    'focus:border-terracotta',
    'focus:border-sage',
    'focus:border-warm-brown',
    'focus:border-cream',
    'focus:ring-terracotta',
    'focus:ring-sage',
    'focus:ring-warm-brown',
    'focus:ring-cream',
    
    // Custom animations
    'animate-fade-in-up',
    'animate-slide-in-right',
    'animate-bounce',
    
    // Brand utility classes
    'brand-terracotta',
    'brand-sage',
    'brand-warm-brown',
  ],
  plugins: [],
} satisfies Config

export default config