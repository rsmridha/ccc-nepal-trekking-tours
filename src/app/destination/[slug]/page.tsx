import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDbAsync, getDestinationBySlugAsync } from "@/lib/db";
import PackageCard from "@/components/PackageCard";

export const dynamic = "force-dynamic";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await getDbAsync();
  const dest = await getDestinationBySlugAsync(slug);

  const matchingPackages = db.packages.filter((p) => p.destinationSlug === slug);
  if (!dest && matchingPackages.length === 0) {
    notFound();
  }

  const title = dest?.title || slug.replace(/-/g, " ");
  const subtitle =
    dest?.subtitle ||
    "Handpicked Himalayan adventures led by experienced local Expert Representatives.";
  const bannerImg =
    dest?.image ||
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80";

  return (
    <div>
      {/* Destination Hero */}
      <div className="relative bg-[#0b243b] text-white py-20 overflow-hidden">
        <img
          src={bannerImg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Destination Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-black capitalize">{title}</h1>
          <p className="text-sky-100 mt-3 max-w-2xl text-sm sm:text-base">
            {subtitle}
          </p>
          <div className="mt-4 text-xs text-sky-200 flex items-center gap-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link href="/treks" className="hover:underline">
              Destinations
            </Link>
            <span>/</span>
            <span className="text-white font-bold capitalize">{title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(matchingPackages.length > 0 ? matchingPackages : db.packages).map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}
