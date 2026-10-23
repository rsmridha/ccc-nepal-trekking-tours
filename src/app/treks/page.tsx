import React from "react";
import Link from "next/link";
import { getDbAsync } from "@/lib/db";
import TreksFilterClient from "@/components/TreksFilterClient";

export const dynamic = "force-dynamic";

export default async function TreksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; region?: string; tab?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDbAsync();

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-[#0b243b] text-white py-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80"
          alt="Himalayan Treks & Tours"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Nepal · Tibet · Bhutan
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            All Himalayan Treks & Tours
          </h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            Filter by region, duration, and comfort tier—from Deluxe Attached-Bath Lodge treks to 5-Star Helicopter VIP expeditions.
          </p>
          <div className="mt-4 text-xs text-sky-200 flex items-center gap-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-bold">All Packages</span>
          </div>
        </div>
      </div>

      <TreksFilterClient
        packages={db.packages}
        initialQuery={sp.q || ""}
        initialCategory={sp.category || sp.tab || ""}
        initialRegion={sp.region || ""}
      />
    </div>
  );
}
