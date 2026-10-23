"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mountain,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nepaltrekkingtours.com");
  const [password, setPassword] = useState("Admin@1216");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error while signing in.");
      setLoading(false);
    }
  };

  const quickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071829] via-[#0b243b] to-[#114463] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Banner */}
        <div className="bg-[#0b243b] text-white p-7 text-center relative">
          <Link
            href="/"
            className="absolute top-5 left-5 inline-flex items-center gap-1 text-xs font-bold text-sky-200 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Public Site
          </Link>

          <div className="w-12 h-12 rounded-2xl bg-[#006ebf] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Mountain className="w-7 h-7 text-white" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block">
            webapp.nepaltrekkingtours.com
          </span>
          <h1 className="text-xl font-black mt-1">WebApp CMS Portal Login</h1>
          <p className="text-xs text-slate-300 mt-1">
            Role-based access for Super Admins, Tour Managers & Support Desk
          </p>
        </div>

        {/* Form Body */}
        <div className="p-7 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nepaltrekkingtours.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#006ebf]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#006ebf]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? "Signing In..." : "Sign In to WebApp CMS"}
            </button>
          </form>

          {/* 1-Click Role Demo Selector */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              <KeyRound className="w-3.5 h-3.5 text-[#006ebf]" />
              <span>Quick-Fill Role Accounts (PostgreSQL Seeded)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickFill("admin@nepaltrekkingtours.com", "Admin@1216")}
                className="p-2 rounded-xl border border-slate-200 hover:border-[#006ebf] hover:bg-sky-50/50 text-left transition-colors"
              >
                <span className="block text-[11px] font-extrabold text-[#0b243b]">
                  Super Admin
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Full + Staff RBAC
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickFill("manager@nepaltrekkingtours.com", "Manager@1216")}
                className="p-2 rounded-xl border border-slate-200 hover:border-[#006ebf] hover:bg-sky-50/50 text-left transition-colors"
              >
                <span className="block text-[11px] font-extrabold text-[#0b243b]">
                  Tour Manager
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Packages & Blogs
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickFill("support@nepaltrekkingtours.com", "Support@1216")}
                className="p-2 rounded-xl border border-slate-200 hover:border-[#006ebf] hover:bg-sky-50/50 text-left transition-colors"
              >
                <span className="block text-[11px] font-extrabold text-[#0b243b]">
                  Support Desk
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Bookings & CRM
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
