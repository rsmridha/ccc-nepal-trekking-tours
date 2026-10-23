import React from "react";
import Link from "next/link";
import { getDbAsync } from "@/lib/db";
import BookingClient from "@/components/BookingClient";

export const dynamic = "force-dynamic";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; date?: string; tier?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDbAsync();

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-[#0b243b] text-white py-16 overflow-hidden">
        <img
          src="/images/unsplash/photo-1544735716-392fe2489ffa-1600.jpg"
          alt="Reserve Your Spot"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Reserve Your Spot
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Book Your Himalayan Trip</h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            Fill in your details and our Kathmandu Expert Representative Team will confirm permits, domestic flights, and deluxe lodges within 24 hours.
          </p>
          <div className="mt-4 text-xs text-sky-200 flex items-center gap-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-bold">Booking</span>
          </div>
        </div>
      </div>

      <BookingClient
        packages={db.packages}
        initialSlug={sp.slug || ""}
        initialDate={sp.date || ""}
        initialTier={sp.tier || "deluxe"}
      />
    </div>
  );
}
