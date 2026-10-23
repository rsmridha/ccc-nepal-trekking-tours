import fs from "fs";
import path from "path";

const API_BASE = "https://webapp.nepaltrekkingtours.com/api";
const IMAGE_BASE = "/images/misc/upload";

function resolveImage(folder, filename, fallback) {
  if (!filename) return fallback;
  if (filename.startsWith("http")) return filename;
  return `${IMAGE_BASE}/${folder}/${filename}`;
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&mdash;|&ndash;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function main() {
  console.log("Fetching home data from reference API...");
  const home = await fetchJson(`${API_BASE}/home`);
  const blogsRes = await fetchJson(`${API_BASE}/blogs`);
  const reviewsRes = await fetchJson(`${API_BASE}/reviews`);

  const packageSlugs = [
    "deluxe-everest-base-camp-trek",
    "deluxe-annapurna-circuit-trek",
    "deluxe-manaslu-circuit-trek",
    "luxury-helicopter-everest-base-camp-trek",
    "luxury-annapurna-circuit-trek",
    "luxury-everest-base-camp-trek",
    "deluxe-mera-peak-expedition",
    "deluxe-lobuche-peak-expedition",
    "deluxe-island-peak-expedition",
    "luxury-everest-experience-trek",
    "luxury-annapurna-experience-trek",
    "deluxe-best-of-annapurna-trek",
    "deluxe-annapurna-base-camp-trek",
    "deluxe-everest-high-pass-trek",
    "deluxe-gokyo-everest-base-camp-trek",
    "deluxe-upper-mustang-trek",
    "deluxe-langtang-gosaikunda-lake-trek",
    "deluxe-best-of-nepal-tour",
    "deluxe-best-of-bhutan-tour",
    "luxury-helicopter-annapurna-base-camp-trek",
  ];

  console.log(`Fetching ${packageSlugs.length} detailed packages in parallel...`);
  const rawPackages = await Promise.all(
    packageSlugs.map((slug) => fetchJson(`${API_BASE}/packages/${slug}`))
  );

  const packages = rawPackages
    .filter(Boolean)
    .map((pkg, idx) => {
      const slug = pkg.slug;
      const isLuxury = slug.includes("luxury");
      const isPeak = slug.includes("peak") || slug.includes("expedition");
      const isTour = slug.includes("tour") || slug.includes("bhutan");
      let category = "deluxe-trekking";
      if (isPeak) category = "peak-climbing";
      else if (isLuxury) category = "luxury-trekking";
      else if (isTour) category = "cultural-tours";

      let region = "Everest";
      if (slug.includes("annapurna") || slug.includes("poonhill")) region = "Annapurna";
      else if (slug.includes("manaslu")) region = "Manaslu";
      else if (slug.includes("langtang")) region = "Langtang";
      else if (slug.includes("mustang")) region = "Mustang";
      else if (slug.includes("bhutan")) region = "Bhutan";
      else if (slug.includes("mera") || slug.includes("island") || slug.includes("lobuche")) region = "Everest / Khumbu";
      else if (slug.includes("nepal-tour")) region = "Kathmandu & Pokhara";

      const itineraries = Array.isArray(pkg.itineraries) && pkg.itineraries.length > 0
        ? pkg.itineraries.map((it, i) => ({
            day: i + 1,
            title: it.title || `Day ${i + 1}`,
            description: stripHtml(it.description) || "Full guided day in the Himalayas with luxury lodge hospitality and scenic trails.",
            accommodation: it.accommodation || (isLuxury ? "5-Star Luxury Mountain Lodge" : "Deluxe Attached-Bath Lodge"),
            meal: it.meal || "Breakfast, Lunch & Dinner (B+L+D)",
            transportation: it.transportation || "On Foot / Trekking",
            altitude: it.altitude || "3,440m / 11,286ft",
            walking: it.walking || "5-6 hours",
            distance: it.distance || "10-12 km",
          }))
        : [
            {
              day: 1,
              title: "Day 01: Arrival in Kathmandu (1,400m) & Transfer to Hotel",
              description: "Welcome & greet at Tribhuvan International Airport in Kathmandu and private transfer to your luxury hotel. Evening welcome dinner with cultural performance and trip briefing.",
              accommodation: "4/5-Star Deluxe Hotel in Kathmandu",
              meal: "Welcome Cultural Dinner",
              transportation: "Private Luxury SUV/Van",
              altitude: "1,400m / 4,593ft",
              walking: "-",
              distance: "-",
            },
          ];

      const departures = Array.isArray(pkg.departures) && pkg.departures.length > 0
        ? pkg.departures.map((d) => ({
            id: d.id,
            startDate: d.trip_start,
            endDate: d.trip_end,
            status: d.trip_status || "Available",
            price: Number(d.price) || Number(pkg.price) || 1899,
            spotsLeft: Math.floor(Math.random() * 6) + 4,
          }))
        : [
            { id: idx * 10 + 1, startDate: "2026-11-01", endDate: "2026-11-15", status: "Guaranteed", price: Number(pkg.price) || 1899, spotsLeft: 6 },
            { id: idx * 10 + 2, startDate: "2026-11-15", endDate: "2026-11-29", status: "Available", price: Number(pkg.price) || 1899, spotsLeft: 8 },
            { id: idx * 10 + 3, startDate: "2026-12-05", endDate: "2026-12-19", status: "Available", price: Number(pkg.price) || 1899, spotsLeft: 10 },
            { id: idx * 10 + 4, startDate: "2027-03-10", endDate: "2027-03-24", status: "Available", price: Number(pkg.price) || 1899, spotsLeft: 12 },
            { id: idx * 10 + 5, startDate: "2027-04-02", endDate: "2027-04-16", status: "Guaranteed", price: Number(pkg.price) || 1899, spotsLeft: 5 },
          ];

      const gallery = Array.isArray(pkg.sliders) && pkg.sliders.length > 0
        ? pkg.sliders.map((s) => resolveImage("package/slider", s.imagename, "/images/unsplash/photo-1544735716-392fe2489ffa-1600.jpg"))
        : [
            resolveImage("package", pkg.imagename, "/images/unsplash/photo-1544735716-392fe2489ffa-1600.jpg"),
            "/images/unsplash/photo-1518002054494-3a6f94352e9d-1200.jpg",
            "/images/unsplash/photo-1464822759023-fed622ff2c3b-1200.jpg",
          ];

      const faqs = Array.isArray(pkg.faqs) && pkg.faqs.length > 0
        ? pkg.faqs.map((f) => ({
            id: f.id,
            question: f.title,
            answer: stripHtml(f.description),
          }))
        : [];

      const reviews = Array.isArray(pkg.reviews) && pkg.reviews.length > 0
        ? pkg.reviews.map((r) => ({
            id: r.id,
            author: r.label || "Adventure Traveler",
            country: r.address || "USA",
            rating: Number(r.rating) || 5,
            title: r.title || "Unforgettable Himalayan Experience",
            comment: stripHtml(r.description),
            date: (r.created_at || "2025-11-17").slice(0, 10),
          }))
        : [];

      return {
        id: pkg.id || idx + 1,
        title: pkg.title,
        slug: pkg.slug,
        subtitle: pkg.label || `${pkg.trip_days || 14} Days Guided Himalayan Adventure`,
        category,
        region,
        destinationSlug: isPeak
          ? "peak-climbing-in-nepal"
          : isLuxury
          ? "luxury-nepal-trekking-tours"
          : isTour
          ? "multi-country-tour"
          : "deluxe-nepal-trekking-tours",
        duration: Number(pkg.trip_days) || 14,
        price: Number(pkg.price) || 1899,
        regularPrice: Number(pkg.price_regular) || Math.round((Number(pkg.price) || 1899) * 1.18),
        luxuryPrice: Number(pkg.luxury_price) || Math.round((Number(pkg.price) || 1899) * 1.35),
        luxuryRegularPrice: Number(pkg.luxury_price_regular) || Math.round((Number(pkg.price) || 1899) * 1.5),
        difficulty: isPeak ? "Challenging / Expedition" : pkg.slug.includes("experience") || pkg.slug.includes("tour") ? "Easy to Moderate" : "Moderate",
        maxAltitude: isPeak ? "6,476m / 21,246ft" : region === "Everest" ? "5,545m (Kala Patthar)" : region === "Annapurna" ? "5,416m (Thorong La) / 4,130m (ABC)" : "4,500m",
        bestSeason: "Spring (Mar-May) & Autumn (Sep-Nov)",
        accommodationType: isLuxury ? "5-Star City Hotels & Luxury Mountain Lodges" : "4-Star City Hotel & Deluxe Attached-Bath Lodges",
        mealsIncluded: "Full Board (Breakfast, Lunch & Dinner) on Trek",
        groupSize: "2 – 12 Guests (Private or Small Group)",
        featured: idx < 8,
        tabCategory: isPeak ? "peak" : isLuxury ? "luxury" : pkg.slug.includes("experience") || pkg.slug.includes("poonhill") ? "beginner" : "bestseller",
        heroImage: resolveImage("package", pkg.imagename, "/images/unsplash/photo-1544735716-392fe2489ffa-1200.jpg"),
        gallery,
        overviewHtml: pkg.description || "",
        overviewText: stripHtml(pkg.description).slice(0, 1200),
        highlightsHtml: pkg.highlights || "",
        includesHtml: pkg.includes || "",
        excludesHtml: pkg.excludes || "",
        notesHtml: pkg.notes || "",
        groupDiscounts: [
          { minPax: 1, maxPax: 1, label: "1 Traveler (Solo Private)", deluxePrice: (Number(pkg.price) || 1899) + 250, luxuryPrice: (Number(pkg.luxury_price) || 2599) + 350 },
          { minPax: 2, maxPax: 3, label: "2 – 3 Travelers", deluxePrice: Number(pkg.price) || 1899, luxuryPrice: Number(pkg.luxury_price) || 2599 },
          { minPax: 4, maxPax: 6, label: "4 – 6 Travelers", deluxePrice: Math.round((Number(pkg.price) || 1899) * 0.93), luxuryPrice: Math.round((Number(pkg.luxury_price) || 2599) * 0.93) },
          { minPax: 7, maxPax: 12, label: "7 – 12 Travelers (Group)", deluxePrice: Math.round((Number(pkg.price) || 1899) * 0.87), luxuryPrice: Math.round((Number(pkg.luxury_price) || 2599) * 0.87) },
        ],
        itineraries,
        departures,
        faqs,
        reviews,
        rating: 5.0,
        reviewCount: Math.max(reviews.length, Math.floor(Math.random() * 25) + 12),
      };
    });

  const destinations = [
    {
      id: 1,
      title: "Deluxe CCC Nepal Trekking Tours",
      slug: "deluxe-nepal-trekking-tours",
      subtitle: "Signature comfort treks with handpicked mountain lodges, private transfers, and veteran Sherpa guides.",
      image: "/images/upload/destination/deluxe-nepal-trekking-tours.jpg",
      region: "Nepal",
      tripCount: packages.filter((p) => p.destinationSlug === "deluxe-nepal-trekking-tours").length,
    },
    {
      id: 2,
      title: "Luxury CCC Nepal Trekking Tours",
      slug: "luxury-nepal-trekking-tours",
      subtitle: "5-star heritage stays, Yeti Mountain Homes, gourmet dining, and scenic helicopter returns.",
      image: "/images/upload/destination/luxury-nepal-trekking-tours.jpg",
      region: "Nepal",
      tripCount: packages.filter((p) => p.destinationSlug === "luxury-nepal-trekking-tours").length,
    },
    {
      id: 3,
      title: "Peak Climbing in Nepal",
      slug: "peak-climbing-in-nepal",
      subtitle: "NMA-certified Himalayan summit expeditions led by IFMGA & Everest-summiteer Sherpa climbing guides.",
      image: "/images/upload/destination/home/img_1653.JPG",
      region: "Himalayas",
      tripCount: packages.filter((p) => p.destinationSlug === "peak-climbing-in-nepal").length,
    },
    {
      id: 4,
      title: "Multi-Country Himalayan Tours",
      slug: "multi-country-tour",
      subtitle: "Cross-border cultural odysseys across Nepal, Bhutan (Land of the Thunder Dragon), and Tibet.",
      image: "/images/upload/destination/img_1831jpg.jpeg",
      region: "Nepal · Tibet · Bhutan",
      tripCount: packages.filter((p) => p.destinationSlug === "multi-country-tour").length,
    },
  ];

  const activities = [
    {
      id: 1,
      title: "Deluxe Trekking in Nepal",
      slug: "deluxe-trekking-in-nepal",
      tripCount: 19,
      image: "/images/upload/activity/home/img_1649.JPG",
      description: "Classic Himalayan trails upgraded with attached-bathroom lodges, hot showers, and veteran Sherpa guides.",
    },
    {
      id: 2,
      title: "Deluxe Tour in Nepal",
      slug: "deluxe-tour-in-nepal",
      tripCount: 4,
      image: "/images/upload/activity/home/img_1929.jpeg",
      description: "Private cultural heritage, wildlife safari, and lakeside retreats in Kathmandu, Pokhara, and Chitwan.",
    },
    {
      id: 3,
      title: "Deluxe Peak Climbing in Nepal",
      slug: "deluxe-peak-climbing-in-nepal",
      tripCount: 7,
      image: "/images/upload/activity/home/img_2374.JPG",
      description: "Conquer 6,000m+ Himalayan trekking peaks including Island Peak, Mera Peak, and Lobuche East.",
    },
    {
      id: 4,
      title: "Deluxe Adventure Tour in Nepal",
      slug: "deluxe-adventure-tour-in-nepal",
      tripCount: 3,
      image: "/images/upload/activity/home/4ec1887a-2e70-4c66-a012-c3f4119095b5.JPG",
      description: "Mountain biking, helicopter expeditions, white-water rafting, and multi-sport Himalayan thrills.",
    },
  ];

  const rawBlogs = Array.isArray(blogsRes?.blogs || blogsRes?.data || home?.blogs)
    ? (blogsRes?.blogs || blogsRes?.data || home?.blogs)
    : [];

  const blogs = rawBlogs.map((b, i) => ({
    id: b.id || i + 1,
    title: b.title,
    slug: b.slug,
    date: b.fulldate || (b.created_at || "2025-08-02").slice(0, 10),
    author: "Expert Representative",
    category: b.title.toLowerCase().includes("peak") ? "Peak Climbing" : b.title.toLowerCase().includes("luxury") ? "Luxury Trekking" : "Travel Guide",
    readTime: "7 min read",
    image: resolveImage("blog", b.imagename, "/images/unsplash/photo-1544735716-392fe2489ffa-1080.jpg"),
    excerpt: stripHtml(b.excerpt || b.description).slice(0, 220) + "...",
    contentHtml: b.description || `<p>${stripHtml(b.excerpt)}</p>`,
  }));

  const rawReviews = Array.isArray(reviewsRes?.reviews || reviewsRes?.data || home?.reviews)
    ? (reviewsRes?.reviews || reviewsRes?.data || home?.reviews)
    : [];

  const reviews = rawReviews.map((r, i) => ({
    id: r.id || i + 1,
    author: r.label || "Adam Smith",
    country: r.address || "USA",
    title: r.title || "Best trekking tour service - Excellent Local Travel Agency in Nepal",
    rating: Number(r.rating) || 5,
    comment: stripHtml(r.description),
    tripName: r.title || "Deluxe Everest Base Camp Trek",
    platform: i % 2 === 0 ? "TripAdvisor" : "Google",
    date: (r.created_at || "2025-10-15").slice(0, 10),
    status: "Approved",
  }));

  const faqs = Array.isArray(home?.faqs)
    ? home.faqs.map((f, i) => ({
        id: f.id || i + 1,
        question: f.title,
        answer: stripHtml(f.description),
        category: "General Trekking",
        sortOrder: f.sort_order || i + 1,
      }))
    : [];

  const team = [
    {
      id: 1,
      name: "Expert Representative",
      role: "Founder & Managing Director / Lead Expedition Guide",
      experience: "27+ Years in the Himalayas",
      bio: "Born in the Solukhumbu (Everest) region, our Expert Representative has led over 300 deluxe and luxury treks across Nepal, Tibet, and Bhutan since 1999.",
      image: "/images/team/expert-representative.png",
      certifications: ["Government Licensed Trekking & Mountaineering Guide", "Wilderness First Responder (WFR)", "STEAN Founding Member"],
    },
    {
      id: 2,
      name: "Pema Dorjee Sherpa",
      role: "Senior Trekking & Peak Climbing Guide",
      experience: "18+ Years Experience",
      bio: "Summit specialist for Island Peak, Mera Peak, and Lobuche East, known for his deep cultural stories, warmth, and impeccable high-altitude safety record.",
      image: "/images/unsplash/photo-1534528741775-53994a69daeb-600.jpg",
      certifications: ["NMA High Altitude Climbing Guide", "High Altitude First Aid Certified"],
    },
    {
      id: 3,
      name: "Tendi Sherpa",
      role: "Head of Operations & Guest Relations (Kathmandu)",
      experience: "16+ Years Experience",
      bio: "Oversees all airport welcomes, domestic flight logistics, luxury hotel partnerships, and 24/7 satellite on-trip support.",
      image: "/images/unsplash/photo-1507003211169-0a1dd7228f2d-600.jpg",
      certifications: ["Tourism Management Degree", "TAAN Coordinator"],
    },
    {
      id: 4,
      name: "Ngima Tendi Sherpa",
      role: "Senior Sherpa Guide & Logistics Leader",
      experience: "14+ Years Experience",
      bio: "Expert on Annapurna, Manaslu Circuit, and Upper Mustang trails with a passion for sustainable Himalayan hospitality.",
      image: "/images/unsplash/photo-1500648767791-00dcc994a43e-600.jpg",
      certifications: ["KEEP Eco-Trekking Certified", "Government Licensed Guide"],
    },
  ];

  const bookings = [
    {
      id: "BK-2026-1001",
      packageSlug: "deluxe-everest-base-camp-trek",
      packageTitle: "Deluxe Everest Base Camp Trek",
      customerName: "Mandy Williams",
      customerEmail: "mandy.w@example.com",
      customerPhone: "+1 (415) 890-2341",
      country: "United States",
      departureDate: "2026-11-01",
      travelers: 2,
      tier: "Deluxe (4-Star Hotel & Deluxe Lodges)",
      totalPrice: 3798,
      depositPaid: 760,
      paymentStatus: "Deposit Paid",
      bookingStatus: "Confirmed",
      specialRequests: "Vegetarian meals on the trek, twin bed room preference.",
      createdAt: "2026-10-18T14:22:00Z",
    },
    {
      id: "BK-2026-1002",
      packageSlug: "luxury-helicopter-everest-base-camp-trek",
      packageTitle: "Luxury Helicopter Everest Base Camp Trek",
      customerName: "James & Victoria Sterling",
      customerEmail: "j.sterling@example.co.uk",
      customerPhone: "+44 7700 900412",
      country: "United Kingdom",
      departureDate: "2026-11-15",
      travelers: 2,
      tier: "Luxury VIP (5-Star Hotel & Yeti Mountain Home)",
      totalPrice: 8998,
      depositPaid: 1800,
      paymentStatus: "Paid in Full",
      bookingStatus: "Confirmed",
      specialRequests: "Private helicopter return from Gorakshep to Lukla.",
      createdAt: "2026-10-20T09:15:00Z",
    },
  ];

  const customTrips = [
    {
      id: "CT-2026-501",
      fullName: "Dr. Henrik Lindqvist",
      email: "henrik.lindqvist@example.se",
      phone: "+46 70 123 45 67",
      country: "Sweden",
      destination: "Upper Mustang & Annapurna Heli Trek",
      startDate: "2027-04-10",
      durationDays: 16,
      travelers: 4,
      accommodationLevel: "Luxury (4-5 star hotels & luxury lodges)",
      budgetRange: "$3,500 - $4,500 per person",
      comments: "We are two couples in our 50s looking for a private photography-focused trek in Upper Mustang with a helicopter charter from Lo Manthang.",
      status: "In Review",
      createdAt: "2026-10-21T16:40:00Z",
    },
  ];

  const inquiries = [
    {
      id: "INQ-2026-301",
      name: "Carlos Mendoza",
      email: "carlos.m@example.com",
      phone: "+34 612 345 678",
      subject: "Deluxe Mera Peak Expedition - Gear & Acclimatization",
      packageSlug: "deluxe-mera-peak-expedition",
      message: "Hi Expert Representative, I am interested in joining the November Mera Peak climb. Do you provide La Sportiva double boots in Kathmandu or should I bring my own?",
      status: "Replied",
      createdAt: "2026-10-22T08:10:00Z",
    },
  ];

  const db = {
    settings: {
      siteName: "CCC Nepal Trekking Tours",
      tagline: "Himalayan Adventures Since 1999",
      slogan: "Experience the Luxury in Himalaya",
      establishedYear: 1999,
      yearsExperience: "27+",
      happyTravelers: "15,000+",
      countriesCovered: 3,
      phone: "+1-888-820-8072",
      whatsapp: "+1-888-820-8072",
      email: "info@nepaltrekkingtours.com",
      address: "Thamel, Kathmandu, Nepal",
      expertName: "Expert Representative",
      expertRole: "Founder & Lead Sherpa Trekking Expert",
      tripAdvisorReviews: 126,
      googleReviews: 130,
      facebookReviews: 53,
    },
    destinations,
    activities,
    packages,
    blogs,
    reviews,
    faqs,
    team,
    bookings,
    customTrips,
    inquiries,
    newsletterSubscribers: [
      { id: 1, name: "Sarah Jenkins", email: "sarah.j@example.com", subscribedAt: "2026-10-15T10:00:00Z" },
    ],
  };

  const outDir = path.join(process.cwd(), "src", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "db.json");
  fs.writeFileSync(outPath, JSON.stringify(db, null, 2), "utf8");
  console.log(`Saved database to ${outPath} with ${packages.length} packages, ${blogs.length} blogs, ${reviews.length} reviews, ${faqs.length} FAQs!`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
