'use client';

import { useState } from 'react';
import type { AnchorHTMLAttributes, FormHTMLAttributes, ReactNode } from 'react';
import { trackConversion, type ConversionName, type ConversionProps } from '@/lib/analytics';

type SuccessConversion =
  | {
      name: 'waitlist_submit';
      props: { source: string };
    }
  | {
      name: 'contact_submit';
      /** Read topic from this FormData field after a successful POST. */
      topicFromField: string;
    };

interface TrackedFormProps extends FormHTMLAttributes<HTMLFormElement> {
  successConversion?: SuccessConversion;
  pendingLabel?: string;
  children: ReactNode;
}

interface TrackedAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  conversion: {
    name: ConversionName;
    props?: ConversionProps;
  };
  children: ReactNode;
}

function isSuccessRedirect(location: string): boolean {
  try {
    const url = new URL(location, window.location.origin);
    return url.searchParams.get('waitlist') === '1' || url.searchParams.get('sent') === '1';
  } catch {
    return false;
  }
}

function fireSuccessConversion(conversion: SuccessConversion, formData: FormData) {
  if (conversion.name === 'waitlist_submit') {
    trackConversion({ name: 'waitlist_submit', props: conversion.props });
    return;
  }
  trackConversion({
    name: 'contact_submit',
    props: { topic: String(formData.get(conversion.topicFromField) ?? '') },
  });
}

/**
 * Form wrapper that only tracks conversions after a successful POST redirect
 * (`?waitlist=1` or `?sent=1`). Native validation still blocks invalid submits
 * before fetch runs; click alone never fires a conversion.
 */
export function TrackedForm({
  successConversion,
  onSubmit,
  children,
  pendingLabel = 'Submitting...',
  action,
  method = 'post',
  ...props
}: TrackedFormProps) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      {...props}
      action={action}
      method={method}
      aria-busy={submitting}
      data-submitting={submitting ? 'true' : 'false'}
      onSubmit={(e) => {
        if (submitting) {
          e.preventDefault();
          return;
        }

        // Allow callers to short-circuit (tests); otherwise take over submit.
        onSubmit?.(e);
        if (e.defaultPrevented) {
          return;
        }

        e.preventDefault();
        setSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const actionUrl =
          typeof action === 'string' && action.length > 0
            ? action
            : form.getAttribute('action') || window.location.href;

        void (async () => {
          try {
            const res = await fetch(actionUrl, {
              method: (method || 'post').toString().toUpperCase(),
              body: formData,
              redirect: 'manual',
            });

            const location = res.headers.get('Location');
            if (location) {
              if (successConversion && isSuccessRedirect(location)) {
                fireSuccessConversion(successConversion, formData);
              }
              window.location.assign(new URL(location, window.location.origin).toString());
              return;
            }

            // JSON or unexpected response — treat 2xx as success for non-redirect clients.
            if (res.ok && successConversion) {
              fireSuccessConversion(successConversion, formData);
            }
            window.location.reload();
          } catch {
            setSubmitting(false);
          }
        })();
      }}
    >
      {children}
      <span className="sr-only" role="status" aria-live="polite">
        {submitting ? pendingLabel : ''}
      </span>
    </form>
  );
}

/** Anchor click tracking — does not preventDefault; navigation proceeds normally. */
export function TrackedAnchor({
  conversion,
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
        trackConversion({
          name: conversion.name,
          props: {
            ...conversion.props,
            ...(href ? { destination: href } : {}),
          },
        });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
