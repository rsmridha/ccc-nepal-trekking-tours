import React from "react";
import { notFound } from "next/navigation";
import { getDbAsync } from "@/lib/db";
import InvoicePrintClient from "@/components/InvoicePrintClient";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDbAsync();
  const booking = db.bookings.find(
    (b) => b.id.toLowerCase() === decodeURIComponent(id).toLowerCase()
  );

  if (!booking) {
    notFound();
  }

  const pkg = db.packages.find((p) => p.slug === booking.packageSlug);

  return (
    <InvoicePrintClient
      booking={booking}
      pkg={pkg}
      settings={db.settings}
    />
  );
}
