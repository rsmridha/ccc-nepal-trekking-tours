"use client";

import React from "react";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  Calendar,
  Mountain,
  Clock,
  Users,
  Hotel,
  Utensils,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { TrekPackage, SiteSettings } from "@/lib/db";

export default function ItineraryPrintClient({
  pkg,
  settings,
}: {
  pkg: TrekPackage;
  settings: SiteSettings;
}) {
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0">
      {/* Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/${pkg.slug}`}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Package Page
          </Link>
          <Link
            href={`/booking?package=${pkg.slug}`}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            Book This Expedition
          </Link>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF Dossier
        </button>
      </div>

      {/* Printable Dossier Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Header */}
        <div className="bg-[#0b243b] text-white p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 block">
                Official Expedition Dossier & Day-by-Day Itinerary
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">{pkg.title}</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{pkg.subtitle}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 sm:text-right shrink-0">
              <div className="text-xs text-sky-300 font-bold">Deluxe Package From</div>
              <div className="text-2xl font-black text-white">USD {pkg.price.toLocaleString()}</div>
              <div className="text-[11px] text-amber-300 font-semibold">
                5-Star Luxury Tier: USD {pkg.luxuryPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
            <div>
              <span className="text-slate-400 block">Duration & Region</span>
              <strong className="text-white text-sm">
                {pkg.duration} Days · {pkg.region}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Max Elevation</span>
              <strong className="text-white text-sm">{pkg.maxAltitude}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Difficulty & Season</span>
              <strong className="text-white text-sm">
                {pkg.difficulty} · {pkg.bestSeason}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Accommodation</span>
              <strong className="text-white text-sm">{pkg.accommodationType}</strong>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          {/* Overview */}
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-[#006ebf] mb-2">
              1. Expedition Overview
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{pkg.overviewText}</p>
          </div>

          {/* Day-by-Day Itinerary */}
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-[#006ebf] mb-4">
              2. Complete Day-by-Day Itinerary ({pkg.itineraries.length} Days)
            </h2>
            <div className="space-y-4">
              {pkg.itineraries.map((day) => (
                <div
                  key={day.day}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 break-inside-avoid"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0b243b] text-white text-xs font-black">
                        Day {day.day}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#0b243b]">{day.title}</h3>
                    </div>
                    {day.altitude && (
                      <span className="text-xs font-bold text-[#006ebf] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                        Max Alt: {day.altitude}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                    {day.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-semibold border-t border-slate-200/80 pt-2">
                    {day.accommodation && <span>🏨 Lodging: {day.accommodation}</span>}
                    {day.meal && <span>🍽️ Meals: {day.meal}</span>}
                    {day.walking && <span>🥾 Trekking: {day.walking}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 break-inside-avoid">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-700 mb-2">
                What Is Included
              </h3>
              <div
                className="prose prose-sm text-xs text-slate-600 space-y-1"
                dangerouslySetInnerHTML={{ __html: pkg.includesHtml }}
              />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-700 mb-2">
                What Is Excluded
              </h3>
              <div
                className="prose prose-sm text-xs text-slate-600 space-y-1"
                dangerouslySetInnerHTML={{ __html: pkg.excludesHtml }}
              />
            </div>
          </div>

          {/* Footer Contact */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <strong className="text-[#0b243b] block">
                CCC Nepal Trekking Tours Pvt. Ltd. — Thamel, Kathmandu, Nepal
              </strong>
              <span>
                Direct Expedition Desk (Expert Representative): {settings.phone} · {settings.email}
              </span>
            </div>
            <div className="sm:text-right">
              <span className="font-bold text-[#006ebf]">http://localhost:3200/{pkg.slug}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
