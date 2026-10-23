"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { TrekPackage } from "@/lib/db";
import PackageCard from "./PackageCard";

export default function TreksFilterClient({
  packages,
  initialQuery = "",
  initialCategory = "",
  initialRegion = "",
}: {
  packages: TrekPackage[];
  initialQuery?: string;
  initialCategory?: string;
  initialRegion?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);
  const [maxDuration, setMaxDuration] = useState<number>(30);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "duration-asc">("featured");

  const regions = useMemo(
    () => Array.from(new Set(packages.map((p) => p.region))),
    [packages]
  );

  const filtered = useMemo(() => {
    let res = packages.filter((p) => {
      if (
        query.trim() &&
        !p.title.toLowerCase().includes(query.toLowerCase()) &&
        !p.region.toLowerCase().includes(query.toLowerCase()) &&
        !p.overviewText.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      if (category && p.category !== category && p.tabCategory !== category) {
        return false;
      }
      if (region && p.region !== region) {
        return false;
      }
      if (p.duration > maxDuration) {
        return false;
      }
      return true;
    });

    if (sortBy === "price-asc") res = [...res].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") res = [...res].sort((a, b) => b.price - a.price);
    else if (sortBy === "duration-asc") res = [...res].sort((a, b) => a.duration - b.duration);

    return res;
  }, [packages, query, category, region, maxDuration, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setCategory("");
    setRegion("");
    setMaxDuration(30);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#0b243b]">
            <SlidersHorizontal className="w-4 h-4 text-[#006ebf]" />
            <span>Filter & Sort Himalayan Trips ({filtered.length} matching)</span>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#006ebf]"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trip or peak..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#006ebf]"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white"
          >
            <option value="">All Trip Styles</option>
            <option value="deluxe-trekking">Deluxe Lodge Trekking</option>
            <option value="luxury-trekking">5-Star Luxury & Heli Treks</option>
            <option value="peak-climbing">Peak Climbing Expeditions</option>
            <option value="cultural-tours">Cultural & Multi-Country Tours</option>
          </select>

          {/* Region */}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white"
          >
            <option value="">All Himalayan Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Max Duration */}
          <div className="flex flex-col justify-center px-2">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
              <span>Max Duration</span>
              <span className="text-[#006ebf]">{maxDuration} Days</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={maxDuration}
              onChange={(e) => setMaxDuration(Number(e.target.value))}
              className="accent-[#006ebf]"
            />
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white"
          >
            <option value="featured">Sort: Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration-asc">Duration: Shortest First</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <h3 className="text-lg font-extrabold text-[#0b243b]">
            No Himalayan packages match your current filters
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Try clearing your search filters or let our Expert Representative Team design a custom itinerary for you.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#006ebf] text-white text-xs font-bold"
          >
            Show All Packages
          </button>
        </div>
      )}
    </div>
  );
}
