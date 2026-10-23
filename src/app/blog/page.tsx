import React from "react";
import Link from "next/link";
import { CalendarDays, ArrowRight, User } from "lucide-react";
import { getDbAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const db = await getDbAsync();

  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Expert Field Notes & Dispatches
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Himalayan Travel Guides & Blog
          </h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            Comprehensive route guides, packing checklists, luxury lodge reviews, and climbing preparation notes written by our local Expert Representative Team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {db.blogs.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col group"
          >
            <Link href={`/blog/${post.slug}`} className="block h-56 overflow-hidden bg-slate-900">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#006ebf] font-bold">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> {post.date}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block text-lg font-extrabold text-[#0b243b] group-hover:text-[#006ebf] transition-colors leading-snug"
                >
                  {post.title}
                </Link>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                  <User className="w-3.5 h-3.5 text-[#006ebf]" /> {post.author}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 font-extrabold text-[#006ebf]"
                >
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
