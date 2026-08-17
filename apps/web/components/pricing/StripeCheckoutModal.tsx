"use client";
import React, { useState } from 'react';
import { CreditCard, Lock, Sparkles, X, CheckCircle, Loader2 } from 'lucide-react';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  planId: 'free' | 'basic' | 'pro';
  userEmail: string;
  onSuccess: (tier: 'FREE' | 'BASIC' | 'PRO') => void;
}

export default function StripeCheckoutModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  planId,
  userEmail,
  onSuccess,
}: StripeCheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    zip: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Simulate Stripe webhook call to database
      const backendTier = planId.toUpperCase() as 'FREE' | 'BASIC' | 'PRO';
      await fetch('/api/billing/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'customer.subscription.created',
          data: {
            email: userEmail,
            tier: backendTier,
          },
        }),
      });

      // 2. Success delay
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        // 3. Trigger tier switch on frontend auth context
        onSuccess(backendTier);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }, 2000);
    } catch (err) {
      console.error('Failed mock stripe transaction:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden">
        {/* Glow accent matching selected plan */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          planId === 'basic' ? 'bg-blue-500' : 'bg-emerald-500'
        }`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-300 rounded-lg transition"
          aria-label="Close billing overlay"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-400 animate-bounce" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Payment Successful</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Your subscription is active. Enabling advanced linguistic capabilities and telemetry node clusters.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-5">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 rounded-md px-2 py-0.5 uppercase tracking-widest">
                Stripe Gateway
              </span>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider pt-2">Checkout Details</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase">Plan: <span className="text-white">{planName}</span> / ${planPrice} mo</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Billed To</span>
                <span className="text-slate-200 font-bold truncate max-w-[200px]">{userEmail}</span>
              </div>
              <div className="w-full h-px bg-slate-900" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Total Charge</span>
                <span className="text-white font-extrabold text-sm">${planPrice}.00</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Card Information
              </label>
              
              <div className="space-y-2">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="4242 4242 4242 4242 (Stripe test)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-500 text-xs font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-500 text-center text-xs font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition"
                    required
                  />
                  <input
                    type="text"
                    name="cvc"
                    value={form.cvc}
                    onChange={handleChange}
                    placeholder="CVC"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-500 text-center text-xs font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition"
                    required
                  />
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="ZIP"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 placeholder-slate-500 text-center text-xs font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-semibold select-none">
              <Lock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>Payments are encrypted and secured in compliance with PCI-DSS guidelines.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold uppercase tracking-wider text-xs border shadow-md transition ${
                loading
                  ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                  : planId === 'basic'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-500" />
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5 shrink-0" />
                  <span>Authorize Subscription Pay</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
