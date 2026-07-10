import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink',
        'transition-opacity hover:opacity-70 focus-visible:opacity-70',
        className,
      )}
      aria-label="Brian Kramer — home"
    >
      <span className="text-lg">Brian Kramer</span>
    </Link>
  );
}
