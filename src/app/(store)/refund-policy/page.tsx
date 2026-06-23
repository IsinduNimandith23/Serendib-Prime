import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import {
  LegalBody,
  LegalSection,
  LegalList,
  LegalContact,
  MailLink,
} from "@/components/legal/Legal";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description:
    "How returns, refunds and order cancellations work at Serendib Prime. Due to the perishable nature of our products, all sales are final except for damaged or defective goods.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund & Return Policy"
        intro="Thank you for shopping with Serendib Prime - Sri Lanka's trusted range of premium ready-to-eat canned seafood products. Please read this policy carefully before placing your order."
      >
        <p className="text-sm text-cocoa-soft/80">Last updated: June 23, 2026</p>
      </PageHero>

      <LegalBody>
        <LegalSection n="1" title="All Sales Are Final">
          <p>
            Due to the perishable and food-safety nature of our products, all
            sales are final. We do not accept returns, exchanges, or
            cancellations once an order has been placed and dispatched.
          </p>
        </LegalSection>

        <LegalSection n="2" title="Damaged or Defective Products">
          <p>
            We take product quality very seriously. If you receive a product
            that is:
          </p>
          <LegalList
            items={[
              "Visibly damaged or dented upon delivery",
              "Leaking or the seal has been broken",
              "Expired or otherwise unfit for consumption",
            ]}
          />
          <p>
            Please contact us within 48 hours of receiving your order. We will
            review your claim and, where appropriate, offer a replacement, store
            credit, or a refund at our sole discretion.
          </p>
          <p>
            To raise a claim, email us at <MailLink />. Please include your
            order number, a clear description of the issue, and photographs of
            the affected product(s).
          </p>
          <p>
            Where a monetary refund is approved, it will be issued to your
            original payment method through PayHere, our secure payment gateway,
            within 7 to 10 business days. Depending on your bank or card
            provider, it may take additional time for the refunded amount to
            appear in your account.
          </p>
        </LegalSection>

        <LegalSection n="3" title="Non-Returnable Items">
          <p>
            The following items cannot be returned or refunded under any
            circumstances:
          </p>
          <LegalList
            items={[
              "Opened or partially consumed products",
              "Products not stored in accordance with label instructions",
              "Products purchased on promotion or at a discounted price",
              "Products for which a claim is raised after 48 hours of delivery",
            ]}
          />
        </LegalSection>

        <LegalSection n="4" title="Order Cancellations">
          <p>
            Orders cannot be cancelled once they have been confirmed and
            dispatched. If you wish to cancel before dispatch, please contact us
            immediately at the email above. Cancellation before dispatch is
            subject to availability and is not guaranteed.
          </p>
        </LegalSection>

        <LegalSection n="5" title="Delivery Issues">
          <p>
            If your order has not arrived within 7 business days of dispatch,
            please contact us and we will investigate with our logistics
            partner.
          </p>
        </LegalSection>

        <LegalSection n="6" title="Contact Us">
          <p>
            For any concerns regarding your order, please reach out to us at{" "}
            <MailLink />. We aim to respond within 2 business days.
          </p>
        </LegalSection>

        <LegalContact />
      </LegalBody>
    </>
  );
}
