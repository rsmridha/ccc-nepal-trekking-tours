import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function listLocalImages(dir: string, baseRel = "/images"): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = `${baseRel}/${entry.name}`;
    if (entry.isDirectory()) {
      results.push(...listLocalImages(fullPath, relPath));
    } else if (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(entry.name)) {
      results.push(relPath);
    }
  }
  return results;
}

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const images = listLocalImages(imagesDir, "/images");
    return NextResponse.json({ images });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to list application images", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "custom";

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const fileName = `${baseName || "image"}-${Date.now()}${ext}`;
    const relDir = `/images/upload/${safeFolder}`;
    const absDir = path.join(process.cwd(), "public", relDir);

    fs.mkdirSync(absDir, { recursive: true });
    const absPath = path.join(absDir, fileName);
    fs.writeFileSync(absPath, buffer);

    const localAppPath = `${relDir}/${fileName}`;
    return NextResponse.json({
      success: true,
      path: localAppPath,
      url: localAppPath,
      fileName,
      size: buffer.byteLength,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to upload image to application path", details: String(err) },
      { status: 500 }
    );
  }
}
