import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:1216@localhost:5432/nepal_trekking_tours";

const pool = new Pool({ connectionString });

async function main() {
  const client = await pool.connect();
  try {
    console.log("Connected to PostgreSQL: nepal_trekking_tours");

    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        subtitle TEXT NOT NULL,
        image TEXT NOT NULL,
        region TEXT NOT NULL,
        trip_count INT NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        trip_count INT NOT NULL DEFAULT 0,
        image TEXT NOT NULL,
        description TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS packages (
        id BIGINT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        subtitle TEXT NOT NULL,
        category TEXT NOT NULL,
        region TEXT NOT NULL,
        destination_slug TEXT NOT NULL,
        duration INT NOT NULL,
        price INT NOT NULL,
        regular_price INT NOT NULL,
        luxury_price INT NOT NULL,
        luxury_regular_price INT NOT NULL,
        difficulty TEXT NOT NULL,
        max_altitude TEXT NOT NULL,
        best_season TEXT NOT NULL,
        accommodation_type TEXT NOT NULL,
        meals_included TEXT NOT NULL,
        group_size TEXT NOT NULL,
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        tab_category TEXT NOT NULL,
        hero_image TEXT NOT NULL,
        gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
        overview_html TEXT NOT NULL DEFAULT '',
        overview_text TEXT NOT NULL DEFAULT '',
        highlights_html TEXT NOT NULL DEFAULT '',
        includes_html TEXT NOT NULL DEFAULT '',
        excludes_html TEXT NOT NULL DEFAULT '',
        notes_html TEXT NOT NULL DEFAULT '',
        group_discounts JSONB NOT NULL DEFAULT '[]'::jsonb,
        itineraries JSONB NOT NULL DEFAULT '[]'::jsonb,
        departures JSONB NOT NULL DEFAULT '[]'::jsonb,
        faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
        reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
        rating NUMERIC(3,1) NOT NULL DEFAULT 5.0,
        review_count INT NOT NULL DEFAULT 10,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id BIGINT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        read_time TEXT NOT NULL,
        image TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content_html TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT PRIMARY KEY,
        author TEXT NOT NULL,
        country TEXT NOT NULL,
        title TEXT NOT NULL,
        rating INT NOT NULL DEFAULT 5,
        comment TEXT NOT NULL,
        trip_name TEXT NOT NULL,
        platform TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Approved'
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id INT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INT NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS team_members (
        id INT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        experience TEXT NOT NULL,
        bio TEXT NOT NULL,
        image TEXT NOT NULL,
        certifications JSONB NOT NULL DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        package_slug TEXT NOT NULL,
        package_title TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        country TEXT NOT NULL,
        departure_date TEXT NOT NULL,
        travelers INT NOT NULL DEFAULT 2,
        tier TEXT NOT NULL,
        total_price INT NOT NULL,
        deposit_paid INT NOT NULL,
        payment_status TEXT NOT NULL,
        booking_status TEXT NOT NULL,
        special_requests TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS custom_trips (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        country TEXT NOT NULL,
        destination TEXT NOT NULL,
        start_date TEXT NOT NULL,
        duration_days INT NOT NULL,
        travelers INT NOT NULL,
        accommodation_level TEXT NOT NULL,
        budget_range TEXT NOT NULL,
        comments TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'New Request',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        subject TEXT NOT NULL,
        package_slug TEXT DEFAULT '',
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'New',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const dbPath = path.join(process.cwd(), "src", "data", "db.json");
    const seed = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    await client.query(
      `INSERT INTO site_settings (id, data) VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [JSON.stringify(seed.settings)]
    );

    for (const d of seed.destinations) {
      await client.query(
        `INSERT INTO destinations (id, title, slug, subtitle, image, region, trip_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           subtitle = EXCLUDED.subtitle,
           image = EXCLUDED.image,
           region = EXCLUDED.region,
           trip_count = EXCLUDED.trip_count`,
        [d.id, d.title, d.slug, d.subtitle, d.image, d.region, d.tripCount]
      );
    }

    for (const a of seed.activities) {
      await client.query(
        `INSERT INTO activities (id, title, slug, trip_count, image, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           trip_count = EXCLUDED.trip_count,
           image = EXCLUDED.image,
           description = EXCLUDED.description`,
        [a.id, a.title, a.slug, a.tripCount, a.image, a.description]
      );
    }

    for (const p of seed.packages) {
      await client.query(
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
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          category = EXCLUDED.category,
          region = EXCLUDED.region,
          destination_slug = EXCLUDED.destination_slug,
          duration = EXCLUDED.duration,
          price = EXCLUDED.price,
          regular_price = EXCLUDED.regular_price,
          luxury_price = EXCLUDED.luxury_price,
          luxury_regular_price = EXCLUDED.luxury_regular_price,
          overview_html = EXCLUDED.overview_html,
          overview_text = EXCLUDED.overview_text,
          itineraries = EXCLUDED.itineraries,
          departures = EXCLUDED.departures,
          faqs = EXCLUDED.faqs,
          reviews = EXCLUDED.reviews`,
        [
          p.id,
          p.title,
          p.slug,
          p.subtitle,
          p.category,
          p.region,
          p.destinationSlug,
          p.duration,
          p.price,
          p.regularPrice,
          p.luxuryPrice,
          p.luxuryRegularPrice,
          p.difficulty,
          p.maxAltitude,
          p.bestSeason,
          p.accommodationType,
          p.mealsIncluded,
          p.groupSize,
          Boolean(p.featured),
          p.tabCategory,
          p.heroImage,
          JSON.stringify(p.gallery || []),
          p.overviewHtml || "",
          p.overviewText || "",
          p.highlightsHtml || "",
          p.includesHtml || "",
          p.excludesHtml || "",
          p.notesHtml || "",
          JSON.stringify(p.groupDiscounts || []),
          JSON.stringify(p.itineraries || []),
          JSON.stringify(p.departures || []),
          JSON.stringify(p.faqs || []),
          JSON.stringify(p.reviews || []),
          p.rating || 5.0,
          p.reviewCount || 12,
        ]
      );
    }

    for (const b of seed.blogs) {
      await client.query(
        `INSERT INTO blogs (id, title, slug, date, author, category, read_time, image, excerpt, content_html)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           author = EXCLUDED.author,
           excerpt = EXCLUDED.excerpt,
           content_html = EXCLUDED.content_html`,
        [
          b.id,
          b.title,
          b.slug,
          b.date,
          b.author,
          b.category,
          b.readTime,
          b.image,
          b.excerpt,
          b.contentHtml,
        ]
      );
    }

    for (const r of seed.reviews) {
      await client.query(
        `INSERT INTO reviews (id, author, country, title, rating, comment, trip_name, platform, date, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO UPDATE SET
           comment = EXCLUDED.comment,
           author = EXCLUDED.author`,
        [
          r.id,
          r.author,
          r.country,
          r.title,
          r.rating,
          r.comment,
          r.tripName,
          r.platform,
          r.date,
          r.status,
        ]
      );
    }

    for (const f of seed.faqs) {
      await client.query(
        `INSERT INTO faqs (id, question, answer, category, sort_order)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO UPDATE SET
           question = EXCLUDED.question,
           answer = EXCLUDED.answer`,
        [f.id, f.question, f.answer, f.category, f.sortOrder]
      );
    }

    for (const t of seed.team) {
      await client.query(
        `INSERT INTO team_members (id, name, role, experience, bio, image, certifications)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           role = EXCLUDED.role,
           bio = EXCLUDED.bio`,
        [
          t.id,
          t.name,
          t.role,
          t.experience,
          t.bio,
          t.image,
          JSON.stringify(t.certifications || []),
        ]
      );
    }

    for (const bk of seed.bookings) {
      await client.query(
        `INSERT INTO bookings (
          id, package_slug, package_title, customer_name, customer_email,
          customer_phone, country, departure_date, travelers, tier,
          total_price, deposit_paid, payment_status, booking_status,
          special_requests, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        ON CONFLICT (id) DO NOTHING`,
        [
          bk.id,
          bk.packageSlug,
          bk.packageTitle,
          bk.customerName,
          bk.customerEmail,
          bk.customerPhone,
          bk.country,
          bk.departureDate,
          bk.travelers,
          bk.tier,
          bk.totalPrice,
          bk.depositPaid,
          bk.paymentStatus,
          bk.bookingStatus,
          bk.specialRequests,
          bk.createdAt,
        ]
      );
    }

    for (const ct of seed.customTrips) {
      await client.query(
        `INSERT INTO custom_trips (
          id, full_name, email, phone, country, destination, start_date,
          duration_days, travelers, accommodation_level, budget_range,
          comments, status, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT (id) DO NOTHING`,
        [
          ct.id,
          ct.fullName,
          ct.email,
          ct.phone,
          ct.country,
          ct.destination,
          ct.startDate,
          ct.durationDays,
          ct.travelers,
          ct.accommodationLevel,
          ct.budgetRange,
          ct.comments,
          ct.status,
          ct.createdAt,
        ]
      );
    }

    for (const inq of seed.inquiries) {
      await client.query(
        `INSERT INTO inquiries (
          id, name, email, phone, subject, package_slug, message, status, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO NOTHING`,
        [
          inq.id,
          inq.name,
          inq.email,
          inq.phone,
          inq.subject,
          inq.packageSlug || "",
          inq.message,
          inq.status,
          inq.createdAt,
        ]
      );
    }

    for (const sub of seed.newsletterSubscribers) {
      await client.query(
        `INSERT INTO newsletter_subscribers (id, name, email, subscribed_at)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (id) DO NOTHING`,
        [sub.id, sub.name, sub.email, sub.subscribedAt]
      );
    }

    await client.query("COMMIT");
    console.log("PostgreSQL schema created and seeded with 12 tables!");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
