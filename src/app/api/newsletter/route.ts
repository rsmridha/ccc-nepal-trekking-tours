import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await pool.query(
      `INSERT INTO newsletter_subscribers (id, name, email, subscribed_at)
       VALUES ($1, $2, $3, $4)`,
      [Date.now(), body.name || "Subscriber", body.email, new Date().toISOString()]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
