import React from 'react';
import { AlertCircle, Copy, Wallet } from 'lucide-react';

export const ActionRequiredAlert: React.FC = () => {
  return (
    <div className="bg-status-alert/30 rounded-2xl p-5 border border-status-alert/50 shadow-soft max-w-md w-full text-left">
      <div className="flex items-start space-x-3 mb-3">
        <div className="p-2 bg-red-100 rounded-full text-red-600 mt-1">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-red-900 text-lg">Action Required: Insufficient Funds</h4>
          <p className="text-sm text-red-800/80 mt-1 leading-snug">
            Top up <span className="font-semibold">₦350.00</span> to unblock this subscription.
          </p>
        </div>
      </div>

      <div className="bg-white/60 rounded-xl p-4 mb-4 text-sm text-ink/80 flex flex-col gap-2">
        <div className="flex justify-between">
          <span>Netflix Basic</span>
          <span className="font-medium">₦4,900.00</span>
        </div>
        <div className="flex justify-between">
          <span>Current Wallet Balance</span>
          <span className="font-medium">₦4,550.00</span>
        </div>
        <div className="border-t border-red-200/50 pt-2 flex justify-between font-semibold text-red-900">
          <span>Shortfall</span>
          <span>₦350.00</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <p className="text-xs text-red-800/70 mb-1">Send funds to your SubBee wallet</p>
          <p className="font-bold text-lg tracking-widest text-tabular text-red-950">8123 456 789</p>
        </div>
        <img src="/assets/nomba-transparent.png" alt="Nomba" className="h-5 opacity-60" />
      </div>

      <div className="flex space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 bg-white text-red-900 py-2.5 rounded-pill font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
          <Copy className="w-4 h-4" />
          <span>Copy Account</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 bg-gold-primary text-white py-2.5 rounded-pill font-medium text-sm hover:bg-gold-dark transition-colors shadow-sm">
          <Wallet className="w-4 h-4" />
          <span>Top Up Wallet</span>
        </button>
      </div>
    </div>
  );
};
