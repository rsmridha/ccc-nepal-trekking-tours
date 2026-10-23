import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, BookingRecord } from "@/lib/db";
import {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
} from "@/lib/mailer";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ bookings: db.bookings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newBooking: BookingRecord = {
      id: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      packageSlug: body.packageSlug || "deluxe-everest-base-camp-trek",
      packageTitle: body.packageTitle || "Deluxe Everest Base Camp Trek",
      customerName: body.customerName || "Guest Traveler",
      customerEmail: body.customerEmail || "",
      customerPhone: body.customerPhone || "",
      country: body.country || "",
      departureDate: body.departureDate || "2026-11-15",
      travelers: Number(body.travelers) || 2,
      tier: body.tier || "Deluxe Package",
      totalPrice: Number(body.totalPrice) || 1899,
      depositPaid: Number(body.depositPaid) || Math.round((Number(body.totalPrice) || 1899) * 0.2),
      paymentStatus:
        body.paymentMethod === "full"
          ? "Paid in Full"
          : body.paymentMethod === "deposit"
          ? "20% Deposit Paid"
          : "Pay on Arrival / Bank Wire",
      bookingStatus: "Confirmed",
      specialRequests: body.specialRequests || "",
      createdAt: new Date().toISOString(),
    };

    await pool.query(
      `INSERT INTO bookings (
        id, package_slug, package_title, customer_name, customer_email,
        customer_phone, country, departure_date, travelers, tier,
        total_price, deposit_paid, payment_status, booking_status,
        special_requests, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        newBooking.id,
        newBooking.packageSlug,
        newBooking.packageTitle,
        newBooking.customerName,
        newBooking.customerEmail,
        newBooking.customerPhone,
        newBooking.country,
        newBooking.departureDate,
        newBooking.travelers,
        newBooking.tier,
        newBooking.totalPrice,
        newBooking.depositPaid,
        newBooking.paymentStatus,
        newBooking.bookingStatus,
        newBooking.specialRequests,
        newBooking.createdAt,
      ]
    );

    const emailLog = await sendBookingConfirmationEmail(newBooking);

    return NextResponse.json(
      { success: true, booking: newBooking, emailSent: Boolean(emailLog) },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create booking", details: String(err) },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE bookings
       SET booking_status = COALESCE($2, booking_status),
           payment_status = COALESCE($3, payment_status)
       WHERE id = $1
       RETURNING *`,
      [body.id, body.bookingStatus || null, body.paymentStatus || null]
    );
    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const r = res.rows[0];
    const updated: BookingRecord = {
      id: r.id,
      packageSlug: r.package_slug,
      packageTitle: r.package_title,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      country: r.country,
      departureDate: r.departure_date,
      travelers: Number(r.travelers),
      tier: r.tier,
      totalPrice: Number(r.total_price),
      depositPaid: Number(r.deposit_paid),
      paymentStatus: r.payment_status,
      bookingStatus: r.booking_status,
      specialRequests: r.special_requests || "",
      createdAt: new Date(r.created_at).toISOString(),
    };

    await sendBookingStatusUpdateEmail(updated);

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update booking", details: String(err) },
      { status: 400 }
    );
  }
}
