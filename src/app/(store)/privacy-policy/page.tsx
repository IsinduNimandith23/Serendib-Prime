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
  title: "Privacy Policy",
  description:
    "How Serendib Prime collects, uses, and protects your personal information when you visit our website or place an order.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro={
          <>
            Serendib Prime (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo;) operates the Serendib Prime online store. This
            Privacy Policy explains how we collect, use, and protect your
            personal information when you visit our website or place an order
            with us.
          </>
        }
      >
        <p className="text-sm text-cocoa-soft/80">Last updated: June 23, 2026</p>
      </PageHero>

      <LegalBody>
        <LegalSection n="1" title="Information We Collect">
          <p>
            When you place an order or register on our website, we may collect
            the following information:
          </p>
          <LegalList
            items={[
              "Full name and delivery address",
              "Email address and telephone number",
              "Payment information (processed securely through PayHere - we do not store card details)",
              "Order history and preferences",
              "Device and browser data collected automatically via cookies",
            ]}
          />
        </LegalSection>

        <LegalSection n="2" title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <LegalList
            items={[
              "Process and fulfil your orders",
              "Send order confirmations and delivery updates",
              "Respond to customer service enquiries",
              "Improve our website and product offerings",
              "Send promotional communications (only with your consent)",
              "Comply with legal and regulatory obligations",
            ]}
          />
        </LegalSection>

        <LegalSection n="3" title="Sharing of Information">
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information with trusted partners only
            where necessary:
          </p>
          <LegalList
            items={[
              "Payment gateway (PayHere) for secure transaction processing",
              "Delivery and logistics partners for order fulfilment",
              "Legal authorities if required by law",
            ]}
          />
        </LegalSection>

        <LegalSection n="4" title="Data Security">
          <p>
            We implement appropriate technical and organisational measures to
            protect your personal data against unauthorised access, alteration,
            disclosure, or destruction. All payment transactions are encrypted
            via SSL.
          </p>
        </LegalSection>

        <LegalSection n="5" title="Cookies">
          <p>
            Our website uses cookies to enhance your browsing experience and
            analyse site traffic. You may disable cookies through your browser
            settings; however, this may affect certain website functionality.
          </p>
        </LegalSection>

        <LegalSection n="6" title="Data Retention">
          <p>
            We retain your personal data only for as long as necessary to fulfil
            the purposes outlined in this policy or as required by applicable
            law.
          </p>
        </LegalSection>

        <LegalSection n="7" title="Your Rights">
          <p>You have the right to:</p>
          <LegalList
            items={[
              "Access the personal data we hold about you",
              "Request correction of inaccurate data",
              "Request deletion of your data (subject to legal obligations)",
              "Withdraw consent for marketing communications at any time",
            ]}
          />
          <p>
            To exercise any of these rights, contact us at <MailLink />.
          </p>
        </LegalSection>

        <LegalSection n="8" title="Third-Party Links">
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of those sites and encourage
            you to review their policies separately.
          </p>
        </LegalSection>

        <LegalSection n="9" title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated date. Continued use of our
            website after changes constitutes acceptance of the revised policy.
          </p>
        </LegalSection>

        <LegalSection n="10" title="Contact Us">
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at <MailLink />.
          </p>
        </LegalSection>

        <LegalContact />
      </LegalBody>
    </>
  );
}
