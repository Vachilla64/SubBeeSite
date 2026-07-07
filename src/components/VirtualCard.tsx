import React from 'react';
import { CreditCard } from 'lucide-react';

interface VirtualCardProps {
  className?: string;
}

export const VirtualCard: React.FC<VirtualCardProps> = ({ className = '' }) => {
  return (
    <div className={`relative bg-gradient-to-br from-teal-card-light to-teal-card-dark rounded-2xl p-6 text-white shadow-soft overflow-hidden ${className}`}>
      {/* Decorative subtle hexagon/circle overlay */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-sm font-medium opacity-80 mb-1">Virtual Card</h3>
          <div className="text-3xl font-bold text-tabular">₦0.00</div>
        </div>
        <CreditCard className="w-8 h-8 opacity-50" />
      </div>
      
      <div className="relative z-10 mb-6">
        <p className="text-xs opacity-75 max-w-[200px] leading-relaxed">
          Your card is kept safely empty. We automatically move funds here the millisecond your bill is due.
        </p>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="flex items-center space-x-2 opacity-90 text-tabular tracking-widest text-lg">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span className="font-semibold">3712</span>
        </div>
        <img src="/assets/nomba-transparent.png" alt="Nomba" className="h-6 opacity-80" />
      </div>
    </div>
  );
};
