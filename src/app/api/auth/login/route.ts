import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import {
  ensureAuthTables,
  verifyPassword,
  createAdminSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await ensureAuthTables();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const res = await pool.query(
      `SELECT id, name, email, password_hash, role, active
       FROM admin_users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email.trim()]
    );

    const user = res.rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { error: "This staff account has been deactivated. Contact a Super Admin." },
        { status: 403 }
      );
    }

    const token = await createAdminSession(Number(user.id));

    const response = NextResponse.json({
      success: true,
      user: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Authentication error", details: String(err) },
      { status: 500 }
    );
  }
}
