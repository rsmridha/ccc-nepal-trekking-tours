import fs from "fs";
import path from "path";
import { Pool } from "pg";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation: string;
  meal: string;
  transportation: string;
  altitude: string;
  walking: string;
  distance: string;
}

export interface Departure {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  price: number;
  spotsLeft: number;
}

export interface GroupDiscount {
  minPax: number;
  maxPax: number;
  label: string;
  deluxePrice: number;
  luxuryPrice: number;
}

export interface PackageFAQ {
  id: number;
  question: string;
  answer: string;
}

export interface PackageReview {
  id: number;
  author: string;
  country: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface TrekPackage {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  region: string;
  destinationSlug: string;
  duration: number;
  price: number;
  regularPrice: number;
  luxuryPrice: number;
  luxuryRegularPrice: number;
  difficulty: string;
  maxAltitude: string;
  bestSeason: string;
  accommodationType: string;
  mealsIncluded: string;
  groupSize: string;
  featured: boolean;
  tabCategory: string;
  heroImage: string;
  gallery: string[];
  overviewHtml: string;
  overviewText: string;
  highlightsHtml: string;
  includesHtml: string;
  excludesHtml: string;
  notesHtml: string;
  groupDiscounts: GroupDiscount[];
  itineraries: ItineraryDay[];
  departures: Departure[];
  faqs: PackageFAQ[];
  reviews: PackageReview[];
  rating: number;
  reviewCount: number;
}

export interface Destination {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  region: string;
  tripCount: number;
}

export interface Activity {
  id: number;
  title: string;
  slug: string;
  tripCount: number;
  image: string;
  description: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
  contentHtml: string;
}

export interface GlobalReview {
  id: number;
  author: string;
  country: string;
  title: string;
  rating: number;
  comment: string;
  tripName: string;
  platform: string;
  date: string;
  status: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  experience: string;
  bio: string;
  image: string;
  certifications: string[];
}

export interface BookingRecord {
  id: string;
  packageSlug: string;
  packageTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  country: string;
  departureDate: string;
  travelers: number;
  tier: string;
  totalPrice: number;
  depositPaid: number;
  paymentStatus: string;
  bookingStatus: string;
  specialRequests: string;
  createdAt: string;
}

export interface CustomTripRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  destination: string;
  startDate: string;
  durationDays: number;
  travelers: number;
  accommodationLevel: string;
  budgetRange: string;
  comments: string;
  status: string;
  createdAt: string;
}

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  packageSlug?: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  slogan: string;
  establishedYear: number;
  yearsExperience: string;
  happyTravelers: string;
  countriesCovered: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  expertName: string;
  expertRole: string;
  tripAdvisorReviews: number;
  googleReviews: number;
  facebookReviews: number;
}

export interface DatabaseSchema {
  settings: SiteSettings;
  destinations: Destination[];
  activities: Activity[];
  packages: TrekPackage[];
  blogs: BlogPost[];
  reviews: GlobalReview[];
  faqs: FAQItem[];
  team: TeamMember[];
  bookings: BookingRecord[];
  customTrips: CustomTripRequest[];
  inquiries: InquiryRecord[];
  newsletterSubscribers: { id: number; name: string; email: string; subscribedAt: string }[];
}

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:1216@localhost:5432/nepal_trekking_tours",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

function mapPackageRow(row: Record<string, unknown>): TrekPackage {
  return {
    id: Number(row.id),
    title: String(row.title),
    slug: String(row.slug),
    subtitle: String(row.subtitle),
    category: String(row.category),
    region: String(row.region),
    destinationSlug: String(row.destination_slug),
    duration: Number(row.duration),
    price: Number(row.price),
    regularPrice: Number(row.regular_price),
    luxuryPrice: Number(row.luxury_price),
    luxuryRegularPrice: Number(row.luxury_regular_price),
    difficulty: String(row.difficulty),
    maxAltitude: String(row.max_altitude),
    bestSeason: String(row.best_season),
    accommodationType: String(row.accommodation_type),
    mealsIncluded: String(row.meals_included),
    groupSize: String(row.group_size),
    featured: Boolean(row.featured),
    tabCategory: String(row.tab_category),
    heroImage: String(row.hero_image),
    gallery: (row.gallery as string[]) || [],
    overviewHtml: String(row.overview_html || ""),
    overviewText: String(row.overview_text || ""),
    highlightsHtml: String(row.highlights_html || ""),
    includesHtml: String(row.includes_html || ""),
    excludesHtml: String(row.excludes_html || ""),
    notesHtml: String(row.notes_html || ""),
    groupDiscounts: (row.group_discounts as GroupDiscount[]) || [],
    itineraries: (row.itineraries as ItineraryDay[]) || [],
    departures: (row.departures as Departure[]) || [],
    faqs: (row.faqs as PackageFAQ[]) || [],
    reviews: (row.reviews as PackageReview[]) || [],
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || 10),
  };
}

