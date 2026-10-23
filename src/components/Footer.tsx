"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mountain,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="mt-16">
      {/* Official Associations & Payment Strip */}
      <div className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
              Official Affiliations:
            </span>
            {[
              { code: "Govt. of Nepal", label: "Licensed Tourism Agency" },
              { code: "NTB", label: "Nepal Tourism Board" },
              { code: "TAAN", label: "Trekking Agencies' Assoc." },
              { code: "NMA", label: "Nepal Mountaineering Assoc." },
              { code: "KEEP", label: "Eco-Trekking Partner" },
              { code: "STEAN", label: "Sherpa Tourism Assoc." },
            ].map((org) => (
              <div
                key={org.code}
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5"
                title={org.label}
              >
                <ShieldCheck className="w-4 h-4 text-[#006ebf]" />
                <span className="text-xs font-extrabold text-slate-700">{org.code}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              We Accept:
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded border border-slate-200 bg-white text-xs font-black italic text-blue-900">
                VISA
              </span>
              <span className="px-2.5 py-1 rounded border border-slate-200 bg-white text-xs font-extrabold text-rose-600">
                MasterCard
              </span>
              <span className="px-2.5 py-1 rounded border border-slate-200 bg-[#2E77BC] text-[11px] font-extrabold text-white">
                AMEX
              </span>
              <span className="px-2.5 py-1 rounded border border-slate-200 bg-emerald-700 text-[11px] font-extrabold text-white">
                Bank Wire
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Himalayan Mountain Ridge Silhouette SVG */}
      <div className="w-full overflow-hidden leading-none bg-white" aria-hidden="true">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className="w-full h-20 sm:h-28 lg:h-36 block"
        >
          <defs>
            <linearGradient id="himalaya-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2eef9" />
            </linearGradient>
          </defs>
          <rect width="1440" height="150" fill="url(#himalaya-sky)" />
          <path
            fill="#9db8d3"
            d="M0 110 L90 80 L165 98 L260 46 L330 78 L410 38 L500 88 L590 60 L670 94 L780 28 L860 76 L950 54 L1030 90 L1130 38 L1210 74 L1310 48 L1380 82 L1440 66 V150 H0Z"
          />
          <path
            fill="#3b6998"
            d="M0 126 L120 102 L210 120 L330 84 L430 116 L530 96 L620 124 L730 90 L810 112 L910 88 L1010 118 L1130 96 L1240 120 L1340 100 L1440 114 V150 H0Z"
          />
          <path
            fill="#0b243b"
            d="M0 138 C140 132 230 122 340 128 C460 134 550 138 670 126 C760 118 830 116 900 122 C1000 130 1100 138 1220 134 C1320 130 1390 136 1440 138 V150 H0Z"
          />
        </svg>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#0b243b] text-slate-300 pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: Brand & Head Office */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#006ebf] flex items-center justify-center text-white">
                  <Mountain className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-lg font-extrabold text-white leading-none">
                    CCC NEPAL TREKKING TOURS
                  </span>
                  <span className="block text-[11px] font-semibold uppercase tracking-widest text-amber-400 mt-1">
                    Since 1999 · Kathmandu
                  </span>
                </div>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed">
                Owned and operated by veteran local Expert Representatives. Specializing in Deluxe Lodge Treks, 5-Star Luxury Himalayan Holidays, Helicopter Expeditions & Peak Climbing across Nepal, Tibet & Bhutan.
              </p>
              <div className="space-y-2 pt-2 text-sm">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Thamel, Kathmandu, Nepal</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="https://api.whatsapp.com/send?phone=18888208072" className="hover:text-amber-400">
                    +1-888-820-8072 (WhatsApp / Direct)
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href="mailto:info@nepaltrekkingtours.com" className="hover:text-amber-400">
                    info@nepaltrekkingtours.com
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Top 8 Deluxe Treks */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-slate-800">
                Top 8 Deluxe Treks
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/deluxe-everest-base-camp-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Everest Base Camp Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-annapurna-base-camp-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Annapurna Base Camp Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-annapurna-circuit-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Annapurna Circuit Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-everest-high-pass-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Everest High Pass Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-gokyo-everest-base-camp-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Gokyo Everest Base Camp Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-manaslu-circuit-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Manaslu Circuit Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-upper-mustang-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Upper Mustang Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-best-of-annapurna-trek" className="hover:text-amber-400 transition-colors">
                    Deluxe Best of Annapurna Trek
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Top Luxury & Peak Trips */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-slate-800">
                Top Luxury & Peak Trips
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/luxury-everest-base-camp-trek" className="hover:text-amber-400 transition-colors">
                    Luxury Everest Base Camp Trek
                  </Link>
                </li>
                <li>
                  <Link href="/luxury-helicopter-everest-base-camp-trek" className="hover:text-amber-400 transition-colors">
                    Luxury Helicopter Everest Base Camp
                  </Link>
                </li>
                <li>
                  <Link href="/luxury-annapurna-circuit-trek" className="hover:text-amber-400 transition-colors">
                    Luxury Annapurna Circuit Trek
                  </Link>
                </li>
                <li>
                  <Link href="/luxury-helicopter-annapurna-base-camp-trek" className="hover:text-amber-400 transition-colors">
                    Luxury Helicopter Annapurna Base Camp
                  </Link>
                </li>
                <li>
                  <Link href="/luxury-everest-experience-trek" className="hover:text-amber-400 transition-colors">
                    Luxury Everest Experience Trek
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-island-peak-expedition" className="hover:text-amber-400 transition-colors">
                    Deluxe Island Peak Expedition
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-mera-peak-expedition" className="hover:text-amber-400 transition-colors">
                    Deluxe Mera Peak Expedition
                  </Link>
                </li>
                <li>
                  <Link href="/deluxe-lobuche-peak-expedition" className="hover:text-amber-400 transition-colors">
                    Deluxe Lobuche Peak Expedition
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Useful Links & Resources */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-slate-800">
                Useful Traveler Links
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/payment" className="hover:text-amber-400 transition-colors">
                    Book Now & Pay Online
                  </Link>
                </li>
                <li>
                  <Link href="/custom-trip" className="hover:text-amber-400 transition-colors">
                    Plan a Custom Tailor-Made Trip
                  </Link>
                </li>
                <li>
                  <Link href="/why-us" className="hover:text-amber-400 transition-colors">
                    Why Is Your Holiday Only With Us?
                  </Link>
                </li>
                <li>
                  <Link href="/nepal-trekking-faqs" className="hover:text-amber-400 transition-colors">
                    Nepal Trekking FAQs & Equipment List
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="hover:text-amber-400 transition-colors">
                    Meet Our Expert Representatives
                  </Link>
                </li>
                <li>
                  <Link href="/review" className="hover:text-amber-400 transition-colors">
                    Verified Client Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/write-a-review" className="hover:text-amber-400 transition-colors">
                    Write a Trip Review
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-amber-400 font-semibold hover:underline">
                    Admin WebApp CMS Portal →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Recommended Platforms & Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold text-slate-300">Recommended 5.0 ★ on:</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold">
                TripAdvisor (126+ Reviews)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800 font-semibold">
                Google Reviews (130+ Reviews)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                TourRadar & Bookmundi
              </span>
            </div>
            <p>
              © {new Date().getFullYear()} CCC Nepal Trekking Tours & Adventure Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
