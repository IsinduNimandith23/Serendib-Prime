import { getFeaturedProducts } from "@/lib/data";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ValueProps } from "@/components/home/ValueProps";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ReelsSection } from "@/components/home/ReelsSection";
import { StorySection } from "@/components/home/StorySection";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <Hero products={featured.slice(0, 3)} />
      <Marquee />
      <FeaturedProducts products={featured} />
      <ValueProps />
      <HowItWorks />
      <ReelsSection />
      <StorySection />
      <Testimonials />
      <CTASection />
    </>
  );
}
