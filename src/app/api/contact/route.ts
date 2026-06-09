import { NextResponse, type NextRequest } from "next/server";
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
  // if the table doesn't exist yet. Wire up an email notification in production.
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

  return NextResponse.json({ ok: true });
}
