import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Collect all unique image URLs across src/, scripts/, and db.json
const dbRaw = fs.readFileSync("src/data/db.json", "utf8");
const urlSet = new Set();

function extractUrls(str) {
  if (!str || typeof str !== "string") return;
  const httpRegex = /https?:\/\/[^\s"'\'')<>\\]+/g;
  let m;
  while ((m = httpRegex.exec(str)) !== null) {
    const u = m[0];
    if (
      u.includes("unsplash.com") ||
      u.includes("webapp.nepaltrekkingtours.com/images/") ||
      u.includes("webapp.nepaltrekkingtours.com/storage/") ||
      u.includes("webapp.nepaltrekkingtours.com/public/upload/") ||
      /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(u)
    ) {
      urlSet.add(u);
    }
  }
  const relRegex = /\/public\/upload\/editor\/images\/[^\s"'\'')<>\\]+/g;
  while ((m = relRegex.exec(str)) !== null) {
    urlSet.add(m[0]);
  }
}

extractUrls(dbRaw);

function walkScan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkScan(full);
    else if (/\.(ts|tsx|mjs)$/.test(e.name)) {
      extractUrls(fs.readFileSync(full, "utf8"));
    }
  }
}
walkScan("src");
walkScan("scripts");

console.log(`Found ${urlSet.size} image references to localize.`);

// Map each URL to a clean local path under /images/...
const urlMap = new Map();

