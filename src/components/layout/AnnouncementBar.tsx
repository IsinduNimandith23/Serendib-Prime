import { IconTruck } from "@/components/icons";

export function AnnouncementBar() {
  return (
    <div className="bg-night text-cream">
      <div className="flex items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-[0.8rem]">
        <IconTruck className="h-4 w-4 text-gold" />
        <span>
          Free islandwide delivery over <strong className="font-semibold">Rs 5,000</strong>
          <span className="mx-2 opacity-40">·</span>
          Freshly sealed, shipped within 24 hours
        </span>
      </div>
    </div>
  );
}
