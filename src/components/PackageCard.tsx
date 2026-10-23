import React from "react";
import Link from "next/link";
import { MapPin, Clock, Star, Mountain, ArrowUpRight, Sparkles } from "lucide-react";
import { TrekPackage } from "@/lib/db";

export default function PackageCard({ pkg }: { pkg: TrekPackage }) {
  const isLuxury = pkg.category === "luxury-trekking" || pkg.slug.includes("luxury");
  const discountPct =
    pkg.regularPrice > pkg.price
      ? Math.round(((pkg.regularPrice - pkg.price) / pkg.regularPrice) * 100)
      : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image Header */}
      <div className="relative h-60 overflow-hidden bg-slate-900">
        <Link href={`/${pkg.slug}`} className="block w-full h-full">
          <img
            src={pkg.heroImage}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          {isLuxury ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3" /> Luxury VIP
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#006ebf] text-white shadow-md">
              Featured
            </span>
          )}
          {discountPct > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow">
              Save {discountPct}%
            </span>
          )}
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3.5 right-3.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{pkg.duration} Days</span>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-3.5 left-3.5 text-white">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-white">
              ${pkg.price.toLocaleString()}
            </span>
            {pkg.regularPrice > pkg.price && (
              <del className="text-xs text-slate-300 font-medium">
                ${pkg.regularPrice.toLocaleString()}
              </del>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="inline-flex items-center gap-1 font-semibold text-[#006ebf]">
              <MapPin className="w-3.5 h-3.5" />
              {pkg.region}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              5.0 ({pkg.reviewCount})
            </span>
          </div>

          <Link
            href={`/${pkg.slug}`}
            className="block text-lg font-extrabold text-[#0b243b] group-hover:text-[#006ebf] transition-colors line-clamp-2 leading-snug"
          >
            {pkg.title}
          </Link>

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {pkg.overviewText}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Mountain className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[150px]">{pkg.difficulty}</span>
          </div>

          <Link
            href={`/${pkg.slug}`}
            className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#006ebf] group-hover:translate-x-0.5 transition-transform"
          >
            Explore Trip <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
