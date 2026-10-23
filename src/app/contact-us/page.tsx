"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle } from "lucide-react";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, subject, message }),
    });
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-[#0b243b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            24/7 Himalayan Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Contact Us</h1>
          <p className="text-sky-100 mt-2 max-w-xl text-sm sm:text-base">
            Have questions about permits, Lukla flights, or choosing between Deluxe and Luxury treks? Speak directly with our Expert Representative in Kathmandu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Office Contact Cards */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-extrabold text-[#0b243b]">
              Nepal Head Office (Kathmandu)
            </h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#006ebf] shrink-0 mt-0.5" />
                <span>
                  CCC Nepal Trekking Tours & Adventure Pvt. Ltd.
                  <br />
                  Thamel, Kathmandu 44600, Nepal
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <a href="tel:+18888208072" className="font-bold text-slate-800 hover:text-[#006ebf]">
                  +1-888-820-8072 (Direct / WhatsApp / Viber)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#006ebf] shrink-0" />
                <a href="mailto:info@nepaltrekkingtours.com" className="font-bold text-slate-800 hover:text-[#006ebf]">
                  info@nepaltrekkingtours.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Sun – Sat: 7:00 AM – 9:00 PM NPT (24/7 Emergency Support)</span>
              </div>
            </div>

            <div className="pt-3">
              <a
                href="https://api.whatsapp.com/send?phone=18888208072"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Chat Instantly on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <h2 className="text-xl font-extrabold text-[#0b243b] mb-2">
            Send Us a Message
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            All messages are logged directly into our Kathmandu Support & Admin Portal.
          </p>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Message Sent Successfully!
              </div>
              <p className="text-sm">
                Thank you for contacting CCC Nepal Trekking Tours. Our Expert Representative will respond to your message shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 415 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Group Join Inquiry for EBC"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our Expert Representative Team help plan your trip?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
