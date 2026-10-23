import { NextRequest, NextResponse } from "next/server";
import {
  getAllEmailLogs,
  logAndSendEmail,
  buildEmailWrapper,
} from "@/lib/mailer";

export async function GET() {
  const logs = await getAllEmailLogs();
  return NextResponse.json({ emails: logs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.recipientEmail || !body.subject) {
      return NextResponse.json(
        { error: "Recipient email and subject are required." },
        { status: 400 }
      );
    }

    const bodyHtml = body.bodyHtml
      ? body.bodyHtml
      : buildEmailWrapper(
          body.subject,
          `<p>Namaste <strong>${body.recipientName || "Valued Traveler"}</strong>,</p>
           <div style="white-space: pre-line;">${body.message || ""}</div>`
        );

    const record = await logAndSendEmail({
      recipientEmail: body.recipientEmail,
      recipientName: body.recipientName || "Valued Traveler",
      subject: body.subject,
      category: body.category || "Manual Dispatch",
      referenceId: body.referenceId || "MANUAL",
      bodyHtml,
    });

    return NextResponse.json({ success: true, email: record }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
