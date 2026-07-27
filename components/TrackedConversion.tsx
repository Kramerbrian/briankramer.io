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
  /** Inline banner text shown immediately once a successful submit is confirmed. */
  successMessage?: string;
  /** Inline banner text shown immediately once a failed submit is confirmed. */
  errorMessage?: string;
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

function isErrorRedirect(location: string): boolean {
  try {
    const url = new URL(location, window.location.origin);
    return url.searchParams.get('waitlist') === 'error' || url.searchParams.get('sent') === 'error';
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
 *
 * Also exposes `data-result` ("success" | "error" | "idle") on the form as
 * soon as the response is known, and renders an inline banner immediately —
 * so a confirmation is visible even before any redirect/reload completes.
 */
export function TrackedForm({
  successConversion,
  onSubmit,
  children,
  pendingLabel = 'Submitting...',
  successMessage,
  errorMessage,
  action,
  method = 'post',
  ...props
}: TrackedFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');

  return (
    <form
      {...props}
      action={action}
      method={method}
      aria-busy={submitting}
      data-submitting={submitting ? 'true' : 'false'}
      data-result={result}
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
        setResult('idle');

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
              const succeeded = isSuccessRedirect(location);
              const failed = isErrorRedirect(location);
              if (succeeded && successConversion) {
                fireSuccessConversion(successConversion, formData);
              }
              // Surface the outcome immediately, then follow the redirect.
              setResult(succeeded ? 'success' : failed ? 'error' : 'idle');
              window.location.assign(new URL(location, window.location.origin).toString());
              return;
            }

            // JSON or unexpected response — treat 2xx as success for non-redirect clients.
            if (res.ok && successConversion) {
              fireSuccessConversion(successConversion, formData);
            }
            setSubmitting(false);
            setResult(res.ok ? 'success' : 'error');
            if (res.ok) {
              window.location.reload();
            }
          } catch {
            setSubmitting(false);
            setResult('error');
          }
        })();
      }}
    >
      {children}
      <span className="sr-only" role="status" aria-live="polite">
        {submitting ? pendingLabel : ''}
      </span>
      {result === 'success' && successMessage && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-2xl border border-accent/30 bg-accent-soft px-5 py-4 text-sm text-ink"
        >
          {successMessage}
        </p>
      )}
      {result === 'error' && errorMessage && (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-4 rounded-2xl border border-line bg-surface-muted px-5 py-4 text-sm text-ink-muted"
        >
          {errorMessage}
        </p>
      )}
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
