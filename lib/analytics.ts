'use client';

import { track } from '@vercel/analytics';

export type ConversionName =
  | 'newsletter_subscribe_click'
  | 'waitlist_submit'
  | 'contact_submit'
  | 'contact_mailto_click';

export type ConversionProps = {
  source?: string;
  topic?: string;
  destination?: string;
};

/**
 * Fire a named conversion to Vercel Analytics.
 * Call with `{ name, props }` — forms should only call after a successful POST.
 */
export function trackConversion(input: {
  name: ConversionName;
  props?: ConversionProps;
}) {
  track(input.name, input.props ?? {});
}
