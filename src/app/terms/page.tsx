import React from "react";

export default function TermsPage() {
  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Legal & Booking Policy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Booking Procedures & Terms and Conditions
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
          <h2 className="text-xl font-extrabold text-[#0b243b]">
            1. Reservation & 20% Deposit
          </h2>
          <p>
            To confirm your trek, peak climbing expedition, or luxury tour with CCC Nepal Trekking Tours & Adventure Pvt. Ltd., a 20% non-refundable advance deposit (along with a copy of your passport) is required at the time of booking to secure domestic Lukla/Pokhara air tickets, luxury mountain lodges, and government permits.
          </p>

          <h2 className="text-xl font-extrabold text-[#0b243b]">
            2. Balance Payment on Arrival
          </h2>
          <p>
            The remaining 80% balance can be paid upon arrival in Kathmandu prior to trip departure via cash (USD/EUR/GBP), credit card (Visa/MasterCard/Amex), or bank wire transfer.
          </p>

          <h2 className="text-xl font-extrabold text-[#0b243b]">
            3. Free Date Postponement & Flexibility
          </h2>
          <p>
            If you are unable to travel on your scheduled date due to unforeseen circumstances, you may postpone your trek to any future date within 24 months at no extra administrative fee by notifying us at least 30 days prior to departure.
          </p>

          <h2 className="text-xl font-extrabold text-[#0b243b]">
            4. Travel & Helicopter Rescue Insurance
          </h2>
          <p>
            Comprehensive travel insurance covering high-altitude medical expenses and emergency helicopter evacuation up to 5,600m (or 6,500m for peak climbing) is mandatory for all trekkers.
          </p>
        </div>
      </div>
    </div>
  );
}