export async function getDbAsync(): Promise<DatabaseSchema> {
  try {
    const [
      settingsRes,
      destRes,
      actRes,
      pkgRes,
      blogRes,
      revRes,
      faqRes,
      teamRes,
      bookRes,
      ctRes,
      inqRes,
      subRes,
    ] = await Promise.all([
      pool.query("SELECT data FROM site_settings WHERE id = 1"),
      pool.query("SELECT * FROM destinations ORDER BY id ASC"),
      pool.query("SELECT * FROM activities ORDER BY id ASC"),
      pool.query("SELECT * FROM packages ORDER BY id ASC"),
      pool.query("SELECT * FROM blogs ORDER BY id DESC"),
      pool.query("SELECT * FROM reviews ORDER BY id DESC"),
      pool.query("SELECT * FROM faqs ORDER BY sort_order ASC, id ASC"),
      pool.query("SELECT * FROM team_members ORDER BY id ASC"),
      pool.query("SELECT * FROM bookings ORDER BY created_at DESC"),
      pool.query("SELECT * FROM custom_trips ORDER BY created_at DESC"),
      pool.query("SELECT * FROM inquiries ORDER BY created_at DESC"),
      pool.query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC"),
    ]);

    return {
      settings: (settingsRes.rows[0]?.data as SiteSettings) || getDb().settings,
      destinations: destRes.rows.map((r) => ({
        id: Number(r.id),
        title: String(r.title),
        slug: String(r.slug),
        subtitle: String(r.subtitle),
        image: String(r.image),
        region: String(r.region),
        tripCount: Number(r.trip_count),
      })),
      activities: actRes.rows.map((r) => ({
        id: Number(r.id),
        title: String(r.title),
        slug: String(r.slug),
        tripCount: Number(r.trip_count),
        image: String(r.image),
        description: String(r.description),
      })),
      packages: pkgRes.rows.map(mapPackageRow),
      blogs: blogRes.rows.map((r) => ({
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
      })),
      reviews: revRes.rows.map((r) => ({
        id: Number(r.id),
        author: String(r.author),
        country: String(r.country),
        title: String(r.title),
        rating: Number(r.rating),
        comment: String(r.comment),
        tripName: String(r.trip_name),
        platform: String(r.platform),
        date: String(r.date),
        status: String(r.status),
      })),
      faqs: faqRes.rows.map((r) => ({
        id: Number(r.id),
        question: String(r.question),
        answer: String(r.answer),
        category: String(r.category),
        sortOrder: Number(r.sort_order),
      })),
      team: teamRes.rows.map((r) => ({
        id: Number(r.id),
        name: String(r.name),
        role: String(r.role),
        experience: String(r.experience),
        bio: String(r.bio),
        image: String(r.image),
        certifications: (r.certifications as string[]) || [],
      })),
      bookings: bookRes.rows.map((r) => ({
        id: String(r.id),
        packageSlug: String(r.package_slug),
        packageTitle: String(r.package_title),
        customerName: String(r.customer_name),
        customerEmail: String(r.customer_email),
        customerPhone: String(r.customer_phone),
        country: String(r.country),
        departureDate: String(r.departure_date),
        travelers: Number(r.travelers),
        tier: String(r.tier),
        totalPrice: Number(r.total_price),
        depositPaid: Number(r.deposit_paid),
        paymentStatus: String(r.payment_status),
        bookingStatus: String(r.booking_status),
        specialRequests: String(r.special_requests || ""),
        createdAt: new Date(r.created_at).toISOString(),
      })),
      customTrips: ctRes.rows.map((r) => ({
        id: String(r.id),
        fullName: String(r.full_name),
        email: String(r.email),
        phone: String(r.phone),
        country: String(r.country),
        destination: String(r.destination),
        startDate: String(r.start_date),
        durationDays: Number(r.duration_days),
        travelers: Number(r.travelers),
        accommodationLevel: String(r.accommodation_level),
        budgetRange: String(r.budget_range),
        comments: String(r.comments),
        status: String(r.status),
        createdAt: new Date(r.created_at).toISOString(),
      })),
      inquiries: inqRes.rows.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        phone: String(r.phone),
        subject: String(r.subject),
        packageSlug: String(r.package_slug || ""),
        message: String(r.message),
        status: String(r.status),
        createdAt: new Date(r.created_at).toISOString(),
      })),
      newsletterSubscribers: subRes.rows.map((r) => ({
        id: Number(r.id),
        name: String(r.name),
        email: String(r.email),
        subscribedAt: new Date(r.subscribed_at).toISOString(),
      })),
    };
  } catch (err) {
    console.error("PostgreSQL fallback to JSON snapshot:", err);
    return getDb();
  }
}

export async function getPackageBySlugAsync(slug: string): Promise<TrekPackage | undefined> {
  try {
    const res = await pool.query("SELECT * FROM packages WHERE slug = $1 LIMIT 1", [slug]);
    if (res.rows[0]) return mapPackageRow(res.rows[0]);
    return undefined;
  } catch {
    return getPackageBySlug(slug);
  }
}

export async function getBlogBySlugAsync(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await pool.query("SELECT * FROM blogs WHERE slug = $1 LIMIT 1", [slug]);
    const r = res.rows[0];
    if (!r) return undefined;
    return {
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
    };
  } catch {
    return getBlogBySlug(slug);
  }
}

export async function getDestinationBySlugAsync(slug: string): Promise<Destination | undefined> {
  try {
    const res = await pool.query("SELECT * FROM destinations WHERE slug = $1 LIMIT 1", [slug]);
    const r = res.rows[0];
    if (!r) return undefined;
    return {
      id: Number(r.id),
      title: String(r.title),
      slug: String(r.slug),
      subtitle: String(r.subtitle),
      image: String(r.image),
      region: String(r.region),
      tripCount: Number(r.trip_count),
    };
  } catch {
    return getDestinationBySlug(slug);
  }
}

// Synchronous snapshot helpers (kept synced with PostgreSQL)
export function getDb(): DatabaseSchema {
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw) as DatabaseSchema;
}

export function saveDb(data: DatabaseSchema): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function getPackageBySlug(slug: string): TrekPackage | undefined {
  const db = getDb();
  return db.packages.find((p) => p.slug === slug);
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const db = getDb();
  return db.blogs.find((b) => b.slug === slug);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  const db = getDb();
  return db.destinations.find((d) => d.slug === slug);
}

export function getActivityBySlug(slug: string): Activity | undefined {
  const db = getDb();
  return db.activities.find((a) => a.slug === slug);
}
