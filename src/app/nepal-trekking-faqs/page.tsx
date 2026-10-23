import React from "react";
import { getDbAsync } from "@/lib/db";
import { HomeFaqSection } from "@/components/HomeInteractive";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const db = await getDbAsync();

  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Essential Trekker Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Nepal Trekking FAQs & Equipment Guide
          </h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            Answers to common questions about Kathmandu airport arrival, luggage storage, porter weight limits, drinking water, Wi-Fi, charging, and altitude safety.
          </p>
        </div>
      </div>

      <HomeFaqSection faqs={db.faqs} />
    </div>
  );
}
