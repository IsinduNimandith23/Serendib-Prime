import { Resend } from "resend";
import { formatLKR } from "./utils";
import type { CartItem, OrderRecord, PaymentMethod } from "./types";

/**
 * Transactional email via Resend. Every sender here is fail-safe: when
 * RESEND_API_KEY isn't set (demo mode) or the API errors, we log and move on -
 * an email hiccup must never break checkout or the PayHere webhook.
 *
 * Note: until serendibprime.lk is verified in the Resend dashboard, the
 * default "onboarding@resend.dev" sender only delivers to the Resend account
 * owner's inbox. Set EMAIL_FROM to a verified-domain address for production.
 */

const DEFAULT_FROM = "Serendib Prime <onboarding@resend.dev>";
/** Store inbox for new-order + contact notifications. */
const DEFAULT_NOTIFY = "serendibprime587@gmail.com";

const BRAND = "#b5371f";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function notifyInbox(): string {
  return process.env.EMAIL_NOTIFY || DEFAULT_NOTIFY;
}

/** Everything an order email needs - normalised from either the checkout
 * payload or a stored OrderRecord (see orderEmailDataFromRecord). */
export interface OrderEmailData {
  orderRef: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  bankAccount?: string | null;
}

export function orderEmailDataFromRecord(order: OrderRecord): OrderEmailData {
  return {
    orderRef: order.order_ref,
    customerName: order.customer_name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    postalCode: order.postal_code,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    paymentMethod: order.payment_method,
    bankAccount: order.bank_account,
  };
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on delivery",
  bank: "Bank transfer",
  payhere: "Card / online payment",
};

/** Escape user-provided text before interpolating it into email HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false; // demo mode - no-op

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || DEFAULT_FROM,
      ...options,
    });
    if (error) {
      console.error(`email send failed (${options.subject}):`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`email send threw (${options.subject}):`, err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

/** Shared shell: brand header, content card, support footer. Inline styles +
 * table layout for email-client compatibility. */
function emailLayout(bodyHtml: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:${BRAND};padding:20px 28px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:2px;">SERENDIB PRIME</span>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;color:#2b2119;font-size:14px;line-height:1.6;">
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #eee5da;color:#8a7a68;font-size:12px;line-height:1.5;">
          Questions about your order? Reply to this email or write to
          <a href="mailto:${DEFAULT_NOTIFY}" style="color:${BRAND};">${DEFAULT_NOTIFY}</a>.<br/>
          Serendib Prime &middot; Authentic Sri Lankan flavours, ready in minutes.
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;
}

