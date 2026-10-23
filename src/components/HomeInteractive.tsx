"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Star,
  HandCoins,
  Leaf,
  Quote,
  ArrowLeft,
  ArrowRight,
  PenLine,
  ChevronDown,
  CheckCircle2,
  MapPin,
  Clock,
  Send,
} from "lucide-react";
import { TrekPackage, GlobalReview, FAQItem } from "@/lib/db";
import PackageCard from "./PackageCard";

export function HeroSearchWidget({ packages }: { packages: TrekPackage[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const suggestions = query.trim()
    ? packages
        .filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.region.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/treks?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative max-w-xl w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full p-1.5 pl-5 shadow-2xl border border-white/40"
      >
        <Search className="w-5 h-5 text-[#006ebf] shrink-0 mr-3" />
        <input
          type="text"
          value={query}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your trip (e.g. Everest Base Camp, Annapurna, Heli Trek)..."
          className="w-full text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-[#006ebf] hover:bg-[#0b243b] text-white text-sm font-bold transition-colors shrink-0 shadow-md"
        >
          Search
        </button>
      </form>

      {focused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30">
          {suggestions.map((pkg) => (
            <Link
              key={pkg.slug}
              href={`/${pkg.slug}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-sky-50 transition-colors border-b border-slate-100 last:border-none"
            >
              <div>
                <div className="text-sm font-bold text-slate-800">{pkg.title}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#006ebf]" /> {pkg.region}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> {pkg.duration} days
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-[#114463]">
                ${pkg.price.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function HandpickedTripsSection({ packages }: { packages: TrekPackage[] }) {
  const [activeTab, setActiveTab] = useState<"bestseller" | "luxury" | "peak" | "beginner">("bestseller");

  const tabs = [
    { id: "bestseller", label: "Best Seller for 2026/27" },
    { id: "luxury", label: "Luxury & VIP Trekking" },
    { id: "peak", label: "Peak Climbing" },
    { id: "beginner", label: "Beginner & Cultural Trek" },
  ] as const;

  const filtered = packages.filter((p) => {
    if (activeTab === "bestseller") return p.tabCategory === "bestseller" || p.featured;
    return p.tabCategory === activeTab;
  }).slice(0, 6);

  return (
    <section className="py-20 bg-[#f5f9fd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#006ebf] block mb-2">
              Curated Himalayan Journeys
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b243b]">
              Handpicked Treks & <em className="text-[#006ebf] font-serif italic">Tours</em>
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl">
              Our most-booked Himalayan journeys, led by experienced Expert Representatives with handpicked mountain lodges.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0b243b] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#0b243b] hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0b243b] border-2 border-[#0b243b] font-bold text-sm hover:bg-[#0b243b] hover:text-white transition-colors shadow-sm"
          >
            Explore All {packages.length} Himalayan Packages
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ReviewsShowcaseSection({ reviews }: { reviews: GlobalReview[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const list = reviews.slice(0, 10);
  const current = list[selectedIdx] || list[0];

  if (!current) return null;

  return (
    <section className="py-20 bg-white border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#006ebf] block mb-2">
              Traveller Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b243b]">
              What Our Clients <em className="text-[#006ebf] font-serif italic">Say</em>
            </h2>
            <p className="text-slate-500 mt-1">
              66+ verified 5-star stories from trekkers and climbers around the world
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g293890-d15519243-Reviews-Nepal_Trekking_Tours-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100"
            >
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              TripAdvisor 5.0
            </a>
            <a
              href="https://share.google/8tVoiz5mIuUkKY1oM"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-100"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Google 5.0
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Review Card */}
          <article className="lg:col-span-7 bg-gradient-to-br from-[#0b243b] to-[#114463] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl">
            <Quote className="w-24 h-24 text-white/10 absolute top-6 right-6 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs font-semibold text-sky-200">
                  Verified via {current.platform}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-4 leading-snug">
                &ldquo;{current.title}&rdquo;
              </h3>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {current.comment}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-lg">
                  {current.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong className="block text-base font-bold text-white">
                    {current.author}
                  </strong>
                  <span className="text-xs text-sky-200">{current.country}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-sky-200">
                  {String(selectedIdx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIdx((prev) => (prev === 0 ? list.length - 1 : prev - 1))}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous review"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIdx((prev) => (prev + 1) % list.length)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next review"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          {/* Selectable Reviewer List */}
          <aside className="lg:col-span-5 flex flex-col justify-between bg-[#f5f9fd] rounded-3xl p-6 border border-slate-200">
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {list.map((rev, idx) => (
                <button
                  key={rev.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center gap-3.5 transition-all ${
                    selectedIdx === idx
                      ? "bg-white shadow-md border border-sky-200"
                      : "hover:bg-white/60 border border-transparent"
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${
                      selectedIdx === idx
                        ? "bg-[#006ebf] text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {rev.author.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-800 truncate">
                      {rev.author}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        · {rev.country}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">{rev.title}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-3">
              <Link
                href="/review"
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                Read All Reviews <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/write-a-review"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <PenLine className="w-3.5 h-3.5" /> Write a Review
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function HomeFaqSection({ faqs }: { faqs: FAQItem[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);
  const [showAll, setShowAll] = useState(false);

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 8);

  return (
    <section className="py-20 bg-white border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#006ebf] block mb-2">
            Pre-Trip Knowledge Base
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b243b] leading-tight">
            Frequently Asked Questions{" "}
            <em className="text-[#006ebf] font-serif italic">by Travelers</em>
          </h2>
          <p className="text-slate-600 mt-4 leading-relaxed">
            Everything you need to know before your Himalayan trip—from airport pickup, luggage storage, and porter weights to hot showers, Wi-Fi, and altitude safety.
          </p>
          <div className="mt-6">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#0b243b] text-[#0b243b] font-bold text-sm hover:bg-[#0b243b] hover:text-white transition-colors"
            >
              Ask Our Expert Representative <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-[#f5f9fd] overflow-hidden">
            {visibleFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#006ebf] shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-sky-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {faqs.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#006ebf] hover:underline"
            >
              {showAll ? "Show fewer questions" : `Show all ${faqs.length} questions`}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function NewsletterBand() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setSubmitted(true);
    setName("");
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#0b243b] via-[#114463] to-[#006ebf] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Subscribe for Himalayan Dispatch & Seasonal Offers
        </h2>
        <p className="text-sky-100 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
          Sign up for our newsletter and get alerts on 2026/2027 group departures, luxury lodge upgrades, and route updates from our Expert Representative team.
        </p>

        {submitted ? (
          <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-200 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Thank you for subscribing! You&apos;re on our Himalayan dispatch list.
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full sm:w-56 px-5 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder-sky-200 text-sm focus:outline-none focus:bg-white/20"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address *"
              className="w-full sm:flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder-sky-200 text-sm focus:outline-none focus:bg-white/20"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              Get Updates <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
