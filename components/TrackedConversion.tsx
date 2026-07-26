'use client';

import { useState } from 'react';
import type { AnchorHTMLAttributes, FormHTMLAttributes, ReactNode } from 'react';
import { trackConversion } from '@/lib/analytics';

type ConversionEvent =
  | 'newsletter_signup'
  | 'book_waitlist_submit'
  | 'subscribe_linkedin_click'
  | 'contact_email_click';

type Location =
  | 'home_waitlist'
  | 'newsletter_page'
  | 'contact_page'
  | 'about_page'
  | 'contact_error'
  | 'home_waitlist_error';

interface TrackedFormProps extends FormHTMLAttributes<HTMLFormElement> {
  event?: Extract<ConversionEvent, 'book_waitlist_submit'>;
  location?: Location;
  pendingLabel?: string;
  children: ReactNode;
}

interface TrackedAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  events: ConversionEvent[];
  location: Location;
  children: ReactNode;
}

export function TrackedForm({
  event,
  location,
  onSubmit,
  children,
  pendingLabel = 'Submitting...',
  ...props
}: TrackedFormProps) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      {...props}
      aria-busy={submitting}
      data-submitting={submitting ? 'true' : 'false'}
      onSubmit={(e) => {
        if (submitting) {
          e.preventDefault();
          return;
        }

        setSubmitting(true);
        if (event && location) {
          trackConversion(event, { location });
        }
        onSubmit?.(e);
      }}
    >
      {children}
      <span className="sr-only" role="status" aria-live="polite">
        {submitting ? pendingLabel : ''}
      </span>
    </form>
  );
}

export function TrackedAnchor({
  events,
  location,
  href,
  onClick,
  children,
  ...props
}: TrackedAnchorProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(e) => {
        for (const event of events) {
          trackConversion(event, { location, destination: href });
        }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
