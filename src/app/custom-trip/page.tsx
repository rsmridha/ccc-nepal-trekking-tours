"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Compass, ShieldCheck, Phone, Mail } from "lucide-react";

export default function CustomTripPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [destination, setDestination] = useState("Everest Region (EBC / Gokyo / Heli)");
  const [startDate, setStartDate] = useState("2026-11-10");
  const [durationDays, setDurationDays] = useState(14);
  const [travelers, setTravelers] = useState(2);
  const [accommodationLevel, setAccommodationLevel] = useState(
    "Deluxe (4-Star City Hotel & Attached-Bath Mountain Lodges)"
  );
  const [budgetRange, setBudgetRange] = useState("$2,000 - $3,000 per person");
  const [comments, setComments] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/custom-trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        country,
        destination,
        startDate,
        durationDays,
        travelers,
        accommodationLevel,
        budgetRange,
        comments,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.customTrip) {
      setSubmittedId(data.customTrip.id);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-[#0b243b] text-white py-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80"
          alt="Plan a Custom Trip"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Built Around You
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Plan a Custom Trip</h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            No two travelers are the same—tell us your dream Himalayan itinerary, comfort level, and pace, and our Expert Representative will design a bespoke proposal.
          </p>
          <div className="mt-4 text-xs text-sky-200 flex items-center gap-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-bold">Plan a Custom Trip</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {submittedId ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block">
              Reference ID: {submittedId}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b243b]">
              Your Custom Trip Brief Has Been Sent!
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Lead Trip Planner <strong>Expert Representative</strong> is reviewing your custom itinerary request for <strong>{destination}</strong> and will send you a tailored day-by-day plan and quote within 24 hours.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/treks"
                className="px-6 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-extrabold"
              >
                Browse Packages
              </Link>
              <Link
                href="/admin"
                className="px-6 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-extrabold"
              >
                View in Admin CMS
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#006ebf] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0b243b]">
                  Tailor-Made Himalayan Trip Questionnaire
                </h2>
                <p className="text-xs text-slate-500">
                  Ideal for private couples, families, photography groups, and helicopter upgrades
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 415 000 0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Country of Residence *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="USA, UK, Australia, Germany..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Region / Destination *
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option>Everest Region (EBC / Gokyo / Heli)</option>
                  <option>Annapurna Region (Circuit / ABC / Poon Hill)</option>
                  <option>Manaslu & Tsum Valley</option>
                  <option>Upper Mustang Restricted Area</option>
                  <option>Langtang & Gosaikunda Lakes</option>
                  <option>Peak Climbing (Island / Mera / Lobuche)</option>
                  <option>Multi-Country (Nepal, Tibet & Bhutan)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approximate Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration (Days) & Group Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={3}
                    max={45}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                    title="Days"
                  />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                    title="Travelers"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Accommodation Level
                </label>
                <select
                  value={accommodationLevel}
                  onChange={(e) => setAccommodationLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option>Budget (Standard Teahouses)</option>
                  <option>Deluxe (4-Star City Hotel & Attached-Bath Mountain Lodges)</option>
                  <option>Luxury VIP (5-Star Hotels & Yeti Mountain Homes)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Budget per Person (USD)
                </label>
                <input
                  type="text"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  placeholder="e.g. $2,000 - $3,000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Requirements / Dream Itinerary Details *
              </label>
              <textarea
                rows={5}
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us about your walking pace, places you'd love to visit, helicopter return preferences, or special celebrations..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm inline-flex items-center gap-2 shadow-md transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              {loading ? "Submitting Custom Brief..." : "Submit Custom Trip Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
