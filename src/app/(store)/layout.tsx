import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PreloaderProvider } from "@/components/providers/Preloader";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreloaderProvider>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <SmoothScroll />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </PreloaderProvider>
  );
}
