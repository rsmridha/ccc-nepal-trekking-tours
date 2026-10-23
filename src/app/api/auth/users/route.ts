import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import {
  getCurrentAdmin,
  getAllAdminUsers,
  hashPassword,
  ensureAuthTables,
} from "@/lib/auth";

export async function GET() {
  const current = await getCurrentAdmin();
  if (!current) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await getAllAdminUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const current = await getCurrentAdmin();
  if (!current || current.role !== "Super Admin") {
    return NextResponse.json(
      { error: "Only Super Admins can create staff accounts." },
      { status: 403 }
    );
  }

  try {
    await ensureAuthTables();
    const body = await req.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const res = await pool.query(
      `INSERT INTO admin_users (name, email, password_hash, role, active)
       VALUES ($1, LOWER($2), $3, $4, TRUE)
       RETURNING id, name, email, role, active, last_login, created_at`,
      [
        body.name.trim(),
        body.email.trim(),
        hashPassword(body.password),
        body.role || "Tour Manager",
      ]
    );

    const row = res.rows[0];
    return NextResponse.json(
      {
        success: true,
        user: {
          id: Number(row.id),
          name: row.name,
          email: row.email,
          role: row.role,
          active: Boolean(row.active),
          lastLogin: row.last_login,
          createdAt: new Date(row.created_at).toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Could not create user (email may already exist)", details: String(err) },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const current = await getCurrentAdmin();
  if (!current || current.role !== "Super Admin") {
    return NextResponse.json(
      { error: "Only Super Admins can modify staff roles or status." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const res = await pool.query(
      `UPDATE admin_users
       SET role = COALESCE($2, role),
           active = COALESCE($3, active)
       WHERE id = $1
       RETURNING id, name, email, role, active, last_login, created_at`,
      [Number(body.id), body.role ?? null, body.active ?? null]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const row = res.rows[0];
    return NextResponse.json({
      success: true,
      user: {
        id: Number(row.id),
        name: row.name,
        email: row.email,
        role: row.role,
        active: Boolean(row.active),
        lastLogin: row.last_login ? new Date(row.last_login).toISOString() : null,
        createdAt: new Date(row.created_at).toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const current = await getCurrentAdmin();
  if (!current || current.role !== "Super Admin") {
    return NextResponse.json(
      { error: "Only Super Admins can delete staff accounts." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id || id === current.id) {
    return NextResponse.json(
      { error: "Cannot delete your own active Super Admin account." },
      { status: 400 }
    );
  }

  await pool.query("DELETE FROM admin_users WHERE id = $1", [id]);
  return NextResponse.json({ success: true });
}
