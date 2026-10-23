import React from "react";
import { ShieldCheck, Award } from "lucide-react";
import { getDbAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const db = await getDbAsync();

  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Native Himalayan Leaders
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            Meet Our Professional Expert Representative Team
          </h1>
          <p className="text-sky-100 mt-2 max-w-2xl text-sm sm:text-base">
            More than guides, we are your companions in the mountains—born and raised in the Himalayas with decades of high-altitude expertise.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        {db.team.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start gap-6"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
            />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#006ebf] block">
                {member.experience}
              </span>
              <h2 className="text-xl font-extrabold text-[#0b243b] mt-0.5">
                {member.name}
              </h2>
              <p className="text-xs font-bold text-amber-700 mb-3">{member.role}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {member.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {member.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-[#006ebf] text-[11px] font-bold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
