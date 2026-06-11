"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { IconPlay, IconVolume, IconVolumeOff } from "@/components/icons";

const REELS = [
  {
    src: "/reels/reel-1.mp4",
    title: "Tempering the sprats",
    caption: "Hand-ground spices hit the pan - this is where the flavour starts.",
  },
  {
    src: "/reels/reel-2.mp4",
    title: "Sealed at the peak",
    caption: "Each batch goes into the tin the same day it leaves the fire.",
  },
  {
    src: "/reels/reel-3.mp4",
    title: "Two minutes to table",
    caption: "Open, warm and serve with rice - dinner, done the island way.",
  },
];

export function ReelsSection() {
  // Only one reel plays at a time; starting one pauses whichever was playing.
  const activeVideo = useRef<HTMLVideoElement | null>(null);

  return (
    <section className="bg-night py-20 sm:py-24">
      <Container>
        <SectionHeading
          light
          eyebrow="Straight from the pan"
          title="Watch it come together"
          intro="Short clips from our Colombo kitchen - the tempering, the sealing, and the two-minute plate at the end."
        />
        <Stagger className="mt-14 grid grid-cols-[minmax(0,19rem)] justify-center gap-6 sm:grid-cols-[repeat(3,minmax(0,19rem))] lg:gap-10">
          {REELS.map((reel) => (
            <StaggerItem key={reel.src}>
              <ReelCard reel={reel} activeVideo={activeVideo} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function ReelCard({
  reel,
  activeVideo,
}: {
  reel: (typeof REELS)[number];
  activeVideo: React.RefObject<HTMLVideoElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (activeVideo.current && activeVideo.current !== video) {
        activeVideo.current.pause();
      }
      activeVideo.current = video;
      void video.play();
    } else {
      video.pause();
    }
  }

  return (
    <div className="group relative aspect-9/16 overflow-hidden rounded-3xl border border-cream/15 bg-spice-dark shadow-lg">
      <video
        ref={videoRef}
        src={reel.src}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? `Pause ${reel.title}` : `Play ${reel.title}`}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className={cn(
            "flex h-13 w-13 items-center justify-center rounded-full bg-cream/90 text-spice shadow-lg backdrop-blur transition-all duration-300",
            playing ? "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-0" : "scale-100 opacity-100",
          )}
        >
          <IconPlay className="ml-0.5 h-6 w-6" />
        </span>
      </button>

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-night/60 text-cream backdrop-blur transition-colors hover:bg-night/80"
      >
        {muted ? <IconVolumeOff className="h-4 w-4" /> : <IconVolume className="h-4 w-4" />}
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-night/85 to-transparent px-4 pb-4 pt-12">
        <p className="font-display text-base font-semibold text-cream">{reel.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-cream/75">{reel.caption}</p>
      </div>
    </div>
  );
}
