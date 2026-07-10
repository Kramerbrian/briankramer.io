import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
  interactive?: boolean;
}

export function GlassCard({
  className,
  children,
  as: Tag = 'div',
  interactive = false,
  ...rest
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-line bg-surface/70 backdrop-blur-xl shadow-glass',
        'transition-[border-color,box-shadow] duration-200 ease-out-quart',
        interactive && 'hover:border-line-strong hover:shadow-glass-lift focus-within:border-line-strong',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
