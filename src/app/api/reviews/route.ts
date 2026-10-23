import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, GlobalReview } from "@/lib/db";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ reviews: db.reviews });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newReview: GlobalReview = {
      id: Date.now(),
      author: body.author || "Verified Traveler",
      country: body.country || "USA",
      title: body.title || "Amazing Himalayan Trek!",
      rating: Number(body.rating) || 5,
      comment: body.comment || "",
      tripName: body.tripName || "Deluxe Everest Base Camp Trek",
      platform: body.platform || "Direct Website",
      date: new Date().toISOString().slice(0, 10),
      status: "Approved",
    };

    await pool.query(
      `INSERT INTO reviews (id, author, country, title, rating, comment, trip_name, platform, date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        newReview.id,
        newReview.author,
        newReview.country,
        newReview.title,
        newReview.rating,
        newReview.comment,
        newReview.tripName,
        newReview.platform,
        newReview.date,
        newReview.status,
      ]
    );

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit review", details: String(err) }, { status: 400 });
  }
}
