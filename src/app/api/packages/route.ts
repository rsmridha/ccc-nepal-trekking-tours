import { NextRequest, NextResponse } from "next/server";
import { pool, getDbAsync, TrekPackage } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const region = searchParams.get("region") || "";
  const destination = searchParams.get("destination") || "";

  const db = await getDbAsync();
  let list = db.packages;

  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.overviewText.toLowerCase().includes(q)
    );
  }
  if (category) {
    list = list.filter((p) => p.category === category || p.tabCategory === category);
  }
  if (region) {
    list = list.filter((p) => p.region.toLowerCase() === region.toLowerCase());
  }
  if (destination) {
    list = list.filter((p) => p.destinationSlug === destination);
  }

  return NextResponse.json({ packages: list });
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

    const price = Number(body.price) || 1899;
    const luxuryPrice = Number(body.luxuryPrice) || Math.round(price * 1.35);

    const newPkg: TrekPackage = {
      id: Date.now(),
      title: body.title,
      slug,
      subtitle: body.subtitle || `${body.duration || 14} Days Guided Himalayan Adventure`,
      category: body.category || "deluxe-trekking",
      region: body.region || "Everest",
      destinationSlug: body.destinationSlug || "deluxe-nepal-trekking-tours",
      duration: Number(body.duration) || 14,
      price,
      regularPrice: Number(body.regularPrice) || Math.round(price * 1.18),
      luxuryPrice,
      luxuryRegularPrice: Math.round(luxuryPrice * 1.15),
      difficulty: body.difficulty || "Moderate",
      maxAltitude: body.maxAltitude || "5,364m",
      bestSeason: body.bestSeason || "Spring (Mar-May) & Autumn (Sep-Nov)",
      accommodationType: body.accommodationType || "4-Star City Hotel & Deluxe Attached-Bath Lodges",
      mealsIncluded: body.mealsIncluded || "Full Board (B+L+D) on Trek",
      groupSize: body.groupSize || "2 - 12 Guests",
      featured: Boolean(body.featured),
      tabCategory: body.tabCategory || "bestseller",
      heroImage:
        body.heroImage ||
        "/images/unsplash/photo-1544735716-392fe2489ffa-1200.jpg",
      gallery: [
        body.heroImage ||
          "/images/unsplash/photo-1544735716-392fe2489ffa-1200.jpg",
        "/images/unsplash/photo-1518002054494-3a6f94352e9d-1200.jpg",
      ],
      overviewHtml: `<p>${body.overviewText || ""}</p>`,
      overviewText: body.overviewText || "Experience an authentic Himalayan adventure led by veteran Expert Representatives.",
      highlightsHtml: body.highlightsHtml || "<ul><li>Guided by licensed local Expert Representatives</li><li>Handpicked deluxe mountain lodges</li></ul>",
      includesHtml: body.includesHtml || "<ul><li>Airport transfers in private vehicle</li><li>All meals and deluxe lodge accommodations on trek</li><li>Licensed Expert Representative & porter support</li></ul>",
      excludesHtml: body.excludesHtml || "<ul><li>International airfare & Nepal entry visa</li><li>Personal travel & rescue insurance</li></ul>",
      notesHtml: body.notesHtml || "<p>Comprehensive acclimatization and 24/7 safety backup included.</p>",
      groupDiscounts: [
        { minPax: 1, maxPax: 1, label: "1 Traveler (Solo Private)", deluxePrice: price + 250, luxuryPrice: luxuryPrice + 350 },
        { minPax: 2, maxPax: 3, label: "2 – 3 Travelers", deluxePrice: price, luxuryPrice },
        { minPax: 4, maxPax: 6, label: "4 – 6 Travelers", deluxePrice: Math.round(price * 0.93), luxuryPrice: Math.round(luxuryPrice * 0.93) },
        { minPax: 7, maxPax: 12, label: "7 – 12 Travelers", deluxePrice: Math.round(price * 0.87), luxuryPrice: Math.round(luxuryPrice * 0.87) },
      ],
      itineraries:
        Array.isArray(body.itineraries) && body.itineraries.length > 0
          ? body.itineraries
          : [
              {
                day: 1,
                title: "Day 01: Arrival in Kathmandu (1,400m) & Transfer to Hotel",
                description: "Welcome at Kathmandu International Airport and private transfer to your hotel, followed by a welcome cultural dinner.",
                accommodation: "Deluxe Hotel in Kathmandu",
                meal: "Welcome Dinner",
                transportation: "Private SUV",
                altitude: "1,400m",
                walking: "-",
                distance: "-",
              },
            ],
      departures: [
        { id: Date.now() + 1, startDate: "2026-11-10", endDate: "2026-11-24", status: "Guaranteed", price, spotsLeft: 8 },
        { id: Date.now() + 2, startDate: "2027-03-15", endDate: "2027-03-29", status: "Available", price, spotsLeft: 10 },
      ],
      faqs: [],
      reviews: [],
      rating: 5.0,
      reviewCount: 12,
    };

    await pool.query(
      `INSERT INTO packages (
        id, title, slug, subtitle, category, region, destination_slug, duration,
        price, regular_price, luxury_price, luxury_regular_price, difficulty,
        max_altitude, best_season, accommodation_type, meals_included, group_size,
        featured, tab_category, hero_image, gallery, overview_html, overview_text,
        highlights_html, includes_html, excludes_html, notes_html,
        group_discounts, itineraries, departures, faqs, reviews, rating, review_count
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35
      )`,
      [
        newPkg.id,
        newPkg.title,
        newPkg.slug,
        newPkg.subtitle,
        newPkg.category,
        newPkg.region,
        newPkg.destinationSlug,
        newPkg.duration,
        newPkg.price,
        newPkg.regularPrice,
        newPkg.luxuryPrice,
        newPkg.luxuryRegularPrice,
        newPkg.difficulty,
        newPkg.maxAltitude,
        newPkg.bestSeason,
        newPkg.accommodationType,
        newPkg.mealsIncluded,
        newPkg.groupSize,
        newPkg.featured,
        newPkg.tabCategory,
        newPkg.heroImage,
        JSON.stringify(newPkg.gallery),
        newPkg.overviewHtml,
        newPkg.overviewText,
        newPkg.highlightsHtml,
        newPkg.includesHtml,
        newPkg.excludesHtml,
        newPkg.notesHtml,
        JSON.stringify(newPkg.groupDiscounts),
        JSON.stringify(newPkg.itineraries),
        JSON.stringify(newPkg.departures),
        JSON.stringify(newPkg.faqs),
        JSON.stringify(newPkg.reviews),
        newPkg.rating,
        newPkg.reviewCount,
      ]
    );

    return NextResponse.json({ success: true, package: newPkg }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE packages
       SET title = COALESCE($2, title),
           duration = COALESCE($3, duration),
           price = COALESCE($4, price),
           luxury_price = COALESCE($5, luxury_price)
       WHERE slug = $1
       RETURNING *`,
      [
        body.slug,
        body.title,
        Number(body.duration),
        Number(body.price),
        Number(body.luxuryPrice),
      ]
    );
    if (res.rowCount === 0) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    return NextResponse.json({ success: true, package: body });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    await pool.query("DELETE FROM packages WHERE slug = $1", [slug]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
