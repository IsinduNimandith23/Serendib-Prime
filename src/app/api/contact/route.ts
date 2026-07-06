import { after, NextResponse, type NextRequest } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
  }

  // Persist to a `messages` table when Supabase is configured; safe to ignore
  // if the table doesn't exist yet.
  const admin = createSupabaseAdminClient();
  if (admin) {
    try {
      await admin.from("messages").insert({ name, email, message });
    } catch {
      /* table optional - no-op */
    }
  } else {
    console.log("Contact message (demo):", { name, email });
  }

  // Forward to the store inbox without delaying the response.
  after(() => sendContactEmail({ name, email, message }));

  return NextResponse.json({ ok: true });
}
