import crypto from "crypto";
import { cookies } from "next/headers";
import { pool } from "./db";

export type AdminRole = "Super Admin" | "Tour Manager" | "Support Coordinator";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export const SESSION_COOKIE_NAME = "ntt_admin_session";
const PASSWORD_SALT = "nepal_trekking_tours_salt_2026";

export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, PASSWORD_SALT, 10000, 64, "sha512")
    .toString("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  const candidate = hashPassword(password);
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

let tablesInitialized = false;

export async function ensureAuthTables(): Promise<void> {
  if (tablesInitialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Tour Manager',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      last_login TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      user_id INT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const countRes = await pool.query("SELECT COUNT(*) FROM admin_users");
  if (Number(countRes.rows[0].count) === 0) {
    const defaultUsers: { name: string; email: string; pass: string; role: AdminRole }[] = [
      {
        name: "Expert Representative",
        email: "admin@nepaltrekkingtours.com",
        pass: "Admin@1216",
        role: "Super Admin",
      },
      {
        name: "Tendi Sherpa",
        email: "manager@nepaltrekkingtours.com",
        pass: "Manager@1216",
        role: "Tour Manager",
      },
      {
        name: "Kathmandu Support Desk",
        email: "support@nepaltrekkingtours.com",
        pass: "Support@1216",
        role: "Support Coordinator",
      },
    ];

    for (const u of defaultUsers) {
      await pool.query(
        `INSERT INTO admin_users (name, email, password_hash, role, active)
         VALUES ($1, $2, $3, $4, TRUE)
         ON CONFLICT (email) DO NOTHING`,
        [u.name, u.email.toLowerCase(), hashPassword(u.pass), u.role]
      );
    }
  }

  tablesInitialized = true;
}

export async function createAdminSession(userId: number): Promise<string> {
  await ensureAuthTables();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await pool.query(
    `INSERT INTO admin_sessions (token, user_id, expires_at) VALUES ($1, $2, $3)`,
    [token, userId, expiresAt.toISOString()]
  );

  await pool.query(`UPDATE admin_users SET last_login = NOW() WHERE id = $1`, [
    userId,
  ]);

  return token;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    await ensureAuthTables();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const res = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.active, u.last_login, u.created_at
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > NOW() AND u.active = TRUE
       LIMIT 1`,
      [token]
    );

    const row = res.rows[0];
    if (!row) return null;

    return {
      id: Number(row.id),
      name: String(row.name),
      email: String(row.email),
      role: row.role as AdminRole,
      active: Boolean(row.active),
      lastLogin: row.last_login ? new Date(row.last_login).toISOString() : null,
      createdAt: new Date(row.created_at).toISOString(),
    };
  } catch (err) {
    console.error("getCurrentAdmin error:", err);
    return null;
  }
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  await ensureAuthTables();
  const res = await pool.query(
    `SELECT id, name, email, role, active, last_login, created_at
     FROM admin_users
     ORDER BY id ASC`
  );
  return res.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    role: row.role as AdminRole,
    active: Boolean(row.active),
    lastLogin: row.last_login ? new Date(row.last_login).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}
