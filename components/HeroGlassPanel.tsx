import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroGlassPanelProps {
  className?: string;
}

/**
 * Hero portrait panel. Fills the hero's right column with Brian's portrait
 * (previously an empty frosted-glass mockup with no content). A subtle bottom
 * scrim keeps the caption legible across crops.
 */
export function HeroGlassPanel({ className }: HeroGlassPanelProps) {
  return (
    <figure
      className={cn(
        'relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line shadow-glass',
        className,
      )}
    >
      <Image
        src="/images/brian-portrait-blue.jpg"
        alt="Brian Kramer"
        fill
        priority
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/0 to-ink/0" />
      <figcaption className="absolute bottom-5 left-5 text-white">
        <p className="font-display text-base font-semibold leading-tight">Brian Kramer</p>
        <p className="text-sm text-white/80">Naples, Florida</p>
      </figcaption>
    </figure>
  );
}
