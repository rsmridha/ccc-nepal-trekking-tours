import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, InquiryRecord } from "@/lib/db";
import { sendInquiryAcknowledgementEmail } from "@/lib/mailer";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ inquiries: db.inquiries });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newInquiry: InquiryRecord = {
      id: `INQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      subject: body.subject || "General Trekking Inquiry",
      packageSlug: body.packageSlug || "",
      message: body.message || "",
      status: "New",
      createdAt: new Date().toISOString(),
    };

    await pool.query(
      `INSERT INTO inquiries (
        id, name, email, phone, subject, package_slug, message, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        newInquiry.id,
        newInquiry.name,
        newInquiry.email,
        newInquiry.phone,
        newInquiry.subject,
        newInquiry.packageSlug || "",
        newInquiry.message,
        newInquiry.status,
        newInquiry.createdAt,
      ]
    );

    await sendInquiryAcknowledgementEmail(newInquiry);

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to submit inquiry", details: String(err) },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE inquiries SET status = $2 WHERE id = $1 RETURNING *`,
      [body.id, body.status]
    );
    if (res.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = res.rows[0];
    return NextResponse.json({
      success: true,
      inquiry: {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        subject: r.subject,
        packageSlug: r.package_slug || "",
        message: r.message,
        status: r.status,
        createdAt: new Date(r.created_at).toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
