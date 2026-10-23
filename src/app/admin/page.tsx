import React from "react";
import { redirect } from "next/navigation";
import { getDbAsync } from "@/lib/db";
import { getCurrentAdmin, getAllAdminUsers } from "@/lib/auth";
import { getAllEmailLogs } from "@/lib/mailer";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    redirect("/admin/login");
  }

  const [db, adminUsers, emailLogs] = await Promise.all([
    getDbAsync(),
    getAllAdminUsers(),
    getAllEmailLogs(),
  ]);

  return (
    <AdminDashboardClient
      initialDb={db}
      currentAdmin={currentAdmin}
      initialAdminUsers={adminUsers}
      initialEmails={emailLogs}
    />
  );
}
