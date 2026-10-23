import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function WhyUsPage() {
  const reasons = [
    {
      title: "1. Exclusive Deluxe & Luxury Mountain Lodges",
      desc: "We hand-select the finest mountain lodges with attached bathrooms, heated dining rooms, electric blankets, and hot showers wherever available.",
    },
    {
      title: "2. Complimentary 20kg Domestic Flight Baggage",
      desc: "Standard Lukla & Jomsom flights only allow 15kg. We cover an extra 5kg per trekker free of charge so you can carry up to 20kg hassle-free.",
    },
    {
      title: "3. Free Sleeping Bag, Down Jacket, Duffel Bag & Trekking Poles",
      desc: "Every trek package includes complimentary use of high-grade down jackets, four-season sleeping bags, waterproof porter duffel bags, and trekking poles.",
    },
    {
      title: "4. Dual Acclimatization Rest Days & Medical Safety",
      desc: "Our itineraries include strategic acclimatization days at 3,400m and 4,400m, daily oximeter checks, and 24/7 helicopter rescue coordination.",
    },
    {
      title: "5. Free Welcome Cultural Dinner & Post-Trek Body Massage",
      desc: "Enjoy an authentic Nepali cultural dinner on arrival and a complimentary 1-hour trekker's body massage in Kathmandu after your trek.",
    },
  ];

  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            The Expert Difference
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Why Is Your Holiday Only With Us?
          </h1>
          <p className="text-sky-100 mt-2 text-sm sm:text-base">
            Discover why 98% of our guests return or recommend CCC Nepal Trekking Tours to their friends and family.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-5">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex items-start gap-4"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-extrabold text-[#0b243b] mb-2">{r.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{r.desc}</p>
            </div>
          </div>
        ))}

        <div className="pt-6 text-center">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#006ebf] text-white font-extrabold text-sm"
          >
            Explore Our Deluxe & Luxury Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
