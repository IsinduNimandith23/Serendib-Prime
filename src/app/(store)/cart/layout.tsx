import type { Metadata } from "next";

// The cart page is a client component, so its metadata lives in this segment layout.
export const metadata: Metadata = {
  title: "Your Basket",
  robots: { index: false, follow: true },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
