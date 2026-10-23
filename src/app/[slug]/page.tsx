import React from "react";
import { notFound } from "next/navigation";
import { getDbAsync, getPackageBySlugAsync } from "@/lib/db";
import PackageDetailClient from "@/components/PackageDetailClient";

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlugAsync(slug);
  if (!pkg) {
    notFound();
  }

  const db = await getDbAsync();
  const similarPackages = db.packages
    .filter((p) => p.slug !== pkg.slug && (p.region === pkg.region || p.category === pkg.category))
    .slice(0, 3);

  return <PackageDetailClient pkg={pkg} similarPackages={similarPackages} />;
}
