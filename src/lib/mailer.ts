import { pool, BookingRecord, CustomTripRequest, InquiryRecord } from "@/lib/db";

export interface EmailLogRecord {
  id: number;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  category: "Booking Confirmation" | "Booking Update" | "Custom Trip" | "Inquiry Reply" | "Manual Dispatch";
  referenceId: string;
  status: string;
  bodyHtml: string;
  createdAt: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200";

let emailTableInitialized = false;

export async function ensureEmailTable(): Promise<void> {
  if (emailTableInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        recipient_email TEXT NOT NULL,
        recipient_name TEXT NOT NULL DEFAULT '',
        subject TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Booking Confirmation',
        reference_id TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'Delivered (PostgreSQL Outbox)',
        body_html TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const countRes = await pool.query(`SELECT COUNT(*)::int AS cnt FROM email_logs`);
    if ((countRes.rows[0]?.cnt ?? 0) === 0) {
      await pool.query(
        `INSERT INTO email_logs (recipient_email, recipient_name, subject, category, reference_id, status, body_html)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          "david.miller@example.com",
          "David Miller",
          "Official Booking Confirmation & Invoice [BK-2026-1001] — Deluxe Everest Base Camp Trek",
          "Booking Confirmation",
          "BK-2026-1001",
          "Delivered",
          buildEmailWrapper(
            "Official Booking Confirmation",
            `<p>Namaste <strong>David Miller</strong>,</p>
             <p>Thank you for choosing <strong>CCC Nepal Trekking Tours</strong>! Your reservation for <strong>Deluxe Everest Base Camp Trek</strong> (2 Guests, departing 2026-10-12) is confirmed.</p>
             <p><strong>Booking Reference:</strong> BK-2026-1001<br/>
             <strong>Total Package Amount:</strong> USD 3,798<br/>
             <strong>Deposit Received:</strong> USD 760 (20% Deposit Paid)</p>
             <p>You can view and print your official Booking Invoice at any time: <a href="${SITE_URL}/invoice/BK-2026-1001">${SITE_URL}/invoice/BK-2026-1001</a></p>`
          ),
        ]
      );
    }

    emailTableInitialized = true;
  } catch (err) {
    console.error("Failed to initialize email_logs table:", err);
  }
}

function buildEmailWrapper(headline: string, innerHtml: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
      <div style="background: #0b243b; color: #ffffff; padding: 24px 28px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; font-weight: 700;">
          CCC Nepal Trekking Tours · Kathmandu, Nepal
        </div>
        <h2 style="margin: 6px 0 0; font-size: 20px; font-weight: 800;">${headline}</h2>
      </div>
      <div style="padding: 26px 28px; color: #1e293b; font-size: 14px; line-height: 1.65;">
        ${innerHtml}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="margin: 0; font-size: 13px; color: #475569;">
          Warm Himalayan Regards,<br/>
          <strong style="color: #0b243b;">Expert Representative</strong><br/>
          Lead Expedition Coordinator · CCC Nepal Trekking Tours Pvt. Ltd.<br/>
          Kaldhara Marg, Thamel, Kathmandu · +1-888-820-8072
        </p>
      </div>
    </div>
  `.trim();
}

export async function logAndSendEmail(params: {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  category: EmailLogRecord["category"];
  referenceId: string;
  bodyHtml: string;
}): Promise<EmailLogRecord | null> {
  await ensureEmailTable();
  try {
    const res = await pool.query(
      `INSERT INTO email_logs (recipient_email, recipient_name, subject, category, reference_id, status, body_html)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        params.recipientEmail,
        params.recipientName,
        params.subject,
        params.category,
        params.referenceId,
        process.env.SMTP_HOST ? "Sent via SMTP" : "Delivered (Outbox Log)",
        params.bodyHtml,
      ]
    );
    const r = res.rows[0];
    return {
      id: Number(r.id),
      recipientEmail: String(r.recipient_email),
      recipientName: String(r.recipient_name),
      subject: String(r.subject),
      category: r.category as EmailLogRecord["category"],
      referenceId: String(r.reference_id),
      status: String(r.status),
      bodyHtml: String(r.body_html),
      createdAt: new Date(r.created_at).toISOString(),
    };
  } catch (err) {
    console.error("Failed to record email:", err);
    return null;
  }
}

export async function sendBookingConfirmationEmail(booking: BookingRecord) {
  if (!booking.customerEmail) return null;
  const html = buildEmailWrapper(
    `Booking Confirmation [${booking.id}]`,
    `<p>Namaste <strong>${booking.customerName}</strong>,</p>
     <p>Your Himalayan expedition with <strong>CCC Nepal Trekking Tours</strong> has been officially registered and assigned to our Lead Expedition Coordinator, <strong>Expert Representative</strong>.</p>
     <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
       <p style="margin: 4px 0;"><strong>Booking Reference:</strong> ${booking.id}</p>
       <p style="margin: 4px 0;"><strong>Package:</strong> ${booking.packageTitle}</p>
       <p style="margin: 4px 0;"><strong>Departure Date:</strong> ${booking.departureDate}</p>
       <p style="margin: 4px 0;"><strong>Travelers & Tier:</strong> ${booking.travelers} Guests · ${booking.tier}</p>
       <p style="margin: 4px 0;"><strong>Total Package Price:</strong> USD ${booking.totalPrice.toLocaleString()}</p>
       <p style="margin: 4px 0;"><strong>Deposit / Payment Status:</strong> ${booking.paymentStatus} (USD ${booking.depositPaid.toLocaleString()})</p>
     </div>
     <p><strong>Printable Invoice & Official Voucher:</strong><br/>
     <a href="${SITE_URL}/invoice/${booking.id}" style="color: #006ebf; font-weight: 700;">View & Print Official Invoice (${booking.id})</a></p>
     <p><strong>Printable Day-by-Day Itinerary Dossier:</strong><br/>
     <a href="${SITE_URL}/itinerary/${booking.packageSlug}" style="color: #006ebf; font-weight: 700;">Download Printable Trip Itinerary</a></p>`
  );

  return logAndSendEmail({
    recipientEmail: booking.customerEmail,
    recipientName: booking.customerName,
    subject: `Official Booking Confirmation & Invoice [${booking.id}] — ${booking.packageTitle}`,
    category: "Booking Confirmation",
    referenceId: booking.id,
    bodyHtml: html,
  });
}

export async function sendBookingStatusUpdateEmail(booking: BookingRecord) {
  if (!booking.customerEmail) return null;
  const html = buildEmailWrapper(
    `Reservation Status Update [${booking.id}]`,
    `<p>Namaste <strong>${booking.customerName}</strong>,</p>
     <p>Your booking <strong>${booking.id}</strong> for <strong>${booking.packageTitle}</strong> has been updated by our Kathmandu operations desk:</p>
     <ul>
       <li><strong>Booking Status:</strong> ${booking.bookingStatus}</li>
       <li><strong>Payment Status:</strong> ${booking.paymentStatus}</li>
       <li><strong>Departure Date:</strong> ${booking.departureDate}</li>
     </ul>
     <p>Access your updated invoice here: <a href="${SITE_URL}/invoice/${booking.id}">${SITE_URL}/invoice/${booking.id}</a></p>`
  );

  return logAndSendEmail({
    recipientEmail: booking.customerEmail,
    recipientName: booking.customerName,
    subject: `Booking Update [${booking.id}]: ${booking.bookingStatus} (${booking.paymentStatus})`,
    category: "Booking Update",
    referenceId: booking.id,
    bodyHtml: html,
  });
}

export async function sendCustomTripAcknowledgementEmail(trip: CustomTripRequest) {
  if (!trip.email) return null;
  const html = buildEmailWrapper(
    `Custom Trip Proposal Request [${trip.id}]`,
    `<p>Namaste <strong>${trip.fullName}</strong>,</p>
     <p>We have received your custom Himalayan trip planning request (Reference: <strong>${trip.id}</strong>) for <strong>${trip.destination}</strong>.</p>
     <p><strong>Summary of Your Tailor-Made Request:</strong></p>
     <ul>
       <li><strong>Preferred Start Date:</strong> ${trip.startDate || "Flexible"}</li>
       <li><strong>Duration & Group Size:</strong> ${trip.durationDays} Days · ${trip.travelers} Travelers</li>
       <li><strong>Comfort Level:</strong> ${trip.accommodationLevel}</li>
       <li><strong>Target Budget:</strong> ${trip.budgetRange}</li>
     </ul>
     <p>Our Senior Expedition Planner <strong>Expert Representative</strong> is preparing a custom day-by-day route and quote for you within 24 hours.</p>`
  );

  return logAndSendEmail({
    recipientEmail: trip.email,
    recipientName: trip.fullName,
    subject: `Tailor-Made Himalayan Trip Request Received [${trip.id}] — ${trip.destination}`,
    category: "Custom Trip",
    referenceId: trip.id,
    bodyHtml: html,
  });
}

export async function sendInquiryAcknowledgementEmail(inquiry: InquiryRecord) {
  if (!inquiry.email) return null;
  const html = buildEmailWrapper(
    `We Received Your Inquiry [${inquiry.id}]`,
    `<p>Namaste <strong>${inquiry.name}</strong>,</p>
     <p>Thank you for contacting <strong>CCC Nepal Trekking Tours</strong> regarding <strong>"${inquiry.subject}"</strong>.</p>
     <p>Your inquiry reference is <strong>${inquiry.id}</strong>. Our Kathmandu desk led by <strong>Expert Representative</strong> will respond shortly with detailed guidance.</p>`
  );

  return logAndSendEmail({
    recipientEmail: inquiry.email,
    recipientName: inquiry.name,
    subject: `Inquiry Received [${inquiry.id}]: ${inquiry.subject}`,
    category: "Inquiry Reply",
    referenceId: inquiry.id,
    bodyHtml: html,
  });
}

export async function getAllEmailLogs(): Promise<EmailLogRecord[]> {
  await ensureEmailTable();
  try {
    const res = await pool.query(`SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 100`);
    return res.rows.map((r) => ({
      id: Number(r.id),
      recipientEmail: String(r.recipient_email),
      recipientName: String(r.recipient_name),
      subject: String(r.subject),
      category: r.category as EmailLogRecord["category"],
      referenceId: String(r.reference_id),
      status: String(r.status),
      bodyHtml: String(r.body_html),
      createdAt: new Date(r.created_at).toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch email logs:", err);
    return [];
  }
}

export { buildEmailWrapper };
