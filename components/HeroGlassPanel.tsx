import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroGlassPanelProps {
  className?: string;
}

/**
 * Hero portrait panel. Fills the hero's right column with Brian's portrait
 * (previously an empty frosted-glass mockup with no content). A strengthened
 * bottom scrim plus a solid backdrop chip behind the caption text guarantee
 * legible contrast regardless of the underlying photo's brightness.
 */
export function HeroGlassPanel({ className }: HeroGlassPanelProps) {
  return (
    <figure
      className={cn(
        'relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line shadow-glass',
        className,
      )}
      style={{ aspectRatio: '4 / 3' }}
    >
      <Image
        src="/images/brian-portrait-blue.jpg"
        alt="Brian Kramer"
        fill
        priority
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/0" />
      <figcaption className="absolute bottom-5 left-5 rounded-xl bg-ink/70 px-4 py-2.5 text-white backdrop-blur-sm">
        <p className="font-display text-base font-semibold leading-tight">Brian Kramer</p>
        <p className="text-sm text-white/90">Naples, Florida</p>
      </figcaption>
    </figure>
  );
}
