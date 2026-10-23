import React from "react";
import { notFound } from "next/navigation";
import { getDbAsync, getPackageBySlugAsync } from "@/lib/db";
import ItineraryPrintClient from "@/components/ItineraryPrintClient";

export const dynamic = "force-dynamic";

export default async function PrintableItineraryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [pkg, db] = await Promise.all([
    getPackageBySlugAsync(slug),
    getDbAsync(),
  ]);

  if (!pkg) {
    notFound();
  }

  return <ItineraryPrintClient pkg={pkg} settings={db.settings} />;
}
