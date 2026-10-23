"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Sparkles,
  MessageSquare,
  FileText,
  Star,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Mountain,
  DollarSign,
  ShieldCheck,
  Users,
  LogOut,
  X,
  Search,
  UserPlus,
  Printer,
  Mail,
  MapPin,
  HelpCircle,
  Send,
  Eye,
} from "lucide-react";
import {
  DatabaseSchema,
  TrekPackage,
  BookingRecord,
  CustomTripRequest,
  InquiryRecord,
  BlogPost,
  Destination,
  FAQItem,
} from "@/lib/db";
import type { AdminUser, AdminRole } from "@/lib/auth";
import type { EmailLogRecord } from "@/lib/mailer";

export default function AdminDashboardClient({
  initialDb,
  currentAdmin,
  initialAdminUsers,
  initialEmails = [],
}: {
  initialDb: DatabaseSchema;
  currentAdmin: AdminUser;
  initialAdminUsers: AdminUser[];
  initialEmails?: EmailLogRecord[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "packages"
    | "bookings"
    | "custom-trips"
    | "inquiries"
    | "blogs"
    | "destinations"
    | "emails"
    | "reviews"
    | "staff"
  >("overview");

  const [packages, setPackages] = useState<TrekPackage[]>(initialDb.packages);
  const [bookings, setBookings] = useState<BookingRecord[]>(initialDb.bookings);
  const [customTrips, setCustomTrips] = useState<CustomTripRequest[]>(
    initialDb.customTrips
  );
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(
    initialDb.inquiries
  );
  const [blogs, setBlogs] = useState<BlogPost[]>(initialDb.blogs);
  const [destinations, setDestinations] = useState<Destination[]>(
    initialDb.destinations
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(initialDb.faqs);
  const [emails, setEmails] = useState<EmailLogRecord[]>(initialEmails);
  const [reviews] = useState(initialDb.reviews);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);

  const [pkgSearch, setPkgSearch] = useState("");
  const [showNewPkgModal, setShowNewPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<TrekPackage | null>(null);

  // Blog Modals
  const [showNewBlogModal, setShowNewBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Destination & FAQ Modals
  const [showNewDestModal, setShowNewDestModal] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [showNewFaqModal, setShowNewFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Email Modals
  const [previewEmail, setPreviewEmail] = useState<EmailLogRecord | null>(null);
  const [showComposeEmailModal, setShowComposeEmailModal] = useState(false);

  // Staff Modal
  const [showNewStaffModal, setShowNewStaffModal] = useState(false);

  // Role Permission Flags
  const isSuperAdmin = currentAdmin.role === "Super Admin";
  const canEditCatalog =
    currentAdmin.role === "Super Admin" || currentAdmin.role === "Tour Manager";
  const canManageBookings =
    currentAdmin.role === "Super Admin" ||
    currentAdmin.role === "Support Coordinator" ||
    currentAdmin.role === "Tour Manager";

  // New Package Form State
  const [newTitle, setNewTitle] = useState("");
  const [newRegion, setNewRegion] = useState("Everest");
  const [newCategory, setNewCategory] = useState("deluxe-trekking");
  const [newDuration, setNewDuration] = useState(14);
  const [newPrice, setNewPrice] = useState(1899);
  const [newLuxuryPrice, setNewLuxuryPrice] = useState(2699);
  const [newHeroImage, setNewHeroImage] = useState(
    "/images/unsplash/photo-1544735716-392fe2489ffa-1200.jpg"
  );
  const [newOverview, setNewOverview] = useState("");

  // New Blog Form State
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("Travel Guide");
  const [blogReadTime, setBlogReadTime] = useState("7 min read");
  const [blogImage, setBlogImage] = useState(
    "/images/unsplash/photo-1544735716-392fe2489ffa-1080.jpg"
  );
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");

  // New Destination Form State
  const [destTitle, setDestTitle] = useState("");
  const [destRegion, setDestRegion] = useState("");
  const [destSubtitle, setDestSubtitle] = useState("");
  const [destTripCount, setDestTripCount] = useState(8);
  const [destImage, setDestImage] = useState(
    "/images/unsplash/photo-1544735716-392fe2489ffa-1080.jpg"
  );

  // New FAQ Form State
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState("General Trekking");
  const [faqSortOrder, setFaqSortOrder] = useState(10);

  // Compose Email Form State
  const [composeRecipientName, setComposeRecipientName] = useState("");
  const [composeRecipientEmail, setComposeRecipientEmail] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeReferenceId, setComposeReferenceId] = useState("");
  const [composeMessage, setComposeMessage] = useState("");

  // New Staff Form State
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffRole, setStaffRole] = useState<AdminRole>("Tour Manager");
  const [staffError, setStaffError] = useState("");

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
  const totalDeposits = bookings.reduce((acc, b) => acc + (b.depositPaid || 0), 0);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleUploadImageFile = async (
    file: File | undefined,
    folder: string,
    onDone: (appPath: string) => void
  ) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.path) {
      onDone(data.path);
    }
  };

  const refreshEmails = async () => {
    const res = await fetch("/api/emails");
    const data = await res.json();
    if (data.emails) setEmails(data.emails);
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditCatalog) return;
    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        region: newRegion,
        category: newCategory,
        duration: newDuration,
        price: newPrice,
        luxuryPrice: newLuxuryPrice,
        heroImage: newHeroImage,
        overviewText: newOverview,
        featured: true,
      }),
    });
    const data = await res.json();
    if (data.package) {
      setPackages([data.package, ...packages]);
      setShowNewPkgModal(false);
      setNewTitle("");
      setNewOverview("");
    }
  };

  const handleSaveEditPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg || !canEditCatalog) return;
    const res = await fetch("/api/packages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingPkg),
    });
    const data = await res.json();
    if (data.package) {
      setPackages(
        packages.map((p) => (p.slug === data.package.slug ? data.package : p))
      );
      setEditingPkg(null);
    }
  };

  const handleDeletePackage = async (slug: string) => {
    if (!canEditCatalog) return;
    await fetch(`/api/packages?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    setPackages(packages.filter((p) => p.slug !== slug));
  };

  const handleUpdateBookingStatus = async (
    id: string,
    bookingStatus: string,
    paymentStatus?: string
  ) => {
    if (!canManageBookings) return;
    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, bookingStatus, paymentStatus }),
    });
    const data = await res.json();
    if (data.booking) {
      setBookings(bookings.map((b) => (b.id === id ? data.booking : b)));
      await refreshEmails();
    }
  };

  const handleResendBookingEmail = async (b: BookingRecord) => {
    const res = await fetch("/api/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmail: b.customerEmail || "guest@example.com",
        recipientName: b.customerName,
        subject: `Official Booking Voucher & Invoice [${b.id}] — ${b.packageTitle}`,
        category: "Booking Confirmation",
        referenceId: b.id,
        message: `Your reservation ${b.id} for ${b.packageTitle} (${b.travelers} Guests, departing ${b.departureDate}) is ${b.bookingStatus}.\n\nTotal Amount: USD ${b.totalPrice.toLocaleString()}\nPayment Status: ${b.paymentStatus} (USD ${b.depositPaid.toLocaleString()})\n\nOfficial Printable Invoice: http://localhost:3200/invoice/${b.id}\nPrintable Trip Itinerary: http://localhost:3200/itinerary/${b.packageSlug}`,
      }),
    });
    const data = await res.json();
    if (data.email) {
      setEmails([data.email, ...emails]);
      setPreviewEmail(data.email);
    }
  };

  const handleUpdateCustomTripStatus = async (id: string, status: string) => {
    const res = await fetch("/api/custom-trips", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.customTrip) {
      setCustomTrips(
        customTrips.map((c) => (c.id === id ? data.customTrip : c))
      );
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    const res = await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.inquiry) {
      setInquiries(inquiries.map((i) => (i.id === id ? data.inquiry : i)));
    }
  };

  // Blog CRUD Handlers
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditCatalog) return;
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: blogTitle,
        category: blogCategory,
        readTime: blogReadTime,
        image: blogImage,
        author: "Expert Representative",
        excerpt: blogExcerpt,
        contentHtml: blogContent.startsWith("<")
          ? blogContent
          : `<p>${blogContent}</p>`,
      }),
    });
    const data = await res.json();
    if (data.blog) {
      setBlogs([data.blog, ...blogs]);
      setShowNewBlogModal(false);
      setBlogTitle("");
      setBlogExcerpt("");
      setBlogContent("");
    }
  };

  const handleSaveEditBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !canEditCatalog) return;
    const res = await fetch("/api/blogs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBlog),
    });
    const data = await res.json();
    if (data.blog) {
      setBlogs(blogs.map((b) => (b.slug === data.blog.slug ? data.blog : b)));
      setEditingBlog(null);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!canEditCatalog) return;
    await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    setBlogs(blogs.filter((b) => b.slug !== slug));
  };

  // Destination CRUD Handlers
  const handleCreateDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditCatalog) return;
    const res = await fetch("/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: destTitle,
        region: destRegion || destTitle,
        subtitle: destSubtitle,
        tripCount: destTripCount,
        image: destImage,
      }),
    });
    const data = await res.json();
    if (data.destination) {
      setDestinations([...destinations, data.destination]);
      setShowNewDestModal(false);
      setDestTitle("");
      setDestRegion("");
      setDestSubtitle("");
    }
  };

  const handleSaveEditDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest || !canEditCatalog) return;
    const res = await fetch("/api/destinations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingDest),
    });
    const data = await res.json();
    if (data.destination) {
      setDestinations(
        destinations.map((d) =>
          d.slug === data.destination.slug ? data.destination : d
        )
      );
      setEditingDest(null);
    }
  };

  const handleDeleteDest = async (slug: string) => {
    if (!canEditCatalog) return;
    await fetch(`/api/destinations?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    setDestinations(destinations.filter((d) => d.slug !== slug));
  };

  // FAQ CRUD Handlers
  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditCatalog) return;
    const res = await fetch("/api/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory,
        sortOrder: faqSortOrder,
      }),
    });
    const data = await res.json();
    if (data.faq) {
      setFaqs([...faqs, data.faq]);
      setShowNewFaqModal(false);
      setFaqQuestion("");
      setFaqAnswer("");
    }
  };

  const handleSaveEditFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !canEditCatalog) return;
    const res = await fetch("/api/faqs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingFaq),
    });
    const data = await res.json();
    if (data.faq) {
      setFaqs(faqs.map((f) => (f.id === data.faq.id ? data.faq : f)));
      setEditingFaq(null);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!canEditCatalog) return;
    await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  // Compose & Send Manual Email
  const handleSendManualEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientName: composeRecipientName,
        recipientEmail: composeRecipientEmail,
        subject: composeSubject,
        referenceId: composeReferenceId || "MANUAL",
        category: "Manual Dispatch",
        message: composeMessage,
      }),
    });
    const data = await res.json();
    if (data.email) {
      setEmails([data.email, ...emails]);
      setShowComposeEmailModal(false);
      setComposeRecipientName("");
      setComposeRecipientEmail("");
      setComposeSubject("");
      setComposeReferenceId("");
      setComposeMessage("");
    }
  };

  // Staff RBAC Handlers
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError("");
    const res = await fetch("/api/auth/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: staffName,
        email: staffEmail,
        password: staffPassword,
        role: staffRole,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStaffError(data.error || "Failed to create staff user");
      return;
    }
    if (data.user) {
      setAdminUsers([...adminUsers, data.user]);
      setShowNewStaffModal(false);
      setStaffName("");
      setStaffEmail("");
      setStaffPassword("");
    }
  };

  const handleUpdateStaff = async (
    id: number,
    updates: { role?: AdminRole; active?: boolean }
  ) => {
    const res = await fetch("/api/auth/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    const data = await res.json();
    if (data.user) {
      setAdminUsers(adminUsers.map((u) => (u.id === id ? data.user : u)));
    }
  };

  const handleDeleteStaff = async (id: number) => {
    const res = await fetch(`/api/auth/users?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAdminUsers(adminUsers.filter((u) => u.id !== id));
    }
  };

  const filteredPackages = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(pkgSearch.toLowerCase()) ||
      p.region.toLowerCase().includes(pkgSearch.toLowerCase())
  );

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "packages", label: `Trek Packages (${packages.length})`, icon: Compass },
    { id: "bookings", label: `Bookings & Invoices (${bookings.length})`, icon: CalendarCheck },
    { id: "custom-trips", label: `Custom Trips (${customTrips.length})`, icon: Sparkles },
    { id: "inquiries", label: `Inquiries (${inquiries.length})`, icon: MessageSquare },
    { id: "blogs", label: `Blogs & Guides (${blogs.length})`, icon: FileText },
    { id: "destinations", label: `Destinations & FAQs (${destinations.length}/${faqs.length})`, icon: MapPin },
    { id: "emails", label: `Email Outbox (${emails.length})`, icon: Mail },
    { id: "reviews", label: `Client Reviews (${reviews.length})`, icon: Star },
    ...(isSuperAdmin
      ? [{ id: "staff", label: `Staff & Roles (${adminUsers.length})`, icon: Users }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Left Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#0b243b] text-white shrink-0 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006ebf] flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-sm font-black tracking-wide text-white">
                  WEBAPP CMS
                </span>
                <span className="block text-[11px] text-amber-400 font-semibold">
                  CCC Nepal Trekking Tours
                </span>
              </div>
            </Link>
          </div>

          {/* Logged-in Admin Profile Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                {currentAdmin.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-white truncate">
                  {currentAdmin.name}
                </div>
                <div className="text-[11px] text-sky-200 truncate">
                  {currentAdmin.email}
                </div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3" /> {currentAdmin.role}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 hover:text-rose-200"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#006ebf] text-white shadow-md"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 mt-6">
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-center flex items-center justify-center gap-2 text-amber-300"
          >
            <ExternalLink className="w-4 h-4" /> View Public Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#006ebf] block">
              Authenticated as {currentAdmin.name} ({currentAdmin.role})
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0b243b] capitalize">
              {activeTab.replace("-", " ")} Management
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {canEditCatalog && (
              <>
                <button
                  type="button"
                  onClick={() => setShowNewPkgModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> New Package
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBlogModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#006ebf] text-slate-700 text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> New Blog
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewDestModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#006ebf] text-slate-700 text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> New Destination
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowComposeEmailModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Send Email
            </button>
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setShowNewStaffModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4" /> Add Staff
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase">Total Booked Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-[#0b243b]">
                  USD {totalRevenue.toLocaleString()}
                </div>
                <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                  ${totalDeposits.toLocaleString()} deposits collected
                </span>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase">Catalog & Destinations</span>
                  <Compass className="w-5 h-5 text-[#006ebf]" />
                </div>
                <div className="text-2xl font-black text-[#0b243b]">
                  {packages.length} Packages
                </div>
                <span className="text-xs text-slate-500 mt-1 block">
                  {destinations.length} Destinations · {blogs.length} Blogs
                </span>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase">Confirmed Bookings</span>
                  <CalendarCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-[#0b243b]">
                  {bookings.length} Reservations
                </div>
                <span className="text-xs text-slate-500 mt-1 block">
                  {customTrips.length} Tailor-made briefs
                </span>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase">Email Notifications</span>
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-[#0b243b]">
                  {emails.length} Dispatched
                </div>
                <span className="text-xs text-slate-500 mt-1 block">
                  Automated PostgreSQL Outbox
                </span>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-[#0b243b]">
                  Recent Online Bookings & Printable Invoices
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-bold text-[#006ebf] hover:underline"
                >
                  Manage All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                      <th className="py-3 pr-4">Booking ID</th>
                      <th className="py-3 pr-4">Traveler</th>
                      <th className="py-3 pr-4">Package</th>
                      <th className="py-3 pr-4">Departure</th>
                      <th className="py-3 pr-4">Total</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-3.5 pr-4 font-bold text-[#006ebf]">{b.id}</td>
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-slate-800">{b.customerName}</div>
                          <div className="text-xs text-slate-500">{b.country}</div>
                        </td>
                        <td className="py-3.5 pr-4 font-medium text-slate-700">
                          {b.packageTitle}
                        </td>
                        <td className="py-3.5 pr-4 text-slate-600">{b.departureDate}</td>
                        <td className="py-3.5 pr-4 font-extrabold text-slate-900">
                          ${b.totalPrice.toLocaleString()}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/invoice/${b.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-[#006ebf] hover:bg-[#006ebf] hover:text-white text-xs font-bold transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" /> PDF Invoice
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES */}
        {activeTab === "packages" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={pkgSearch}
                  onChange={(e) => setPkgSearch(e.target.value)}
                  placeholder="Search packages by title or region..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredPackages.length} of {packages.length} packages
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 pr-4">Package Title</th>
                    <th className="py-3 pr-4">Region</th>
                    <th className="py-3 pr-4">Duration</th>
                    <th className="py-3 pr-4">Deluxe Price</th>
                    <th className="py-3 pr-4">Luxury VIP Price</th>
                    <th className="py-3 text-right">Actions & Printable PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPackages.map((p) => (
                    <tr key={p.slug} className="hover:bg-slate-50/80">
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-[#0b243b]">{p.title}</div>
                        <div className="text-xs text-slate-400">/{p.slug}</div>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-[#006ebf]">
                        {p.region}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600">{p.duration} Days</td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 pr-4 font-extrabold text-amber-700">
                        ${p.luxuryPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/itinerary/${p.slug}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 text-[#006ebf] hover:bg-[#006ebf] hover:text-white text-xs font-bold transition-colors"
                          title="Printable PDF Itinerary Dossier"
                        >
                          <Printer className="w-3.5 h-3.5" /> PDF Itinerary
                        </Link>
                        <Link
                          href={`/${p.slug}`}
                          className="inline-flex items-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#006ebf]"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {canEditCatalog && (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingPkg(p)}
                              className="inline-flex items-center p-2 rounded-lg text-slate-500 hover:bg-sky-50 hover:text-[#006ebf]"
                              title="Edit Package"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePackage(p.slug)}
                              className="inline-flex items-center p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Delete Package"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS & INVOICES */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-black text-[#006ebf]">{b.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {b.bookingStatus}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                      {b.paymentStatus}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0b243b]">
                    {b.packageTitle} ({b.travelers} Travelers)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    <strong>Lead Guest:</strong> {b.customerName} ({b.country}) ·{" "}
                    {b.customerEmail} · {b.customerPhone}
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Departure:</strong> {b.departureDate} · <strong>Tier:</strong>{" "}
                    {b.tier}
                  </p>
                  {b.specialRequests && (
                    <p className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg inline-block mt-1">
                      Note: {b.specialRequests}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
                  <div className="text-left lg:text-right">
                    <div className="text-xl font-black text-[#0b243b]">
                      USD {b.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-700 font-bold">
                      Deposit Paid: USD {b.depositPaid.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/invoice/${b.id}`}
                      className="px-3.5 py-2 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Printable Invoice
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleResendBookingEmail(b)}
                      className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Voucher
                    </button>
                    <select
                      value={b.bookingStatus}
                      onChange={(e) =>
                        handleUpdateBookingStatus(b.id, e.target.value)
                      }
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CUSTOM TRIPS */}
        {activeTab === "custom-trips" && (
          <div className="space-y-4">
            {customTrips.map((ct) => (
              <div
                key={ct.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col lg:flex-row justify-between gap-6"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#006ebf]">{ct.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {ct.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0b243b]">
                    {ct.destination} — {ct.durationDays} Days ({ct.travelers} Guests)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    <strong>Client:</strong> {ct.fullName} ({ct.country}) · {ct.email} ·{" "}
                    {ct.phone}
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Start Date:</strong> {ct.startDate} ·{" "}
                    <strong>Comfort:</strong> {ct.accommodationLevel} ·{" "}
                    <strong>Budget:</strong> {ct.budgetRange}
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl mt-2">
                    &ldquo;{ct.comments}&rdquo;
                  </p>
                </div>

                <div className="shrink-0">
                  <select
                    value={ct.status}
                    onChange={(e) =>
                      handleUpdateCustomTripStatus(ct.id, e.target.value)
                    }
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="New Request">New Request</option>
                    <option value="In Review">In Review</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#006ebf]">{inq.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                      {inq.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b243b]">
                    {inq.subject}
                  </h3>
                  <p className="text-xs text-slate-500">
                    From: <strong>{inq.name}</strong> ({inq.email} · {inq.phone})
                  </p>
                  <p className="text-sm text-slate-700 pt-2">{inq.message}</p>
                </div>
                <div>
                  <select
                    value={inq.status}
                    onChange={(e) =>
                      handleUpdateInquiryStatus(inq.id, e.target.value)
                    }
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: BLOGS & TRAVEL GUIDES EDITOR */}
        {activeTab === "blogs" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h2 className="text-lg font-extrabold text-[#0b243b]">
                  Himalayan Travel Guides & Blog Posts ({blogs.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Create, edit, or remove travel articles stored in PostgreSQL.
                </p>
              </div>
              {canEditCatalog && (
                <button
                  type="button"
                  onClick={() => setShowNewBlogModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Publish New Guide
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((b) => (
                <div
                  key={b.slug}
                  className="bg-white rounded-3xl p-5 border border-slate-200 flex items-start gap-4"
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#006ebf]">
                      {b.category} · {b.date} · {b.readTime}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#0b243b] line-clamp-2 mt-0.5">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {b.excerpt}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/blog/${b.slug}`}
                        className="text-xs font-bold text-[#006ebf] hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </Link>
                      {canEditCatalog && (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingBlog(b)}
                            className="text-xs font-bold text-slate-600 hover:text-[#006ebf] inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlog(b.slug)}
                            className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: DESTINATIONS & FAQS EDITOR */}
        {activeTab === "destinations" && (
          <div className="space-y-8">
            {/* Destinations Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0b243b]">
                    Himalayan Destinations ({destinations.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage destination regions, cover imagery, and trip counts.
                  </p>
                </div>
                {canEditCatalog && (
                  <button
                    type="button"
                    onClick={() => setShowNewDestModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Destination
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((d) => (
                  <div
                    key={d.slug}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="h-36 relative">
                      <img
                        src={d.image}
                        alt={d.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          {d.region} · {d.tripCount} Trips
                        </span>
                        <h3 className="text-base font-extrabold">{d.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-600 line-clamp-1">
                        {d.subtitle}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          href={`/destination/${d.slug}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                          title="View Destination"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {canEditCatalog && (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingDest(d)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-sky-100 hover:text-[#006ebf]"
                              title="Edit Destination"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDest(d.slug)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Delete Destination"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global FAQs Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0b243b] flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#006ebf]" />
                    Global Trekking FAQs ({faqs.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage frequently asked questions displayed on the Homepage and FAQs page.
                  </p>
                </div>
                {canEditCatalog && (
                  <button
                    type="button"
                    onClick={() => setShowNewFaqModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add FAQ Item
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase text-[#006ebf]">
                        {f.category} · Order #{f.sortOrder}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#0b243b]">
                        {f.question}
                      </h3>
                      <p className="text-xs text-slate-600">{f.answer}</p>
                    </div>
                    {canEditCatalog && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingFaq(f)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-sky-50 hover:text-[#006ebf]"
                          title="Edit FAQ"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(f.id)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: EMAIL NOTIFICATIONS & OUTBOX */}
        {activeTab === "emails" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#0b243b]">
                  Automated Email Notifications & PostgreSQL Outbox ({emails.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Every new booking, status change, custom trip request, and inquiry dispatches a formatted HTML email logged here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowComposeEmailModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Compose Custom Email
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 pr-4">Recipient</th>
                    <th className="py-3 pr-4">Subject</th>
                    <th className="py-3 pr-4">Category / Ref</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Sent At</th>
                    <th className="py-3 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emails.map((em) => (
                    <tr key={em.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-[#0b243b]">
                          {em.recipientName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {em.recipientEmail}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-slate-800 max-w-xs truncate">
                        {em.subject}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#006ebf] border border-sky-200">
                          {em.category}
                        </span>
                        {em.referenceId && (
                          <span className="ml-1.5 text-xs font-bold text-slate-500">
                            [{em.referenceId}]
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {em.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-slate-500">
                        {new Date(em.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setPreviewEmail(em)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#006ebf] hover:text-white text-slate-700 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View HTML
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-[#0b243b]">
                    {r.author} ({r.country})
                  </strong>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {r.rating}.0 ★ {r.platform}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700">{r.title}</div>
                <p className="text-xs text-slate-500 line-clamp-3">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 10: STAFF & ROLES (SUPER ADMIN RBAC) */}
        {activeTab === "staff" && isSuperAdmin && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#0b243b]">
                  Role-Based Access Control (Admin Staff Accounts)
                </h2>
                <p className="text-xs text-slate-500">
                  Manage staff roles, active status, and permissions across the WebApp CMS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewStaffModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#006ebf] text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Add Staff Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 pr-4">Staff Member</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Last Login</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-[#0b243b]">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleUpdateStaff(u.id, {
                              role: e.target.value as AdminRole,
                            })
                          }
                          disabled={u.id === currentAdmin.id}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white disabled:opacity-60"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Tour Manager">Tour Manager</option>
                          <option value="Support Coordinator">Support Coordinator</option>
                        </select>
                      </td>
                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          disabled={u.id === currentAdmin.id}
                          onClick={() =>
                            handleUpdateStaff(u.id, { active: !u.active })
                          }
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {u.active ? "Active" : "Suspended"}
                        </button>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-slate-500">
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="py-3.5 text-right">
                        {u.id !== currentAdmin.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(u.id)}
                            className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete Staff Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Preview Sent HTML Email */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative space-y-4">
            <button
              type="button"
              onClick={() => setPreviewEmail(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#006ebf]">
                {previewEmail.category} · {previewEmail.status}
              </span>
              <h3 className="text-lg font-extrabold text-[#0b243b] mt-0.5">
                {previewEmail.subject}
              </h3>
              <p className="text-xs text-slate-500">
                To: <strong>{previewEmail.recipientName}</strong> &lt;
                {previewEmail.recipientEmail}&gt; ·{" "}
                {new Date(previewEmail.createdAt).toLocaleString()}
              </p>
            </div>
            <div
              className="border border-slate-200 rounded-2xl p-4 bg-slate-50"
              dangerouslySetInnerHTML={{ __html: previewEmail.bodyHtml }}
            />
          </div>
        </div>
      )}

      {/* Modal: Compose & Send Email */}
      {showComposeEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowComposeEmailModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Send Official Email Notification
            </h2>
            <form onSubmit={handleSendManualEmail} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={composeRecipientName}
                    onChange={(e) => setComposeRecipientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={composeRecipientEmail}
                    onChange={(e) => setComposeRecipientEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Everest Trek Briefing & Permit Confirmation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ref ID
                  </label>
                  <input
                    type="text"
                    value={composeReferenceId}
                    onChange={(e) => setComposeReferenceId(e.target.value)}
                    placeholder="BK-2026-1001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Body *
                </label>
                <textarea
                  rows={5}
                  required
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Write your expedition update or custom itinerary message..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm"
              >
                Dispatch Email Notification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Destination */}
      {showNewDestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewDestModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Add Himalayan Destination
            </h2>
            <form onSubmit={handleCreateDest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Title *
                </label>
                <input
                  type="text"
                  required
                  value={destTitle}
                  onChange={(e) => setDestTitle(e.target.value)}
                  placeholder="e.g. Upper Dolpo & Shey Phoksundo"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Region Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={destRegion}
                    onChange={(e) => setDestRegion(e.target.value)}
                    placeholder="Dolpo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trip Count
                  </label>
                  <input
                    type="number"
                    value={destTripCount}
                    onChange={(e) => setDestTripCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle / Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={destSubtitle}
                  onChange={(e) => setDestSubtitle(e.target.value)}
                  placeholder="Remote Tibetan Buddhist valleys and turquoise alpine lakes"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Image (Application Path or Upload File)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={destImage}
                    onChange={(e) => setDestImage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#006ebf] text-xs font-extrabold cursor-pointer hover:bg-sky-100 shrink-0">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUploadImageFile(
                          e.target.files?.[0],
                          "destination",
                          (p) => setDestImage(p)
                        )
                      }
                    />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm"
              >
                Create Destination
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Destination */}
      {editingDest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setEditingDest(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Edit Destination: {editingDest.title}
            </h2>
            <form onSubmit={handleSaveEditDest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingDest.title}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    value={editingDest.region}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, region: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trip Count
                  </label>
                  <input
                    type="number"
                    value={editingDest.tripCount}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        tripCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingDest.subtitle}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image (Application Path or Upload File)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingDest.image}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, image: e.target.value })
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#006ebf] text-xs font-extrabold cursor-pointer hover:bg-sky-100 shrink-0">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUploadImageFile(
                          e.target.files?.[0],
                          "destination",
                          (p) => setEditingDest({ ...editingDest, image: p })
                        )
                      }
                    />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm"
              >
                Save Destination Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create FAQ */}
      {showNewFaqModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewFaqModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Add New FAQ Item
            </h2>
            <form onSubmit={handleCreateFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Do I need travel insurance with helicopter evacuation?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={faqCategory}
                    onChange={(e) => setFaqCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={faqSortOrder}
                    onChange={(e) => setFaqSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm"
              >
                Save FAQ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setEditingFaq(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Edit FAQ Item
            </h2>
            <form onSubmit={handleSaveEditFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, question: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingFaq.category}
                    onChange={(e) =>
                      setEditingFaq({ ...editingFaq, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingFaq.sortOrder}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        sortOrder: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, answer: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm"
              >
                Update FAQ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Staff Member */}
      {showNewStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewStaffModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Create Staff Account
            </h2>
            {staffError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">
                {staffError}
              </div>
            )}
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Dawa Coordinator"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Staff Email *
                </label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="dawa@nepaltrekkingtours.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role & Permissions
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Tour Manager">
                    Tour Manager (Packages, Blogs, Bookings)
                  </option>
                  <option value="Support Coordinator">
                    Support Coordinator (Bookings, Custom Trips, Inquiries)
                  </option>
                  <option value="Super Admin">
                    Super Admin (Full Access + Staff RBAC)
                  </option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Package */}
      {showNewPkgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setShowNewPkgModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Create New Himalayan Package
            </h2>
            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Deluxe Gokyo Lakes & Renjo La Pass Trek"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Region
                  </label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option>Everest</option>
                    <option>Annapurna</option>
                    <option>Manaslu</option>
                    <option>Langtang</option>
                    <option>Mustang</option>
                    <option>Bhutan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="deluxe-trekking">Deluxe Trekking</option>
                    <option value="luxury-trekking">Luxury VIP Trekking</option>
                    <option value="peak-climbing">Peak Climbing</option>
                    <option value="cultural-tours">Cultural Tour</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deluxe Price ($)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Luxury Price ($)
                  </label>
                  <input
                    type="number"
                    value={newLuxuryPrice}
                    onChange={(e) => setNewLuxuryPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hero Image (Application Path or Upload File)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHeroImage}
                    onChange={(e) => setNewHeroImage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#006ebf] text-xs font-extrabold cursor-pointer hover:bg-sky-100 shrink-0">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUploadImageFile(
                          e.target.files?.[0],
                          "package",
                          (p) => setNewHeroImage(p)
                        )
                      }
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Package Overview *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newOverview}
                  onChange={(e) => setNewOverview(e.target.value)}
                  placeholder="Describe the highlights, lodges, and route..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm"
              >
                Publish Package
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Package */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setEditingPkg(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Edit Package: {editingPkg.title}
            </h2>
            <form onSubmit={handleSaveEditPackage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPkg.title}
                  onChange={(e) =>
                    setEditingPkg({ ...editingPkg, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={editingPkg.duration}
                    onChange={(e) =>
                      setEditingPkg({
                        ...editingPkg,
                        duration: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deluxe Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingPkg.price}
                    onChange={(e) =>
                      setEditingPkg({
                        ...editingPkg,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Luxury Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingPkg.luxuryPrice}
                    onChange={(e) =>
                      setEditingPkg({
                        ...editingPkg,
                        luxuryPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm"
              >
                Save Package Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Blog Guide */}
      {showNewBlogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setShowNewBlogModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Publish New Travel Guide
            </h2>
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guide Title *
                </label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g. Best Time to Trek Everest Base Camp in 2027"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Image (Application Path or Upload File)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#006ebf] text-xs font-extrabold cursor-pointer hover:bg-sky-100 shrink-0">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUploadImageFile(
                          e.target.files?.[0],
                          "blog",
                          (p) => setBlogImage(p)
                        )
                      }
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Article Content (HTML or Text) *
                </label>
                <textarea
                  rows={5}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white font-extrabold text-sm"
              >
                Publish Guide
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Blog Guide */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setEditingBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-[#0b243b] mb-4">
              Edit Travel Guide
            </h2>
            <form onSubmit={handleSaveEditBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingBlog.category}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={editingBlog.readTime}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        readTime: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Image (Application Path or Upload File)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingBlog.image}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, image: e.target.value })
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#006ebf] text-xs font-extrabold cursor-pointer hover:bg-sky-100 shrink-0">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleUploadImageFile(
                          e.target.files?.[0],
                          "blog",
                          (p) => setEditingBlog({ ...editingBlog, image: p })
                        )
                      }
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, excerpt: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Content HTML
                </label>
                <textarea
                  rows={5}
                  value={editingBlog.contentHtml}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      contentHtml: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm"
              >
                Save Guide Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
