'use client';

import { useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface ComingSoonOverlayProps {
  businessName: string;
}

export function ComingSoonOverlay({ businessName }: ComingSoonOverlayProps) {
  useEffect(() => {
    // Prevent scrolling when overlay is shown
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* Blurred background overlay - matching footer colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-slate-900/40 to-black/40 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Animated icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-terracotta/50 to-sage/50 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-terracotta to-sage p-6 rounded-full shadow-2xl">
              <Clock className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-terracotta to-sage bg-clip-text text-transparent">
            Coming Soon
          </span>
        </h1>

        {/* Business Name */}
        <h2 className="text-2xl md:text-4xl font-semibold text-white/90 mb-8">
          {businessName}
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/70 mb-12 max-w-xl mx-auto leading-relaxed">
          We're putting the finishing touches on something amazing. 
          Stay tuned for updates!
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-terracotta animate-pulse" style={{ animationDelay: '0s' }} />
          <Sparkles className="w-6 h-6 text-sage animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Sparkles className="w-6 h-6 text-terracotta animate-pulse" style={{ animationDelay: '0.6s' }} />
          <Sparkles className="w-6 h-6 text-sage animate-pulse" style={{ animationDelay: '0.9s' }} />
        </div>

        {/* Back button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-terracotta/20 to-sage/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:from-terracotta/30 hover:to-sage/30 transition-all duration-300 transform hover:scale-105"
        >
          <span>←</span>
          Back to Home
        </a>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-terracotta/40 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-sage/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-terracotta/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-sage/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}

