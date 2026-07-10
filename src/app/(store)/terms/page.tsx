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
  title: "Terms & Conditions",
  description:
    "The terms governing your use of the Serendib Prime website and your purchase of our premium ready-to-eat canned seafood products.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        intro="These Terms & Conditions govern your use of the Serendib Prime website and your purchase of products from Serendib Prime. By placing an order, you agree to be bound by these terms."
      >
        <p className="text-sm text-cocoa-soft/80">Last updated: July 10, 2026</p>
      </PageHero>

      <LegalBody>
        <LegalSection n="1" title="About Us">
          <p>
            Serendib Prime is a product brand owned and operated by Serendib
            Prime, a registered business in Sri Lanka engaged in the production
            and sale of premium ready-to-eat canned seafood products.
          </p>
          <p>
            Contact: <MailLink />
          </p>
        </LegalSection>

        <LegalSection n="2" title="Products">
          <p>
            All products listed on our website are subject to availability. We
            reserve the right to discontinue any product at any time without
            notice. Product images are for illustrative purposes and may vary
            slightly from the actual product.
          </p>
        </LegalSection>

        <LegalSection n="3" title="Pricing">
          <p>
            All prices are listed in Sri Lankan Rupees (LKR) and include
            applicable taxes unless otherwise stated. We reserve the right to
            change prices without prior notice. The price applicable to your
            order is the price displayed at the time of checkout.
          </p>
        </LegalSection>

        <LegalSection n="4" title="Orders & Payment">
          <p>By placing an order, you confirm that:</p>
          <LegalList
            items={[
              "You are at least 18 years of age",
              "The information you provide is accurate and complete",
              "You are authorised to use the payment method provided",
            ]}
          />
          <p>
            Orders are confirmed only upon successful payment. We reserve the
            right to cancel or refuse any order at our discretion, in which case
            a full refund will be issued to your original payment method (the
            payment-initiated media) through PayHere.
          </p>
          <p>
            All payments are processed securely through PayHere, our third-party
            payment gateway. We do not collect or store your full card or
            banking details on our website.
          </p>
        </LegalSection>

        <LegalSection n="5" title="Dispatch & Delivery">
          <p>
            We aim to dispatch all orders within 24 hours of confirmed payment
            (excluding Sundays and public holidays). Estimated delivery time is
            2 to 5 business days depending on your location within Sri Lanka.
          </p>
          <p>
            Delivery timelines are estimates and may be affected by factors
            outside our control, including weather, carrier delays, or public
            holidays. We are not liable for delays beyond our reasonable
            control.
          </p>
        </LegalSection>

        <LegalSection n="6" title="Refunds & Returns">
          <p>
            Please refer to our Refund & Return Policy for full details. Due to
            the perishable nature of our products, all sales are final except in
            the case of damaged or defective goods reported within 48 hours of
            delivery.
          </p>
        </LegalSection>

        <LegalSection n="7" title="Food Safety & Storage">
          <p>
            Our canned products are manufactured to meet applicable food safety
            standards. Customers are responsible for storing products in
            accordance with the instructions on the label. We are not liable for
            any adverse effects resulting from improper storage or handling
            after delivery.
          </p>
        </LegalSection>

        <LegalSection n="8" title="Intellectual Property">
          <p>
            All content on this website - including the Serendib Prime name,
            logo, product images, and text - is the intellectual property of
            Serendib Prime. Unauthorised use, reproduction, or distribution is
            strictly prohibited.
          </p>
        </LegalSection>

        <LegalSection n="9" title="Limitation of Liability">
          <p>
            To the fullest extent permitted by law, Serendib Prime shall not be
            liable for any indirect, incidental, or consequential damages
            arising from the use of our products or website, including loss of
            data, revenue, or business.
          </p>
        </LegalSection>

        <LegalSection n="10" title="Governing Law">
          <p>
            These Terms & Conditions are governed by the laws of the Democratic
            Socialist Republic of Sri Lanka. Any disputes shall be subject to
            the exclusive jurisdiction of the courts of Sri Lanka.
          </p>
        </LegalSection>

        <LegalSection n="11" title="Changes to These Terms">
          <p>
            We reserve the right to update these Terms & Conditions at any time.
            Changes will be posted on this page with a revised date. Continued
            use of our website constitutes acceptance of the updated terms.
          </p>
        </LegalSection>

        <LegalSection n="12" title="Contact Us">
          <p>
            For any enquiries regarding these Terms & Conditions, please contact
            us at <MailLink />.
          </p>
        </LegalSection>

        <LegalContact />
      </LegalBody>
    </>
  );
}
