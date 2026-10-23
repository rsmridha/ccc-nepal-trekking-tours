"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Users,
  Hotel,
  CreditCard,
  Printer,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import { TrekPackage, BookingRecord } from "@/lib/db";

export default function BookingClient({
  packages,
  initialSlug = "",
  initialDate = "",
  initialTier = "deluxe",
}: {
  packages: TrekPackage[];
  initialSlug?: string;
  initialDate?: string;
  initialTier?: string;
}) {
  const [selectedSlug, setSelectedSlug] = useState(
    initialSlug || packages[0]?.slug || "deluxe-everest-base-camp-trek"
  );
  const [tier, setTier] = useState<"deluxe" | "luxury">(
    initialTier === "luxury" ? "luxury" : "deluxe"
  );
  const [travelers, setTravelers] = useState<number>(2);
  const [departureDate, setDepartureDate] = useState<string>(
    initialDate || "2026-11-15"
  );
  const [heliUpgrade, setHeliUpgrade] = useState(false);
  const [extraNight, setExtraNight] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"deposit" | "full" | "wire">("deposit");
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const currentPkg = useMemo(
    () => packages.find((p) => p.slug === selectedSlug) || packages[0],
    [packages, selectedSlug]
  );

  const perPersonPrice = useMemo(() => {
    if (!currentPkg) return 1899;
    const base = tier === "luxury" ? currentPkg.luxuryPrice : currentPkg.price;
    if (travelers === 1) return base + 250;
    if (travelers >= 4 && travelers <= 6) return Math.round(base * 0.93);
    if (travelers >= 7) return Math.round(base * 0.87);
    return base;
  }, [currentPkg, tier, travelers]);

  const addonsTotal =
    (heliUpgrade ? 950 * travelers : 0) + (extraNight ? 140 * travelers : 0);

  const totalPrice = perPersonPrice * travelers + addonsTotal;
  const depositAmount = Math.round(totalPrice * 0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPkg) return;
    setSubmitting(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageSlug: currentPkg.slug,
        packageTitle: currentPkg.title,
        customerName,
        customerEmail,
        customerPhone,
        country,
        departureDate,
        travelers,
        tier:
          tier === "luxury"
            ? "5-Star Luxury Hotel + VIP Mountain Lodges"
            : "4-Star Deluxe Hotel + Deluxe Attached-Bath Lodges",
        totalPrice,
        depositPaid: paymentMethod === "full" ? totalPrice : depositAmount,
        paymentMethod,
        specialRequests: [
          specialRequests,
          heliUpgrade ? "Add-on: Helicopter Return Charter" : "",
          extraNight ? "Add-on: Extra Kathmandu Hotel Night" : "",
        ]
          .filter(Boolean)
          .join(" | "),
      }),
    });

    const data = await res.json();
    setSubmitting(false);
    if (data.booking) {
      setConfirmedBooking(data.booking);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">
                Official Booking Confirmation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0b243b]">
                Reservation Confirmed!
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600">
            Thank you, <strong>{confirmedBooking.customerName}</strong>! Your Himalayan adventure has been registered in our system and assigned to our Lead Trip Coordinator <strong>Expert Representative</strong>.
          </p>

          <div className="bg-[#f5f9fd] rounded-2xl p-6 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Booking Reference ID</span>
              <strong className="text-base font-black text-[#006ebf]">
                {confirmedBooking.id}
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Selected Package</span>
              <strong className="text-slate-800">{confirmedBooking.packageTitle}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Departure Date</span>
              <strong className="text-slate-800">{confirmedBooking.departureDate}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Group Size & Tier</span>
              <strong className="text-slate-800">
                {confirmedBooking.travelers} Guests · {confirmedBooking.tier}
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Total Package Price</span>
              <strong className="text-lg font-black text-[#0b243b]">
                USD {confirmedBooking.totalPrice.toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Payment Status</span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {confirmedBooking.paymentStatus} (USD {confirmedBooking.depositPaid.toLocaleString()})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/invoice/${confirmedBooking.id}`}
              className="px-5 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-bold inline-flex items-center gap-2 hover:bg-[#0b243b]"
            >
              <Printer className="w-4 h-4" /> Official PDF Invoice & Voucher
            </Link>
            <Link
              href={`/itinerary/${confirmedBooking.packageSlug}`}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold inline-flex items-center gap-2 hover:bg-slate-50"
            >
              Printable Day-by-Day Itinerary
            </Link>
            <Link
              href={`/${confirmedBooking.packageSlug}`}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-2 hover:bg-slate-50"
            >
              Return to Trip Page <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold"
            >
              View in Admin CMS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8"
        >
          {/* Step 1: Select Trip & Comfort Tier */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] block mb-1">
              Step 1 of 3
            </span>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Choose Your Himalayan Trip & Comfort Tier
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Trek or Tour Package *
                </label>
                <select
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white"
                >
                  {packages.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title} ({p.duration} Days) — From ${p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTier("deluxe")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    tier === "deluxe"
                      ? "border-[#006ebf] bg-sky-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold uppercase text-[#006ebf]">
                      Deluxe Package
                    </span>
                    <span className="text-base font-black text-[#0b243b]">
                      ${currentPkg?.price.toLocaleString()}/pp
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    4-Star Kathmandu Hotel + Deluxe Attached-Bath Mountain Lodges
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setTier("luxury")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    tier === "luxury"
                      ? "border-amber-500 bg-amber-50/40"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold uppercase text-amber-700">
                      5-Star Luxury VIP
                    </span>
                    <span className="text-base font-black text-[#0b243b]">
                      ${currentPkg?.luxuryPrice.toLocaleString()}/pp
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    5-Star Heritage Hotel + Yeti Mountain Homes / Luxury VIP Lodges
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Preferred Departure Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Number of Travelers (Group Discount Applied) *
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Traveler (Solo Private)" : "Travelers"}
                        {n >= 4 && n <= 6 ? " (7% Group Discount)" : n >= 7 ? " (13% Group Discount)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Upgrades */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Optional Himalayan Upgrades
                </label>
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={heliUpgrade}
                      onChange={(e) => setHeliUpgrade(e.target.checked)}
                      className="w-4 h-4 accent-[#006ebf]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">
                      Scenic Helicopter Return Flight to Lukla / Kathmandu
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#006ebf]">+$950 / person</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraNight}
                      onChange={(e) => setExtraNight(e.target.checked)}
                      className="w-4 h-4 accent-[#006ebf]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">
                      Extra Night at Luxury Hotel in Kathmandu (with Airport Transfer)
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#006ebf]">+$140 / person</span>
                </label>
              </div>
            </div>
          </div>

          {/* Step 2: Lead Traveler Details */}
          <div className="pt-6 border-t border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] block mb-1">
              Step 2 of 3
            </span>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Lead Traveler Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (as on Passport) *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Adam Smith"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (415) 890-2341"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nationality / Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States, UK, Australia..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dietary Requirements, Rooming Preference (Twin/Double) or Special Notes
              </label>
              <textarea
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Let us know any dietary restrictions (vegetarian, gluten-free), flight details, or gear sizes..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          {/* Step 3: Payment Option */}
          <div className="pt-6 border-t border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] block mb-1">
              Step 3 of 3
            </span>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Payment & Deposit Preference
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("deposit")}
                className={`p-4 rounded-2xl border-2 text-left ${
                  paymentMethod === "deposit"
                    ? "border-[#006ebf] bg-sky-50/40"
                    : "border-slate-200"
                }`}
              >
                <div className="text-xs font-extrabold text-[#006ebf]">20% Deposit Now</div>
                <div className="text-lg font-black text-[#0b243b] mt-1">
                  USD {depositAmount.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Lock in permits & Lukla flights; pay balance on arrival
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("full")}
                className={`p-4 rounded-2xl border-2 text-left ${
                  paymentMethod === "full"
                    ? "border-[#006ebf] bg-sky-50/40"
                    : "border-slate-200"
                }`}
              >
                <div className="text-xs font-extrabold text-emerald-700">100% Full Payment</div>
                <div className="text-lg font-black text-[#0b243b] mt-1">
                  USD {totalPrice.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Complete payment via Visa / MasterCard / Amex
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("wire")}
                className={`p-4 rounded-2xl border-2 text-left ${
                  paymentMethod === "wire"
                    ? "border-[#006ebf] bg-sky-50/40"
                    : "border-slate-200"
                }`}
              >
                <div className="text-xs font-extrabold text-amber-700">Bank Wire / Invoice</div>
                <div className="text-lg font-black text-[#0b243b] mt-1">
                  Reserve Seat
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Receive SWIFT bank wire invoice from Kathmandu office
                </p>
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full py-4 rounded-2xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              {submitting
                ? "Confirming Reservation..."
                : `Confirm Booking — USD ${(paymentMethod === "full" ? totalPrice : depositAmount).toLocaleString()}`}
            </button>
          </div>
        </form>

        {/* Right Live Summary Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-36 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
          {currentPkg && (
            <>
              <div className="rounded-2xl overflow-hidden h-44 relative">
                <img
                  src={currentPkg.heroImage}
                  alt={currentPkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                    {currentPkg.region} · {currentPkg.duration} Days
                  </span>
                  <h3 className="text-base font-extrabold leading-snug">
                    {currentPkg.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Comfort Tier</span>
                  <strong className="text-slate-800 capitalize">{tier} Tier</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Departure Date</span>
                  <strong className="text-slate-800">{departureDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Rate ({travelers} × ${perPersonPrice.toLocaleString()})
                  </span>
                  <strong className="text-slate-800">
                    ${(perPersonPrice * travelers).toLocaleString()}
                  </strong>
                </div>
                {heliUpgrade && (
                  <div className="flex justify-between text-sky-700">
                    <span>Helicopter Return Add-on</span>
                    <strong>+${(950 * travelers).toLocaleString()}</strong>
                  </div>
                )}
                {extraNight && (
                  <div className="flex justify-between text-sky-700">
                    <span>Extra Kathmandu Hotel Night</span>
                    <strong>+${(140 * travelers).toLocaleString()}</strong>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-600">Total Trip Cost</span>
                  <span className="text-2xl font-black text-[#0b243b]">
                    USD {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-emerald-700 font-bold mt-1">
                  <span>Due Today (20% Deposit)</span>
                  <span>USD {depositAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-slate-600 space-y-1.5">
                <div className="font-extrabold text-[#0b243b] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#006ebf]" />
                  Flexible Himalayan Booking Promise
                </div>
                <p>✓ Free date postponement up to 30 days before departure</p>
                <p>✓ Guaranteed domestic Lukla flights & 20kg baggage allowance</p>
                <p>✓ Direct support from Expert Representative in Kathmandu</p>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
