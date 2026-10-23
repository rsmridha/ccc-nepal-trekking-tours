"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, Send } from "lucide-react";
import ImageUploadPreview from "@/components/ImageUploadPreview";

export default function WriteReviewPage() {
  const [author, setAuthor] = useState("");
  const [country, setCountry] = useState("");
  const [tripName, setTripName] = useState("Deluxe Everest Base Camp Trek");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tripPhoto, setTripPhoto] = useState(
    "/images/upload/package/deluxe-everest-base-camp-trek.jpg"
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, country, tripName, title, rating, comment }),
    });
    setSubmitted(true);
  };

  return (
    <div>
      <div className="bg-[#0b243b] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
            Share Your Himalayan Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Write a Trip Review</h1>
          <p className="text-sky-100 mt-2 text-sm sm:text-base">
            Trekked with our Expert Representative and team? Share your feedback with future Himalayan adventurers.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-black text-[#0b243b]">
              Thank You for Your Review!
            </h2>
            <p className="text-sm text-slate-600">
              Your review has been published to our Traveller Stories wall.
            </p>
            <Link
              href="/review"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-extrabold"
            >
              View All Reviews
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Amanda"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="USA, Australia, UK..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trek / Tour Completed
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Star Rating
                </label>
                <div className="flex items-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          num <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best Everest Base Camp Deluxe Trek!"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Experience *
              </label>
              <textarea
                rows={5}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your guide, porter, lodges, meals, and overall experience..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <ImageUploadPreview
              label="Optional Trip Photo (Upload & Live Preview)"
              value={tripPhoto}
              onChange={(p) => setTripPhoto(p)}
              folder="reviews"
            />

            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
