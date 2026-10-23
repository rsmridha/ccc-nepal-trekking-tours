"use client";

import React from "react";
import Link from "next/link";
import {
  Printer,
  Download,
  CheckCircle2,
  Mountain,
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { BookingRecord, TrekPackage, SiteSettings } from "@/lib/db";

export default function InvoicePrintClient({
  booking,
  pkg,
  settings,
}: {
  booking: BookingRecord;
  pkg?: TrekPackage;
  settings: SiteSettings;
}) {
  const balanceDue = Math.max(0, booking.totalPrice - booking.depositPaid);
  const perPersonRate = Math.round(booking.totalPrice / Math.max(1, booking.travelers));

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          {pkg && (
            <Link
              href={`/itinerary/${pkg.slug}`}
              className="px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 text-xs font-bold text-[#006ebf] hover:bg-sky-100 inline-flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Printable Trip Itinerary
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF Invoice
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Header Banner */}
        <div className="bg-[#0b243b] text-white p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#006ebf] flex items-center justify-center font-black text-lg">
                NT
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  CCC NEPAL TREKKING TOURS
                </h1>
                <p className="text-xs text-sky-300 font-semibold">
                  Govt. Regd. Himalayan Adventure & Luxury Expedition Operator
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-300 space-y-0.5 pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {settings.address || "Kaldhara Marg, Thamel, Kathmandu, Nepal"}
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-sky-400" /> {settings.phone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-400" /> {settings.email}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
              Official Tax Invoice & Voucher
            </span>
            <div className="text-2xl font-black text-white mt-0.5">{booking.id}</div>
            <div className="text-xs text-slate-300 mt-1">
              Issued: {new Date(booking.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              <CheckCircle2 className="w-3 h-3" /> {booking.bookingStatus}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 sm:p-10 space-y-8">
          {/* Billed To & Expedition Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                Lead Traveler / Billed To
              </span>
              <h2 className="text-lg font-extrabold text-[#0b243b]">{booking.customerName}</h2>
              <div className="text-xs text-slate-600 space-y-1 mt-1">
                {booking.country && <div>Nationality / Country: <strong>{booking.country}</strong></div>}
                {booking.customerEmail && <div>Email: <strong>{booking.customerEmail}</strong></div>}
                {booking.customerPhone && <div>Phone / WhatsApp: <strong>{booking.customerPhone}</strong></div>}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#006ebf] block mb-1.5">
                Expedition Assignment
              </span>
              <div className="text-sm font-black text-[#0b243b]">{booking.packageTitle}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
                <div>
                  <span className="text-slate-400 block">Departure Date</span>
                  <strong className="text-slate-800">{booking.departureDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Duration / Region</span>
                  <strong className="text-slate-800">
                    {pkg ? `${pkg.duration} Days · ${pkg.region}` : "Himalayan Expedition"}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Party Size</span>
                  <strong className="text-slate-800">{booking.travelers} Guests</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Lead Coordinator</span>
                  <strong className="text-slate-800">Expert Representative</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Itemized Expedition Breakdown
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-center">Guests</th>
                    <th className="py-3.5 px-4 text-right">Rate (USD)</th>
                    <th className="py-3.5 px-4 text-right">Subtotal (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  <tr>
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-[#0b243b]">{booking.packageTitle}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Tier: {booking.tier} · Departure: {booking.departureDate}
                      </div>
                      {booking.specialRequests && (
                        <div className="text-xs text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg mt-2 inline-block">
                          Special Notes / Add-ons: {booking.specialRequests}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      {booking.travelers}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-700">
                      ${perPersonRate.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-[#0b243b]">
                      ${booking.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/60 text-xs text-slate-600">
                    <td className="py-3 px-4" colSpan={3}>
                      TIMS, Sagarmatha / Annapurna National Park Permits, Domestic Flights & Guide Insurance
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      Included
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary & Payment Status */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            <div className="sm:col-span-7 bg-[#f5f9fd] rounded-2xl p-5 border border-sky-100 space-y-2 text-xs text-slate-600">
              <div className="font-extrabold text-[#0b243b] flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#006ebf]" />
                Official Check-In & Arrival Instructions
              </div>
              <p>
                1. Present this voucher (digital or printed) upon arrival at Tribhuvan International Airport (KTM) or at our Thamel headquarters.
              </p>
              <p>
                2. Any remaining balance (<strong>USD {balanceDue.toLocaleString()}</strong>) is payable upon arrival in Kathmandu prior to trek departure via cash, Visa/MasterCard, or bank wire.
              </p>
              <p>
                3. 24/7 Expedition Emergency & Airport Pickup Desk: <strong>+1-888-820-8072 (Expert Representative)</strong>.
              </p>
            </div>

            <div className="sm:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total Package Amount</span>
                <strong className="text-slate-900">USD {booking.totalPrice.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Paid / Deposit Received</span>
                <strong>- USD {booking.depositPaid.toLocaleString()}</strong>
              </div>
              <div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline">
                <span className="font-extrabold text-[#0b243b]">Balance Due on Arrival</span>
                <span className="text-xl font-black text-[#006ebf]">
                  USD {balanceDue.toLocaleString()}
                </span>
              </div>
              <div className="pt-1 text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Payment Status: {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Authorized Signature Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <div>Registered under Ministry of Culture, Tourism & Civil Aviation (Govt. of Nepal)</div>
              <div>Member: TAAN · NMA · Nepal Tourism Board · Keep Nepal Clean</div>
            </div>
            <div className="sm:text-right">
              <div className="font-serif italic text-base text-[#0b243b] font-bold">
                Expert Representative
              </div>
              <div className="font-extrabold text-slate-700">Authorized Signatory</div>
              <div>CCC Nepal Trekking Tours Pvt. Ltd., Kathmandu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
