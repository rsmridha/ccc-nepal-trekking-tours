import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Users, ArrowRight } from "lucide-react";

export default function AboutPage() {

  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Locally Owned & Operated Since 1999
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            About CCC Nepal Trekking Tours
          </h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            27+ years of crafting Deluxe Lodge Treks, 5-Star Luxury Himalayan Holidays & NMA Peak Expeditions across Nepal, Tibet, and Bhutan.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-2xl font-extrabold text-[#0b243b]">
            Our Himalayan Heritage & Mission
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Founded in 1999 by veteran Everest Expert Representative <strong>Expert Representative</strong>, <strong>CCC Nepal Trekking Tours & Adventure Pvt. Ltd.</strong> was born out of a simple conviction: travelers visiting the roof of the world deserve the warmth of authentic Sherpa hospitality combined with the highest standards of lodge comfort, safety, and personalized care.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Unlike overseas middlemen, every trip you book with us is operated directly by our Kathmandu and Solukhumbu Expert Representative Team—meaning fair wages and insurance for our guides and porters, complimentary 20kg domestic flight baggage allowances, and handpicked attached-bath deluxe and 5-star mountain lodges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <ShieldCheck className="w-8 h-8 text-[#006ebf] mb-3" />
            <h3 className="font-extrabold text-[#0b243b] text-lg">
              100% Licensed & Insured
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Registered with the Government of Nepal, Nepal Tourism Board (NTB), TAAN, NMA, KEEP, and STEAN.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <Users className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="font-extrabold text-[#0b243b] text-lg">
              15+ Years Avg. Guide Experience
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Our native Expert Representatives are Wilderness First Responder trained and carry pulse oximeters on every high-altitude trek.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <Award className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-extrabold text-[#0b243b] text-lg">
              98% Repeat & Referred Rate
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Over 15,000 happy trekkers and 5.0-star verified ratings across TripAdvisor, Google, and Facebook.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#006ebf] text-white font-extrabold text-sm hover:bg-[#0b243b]"
          >
            Meet Our Professional Expert Representative Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
