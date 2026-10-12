import React, { useState } from 'react';
import { PassOption, PassType, UserProfile } from '../types';
import { recordNewPurchaseAndPayout } from '../utils/storage';
import { Check, X, ShieldCheck } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onActivatePass: (passType: PassType, days: number) => void;
  onOpenPayouts: () => void;
}

const PASS_OPTIONS: PassOption[] = [
  {
    id: '2_days',
    title: '2-Day Unlimited',
    days: 2,
    price: 5,
    description: 'Unlimited 10-minute sessions for 48 hours. Good for weekend practice or exam preparation.'
  },
  {
    id: '7_days',
    title: '7-Day Unlimited',
    days: 7,
    price: 10,
    popular: true,
    description: 'Unlimited 10-minute sessions for a full week. Join as many conversations as you want.'
  },
  {
    id: '30_days',
    title: 'Whole Month (30 Days)',
    days: 30,
    price: 20,
    description: 'Unlimited daily sessions for thirty days. Regular daily practice for steady speaking confidence.'
  }
];

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onActivatePass,
  onOpenPayouts
}) => {
  const [selectedPass, setSelectedPass] = useState<PassType>('7_days');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'apple'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentOption = PASS_OPTIONS.find((p) => p.id === selectedPass)!;
  const isPassActive = user.unlimitedPassExpiresAt && user.unlimitedPassExpiresAt > Date.now();
  const daysLeft = isPassActive
    ? Math.ceil((user.unlimitedPassExpiresAt! - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Record transaction to organizer payout ledger
      recordNewPurchaseAndPayout(user.name, currentOption.title, currentOption.price);

      setIsProcessing(false);
      onActivatePass(currentOption.id, currentOption.days);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-stone-50 border-b border-stone-200 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold text-stone-600 block mb-1">
            Free Daily Access: 15 Sessions Everyday
          </span>

          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Unlimited Speaking Passes
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
            Every user gets 15 free conversations every day. If you want uninterrupted calls without daily limits, you can choose an unlimited pass below.
          </p>

          {isPassActive && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between font-medium">
              <span>Unlimited Pass Active ({daysLeft} days remaining)</span>
              <span>Valid until {new Date(user.unlimitedPassExpiresAt!).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Pass Options Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PASS_OPTIONS.map((pass) => {
              const isSelected = selectedPass === pass.id;
              return (
                <div
                  key={pass.id}
                  onClick={() => setSelectedPass(pass.id)}
                  className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/40 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-stone-900 text-sm">{pass.title}</h3>
                      {pass.popular && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-bold text-stone-900">${pass.price}</span>
                      <span className="text-xs text-stone-500">USD</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {pass.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-700">
                      {pass.days} Days
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Method Selector */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="block text-xs font-semibold text-stone-700 mb-2">
              Payment Method
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-white border-amber-600 text-stone-900 font-semibold shadow-sm'
                    : 'bg-stone-100 border-transparent text-stone-600 hover:bg-stone-200'
                }`}
              >
                Credit or Debit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('gpay')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  paymentMethod === 'gpay'
                    ? 'bg-white border-amber-600 text-stone-900 font-semibold shadow-sm'
                    : 'bg-stone-100 border-transparent text-stone-600 hover:bg-stone-200'
                }`}
              >
                Google Pay
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  paymentMethod === 'apple'
                    ? 'bg-white border-amber-600 text-stone-900 font-semibold shadow-sm'
                    : 'bg-stone-100 border-transparent text-stone-600 hover:bg-stone-200'
                }`}
              >
                Apple Pay
              </button>
            </div>
          </div>

          {/* Checkout Button & Direct Payout Transparency link */}
          <div className="space-y-3">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm hover:shadow disabled:opacity-60"
            >
              {isProcessing ? (
                <span>Activating pass...</span>
              ) : (
                <span>Activate {currentOption.title} for ${currentOption.price}</span>
              )}
            </button>

            {/* Transparent money settlement disclosure */}
            <div className="p-3 bg-stone-100 rounded-xl text-stone-600 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>
                Standard card processing fee: 2.9% + $0.30. Platform fee: 0%.
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPayouts();
                }}
                className="text-stone-900 font-semibold hover:underline shrink-0"
              >
                View Organizer Bank Payout Flow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
