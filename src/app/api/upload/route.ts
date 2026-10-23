import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to upload image to application path", details: String(err) },
      { status: 500 }
    );
  }
}
