"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Mountain,
  Phone,
  Search,
  Menu,
  X,
  ChevronDown,
  Users,
  Compass,
  Award,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

interface NavPackageSummary {
  title: string;
  slug: string;
  region: string;
  duration: number;
  price: number;
  category: string;
  destinationSlug: string;
}

export default function Navbar({ packages = [] }: { packages?: NavPackageSummary[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  // Do not show public header inside /admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const deluxePackages = packages.filter((p) => p.destinationSlug === "deluxe-nepal-trekking-tours");
  const luxuryPackages = packages.filter((p) => p.destinationSlug === "luxury-nepal-trekking-tours");
  const peakPackages = packages.filter((p) => p.destinationSlug === "peak-climbing-in-nepal");

  const filteredSearch = searchQuery.trim()
    ? packages.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : packages.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/treks?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      {/* Top Utility & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0b243b] to-[#006ebf] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Mountain className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-extrabold tracking-tight text-[#0b243b] leading-none">
              CCC NEPAL TREKKING <span className="text-[#006ebf]">TOURS</span>
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-amber-600 mt-1">
              Locally Owned · Himalayan Luxury Since 1999
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-5">
          <a
            href="https://api.whatsapp.com/send?phone=18888208072"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-[#006ebf] transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50"
          >
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </span>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 leading-none">
                24/7 Expert Representative WhatsApp
              </span>
              <span className="text-sm font-bold text-slate-800">+1-888-820-8072</span>
            </div>
          </a>

          <Link
            href="/treks?tab=bestseller"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-[#006ebf] border border-sky-200 hover:bg-sky-100 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Group Join 2026/27
          </Link>

          <Link
            href="/custom-trip"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0b243b] text-white hover:bg-[#114463] transition-colors shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Plan Custom Trip
          </Link>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
            title="Open Web Application / Admin CMS"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            WebApp CMS
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Search trips"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4" />
            CMS
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="bg-[#0b243b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden lg:flex items-center justify-between">
          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-3.5 text-sm font-semibold transition-colors ${
                pathname === "/" ? "text-amber-400 bg-white/10" : "text-slate-100 hover:text-amber-300 hover:bg-white/5"
              }`}
            >
              Home
            </Link>

            {/* Mega Menu 1: Deluxe CCC Nepal Trekking Tours */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("deluxe")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/destination/deluxe-nepal-trekking-tours"
                className="px-4 py-3.5 text-sm font-semibold text-slate-100 hover:text-amber-300 hover:bg-white/5 inline-flex items-center gap-1.5 transition-colors"
              >
                Deluxe CCC Nepal Trekking Tours
                <ChevronDown className="w-4 h-4 opacity-75" />
              </Link>
              {activeDropdown === "deluxe" && (
                <div className="absolute left-0 top-full w-[760px] bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-200 p-6 grid grid-cols-3 gap-6 z-50">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#006ebf] mb-3 pb-1.5 border-b border-slate-100">
                      Everest & Khumbu Region
                    </div>
                    <ul className="space-y-2 text-sm">
                      {deluxePackages
                        .filter((p) => p.region.includes("Everest"))
                        .map((pkg) => (
                          <li key={pkg.slug}>
                            <Link
                              href={`/${pkg.slug}`}
                              className="hover:text-[#006ebf] font-medium flex items-center justify-between group"
                            >
                              <span className="truncate pr-2">{pkg.title}</span>
                              <span className="text-xs text-slate-400 group-hover:text-[#006ebf] shrink-0">
                                {pkg.duration}d
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#006ebf] mb-3 pb-1.5 border-b border-slate-100">
                      Annapurna & Mustang
                    </div>
                    <ul className="space-y-2 text-sm">
                      {deluxePackages
                        .filter((p) => p.region.includes("Annapurna") || p.region.includes("Mustang"))
                        .map((pkg) => (
                          <li key={pkg.slug}>
                            <Link
                              href={`/${pkg.slug}`}
                              className="hover:text-[#006ebf] font-medium flex items-center justify-between group"
                            >
                              <span className="truncate pr-2">{pkg.title}</span>
                              <span className="text-xs text-slate-400 group-hover:text-[#006ebf] shrink-0">
                                {pkg.duration}d
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#006ebf] mb-3 pb-1.5 border-b border-slate-100">
                      Manaslu, Langtang & Multi-Country
                    </div>
                    <ul className="space-y-2 text-sm">
                      {deluxePackages
                        .filter(
                          (p) =>
                            !p.region.includes("Everest") &&
                            !p.region.includes("Annapurna") &&
                            !p.region.includes("Mustang")
                        )
                        .map((pkg) => (
                          <li key={pkg.slug}>
                            <Link
                              href={`/${pkg.slug}`}
                              className="hover:text-[#006ebf] font-medium flex items-center justify-between group"
                            >
                              <span className="truncate pr-2">{pkg.title}</span>
                              <span className="text-xs text-slate-400 group-hover:text-[#006ebf] shrink-0">
                                {pkg.duration}d
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Link
                        href="/destination/deluxe-nepal-trekking-tours"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#006ebf] hover:underline"
                      >
                        View All Deluxe Treks <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu 2: Luxury CCC Nepal Trekking Tours */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("luxury")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/destination/luxury-nepal-trekking-tours"
                className="px-4 py-3.5 text-sm font-semibold text-slate-100 hover:text-amber-300 hover:bg-white/5 inline-flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Luxury CCC Nepal Trekking Tours
                <ChevronDown className="w-4 h-4 opacity-75" />
              </Link>
              {activeDropdown === "luxury" && (
                <div className="absolute left-0 top-full w-[520px] bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-200 p-6 z-50">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      5-Star Luxury Lodge & Helicopter Treks
                    </span>
                    <Link
                      href="/destination/luxury-nepal-trekking-tours"
                      className="text-xs font-bold text-[#006ebf] hover:underline"
                    >
                      Explore All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {luxuryPackages.map((pkg) => (
                      <Link
                        key={pkg.slug}
                        href={`/${pkg.slug}`}
                        className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 group-hover:text-[#006ebf]">
                            {pkg.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {pkg.region} · {pkg.duration} Days
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-[#114463]">
                          ${pkg.price.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu 3: Peak Climbing in Nepal */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("peak")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/destination/peak-climbing-in-nepal"
                className="px-4 py-3.5 text-sm font-semibold text-slate-100 hover:text-amber-300 hover:bg-white/5 inline-flex items-center gap-1.5 transition-colors"
              >
                Peak Climbing in Nepal
                <ChevronDown className="w-4 h-4 opacity-75" />
              </Link>
              {activeDropdown === "peak" && (
                <div className="absolute left-0 top-full w-[460px] bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-200 p-6 z-50">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#006ebf] mb-3 pb-2 border-b border-slate-100">
                    6,000m+ Himalayan Expeditions
                  </div>
                  <div className="space-y-2.5">
                    {peakPackages.map((pkg) => (
                      <Link
                        key={pkg.slug}
                        href={`/${pkg.slug}`}
                        className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-800 group-hover:text-[#006ebf]">
                            {pkg.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {pkg.duration} Days · Expert Climbing Leader
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-[#114463]">
                          ${pkg.price.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 4: About Us */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="px-4 py-3.5 text-sm font-semibold text-slate-100 hover:text-amber-300 hover:bg-white/5 inline-flex items-center gap-1.5 transition-colors"
              >
                About Us
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === "about" && (
                <div className="absolute left-0 top-full w-72 bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-200 py-3 z-50">
                  <Link href="/about" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    About CCC Nepal Trekking Tours
                  </Link>
                  <Link href="/team" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Meet Our Expert Representative Team
                  </Link>
                  <Link href="/why-us" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Why Is Your Holiday Only With Us?
                  </Link>
                  <Link href="/review" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Client Trip Reviews (66+ Verified)
                  </Link>
                  <Link href="/write-a-review" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Write a Trip Review
                  </Link>
                  <Link href="/nepal-trekking-faqs" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Nepal Trekking FAQs & Gear Guide
                  </Link>
                  <Link href="/contact-us" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Contact Our Kathmandu Office
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown 5: How to Book */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("book")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="px-4 py-3.5 text-sm font-semibold text-slate-100 hover:text-amber-300 hover:bg-white/5 inline-flex items-center gap-1.5 transition-colors"
              >
                How to Book
                <ChevronDown className="w-4 h-4 opacity-75" />
              </button>
              {activeDropdown === "book" && (
                <div className="absolute left-0 top-full w-72 bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-200 py-3 z-50">
                  <Link href="/booking" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Book Now & Reserve Online
                  </Link>
                  <Link href="/payment" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Direct Online Payment & Bank Wire
                  </Link>
                  <Link href="/custom-trip" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Tailor-Made Custom Trip Planner
                  </Link>
                  <Link href="/terms" className="block px-5 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[#006ebf]">
                    Booking Procedures & Terms
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/treks"
              className={`px-4 py-3.5 text-sm font-semibold transition-colors ${
                pathname === "/treks" ? "text-amber-400 bg-white/10" : "text-slate-100 hover:text-amber-300 hover:bg-white/5"
              }`}
            >
              All Packages
            </Link>

            <Link
              href="/blog"
              className={`px-4 py-3.5 text-sm font-semibold transition-colors ${
                pathname?.startsWith("/blog") ? "text-amber-400 bg-white/10" : "text-slate-100 hover:text-amber-300 hover:bg-white/5"
              }`}
            >
              Travel Guides
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Search treks...</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <Link
              href="/custom-trip"
              className="text-center py-2.5 px-3 rounded-xl bg-[#0b243b] text-white text-xs font-bold"
            >
              Plan Custom Trip
            </Link>
            <Link
              href="/booking"
              className="text-center py-2.5 px-3 rounded-xl bg-[#006ebf] text-white text-xs font-bold"
            >
              Book a Trek
            </Link>
          </div>
          <Link href="/" className="block py-2 font-bold text-slate-800">
            Home
          </Link>
          <Link href="/destination/deluxe-nepal-trekking-tours" className="block py-2 font-bold text-slate-800">
            Deluxe CCC Nepal Trekking Tours
          </Link>
          <Link href="/destination/luxury-nepal-trekking-tours" className="block py-2 font-bold text-slate-800">
            Luxury CCC Nepal Trekking Tours
          </Link>
          <Link href="/destination/peak-climbing-in-nepal" className="block py-2 font-bold text-slate-800">
            Peak Climbing in Nepal
          </Link>
          <Link href="/treks" className="block py-2 font-bold text-slate-800">
            All Trek & Tour Packages
          </Link>
          <Link href="/about" className="block py-2 font-semibold text-slate-600">
            About Us & Expert Team
          </Link>
          <Link href="/review" className="block py-2 font-semibold text-slate-600">
            Client Reviews
          </Link>
          <Link href="/nepal-trekking-faqs" className="block py-2 font-semibold text-slate-600">
            Trekking FAQs
          </Link>
          <Link href="/blog" className="block py-2 font-semibold text-slate-600">
            Travel Guides & Blog
          </Link>
          <Link href="/contact-us" className="block py-2 font-semibold text-slate-600">
            Contact Us
          </Link>
        </div>
      )}

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="flex items-center px-5 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-[#006ebf] mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Everest Base Camp, Annapurna, Manaslu, Heli Trek, Island Peak..."
                className="w-full text-base text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="p-5 max-h-96 overflow-y-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {searchQuery.trim() ? "Matching Himalayan Trips" : "Popular Himalayan Journeys"}
              </div>
              <div className="space-y-2">
                {filteredSearch.map((pkg) => (
                  <Link
                    key={pkg.slug}
                    href={`/${pkg.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-sky-50/80 transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-[#006ebf]">
                        {pkg.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#006ebf]" /> {pkg.region}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> {pkg.duration} Days
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">From</span>
                      <span className="text-sm font-extrabold text-[#114463]">
                        USD {pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
                {filteredSearch.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No matching packages found. Try searching for &ldquo;Everest&rdquo;, &ldquo;Annapurna&rdquo;, or &ldquo;Luxury&rdquo;.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
