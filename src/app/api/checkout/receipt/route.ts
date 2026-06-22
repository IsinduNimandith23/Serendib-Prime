import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Receives a bank-transfer payment receipt (image or PDF) and stores it in the
 * private `payment-receipts` bucket via the service-role client. Returns the
 * storage path, which the checkout then attaches to the order. The file is
 * never made public - admins view it through a signed URL.
 */
const RECEIPT_BUCKET = "payment-receipts";
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Invalid upload.");
  }

  const file = form.get("receipt");
  const orderRef = String(form.get("orderRef") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) return bad("Please attach a receipt.");
  if (file.size > MAX_BYTES) return bad("Receipt must be 5MB or smaller.");
  if (!ALLOWED_TYPES.includes(file.type)) {
    return bad("Receipt must be a PNG, JPG, WebP or PDF.");
  }

  const admin = createSupabaseAdminClient();
  // Demo mode (no Supabase) - accept the upload so the flow completes; nothing
  // is stored and the order won't be persisted anyway.
  if (!admin) return NextResponse.json({ path: null, demo: true });

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const slug = orderRef.replace(/[^A-Za-z0-9-]/g, "") || "receipt";
  const path = `${slug}-${Date.now()}.${ext}`;

  const { error } = await admin.storage
    .from(RECEIPT_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: true });

  if (error) {
    console.error("receipt upload failed:", error.message);
    return NextResponse.json({ error: "Could not save your receipt." }, { status: 500 });
  }

  return NextResponse.json({ path });
}
