import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, BlogPost } from "@/lib/db";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({ blogs: db.blogs });
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

    const newPost: BlogPost = {
      id: Date.now() % 2000000000,
      title: body.title,
      slug,
      date: body.date || new Date().toISOString().slice(0, 10),
      author: body.author || "Expert Representative",
      category: body.category || "Travel Guide",
      readTime: body.readTime || "6 min read",
      image:
        body.image ||
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1080&q=80",
      excerpt: body.excerpt || "",
      contentHtml: body.contentHtml || `<p>${body.excerpt || ""}</p>`,
    };

    await pool.query(
      `INSERT INTO blogs (id, title, slug, date, author, category, read_time, image, excerpt, content_html)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        newPost.id,
        newPost.title,
        newPost.slug,
        newPost.date,
        newPost.author,
        newPost.category,
        newPost.readTime,
        newPost.image,
        newPost.excerpt,
        newPost.contentHtml,
      ]
    );

    return NextResponse.json({ success: true, blog: newPost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE blogs
       SET title = COALESCE($2, title),
           category = COALESCE($3, category),
           author = COALESCE($4, author),
           read_time = COALESCE($5, read_time),
           image = COALESCE($6, image),
           excerpt = COALESCE($7, excerpt),
           content_html = COALESCE($8, content_html)
       WHERE slug = $1
       RETURNING *`,
      [
        body.slug,
        body.title || null,
        body.category || null,
        body.author || null,
        body.readTime || null,
        body.image || null,
        body.excerpt || null,
        body.contentHtml || null,
      ]
    );
    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    const r = res.rows[0];
    return NextResponse.json({
      success: true,
      blog: {
        id: Number(r.id),
        title: String(r.title),
        slug: String(r.slug),
        date: String(r.date),
        author: String(r.author),
        category: String(r.category),
        readTime: String(r.read_time),
        image: String(r.image),
        excerpt: String(r.excerpt),
        contentHtml: String(r.content_html),
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
    await pool.query("DELETE FROM blogs WHERE slug = $1", [slug]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
