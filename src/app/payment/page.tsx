import React from "react";
import Link from "next/link";
import { CreditCard, Building2, ShieldCheck, ArrowRight } from "lucide-react";

export default function PaymentPage() {
  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Secure Himalayan Checkout
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Book Now & Pay Online</h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            Secure your Himalayan trek with a 20% advance deposit via Credit Card (Visa, MasterCard, Amex) or international SWIFT bank transfer.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#006ebf] flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0b243b]">
            Option 1: Online Package Booking & Card Deposit
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Use our online reservation portal to select your trek, calculate group discounts, and pay your 20% deposit or full balance securely online.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold"
          >
            Go to Online Booking Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0b243b]">
            Option 2: Direct Bank Wire Transfer (SWIFT)
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p><strong>Beneficiary:</strong> CCC Nepal Trekking Tours & Adventure Pvt. Ltd.</p>
            <p><strong>Bank Name:</strong> Himalayan Bank Limited, Thamel Branch</p>
            <p><strong>Account Location:</strong> Kathmandu, Nepal</p>
            <p><strong>SWIFT Code:</strong> HIMANPKA</p>
            <p><strong>Currency:</strong> USD / EUR / GBP</p>
          </div>
          <p className="text-xs text-slate-500">
            Note: Remaining 80% balance can be paid upon arrival in Kathmandu prior to trek departure.
          </p>
        </div>
      </div>
    </div>
  );
}
