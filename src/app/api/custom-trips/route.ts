import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, CustomTripRequest } from "@/lib/db";
import { sendCustomTripAcknowledgementEmail } from "@/lib/mailer";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ customTrips: db.customTrips });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newRequest: CustomTripRequest = {
      id: `CT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      fullName: body.fullName || "",
      email: body.email || "",
      phone: body.phone || "",
      country: body.country || "",
      destination: body.destination || "Everest Region",
      startDate: body.startDate || "",
      durationDays: Number(body.durationDays) || 14,
      travelers: Number(body.travelers) || 2,
      accommodationLevel: body.accommodationLevel || "Deluxe (4-star hotels & deluxe lodges)",
      budgetRange: body.budgetRange || "$2,000 - $3,000",
      comments: body.comments || "",
      status: "New Request",
      createdAt: new Date().toISOString(),
    };

    await pool.query(
      `INSERT INTO custom_trips (
        id, full_name, email, phone, country, destination, start_date,
        duration_days, travelers, accommodation_level, budget_range,
        comments, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        newRequest.id,
        newRequest.fullName,
        newRequest.email,
        newRequest.phone,
        newRequest.country,
        newRequest.destination,
        newRequest.startDate,
        newRequest.durationDays,
        newRequest.travelers,
        newRequest.accommodationLevel,
        newRequest.budgetRange,
        newRequest.comments,
        newRequest.status,
        newRequest.createdAt,
      ]
    );

    await sendCustomTripAcknowledgementEmail(newRequest);

    return NextResponse.json({ success: true, customTrip: newRequest }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to submit custom trip request", details: String(err) },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE custom_trips SET status = $2 WHERE id = $1 RETURNING *`,
      [body.id, body.status]
    );
    if (res.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = res.rows[0];
    return NextResponse.json({
      success: true,
      customTrip: {
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        country: r.country,
        destination: r.destination,
        startDate: r.start_date,
        durationDays: Number(r.duration_days),
        travelers: Number(r.travelers),
        accommodationLevel: r.accommodation_level,
        budgetRange: r.budget_range,
        comments: r.comments,
        status: r.status,
        createdAt: new Date(r.created_at).toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
