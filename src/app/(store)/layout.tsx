import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PreloaderProvider } from "@/components/providers/Preloader";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreloaderProvider>
      <SmoothScroll />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </PreloaderProvider>
  );
}
