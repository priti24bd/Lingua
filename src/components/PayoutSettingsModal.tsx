import React, { useState } from 'react';
import { PayoutSettings, PayoutTransaction } from '../types';
import {
  getPayoutSettings,
  savePayoutSettings,
  getPayoutTransactions,
  recordNewPurchaseAndPayout
} from '../utils/storage';
import { X, Check, Building2, CreditCard, DollarSign, ArrowUpRight, HelpCircle } from 'lucide-react';

interface PayoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayoutSettingsModal: React.FC<PayoutSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<PayoutSettings>(getPayoutSettings());
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(getPayoutTransactions());
  const [activeTab, setActiveTab] = useState<'flow' | 'bank_settings' | 'ledger'>('flow');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const totalGross = transactions.reduce((acc, t) => acc + t.grossAmount, 0);
  const totalFees = transactions.reduce((acc, t) => acc + t.processingFee, 0);
  const totalNet = transactions.reduce((acc, t) => acc + t.netPayout, 0);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePayoutSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSimulateTestPayout = () => {
    const testNames = ['Sarah Miller', 'Carlos Gomez', 'Yuki Tanaka', 'Hassan Ali'];
    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const newTx = recordNewPurchaseAndPayout(randomName, '7-Day Unlimited', 10.0);
    setTransactions([newTx, ...transactions]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Organizer Payout and Revenue Settlement
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Transparent breakdown of how you receive payments when users purchase paid passes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 px-6 pt-3 gap-6 text-xs font-semibold text-stone-600 bg-white">
          <button
            onClick={() => setActiveTab('flow')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'flow'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            How You Receive Money
          </button>
          <button
            onClick={() => setActiveTab('bank_settings')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'bank_settings'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Bank and Payout Account
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'ledger'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Payout History and Ledger ({transactions.length})
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: How Money Moves */}
          {activeTab === 'flow' && (
            <div className="space-y-6">
              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Gross User Purchases
                  </span>
                  <div className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">
                    ${totalGross.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-stone-500">From paid passes</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Card Processing Fees
                  </span>
                  <div className="text-2xl font-bold text-stone-600 mt-1 tabular-nums">
                    -${totalFees.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-stone-500">2.9% + $0.30 per charge</span>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                    Net Transferred to You
                  </span>
                  <div className="text-2xl font-bold text-emerald-900 mt-1 tabular-nums">
                    ${totalNet.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-emerald-700">Deposited to your account</span>
                </div>
              </div>

              {/* Exact Step-by-Step Transparency Guide */}
              <div className="border border-stone-200 rounded-2xl p-5 space-y-4 bg-white">
                <h3 className="text-sm font-bold text-stone-900">
                  Step-by-Step Payment and Deposit Architecture
                </h3>

                <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <strong className="text-stone-900 block mb-0.5">User Buys a Pass</strong>
                      When a user selects $5 (2 days), $10 (7 days), or $20 (monthly), they pay using Credit Card, Apple Pay, or Google Pay.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <strong className="text-stone-900 block mb-0.5">Card Processor Settlement</strong>
                      The global payment gateway (Stripe or PayPal Merchant) handles the transaction and automatically deducts the standard interchange cost (2.9% + $0.30). LinguaConnect takes 0% platform fee.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <strong className="text-stone-900 block mb-0.5">Automatic Direct Bank Payout</strong>
                      The remaining net amount ($4.55 on $5, $9.41 on $10, or $19.12 on $20) is transferred straight into your connected Bank Account (via ACH, SEPA, or SWIFT) on your selected schedule.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('bank_settings')}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Configure Your Bank Details
                </button>
                <button
                  type="button"
                  onClick={handleSimulateTestPayout}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Test Purchase and Deposit Simulation
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Bank Account Configuration */}
          {activeTab === 'bank_settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, payoutMethod: 'bank_transfer' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      settings.payoutMethod === 'bank_transfer'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    Direct Bank Wire
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, payoutMethod: 'stripe' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      settings.payoutMethod === 'stripe'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    Stripe Direct
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, payoutMethod: 'paypal' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      settings.payoutMethod === 'paypal'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    PayPal Business
                  </button>
                </div>
              </div>

              {settings.payoutMethod === 'bank_transfer' && (
                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Account Holder Legal Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.accountHolderName}
                        onChange={(e) =>
                          setSettings({ ...settings, accountHolderName: e.target.value })
                        }
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.bankName}
                        onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        IBAN / Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.ibanOrAccountNumber}
                        onChange={(e) =>
                          setSettings({ ...settings, ibanOrAccountNumber: e.target.value })
                        }
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        SWIFT / BIC / Routing Code
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.swiftOrRouting}
                        onChange={(e) =>
                          setSettings({ ...settings, swiftOrRouting: e.target.value })
                        }
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {settings.payoutMethod === 'stripe' && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Stripe Connected Account ID
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.stripeAccountId}
                    onChange={(e) => setSettings({ ...settings, stripeAccountId: e.target.value })}
                    className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white font-mono focus:outline-none focus:border-stone-900"
                  />
                  <p className="text-[11px] text-stone-500">
                    Your payouts will be deposited directly to this Stripe ID via rolling transfers.
                  </p>
                </div>
              )}

              {settings.payoutMethod === 'paypal' && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    PayPal Business Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.paypalEmail}
                    onChange={(e) => setSettings({ ...settings, paypalEmail: e.target.value })}
                    className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-stone-900"
                  />
                  <p className="text-[11px] text-stone-500">
                    Net payouts will be deposited directly into this PayPal wallet.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payout Schedule
                </label>
                <select
                  value={settings.payoutSchedule}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payoutSchedule: e.target.value as 'daily' | 'weekly' | 'monthly'
                    })
                  }
                  className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-stone-900"
                >
                  <option value="daily">Daily (2 business days rolling payout)</option>
                  <option value="weekly">Weekly (Every Monday morning)</option>
                  <option value="monthly">Monthly (First day of each month)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Save Payout Account Details
                </button>
                {saveSuccess && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Saved successfully</span>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Tab 3: Detailed Ledger */}
          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
                  <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Pass</th>
                      <th className="py-2.5 px-3 text-right">Gross</th>
                      <th className="py-2.5 px-3 text-right">Fee</th>
                      <th className="py-2.5 px-3 text-right">Net Payout</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 text-[11px] text-stone-500 whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-stone-900">
                          {tx.buyerName}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">
                          {tx.passType}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium tabular-nums">
                          ${tx.grossAmount.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-stone-500 tabular-nums">
                          -${tx.processingFee.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-800 tabular-nums">
                          ${tx.netPayout.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[11px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-medium">
                            {tx.status === 'transferred' ? 'Deposited' : 'Scheduled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
