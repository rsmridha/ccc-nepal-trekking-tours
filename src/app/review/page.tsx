import React from "react";
import Link from "next/link";
import { Star, PenLine, Quote } from "lucide-react";
import { getDbAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const db = await getDbAsync();

  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
              5.0 ★ Verified Traveller Stories
            </span>
            <h1 className="text-3xl sm:text-5xl font-black">
              What Do Our Clients Say?
            </h1>
            <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
              Read authentic trip reports from trekkers and climbers who explored Everest, Annapurna, Manaslu, and Bhutan with our Expert Representative and team.
            </p>
          </div>
          <Link
            href="/write-a-review"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs inline-flex items-center gap-2 shrink-0 self-start"
          >
            <PenLine className="w-4 h-4" /> Write a Review
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        {db.reviews.map((rev) => (
          <article
            key={rev.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between relative"
          >
            <Quote className="w-12 h-12 text-slate-100 absolute top-6 right-6" />
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs font-bold text-[#006ebf]">
                  Verified ({rev.platform})
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#0b243b] mb-3">
                &ldquo;{rev.title}&rdquo;
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#0b243b] text-amber-400 font-extrabold flex items-center justify-center">
                  {rev.author.charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong className="text-sm font-bold text-slate-800 block">
                    {rev.author}
                  </strong>
                  <span className="text-xs text-slate-500">{rev.country}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400">{rev.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
