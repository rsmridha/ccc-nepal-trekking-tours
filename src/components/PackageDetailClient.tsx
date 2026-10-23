"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Footprints,
  Hotel,
  Utensils,
  Star,
  FileDown,
  Images,
  Map,
  ChevronDown,
  BedDouble,
  Car,
  Mountain,
  PersonStanding,
  Ruler,
  CheckCircle2,
  XCircle,
  Calendar,
  Briefcase,
  Mail,
  SquareCheckBig,
  MessageCircle,
  X,
  Send,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { TrekPackage } from "@/lib/db";
import PackageCard from "./PackageCard";

export default function PackageDetailClient({
  pkg,
  similarPackages,
}: {
  pkg: TrekPackage;
  similarPackages: TrekPackage[];
}) {
  const [tier, setTier] = useState<"deluxe" | "luxury">("deluxe");
  const [openDays, setOpenDays] = useState<number[]>([1, 2]);
  const [showGroupDiscount, setShowGroupDiscount] = useState(false);
  const [departureTab, setDepartureTab] = useState<"fixed" | "private">("fixed");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(pkg.faqs[0]?.id ?? null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Inquiry modal state
  const [inqName, setInqName] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqMessage, setInqMessage] = useState("");
  const [inqSubmitted, setInqSubmitted] = useState(false);
  const [inqSubmitting, setInqSubmitting] = useState(false);

  const activePrice = tier === "luxury" ? pkg.luxuryPrice : pkg.price;
  const activeRegularPrice =
    tier === "luxury" ? pkg.luxuryRegularPrice : pkg.regularPrice;

  const toggleDay = (day: number) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const expandAllDays = () => setOpenDays(pkg.itineraries.map((i) => i.day));
  const collapseAllDays = () => setOpenDays([]);

  const months = Array.from(
    new Set(pkg.departures.map((d) => d.startDate.slice(0, 7)))
  );

  const filteredDepartures =
    selectedMonth === "all"
      ? pkg.departures
      : pkg.departures.filter((d) => d.startDate.startsWith(selectedMonth));

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInqSubmitting(true);
    await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: inqName,
        email: inqEmail,
        phone: inqPhone,
        subject: `Trip Inquiry: ${pkg.title}`,
        packageSlug: pkg.slug,
        message: inqMessage,
      }),
    });
    setInqSubmitting(false);
    setInqSubmitted(true);
  };

  return (
    <div className="bg-[#f5f9fd] pb-20">
      {/* Sticky Section Sub-Navigation */}
      <nav className="sticky top-[60px] lg:top-[116px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2.5 text-xs sm:text-sm font-bold text-slate-600 whitespace-nowrap">
            <a href="#overview" className="px-3 py-1.5 rounded-lg hover:bg-sky-50 hover:text-[#006ebf]">
              Overview
            </a>
            <a href="#itinerary" className="px-3 py-1.5 rounded-lg hover:bg-sky-50 hover:text-[#006ebf]">
              Itinerary ({pkg.itineraries.length}d)
            </a>
            <a href="#cost" className="px-3 py-1.5 rounded-lg hover:bg-sky-50 hover:text-[#006ebf]">
              Cost Details
            </a>
            <a href="#departures" className="px-3 py-1.5 rounded-lg hover:bg-sky-50 hover:text-[#006ebf]">
              Trip Dates
            </a>
            <a href="#faq" className="px-3 py-1.5 rounded-lg hover:bg-sky-50 hover:text-[#006ebf]">
              FAQs
            </a>
            <a href="#notes" className="px-3 py-1.5 rounded-lg hover:bg-sky-50 hover:text-[#006ebf]">
              Important Notes
            </a>
            <a href="#reviews" className="px-3 py-1.5 rounded-lg hover:bg-sky-50 hover:text-[#006ebf]">
              Reviews ({pkg.reviewCount})
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-slate-500">
              From <strong className="text-sm text-[#0b243b]">USD {activePrice.toLocaleString()}</strong>
            </span>
            <Link
              href={`/booking?slug=${pkg.slug}&tier=${tier}`}
              className="px-4 py-1.5 rounded-full bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Gallery Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-3xl overflow-hidden relative h-[320px] sm:h-[440px] shadow-md">
          <button
            type="button"
            onClick={() => setLightboxIdx(0)}
            className="md:col-span-8 h-full relative group overflow-hidden bg-slate-900 text-left"
          >
            <img
              src={pkg.gallery[0] || pkg.heroImage}
              alt={pkg.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </button>

          <div className="hidden md:flex md:col-span-4 flex-col gap-3 h-full">
            <button
              type="button"
              onClick={() => setLightboxIdx(1 % pkg.gallery.length)}
              className="flex-1 relative group overflow-hidden bg-slate-900"
            >
              <img
                src={pkg.gallery[1] || pkg.heroImage}
                alt={`${pkg.title} view 2`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
            <button
              type="button"
              onClick={() => setLightboxIdx(2 % pkg.gallery.length)}
              className="flex-1 relative group overflow-hidden bg-slate-900"
            >
              <img
                src={pkg.gallery[2] || pkg.gallery[0] || pkg.heroImage}
                alt={`${pkg.title} view 3`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setLightboxIdx(0)}
            className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-slate-900 text-xs font-extrabold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Images className="w-4 h-4 text-[#006ebf]" />
            View image gallery ({pkg.gallery.length})
          </button>
        </div>

        {/* Title, TripAdvisor Rating & PDF Download */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <nav className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#006ebf]">
                Home
              </Link>
              <span>/</span>
              <Link href={`/destination/${pkg.destinationSlug}`} className="hover:text-[#006ebf]">
                {pkg.region}
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-bold">{pkg.title}</span>
            </nav>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0b243b]">
              {pkg.title} – {pkg.duration} Days
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g293890-d15519243-Reviews-Nepal_Trekking_Tours-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
            >
              <span className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                ))}
              </span>
              See reviews on TripAdvisor
            </a>

            <Link
              href={`/itinerary/${pkg.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#006ebf] text-slate-700 hover:text-[#006ebf] text-xs font-bold transition-colors shadow-2xs"
            >
              <FileDown className="w-4 h-4 text-[#006ebf]" />
              Printable Trip PDF Dossier
            </Link>
          </div>
        </div>

        {/* 4-Column Package Top Summary Bar (Activities, Accommodation Selector, Meals, Price) */}
        <div className="mt-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Col 1: Activities */}
          <div className="lg:col-span-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] flex items-center gap-2 mb-3">
              <Footprints className="w-4 h-4" /> Activities & Grading
            </h5>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li>• Total <strong>{pkg.duration} days</strong> trip</li>
              <li>• Guided <strong>deluxe lodge</strong> trek</li>
              <li>• Kathmandu heritage sightseeing</li>
              <li>• <strong>FREE</strong> welcome cultural dinner</li>
              <li>• <strong>FREE</strong> post-trek body massage</li>
            </ul>
            <p className="mt-3 text-xs font-bold text-slate-500">
              Grading: <span className="text-slate-800">{pkg.difficulty}</span> · Max Alt:{" "}
              <span className="text-slate-800">{pkg.maxAltitude}</span>
            </p>
          </div>

          {/* Col 2: Accommodation with Interactive Tier Selector */}
          <div className="lg:col-span-4 border-b md:border-b-0 lg:border-r border-slate-100 pb-4 md:pb-0 lg:pr-4">
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] flex items-center gap-2 mb-2.5">
              <Hotel className="w-4 h-4" /> Accommodation Tier
            </h5>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as "deluxe" | "luxury")}
              className="w-full px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50/50 text-xs sm:text-sm font-bold text-[#0b243b] mb-3 focus:outline-none focus:ring-2 focus:ring-[#006ebf]"
            >
              <option value="deluxe">4-Star Hotel in Kathmandu + Deluxe Lodges</option>
              <option value="luxury">5-Star Hotel in Kathmandu + Luxury VIP Lodges</option>
            </select>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li>
                • 2–3 nights{" "}
                <strong className="text-amber-800">
                  {tier === "luxury" ? "5-Star Luxury Hotel" : "4-Star Deluxe Hotel"}
                </strong>{" "}
                in Kathmandu
              </li>
              <li>
                • 7+ nights{" "}
                <strong className="text-amber-800">
                  {tier === "luxury" ? "Luxury Yeti Mountain Home / VIP Lodge" : "Exclusive Deluxe Attached-Bath Lodge"}
                </strong>{" "}
                with hot shower
              </li>
              <li>
                • High-altitude best available heated lodges
              </li>
            </ul>
          </div>

          {/* Col 3: Meals */}
          <div className="lg:col-span-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4" /> Meals Included
            </h5>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li>• <strong>{pkg.duration - 1}</strong> Lavish Breakfasts</li>
              <li>• <strong>{pkg.duration - 3}</strong> Healthy Trail Lunches</li>
              <li>• <strong>{pkg.duration - 2}</strong> Fresh Hot Dinners</li>
              <li>• Daily seasonal fresh fruit & hot herbal tea</li>
            </ul>
          </div>

          {/* Col 4: Price Summary */}
          <div className="lg:col-span-2 flex flex-col justify-center items-start lg:items-end text-left lg:text-right">
            <span className="text-xs font-bold text-slate-400">
              Price From{" "}
              <del className="text-rose-500 font-semibold">
                ${activeRegularPrice.toLocaleString()}
              </del>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#0b243b] mt-0.5">
              USD {activePrice.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">per person</span>
            <div className="flex items-center gap-0.5 text-amber-400 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <a href="#reviews" className="text-xs font-bold text-[#006ebf] hover:underline mt-1">
              Read {pkg.reviewCount} Reviews
            </a>
          </div>
        </div>

        {/* Two-Column Body: Main Content + Sticky Booking Sidebar */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Trip Highlights */}
            {pkg.highlightsHtml && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block mb-1">
                  At a Glance
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b] mb-4">
                  Trip Highlights
                </h2>
                <div
                  className="prose-himalaya text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: pkg.highlightsHtml }}
                />
              </section>
            )}

            {/* Overview */}
            <section
              id="overview"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-36"
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block mb-1">
                About This Journey
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b] mb-4">
                {pkg.title} Overview
              </h2>
              {pkg.overviewHtml ? (
                <div
                  className="prose-himalaya text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: pkg.overviewHtml }}
                />
              ) : (
                <p className="text-slate-600 leading-relaxed">{pkg.overviewText}</p>
              )}
            </section>

            {/* Day-by-Day Itinerary */}
            <section
              id="itinerary"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-36"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#006ebf] flex items-center justify-center">
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block">
                      Day-by-Day Route Plan
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b]">
                      {pkg.title} Itinerary
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={expandAllDays}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#006ebf] text-xs font-bold text-slate-700 hover:text-[#006ebf] transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllDays}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#006ebf] text-xs font-bold text-slate-700 hover:text-[#006ebf] transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {pkg.itineraries.map((dayItem) => {
                  const isOpen = openDays.includes(dayItem.day);
                  return (
                    <div
                      key={dayItem.day}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen ? "border-sky-200 bg-sky-50/20 shadow-xs" : "border-slate-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDay(dayItem.day)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="px-3 py-1 rounded-xl bg-[#0b243b] text-amber-400 text-xs font-extrabold shrink-0">
                            Day {String(dayItem.day).padStart(2, "0")}
                          </span>
                          <span className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                            {dayItem.title.replace(/^Day\s*\d+\s*:\s*/i, "")}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-[#006ebf] shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                          <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            {dayItem.description}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200/70 text-xs">
                            <div className="flex items-start gap-2">
                              <BedDouble className="w-4 h-4 text-[#006ebf] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-slate-400 block">Accommodation</span>
                                <strong className="text-slate-700">{dayItem.accommodation}</strong>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-slate-400 block">Meals</span>
                                <strong className="text-slate-700">{dayItem.meal}</strong>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mountain className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-slate-400 block">Altitude</span>
                                <strong className="text-slate-700">{dayItem.altitude}</strong>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Car className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-slate-400 block">Transport</span>
                                <strong className="text-slate-700">{dayItem.transportation}</strong>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <PersonStanding className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-slate-400 block">Walking Time</span>
                                <strong className="text-slate-700">{dayItem.walking}</strong>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Ruler className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-slate-400 block">Distance</span>
                                <strong className="text-slate-700">{dayItem.distance}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Cost Inclusions & Exclusions */}
            <section
              id="cost"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-36"
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block mb-1">
                Transparent All-Inclusive Pricing
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b] mb-6">
                Cost Details (Includes & Excludes)
              </h2>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <h3 className="text-base font-extrabold text-emerald-900 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    What&apos;s Included in Your Package
                  </h3>
                  {pkg.includesHtml ? (
                    <div
                      className="prose-himalaya text-sm"
                      dangerouslySetInnerHTML={{ __html: pkg.includesHtml }}
                    />
                  ) : (
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>✓ Airport pick-up and drop-off by private luxury vehicle</li>
                      <li>✓ Deluxe hotel accommodation in Kathmandu with breakfast</li>
                      <li>✓ Full board meals (Breakfast, Lunch & Dinner) during the trek</li>
                      <li>✓ Experienced government-licensed Expert Representative & porter support</li>
                      <li>✓ Domestic flights & all TIMS / National Park trekking permits</li>
                    </ul>
                  )}
                </div>

                <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200">
                  <h3 className="text-base font-extrabold text-rose-900 flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    What&apos;s Excluded
                  </h3>
                  {pkg.excludesHtml ? (
                    <div
                      className="prose-himalaya text-sm"
                      dangerouslySetInnerHTML={{ __html: pkg.excludesHtml }}
                    />
                  ) : (
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>✗ International airfare to/from Kathmandu & Nepal entry visa fee</li>
                      <li>✗ Personal travel, medical, and high-altitude helicopter evacuation insurance</li>
                      <li>✗ Alcoholic beverages, personal snacks, and tips for guide & porter</li>
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* Availability & Fixed Departures */}
            <section
              id="departures"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-36"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block mb-1">
                    Availability & Group Join
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b]">
                    Upcoming Trip Dates (2026 / 2027)
                  </h2>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDepartureTab("fixed")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      departureTab === "fixed"
                        ? "bg-[#0b243b] text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Fixed Departures
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepartureTab("private")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      departureTab === "private"
                        ? "bg-[#0b243b] text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Private Trip
                  </button>
                </div>
              </div>

              {departureTab === "fixed" ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-bold text-slate-500">
                      Filter by Departure Month:
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
                    >
                      <option value="all">All Upcoming Months</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDepartures.map((dep) => (
                      <div
                        key={dep.id}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-sky-300 bg-[#f5f9fd]/60 flex flex-col justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                            <Calendar className="w-4 h-4 text-[#006ebf]" />
                            <span>
                              {dep.startDate} → {dep.endDate}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {dep.status}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-500 block">Package Price</span>
                            <strong className="text-base font-extrabold text-[#0b243b]">
                              From US$ {activePrice.toLocaleString()}
                            </strong>
                          </div>
                          <Link
                            href={`/booking?slug=${pkg.slug}&date=${dep.startDate}&tier=${tier}`}
                            className="px-5 py-2 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold transition-colors"
                          >
                            Join Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-4">
                  <h3 className="text-lg font-extrabold text-[#0b243b]">
                    Prefer Your Own Private Departure Date?
                  </h3>
                  <p className="text-sm text-slate-600 max-w-xl mx-auto">
                    We run private Deluxe and Luxury treks any day of the season for solo travelers, couples, families, and private groups—at no extra hidden surcharge for 2+ guests.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      href={`/booking?slug=${pkg.slug}&tier=${tier}`}
                      className="px-6 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-extrabold hover:bg-[#0b243b]"
                    >
                      Pick Custom Date & Book
                    </Link>
                    <Link
                      href={`/custom-trip?package=${pkg.slug}`}
                      className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-extrabold hover:border-[#006ebf]"
                    >
                      Customize This Itinerary
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* Trip FAQs */}
            {pkg.faqs.length > 0 && (
              <section
                id="faq"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-36"
              >
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block mb-1">
                  Common Questions
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b] mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                  {pkg.faqs.map((f) => {
                    const isOpen = openFaqId === f.id;
                    return (
                      <div key={f.id} className="bg-white">
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : f.id)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50"
                        >
                          <span className="font-bold text-slate-800 text-sm">
                            {f.question}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#006ebf] shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 pt-2 text-sm text-slate-600 bg-sky-50/20">
                            {f.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Important Notes */}
            {pkg.notesHtml && (
              <section
                id="notes"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-36"
              >
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block mb-1">
                  Essential Briefing
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b] mb-4">
                  Important Notes & Safety Guidelines
                </h2>
                <div
                  className="prose-himalaya text-sm"
                  dangerouslySetInnerHTML={{ __html: pkg.notesHtml }}
                />
              </section>
            )}

            {/* Reviews Section */}
            <section
              id="reviews"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-36"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block mb-1">
                    Verified Guest Feedback
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b243b]">
                    Traveller Reviews ({pkg.reviewCount})
                  </h2>
                </div>
                <Link
                  href={`/write-a-review?package=${encodeURIComponent(pkg.title)}`}
                  className="px-5 py-2.5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold transition-colors self-start"
                >
                  Write a Review
                </Link>
              </div>

              <div className="space-y-4">
                {pkg.reviews.length > 0 ? (
                  pkg.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-[#f5f9fd] border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-[#0b243b] text-amber-400 font-bold text-sm flex items-center justify-center">
                            {rev.author.charAt(0)}
                          </span>
                          <div>
                            <strong className="text-sm font-bold text-slate-800 block">
                              {rev.author}
                            </strong>
                            <span className="text-xs text-slate-500">
                              {rev.country} · {rev.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm pt-1">{rev.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Rated 5.0 ★ by verified travelers on TripAdvisor and Google.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Floating Booking Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-40 space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Best Price Guaranteed
                </span>
                <span className="text-xs font-bold text-amber-600 uppercase">
                  {tier === "luxury" ? "5-Star Luxury Tier" : "Deluxe Tier"}
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Price From{" "}
                <del className="text-rose-500 font-semibold">
                  ${activeRegularPrice.toLocaleString()}
                </del>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black text-[#0b243b]">
                  USD {activePrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ person</span>
              </div>

              {/* Group Booking Discount Accordion */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGroupDiscount(!showGroupDiscount)}
                  className="w-full flex items-center justify-between text-xs font-extrabold text-[#006ebf] hover:underline py-1"
                >
                  <span>See Group Booking Discount</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showGroupDiscount ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showGroupDiscount && (
                  <div className="mt-2.5 rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-1.5 text-xs">
                    {pkg.groupDiscounts.map((gd) => (
                      <div key={gd.label} className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">{gd.label}</span>
                        <strong className="text-slate-900">
                          ${(tier === "luxury" ? gd.luxuryPrice : gd.deluxePrice).toLocaleString()}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <Link
                  href={`/booking?slug=${pkg.slug}&tier=${tier}`}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Briefcase className="w-4 h-4" /> Book This Trip Now
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setInqSubmitted(false);
                    setInquiryModalOpen(true);
                  }}
                  className="w-full py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#006ebf]" /> Quick Inquiry
                </button>

                <Link
                  href={`/custom-trip?package=${pkg.slug}`}
                  className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <SquareCheckBig className="w-4 h-4" /> Design Your Own Trip
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2.5 px-5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <FileDown className="w-4 h-4" /> Download Printable Dossier (PDF)
                </button>
              </div>

              {/* Expert Card */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/team/expert-representative.png"
                    alt="Expert Representative"
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <div className="text-sm font-extrabold text-[#0b243b]">
                      Ask Expert Representative
                    </div>
                    <div className="text-xs text-slate-500">
                      Lead Trekking Expert
                    </div>
                  </div>
                </div>
                <a
                  href={`https://api.whatsapp.com/send?phone=18888208072&text=${encodeURIComponent(
                    `Hi Expert Representative, I have a question about ${pkg.title}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Trips */}
        {similarPackages.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b243b] mb-8">
              Similar Himalayan Trips You May Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarPackages.map((sp) => (
                <PackageCard key={sp.slug} pkg={sp} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full">
            <img
              src={pkg.gallery[lightboxIdx] || pkg.heroImage}
              alt={pkg.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto">
              {pkg.gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIdx(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 ${
                    lightboxIdx === i ? "border-amber-400" : "border-transparent opacity-60"
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] block mb-1">
              Direct Expert Consultation
            </span>
            <h3 className="text-xl font-extrabold text-[#0b243b]">
              Inquire About {pkg.title}
            </h3>

            {inqSubmitted ? (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-extrabold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Inquiry Received!
                </div>
                <p className="text-xs sm:text-sm">
                  Thank you! Our Expert Representative and Kathmandu team will reply to your email within 12–24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={inqPhone}
                      onChange={(e) => setInqPhone(e.target.value)}
                      placeholder="+1 415 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Questions (Dates, Group Size, Gear, Flights) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inqMessage}
                    onChange={(e) => setInqMessage(e.target.value)}
                    placeholder="Tell us your preferred travel month, number of trekkers, or any customization questions..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={inqSubmitting}
                  className="w-full py-3 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {inqSubmitting ? "Sending..." : "Send Inquiry to Expert Representative Team"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