for (const origUrl of urlSet) {
  let localAppPath = "";
  let fetchCandidates = [];

  if (origUrl.startsWith("https://webapp.nepaltrekkingtours.com/images/upload/")) {
    const rel = origUrl.replace("https://webapp.nepaltrekkingtours.com", "");
    localAppPath = decodeURIComponent(rel).replace(/\s+/g, "-");
    fetchCandidates = [origUrl];
  } else if (origUrl.startsWith("/public/upload/editor/images/")) {
    const filename = decodeURIComponent(
      origUrl.replace("/public/upload/editor/images/", "")
    ).replace(/[^a-zA-Z0-9._-]/g, "-");
    localAppPath = `/images/editor/${filename}`;
    fetchCandidates = [
      `https://webapp.nepaltrekkingtours.com${origUrl}`,
      `https://webapp.nepaltrekkingtours.com${origUrl.replace("/public/upload/", "/images/upload/")}`,
    ];
  } else if (origUrl.includes("images.unsplash.com/")) {
    const uObj = new URL(origUrl);
    const baseName = uObj.pathname.replace(/^\//, "").replace(/[^a-zA-Z0-9._-]/g, "-");
    const wParam = uObj.searchParams.get("w") || "1200";
    localAppPath = `/images/unsplash/${baseName}-${wParam}.jpg`;
    fetchCandidates = [origUrl];
  } else if (origUrl.includes("pasang.png")) {
    localAppPath = `/images/team/expert-representative.png`;
    fetchCandidates = [
      origUrl,
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    ];
  } else {
    const parsed = new URL(origUrl);
    const cleanName = parsed.pathname.split("/").pop() || "image.jpg";
    localAppPath = `/images/misc/${cleanName.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    fetchCandidates = [origUrl];
  }

  urlMap.set(origUrl, { localAppPath, fetchCandidates });
}

async function downloadBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("image") && !ct.includes("octet-stream")) return null;
    const ab = await res.arrayBuffer();
    if (ab.byteLength < 200) return null;
    return Buffer.from(ab);
  } catch {
    return null;
  }
}

async function run() {
  let fallbackBuffer = null;

  // Download all images with concurrency = 8
  const entries = [...urlMap.entries()];
  let downloaded = 0;
  let usedFallback = 0;

  for (let i = 0; i < entries.length; i += 8) {
    const batch = entries.slice(i, i + 8);
    await Promise.all(
      batch.map(async ([origUrl, info]) => {
        const diskPath = path.join(PUBLIC_DIR, info.localAppPath);
        fs.mkdirSync(path.dirname(diskPath), { recursive: true });

        if (fs.existsSync(diskPath) && fs.statSync(diskPath).size > 200) {
          downloaded++;
          if (!fallbackBuffer && diskPath.endsWith(".jpg")) {
            fallbackBuffer = fs.readFileSync(diskPath);
          }
          return;
        }

        let buf = null;
        for (const candidate of info.fetchCandidates) {
          buf = await downloadBuffer(candidate);
          if (buf) break;
        }

        if (buf) {
          fs.writeFileSync(diskPath, buf);
          downloaded++;
          if (!fallbackBuffer && diskPath.endsWith(".jpg")) {
            fallbackBuffer = buf;
          }
        } else {
          // Use local fallback buffer if remote file is missing
          if (!fallbackBuffer) {
            fallbackBuffer = await downloadBuffer(
              "https://webapp.nepaltrekkingtours.com/images/upload/package/deluxe-everest-base-camp-trek.jpg"
            );
          }
          if (fallbackBuffer) {
            fs.writeFileSync(diskPath, fallbackBuffer);
            usedFallback++;
          }
        }
      })
    );
  }

  console.log(
    `Downloaded ${downloaded} images directly to public/images/ (${usedFallback} used local fallback).`
  );

  // Replace all original URLs with localAppPath across strings
  // Sort by longest original URL first so substrings don't collide
  const sortedReplacements = [...urlMap.entries()].sort(
    (a, b) => b[0].length - a[0].length
  );

  function replaceAllUrls(text) {
    if (!text || typeof text !== "string") return text;
    let out = text;
    for (const [origUrl, info] of sortedReplacements) {
      out = out.split(origUrl).join(info.localAppPath);
    }
    return out;
  }

  // Update src/ and scripts/ (excluding localize-images.mjs)
  function walkReplace(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walkReplace(full);
      else if (
        /\.(ts|tsx|mjs|json)$/.test(e.name) &&
        e.name !== "localize-images.mjs"
      ) {
        const orig = fs.readFileSync(full, "utf8");
        const updated = replaceAllUrls(orig);
        if (updated !== orig) {
          fs.writeFileSync(full, updated, "utf8");
          console.log("Updated image paths in:", full);
        }
      }
    }
  }

  walkReplace("src");
  walkReplace("scripts");

  // Update PostgreSQL database tables
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:1216@localhost:5432/nepal_trekking_tours",
  });

  // 1. destinations
  const destRes = await pool.query("SELECT id, image FROM destinations");
  for (const row of destRes.rows) {
    await pool.query("UPDATE destinations SET image = $1 WHERE id = $2", [
      replaceAllUrls(row.image),
      row.id,
    ]);
  }

  // 2. activities
  const actRes = await pool.query("SELECT id, image FROM activities");
  for (const row of actRes.rows) {
    await pool.query("UPDATE activities SET image = $1 WHERE id = $2", [
      replaceAllUrls(row.image),
      row.id,
    ]);
  }

  // 3. packages
  const pkgRes = await pool.query(
    "SELECT id, hero_image, gallery, overview_html, highlights_html, includes_html, excludes_html, notes_html FROM packages"
  );
  for (const row of pkgRes.rows) {
    const updatedGallery = (row.gallery || []).map((g) => replaceAllUrls(g));
    await pool.query(
      `UPDATE packages
       SET hero_image = $1,
           gallery = $2,
           overview_html = $3,
           highlights_html = $4,
           includes_html = $5,
           excludes_html = $6,
           notes_html = $7
       WHERE id = $8`,
      [
        replaceAllUrls(row.hero_image),
        JSON.stringify(updatedGallery),
        replaceAllUrls(row.overview_html),
        replaceAllUrls(row.highlights_html),
        replaceAllUrls(row.includes_html),
        replaceAllUrls(row.excludes_html),
        replaceAllUrls(row.notes_html),
        row.id,
      ]
    );
  }

  // 4. blogs
  const blogRes = await pool.query("SELECT id, image, content_html FROM blogs");
  for (const row of blogRes.rows) {
    await pool.query(
      "UPDATE blogs SET image = $1, content_html = $2 WHERE id = $3",
      [replaceAllUrls(row.image), replaceAllUrls(row.content_html), row.id]
    );
  }

  // 5. team_members
  const teamRes = await pool.query("SELECT id, image FROM team_members");
  for (const row of teamRes.rows) {
    await pool.query("UPDATE team_members SET image = $1 WHERE id = $2", [
      replaceAllUrls(row.image),
      row.id,
    ]);
  }

  await pool.end();
  console.log("PostgreSQL database image paths updated to local /images/... paths!");
}

run().catch(console.error);