function itemsTable(order: OrderEmailData): string {
  const rows = order.items
    .map(
      (item: CartItem) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0e9df;">${esc(item.name)} <span style="color:#8a7a68;">(${esc(item.weight)})</span></td>
        <td align="center" style="padding:8px 0;border-bottom:1px solid #f0e9df;white-space:nowrap;">&times;&nbsp;${item.quantity}</td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #f0e9df;white-space:nowrap;">${formatLKR(item.price * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#2b2119;">
    ${rows}
    <tr>
      <td colspan="2" style="padding:8px 0 2px;color:#8a7a68;">Subtotal</td>
      <td align="right" style="padding:8px 0 2px;">${formatLKR(order.subtotal)}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:2px 0;color:#8a7a68;">Shipping</td>
      <td align="right" style="padding:2px 0;">${order.shipping === 0 ? "Free" : formatLKR(order.shipping)}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:6px 0;font-weight:bold;">Total</td>
      <td align="right" style="padding:6px 0;font-weight:bold;">${formatLKR(order.total)}</td>
    </tr>
  </table>`;
}

function deliveryBlock(order: OrderEmailData): string {
  return `
  <p style="margin:20px 0 4px;font-weight:bold;">Delivering to</p>
  <p style="margin:0;color:#5c4f40;">
    ${esc(order.customerName)}<br/>
    ${esc(order.address)}, ${esc(order.city)}${order.postalCode ? ` ${esc(order.postalCode)}` : ""}<br/>
    ${esc(order.phone)}
  </p>`;
}

function orderRefBadge(orderRef: string): string {
  return `<p style="margin:0 0 16px;">Order reference:
    <span style="display:inline-block;background:#f6f3ee;border-radius:6px;padding:2px 10px;font-weight:bold;letter-spacing:1px;">${esc(orderRef)}</span>
  </p>`;
}

/** Per-method note shown in the customer's "order received" email. */
function paymentNote(order: OrderEmailData): string {
  switch (order.paymentMethod) {
    case "cod":
      return `Please keep <strong>${formatLKR(order.total)}</strong> ready in cash - you pay when your order arrives.`;
    case "bank":
      return `We've received your transfer receipt${order.bankAccount ? ` for our ${esc(order.bankAccount)} account` : ""} and will confirm your payment shortly. You'll hear from us if anything else is needed.`;
    case "payhere":
      return "Your payment was processed securely online.";
  }
}

/* ------------------------------------------------------------------ */
/* Senders                                                             */
/* ------------------------------------------------------------------ */

/** Customer confirmation + store notification when an order is placed
 * (COD / bank transfer - PayHere orders email on payment instead). */
export async function sendOrderPlacedEmails(order: OrderEmailData): Promise<void> {
  const first = order.customerName.trim().split(/\s+/)[0] || "there";

  await sendEmail({
    to: order.email,
    subject: `Order ${order.orderRef} received - Serendib Prime`,
    replyTo: notifyInbox(),
    html: emailLayout(`
      <h1 style="margin:0 0 8px;font-size:20px;color:${BRAND};">Thank you, ${esc(first)}!</h1>
      <p style="margin:0 0 16px;">We've received your order and we're getting it ready.</p>
      ${orderRefBadge(order.orderRef)}
      ${itemsTable(order)}
      <p style="margin:20px 0 4px;font-weight:bold;">Payment - ${PAYMENT_LABELS[order.paymentMethod]}</p>
      <p style="margin:0;color:#5c4f40;">${paymentNote(order)}</p>
      ${deliveryBlock(order)}
    `),
  });

  await sendStoreOrderNotification(order, "New order");
}

/** Customer receipt + store notification once PayHere confirms payment. */
export async function sendOrderPaidEmails(order: OrderEmailData): Promise<void> {
  const first = order.customerName.trim().split(/\s+/)[0] || "there";

  await sendEmail({
    to: order.email,
    subject: `Payment confirmed for order ${order.orderRef} - Serendib Prime`,
    replyTo: notifyInbox(),
    html: emailLayout(`
      <h1 style="margin:0 0 8px;font-size:20px;color:${BRAND};">Payment received - thank you, ${esc(first)}!</h1>
      <p style="margin:0 0 16px;">Your payment went through and your order is being prepared.</p>
      ${orderRefBadge(order.orderRef)}
      ${itemsTable(order)}
      ${deliveryBlock(order)}
    `),
  });

  await sendStoreOrderNotification(order, "Order paid");
}

/** Heads-up to the store inbox with full order details. Reply-to is set to the
 * customer so staff can respond directly from their mail client. */
async function sendStoreOrderNotification(
  order: OrderEmailData,
  kind: "New order" | "Order paid",
): Promise<void> {
  await sendEmail({
    to: notifyInbox(),
    subject: `${kind}: ${order.orderRef} · ${formatLKR(order.total)} · ${PAYMENT_LABELS[order.paymentMethod]}`,
    replyTo: order.email,
    html: emailLayout(`
      <h1 style="margin:0 0 8px;font-size:20px;color:${BRAND};">${kind}</h1>
      ${orderRefBadge(order.orderRef)}
      ${itemsTable(order)}
      <p style="margin:20px 0 4px;font-weight:bold;">Payment</p>
      <p style="margin:0;color:#5c4f40;">
        ${PAYMENT_LABELS[order.paymentMethod]}${order.bankAccount ? ` &middot; ${esc(order.bankAccount)}` : ""}
      </p>
      ${deliveryBlock(order)}
      <p style="margin:20px 0 0;color:#5c4f40;">
        Customer email: <a href="mailto:${esc(order.email)}" style="color:${BRAND};">${esc(order.email)}</a>
      </p>
    `),
  });
}

/** Forward a contact-form message to the store inbox. */
export async function sendContactEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await sendEmail({
    to: notifyInbox(),
    subject: `New message from ${input.name} - serendibprime.lk`,
    replyTo: input.email,
    html: emailLayout(`
      <h1 style="margin:0 0 8px;font-size:20px;color:${BRAND};">Contact form message</h1>
      <p style="margin:0 0 4px;"><strong>${esc(input.name)}</strong>
        &lt;<a href="mailto:${esc(input.email)}" style="color:${BRAND};">${esc(input.email)}</a>&gt;
      </p>
      <p style="margin:16px 0 0;white-space:pre-line;color:#2b2119;">${esc(input.message)}</p>
    `),
  });
}
