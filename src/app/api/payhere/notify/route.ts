import { NextResponse, type NextRequest } from "next/server";
import { markOrderStatus } from "@/lib/orders";
import {
  payhereStatusToOrderStatus,
  verifyNotifySignature,
} from "@/lib/payhere";

export const runtime = "nodejs";

/**
 * Server-to-server payment notification from PayHere.
 * PayHere POSTs application/x-www-form-urlencoded data here after a payment.
 * We verify the md5 signature before trusting the status, then update the order.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const get = (k: string) => (form.get(k)?.toString() ?? "");

  const merchantId = get("merchant_id");
  const orderId = get("order_id");
  const amount = get("payhere_amount");
  const currency = get("payhere_currency");
  const statusCode = get("status_code");
  const md5sig = get("md5sig");
  const paymentId = get("payment_id");

  const valid = verifyNotifySignature({
    merchantId,
    orderId,
    amount,
    currency,
    statusCode,
    md5sig,
  });

  if (!valid) {
    console.warn(`PayHere notify: invalid signature for order ${orderId}`);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const status = payhereStatusToOrderStatus(statusCode);
  await markOrderStatus(orderId, status, paymentId || undefined);

  // PayHere expects a 200 acknowledgement.
  return new NextResponse("OK", { status: 200 });
}
