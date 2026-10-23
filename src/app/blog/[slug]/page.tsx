import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, User, Clock, ArrowLeft } from "lucide-react";
import { getBlogBySlugAsync, getDbAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogPostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlugAsync(slug);
  if (!post) notFound();

  const db = await getDbAsync();
  const related = db.blogs.filter((b) => b.slug !== post.slug).slice(0, 3);

  return (
    <div className="pb-20">
      <div className="relative bg-[#0b243b] text-white py-20 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Travel Guides
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-sky-200">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" /> {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-amber-400" /> {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> {post.readTime}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          <div
            className="prose-himalaya text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-6">
              More Himalayan Travel Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-all"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-36 object-cover rounded-xl mb-3"
                  />
                  <h3 className="text-sm font-bold text-[#0b243b] line-clamp-2">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
