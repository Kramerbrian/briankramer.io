import { cn } from '@/lib/utils';

interface HeroGlassPanelProps {
  className?: string;
}

export function HeroGlassPanel({ className }: HeroGlassPanelProps) {
  return (
    <div
      className={cn(
        'relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line',
        'bg-gradient-to-b from-hero-sky via-bg-alt to-hero-sand',
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute -right-16 top-6 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
      <div className="absolute inset-x-8 top-1/2 h-px bg-white/50" />
      <div className="absolute inset-x-10 bottom-10 h-40 rounded-2xl border border-white/50 bg-white/40 shadow-glass backdrop-blur-xl">
        <div className="absolute inset-x-6 top-6 h-px bg-white/60" />
        <div className="absolute inset-x-6 bottom-6 h-px bg-white/60" />
      </div>
    </div>
  );
}
