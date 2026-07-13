import { after, NextResponse, type NextRequest } from "next/server";
import { orderEmailDataFromRecord, sendOrderPaidEmails } from "@/lib/email";
import { getOrderByRef, markOrderStatus } from "@/lib/orders";
import { FULFILLMENT_STATUSES } from "@/lib/order-status";
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
  // Snapshot the order before updating so we only email on the transition to
  // "paid" - PayHere retries notifications, and retries must not re-send.
  const order = await getOrderByRef(orderId);

  // Once an order is paid the admin owns its fulfillment. A late or duplicate
  // notify must not drag a processing/dispatched/completed order back to
  // paid/pending (that would also re-send the confirmation emails). A genuine
  // reversal (cancelled/failed, e.g. a chargeback) is still recorded.
  const alreadyInFulfillment =
    order != null && FULFILLMENT_STATUSES.includes(order.status);
  if (alreadyInFulfillment && (status === "paid" || status === "pending")) {
    return new NextResponse("OK", { status: 200 });
  }

  await markOrderStatus(orderId, status, paymentId || undefined);

  if (status === "paid" && order && order.status !== "paid") {
    after(() => sendOrderPaidEmails(orderEmailDataFromRecord(order)));
  }

  // PayHere expects a 200 acknowledgement.
  return new NextResponse("OK", { status: 200 });
}
