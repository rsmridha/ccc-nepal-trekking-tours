import React from "react";
import Link from "next/link";
import {
  Users,
  Star,
  HandCoins,
  Leaf,
  Plane,
  CalendarClock,
  ShieldCheck,
  Repeat,
  Headphones,
  BadgeCheck,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { getDbAsync } from "@/lib/db";
import {
  HeroSearchWidget,
  HandpickedTripsSection,
  ReviewsShowcaseSection,
  HomeFaqSection,
  NewsletterBand,
} from "@/components/HomeInteractive";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await getDbAsync();

  const whyChooseCards = [
    {
      num: "01",
      icon: Plane,
      title: "Travel · Learn · Share",
      text: "Travel with curiosity, learn from the local mountain people and Himalayas you meet, and share authentic moments along the trail.",
    },
    {
      num: "02",
      icon: Users,
      title: "Enthusiastic Expert Representative Team",
      text: "More than guides, we're your companions in the mountains. With deep local knowledge and 27+ years of experience, our Expert Representative team walks every step with you.",
    },
    {
      num: "03",
      icon: CalendarClock,
      title: "Customized & Fixed Departures",
      text: "Join our guaranteed small-group fixed departures or let us craft a private tailor-made itinerary built around your pace and schedule.",
    },
    {
      num: "04",
      icon: ShieldCheck,
      title: "Safety First, Adventure Always",
      text: "Carefully paced acclimatization days at 3,400m and 4,400m, oximeter monitoring, satellite communication, and 24/7 helicopter rescue coordination.",
    },
    {
      num: "05",
      icon: Repeat,
      title: "98% Repeat & Referred Guests",
      text: "98% of our guests return for another Himalayan journey or refer their friends and family to trek with our Expert Representative team.",
    },
    {
      num: "06",
      icon: Headphones,
      title: "24/7 On-Trip Support",
      text: "From your welcome garland at Kathmandu Airport to your final farewell dinner, our operations team supports you around the clock.",
    },
  ];

  return (
    <div>
      {/* 1. Full-Bleed Himalayan Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[650px] flex items-center justify-center overflow-hidden bg-[#0b243b] py-24">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <img
            src="https://webapp.nepaltrekkingtours.com/images/upload/homeslider/deluxe-everest-base-camp-trek.jpg"
            alt="Experience the Himalayas with Expert Representative"
            className="w-full h-full object-cover animate-hero-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071a38]/90 via-[#071a38]/70 to-[#071a38]/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-5">
            Locally Owned & Operated Since 1999
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
            Experience the Himalayas with{" "}
            <span className="text-amber-400">Expert Representative</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-sky-100 max-w-2xl">
            Handpicked Deluxe Lodge Treks, 5-Star Luxury Helicopter Adventures & NMA Peak Expeditions across Nepal, Tibet & Bhutan.
          </p>

          <div className="mt-8 w-full flex justify-center">
            <HeroSearchWidget packages={db.packages} />
          </div>

          {/* 4 Hero Highlights */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl pt-8 border-t border-white/15">
            <div className="flex items-center justify-center gap-3 text-left text-white">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-amber-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-extrabold">27 Years+</strong>
                <span className="text-xs text-sky-200">Experience</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-left text-white">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-amber-400 shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-extrabold">126+ Reviews</strong>
                <span className="text-xs text-sky-200">5.0 ★ TripAdvisor</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-left text-white">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-amber-400 shrink-0">
                <HandCoins className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-extrabold">Best Price</strong>
                <span className="text-xs text-sky-200">Guaranteed Direct</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-left text-white">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-amber-400 shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-extrabold">Committed To</strong>
                <span className="text-xs text-sky-200">Sustainability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Verified Multi-Platform Trust Strip */}
      <section className="bg-white border-b border-slate-200 py-6 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-7 h-7" />
            </div>
            <div>
              <strong className="block text-base font-extrabold text-[#0b243b]">
                Trusted by 15,000+ Worldwide Travelers
              </strong>
              <span className="text-xs text-slate-500">
                Verified 5.0-star ratings across every major global travel platform
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            {[
              {
                name: "TripAdvisor",
                count: "126 reviews",
                score: "5.0",
                badgeBg: "bg-emerald-600",
                url: "https://www.tripadvisor.com/Attraction_Review-g293890-d15519243-Reviews-Nepal_Trekking_Tours-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html",
              },
              {
                name: "Google Reviews",
                count: "130 reviews",
                score: "5.0",
                badgeBg: "bg-[#006ebf]",
                url: "https://share.google/8tVoiz5mIuUkKY1oM",
              },
              {
                name: "Facebook Official",
                count: "53 reviews",
                score: "5.0",
                badgeBg: "bg-indigo-600",
                url: "https://www.facebook.com/nepaltrekkingtoursofficial/",
              },
            ].map((plat) => (
              <a
                key={plat.name}
                href={plat.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 transition-colors"
              >
                <span
                  className={`w-9 h-9 rounded-xl ${plat.badgeBg} text-white font-black text-xs flex items-center justify-center shrink-0`}
                >
                  {plat.score}
                </span>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="block text-[11px] font-semibold text-slate-600">
                    {plat.count} on {plat.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. About Company & 6 Sherpa Pillars */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#006ebf] block mb-2">
              Since 1999 · Experience the Luxury in Himalaya
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b243b] leading-tight">
              Discover Luxury Tours & Treks Across Nepal, Bhutan & Tibet
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto my-5 rounded-full" />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <strong>CCC Nepal Trekking Tours</strong> is an established Himalayan adventure trekking, hiking, and peak climbing agency in Nepal with over 27 years of experience, owned and managed by professional local Expert Representatives. Our core mission is to deliver the highest quality <strong>Deluxe and Luxury lodge treks, helicopter tours, and climbing expeditions</strong> across Nepal, Tibet, and Bhutan with our live motto:{" "}
              <span className="text-rose-700 font-bold">
                &ldquo;Experience the Luxury in Himalaya.&rdquo;
              </span>
            </p>
          </div>

          {/* 3 Key Stats */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { num: "27+", label: "Years in the Himalaya" },
              { num: "15,000+", label: "Happy Worldwide Travelers" },
              { num: "3", label: "Countries: Nepal, Tibet & Bhutan" },
            ].map((st) => (
              <div
                key={st.label}
                className="bg-[#f5f9fd] border border-sky-100 rounded-2xl p-5 text-center"
              >
                <strong className="block text-3xl font-black text-[#0b243b]">
                  {st.num}
                </strong>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1 block">
                  {st.label}
                </span>
              </div>
            ))}
          </div>

          {/* 6 Feature Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseCards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.num}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-200 transition-all relative group"
                >
                  <span className="absolute top-5 right-6 text-2xl font-black text-slate-100 group-hover:text-sky-100 transition-colors">
                    {c.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#006ebf] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0b243b] mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Handpicked Treks & Tours (Interactive Tabs) */}
      <HandpickedTripsSection packages={db.packages} />

      {/* 5. Traveller Stories / Client Reviews Showcase */}
      <ReviewsShowcaseSection reviews={db.reviews} />

      {/* 6. Activities We Offer */}
      <section className="py-20 bg-[#f5f9fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#006ebf] block mb-2">
              Adventure Styles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b243b]">
              Activities We <em className="text-[#006ebf] font-serif italic">Offer</em>
            </h2>
            <p className="text-slate-600 mt-2">
              From classic deluxe teahouse treks to 6,000m+ peak expeditions, choose your style of adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {db.activities.map((act) => (
              <Link
                key={act.slug}
                href={`/treks?q=${encodeURIComponent(act.title.split(" ")[1] || "")}`}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-6"
              >
                <img
                  src={act.image}
                  alt={act.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                <div className="relative z-10 flex items-end justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                      {act.tripCount} Trips
                    </span>
                    <h3 className="text-lg font-extrabold text-white leading-snug">
                      {act.title}
                    </h3>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center group-hover:bg-[#006ebf] transition-colors shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Things To Do, Wherever You're Going (Destinations) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#006ebf] block mb-2">
              Signature Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b243b]">
              Things To Do,{" "}
              <em className="text-[#006ebf] font-serif italic">
                Wherever You&apos;re Going
              </em>
            </h2>
            <p className="text-slate-600 mt-2">
              Handpicked experiences across Nepal, Tibet & Bhutan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {db.destinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destination/${dest.slug}`}
                className="group relative h-72 rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-6"
              >
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b243b]/90 via-[#0b243b]/30 to-transparent" />
                <div className="relative z-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1">
                    {dest.region}
                  </span>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                    {dest.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1.5 line-clamp-2">
                    {dest.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Travel Guides / Blog Section */}
      <section className="py-20 bg-[#f5f9fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#006ebf] block mb-2">
                Himalayan Dispatches
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b243b]">
                Travel <em className="text-[#006ebf] font-serif italic">Guides</em>
              </h2>
              <p className="text-slate-600 mt-2">
                Expert advice, route notes, packing lists, and trip reports from our Expert Representative team.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 bg-white text-slate-800 hover:border-[#006ebf] hover:text-[#006ebf] text-xs font-bold transition-colors self-start sm:self-auto"
            >
              Explore All Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {db.blogs.slice(0, 4).map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                <Link href={`/blog/${post.slug}`} className="block h-48 overflow-hidden bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <CalendarDays className="w-3.5 h-3.5 text-[#006ebf]" />
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="text-[#006ebf] font-semibold">{post.category}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block text-base font-extrabold text-[#0b243b] group-hover:text-[#006ebf] transition-colors line-clamp-2"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#006ebf] group-hover:translate-x-0.5 transition-transform"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions Accordion */}
      <HomeFaqSection faqs={db.faqs} />

      {/* 10. Newsletter Subscription Band */}
      <NewsletterBand />
    </div>
  );
}
