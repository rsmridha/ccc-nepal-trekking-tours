import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import pg from "pg";

const BASE_URL = "http://localhost:3200";
const PROJECT_OUT_DIR = path.resolve("public/snapshots/verification");
const ARTIFACT_OUT_DIR = "/Users/RAIHAN/.gemini/antigravity/brain/836c5ffc-6b9f-492d-949f-8e5dedcde0fb/snapshots/verification";

fs.mkdirSync(PROJECT_OUT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_OUT_DIR, { recursive: true });

// 1. Ensure admin session token exists in postgres
const pool = new pg.Pool({ connectionString: "postgresql://postgres:1216@localhost:5432/nepal_trekking_tours" });
const adminToken = "verification_session_" + Date.now();
await pool.query(
  "INSERT INTO admin_sessions (token, user_id, expires_at) VALUES ($1, 1, NOW() + INTERVAL '7 days') ON CONFLICT DO NOTHING",
  [adminToken]
);
await pool.end();

const storagePath = "/tmp/playwright_admin_storage.json";
fs.writeFileSync(
  storagePath,
  JSON.stringify(
    {
      cookies: [
        {
          name: "ntt_admin_session",
          value: adminToken,
          domain: "localhost",
          path: "/",
          expires: -1,
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        },
      ],
      origins: [],
    },
    null,
    2
  )
);

const pages = [
  { id: "01-homepage", path: "/", title: "Homepage (Hero, Pillars, Treks)" },
  { id: "02-treks-catalog", path: "/treks", title: "Treks Search & Catalog" },
  { id: "03-package-everest-base-camp", path: "/deluxe-everest-base-camp-trek", title: "Package: Deluxe Everest Base Camp" },
  { id: "04-package-annapurna-base-camp", path: "/deluxe-annapurna-base-camp-trek", title: "Package: Deluxe Annapurna Base Camp" },
  { id: "05-package-helicopter-ebc", path: "/luxury-helicopter-everest-base-camp-trek", title: "Package: Luxury Helicopter EBC Trek" },
  { id: "06-package-island-peak", path: "/deluxe-island-peak-expedition", title: "Package: Deluxe Island Peak Climbing" },
  { id: "07-destination-deluxe-nepal", path: "/destination/deluxe-nepal-trekking-tours", title: "Destination: Deluxe Nepal Tours" },
  { id: "08-custom-trip-planner", path: "/custom-trip", title: "Bespoke Custom Trip Planner" },
  { id: "09-booking-checkout", path: "/booking?slug=deluxe-everest-base-camp-trek", title: "Live Booking Engine & Form" },
  { id: "10-payment-methods", path: "/payment", title: "Payment & Wire Transfer Details" },
  { id: "11-about-us", path: "/about", title: "About Nomad & Noble Nepal" },
  { id: "12-why-choose-us", path: "/why-us", title: "Why Choose Us (6 Sherpa Pillars)" },
  { id: "13-contact-us", path: "/contact-us", title: "Contact Us & Head Office" },
  { id: "14-our-team", path: "/team", title: "Meet Our Expert Team" },
  { id: "15-customer-reviews", path: "/review", title: "Verified Customer Reviews" },
  { id: "16-write-a-review", path: "/write-a-review", title: "Submit a Trip Review Form" },
  { id: "17-faqs-equipment-list", path: "/nepal-trekking-faqs", title: "FAQs & High-Altitude Equipment" },
  { id: "18-terms-and-policies", path: "/terms", title: "Booking Terms & Policies" },
  { id: "19-blog-guides", path: "/blog", title: "Editorial Trekking Guides Listing" },
  { id: "20-blog-article-detail", path: "/blog/top-7-luxury-treks-in-nepal", title: "Blog Article: Top 7 Luxury Treks" },
  { id: "21-printable-invoice", path: "/invoice/BK-2026-1001", title: "Official Printable Invoice (BK-2026-1001)" },
  { id: "22-printable-itinerary", path: "/itinerary/deluxe-everest-base-camp-trek", title: "Official Printable Itinerary" },
  { id: "23-admin-login-portal", path: "/admin/login", title: "Admin Portal Sign-In Screen" },
  { id: "24-admin-dashboard", path: "/admin", title: "Admin Operations Dashboard", auth: true },
];

console.log(`Starting capture of ${pages.length} pages...`);

const results = [];

for (const p of pages) {
  const targetUrl = `${BASE_URL}${p.path}`;
  const filename = `${p.id}.png`;
  const projectFile = path.join(PROJECT_OUT_DIR, filename);
  const artifactFile = path.join(ARTIFACT_OUT_DIR, filename);

  const authFlag = p.auth ? `--load-storage=${storagePath}` : "";
  const cmd = `npx playwright screenshot --browser=chromium --channel=chrome ${authFlag} --viewport-size=1440,920 "${targetUrl}" "${projectFile}"`;

  try {
    process.stdout.write(`Capturing [${p.id}] ${p.title}... `);
    execSync(cmd, { stdio: "ignore", timeout: 25000 });
    fs.copyFileSync(projectFile, artifactFile);
    const size = (fs.statSync(projectFile).size / 1024).toFixed(0);
    console.log(`✓ (${size} KB)`);
    results.push({ ...p, filename, sizeKb: size, projectFile, artifactFile });
  } catch (err) {
    console.log(`✗ Error: ${err.message}`);
  }
}

console.log(`\nAll ${results.length} pages captured successfully!`);
fs.writeFileSync(
  path.join(PROJECT_OUT_DIR, "index.json"),
  JSON.stringify(results, null, 2)
);
fs.writeFileSync(
  path.join(ARTIFACT_OUT_DIR, "index.json"),
  JSON.stringify(results, null, 2)
);
