import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center text-white px-4 max-w-2xl mx-auto">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-white/10 mb-4">404</div>
          <div className="text-6xl mb-6">🔍</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Category Not Found
          </span>
        </h1>
        
        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          Sorry, we couldn't find any businesses in this service category. 
          It might not exist yet or all businesses in this category might be inactive.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link 
            href="/#businesses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/20 font-semibold rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
          >
            <Search className="w-5 h-5" />
            Browse All Categories
          </Link>
        </div>

        {/* Available Categories */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Available Categories:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Automotive',
              'Gas Stations', 
              'Hotels & Resorts',
              'Healthcare',
              'Agriculture',
              'Retail',
              'Restaurants',
              'Real Estate'
            ].map((category) => (
              <span 
                key={category}
                className="px-3 py-1 text-sm bg-white/10 text-white/80 rounded-full border border-white/20"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}