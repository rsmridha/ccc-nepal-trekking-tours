import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDbAsync } from "@/lib/db";

export const metadata: Metadata = {
  title: "Nomad & Noble Nepal (NNN) - The Ultimate Everest Experience, Curated Without Compromise.",
  description:
    "The Ultimate Everest Experience, Curated Without Compromise. Deluxe & Luxury Trekking, Helicopter Tours, and Peak Climbing Expeditions in Nepal, Tibet, and Bhutan led by veteran local Expert Representatives.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await getDbAsync();
  const navPackages = db.packages.map((p) => ({
    title: p.title,
    slug: p.slug,
    region: p.region,
    duration: p.duration,
    price: p.price,
    category: p.category,
    destinationSlug: p.destinationSlug,
  }));

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar packages={navPackages} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
