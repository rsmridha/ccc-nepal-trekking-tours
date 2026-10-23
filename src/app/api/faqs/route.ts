import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, FAQItem } from "@/lib/db";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ faqs: db.faqs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newFaq: FAQItem = {
      id: Date.now() % 2000000000,
      question: body.question,
      answer: body.answer,
      category: body.category || "General Trekking",
      sortOrder: Number(body.sortOrder) || 10,
    };

    await pool.query(
      `INSERT INTO faqs (id, question, answer, category, sort_order)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        newFaq.id,
        newFaq.question,
        newFaq.answer,
        newFaq.category,
        newFaq.sortOrder,
      ]
    );

    return NextResponse.json({ success: true, faq: newFaq }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE faqs
       SET question = COALESCE($2, question),
           answer = COALESCE($3, answer),
           category = COALESCE($4, category),
           sort_order = COALESCE($5, sort_order)
       WHERE id = $1
       RETURNING *`,
      [
        Number(body.id),
        body.question || null,
        body.answer || null,
        body.category || null,
        body.sortOrder !== undefined ? Number(body.sortOrder) : null,
      ]
    );
    if (res.rowCount === 0) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }
    const r = res.rows[0];
    return NextResponse.json({
      success: true,
      faq: {
        id: Number(r.id),
        question: String(r.question),
        answer: String(r.answer),
        category: String(r.category),
        sortOrder: Number(r.sort_order),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    await pool.query("DELETE FROM faqs WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
