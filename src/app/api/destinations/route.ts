import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, Destination } from "@/lib/db";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ destinations: db.destinations });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newDest: Destination = {
      id: Date.now() % 2000000000,
      title: body.title,
      slug,
      subtitle: body.subtitle || "Explore iconic Himalayan trails and heritage valleys",
      image:
        body.image ||
        "/images/unsplash/photo-1544735716-392fe2489ffa-1080.jpg",
      region: body.region || body.title,
      tripCount: Number(body.tripCount) || 8,
    };

    await pool.query(
      `INSERT INTO destinations (id, title, slug, subtitle, image, region, trip_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        newDest.id,
        newDest.title,
        newDest.slug,
        newDest.subtitle,
        newDest.image,
        newDest.region,
        newDest.tripCount,
      ]
    );

    return NextResponse.json({ success: true, destination: newDest }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE destinations
       SET title = COALESCE($2, title),
           subtitle = COALESCE($3, subtitle),
           region = COALESCE($4, region),
           image = COALESCE($5, image),
           trip_count = COALESCE($6, trip_count)
       WHERE slug = $1
       RETURNING *`,
      [
        body.slug,
        body.title || null,
        body.subtitle || null,
        body.region || null,
        body.image || null,
        body.tripCount !== undefined ? Number(body.tripCount) : null,
      ]
    );
    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    const r = res.rows[0];
    return NextResponse.json({
      success: true,
      destination: {
        id: Number(r.id),
        title: String(r.title),
        slug: String(r.slug),
        subtitle: String(r.subtitle),
        image: String(r.image),
        region: String(r.region),
        tripCount: Number(r.trip_count),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    await pool.query("DELETE FROM destinations WHERE slug = $1", [slug]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
