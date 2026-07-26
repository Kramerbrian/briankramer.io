'use client';

import { track } from '@vercel/analytics';

type ConversionEvent =
  | 'newsletter_signup'
  | 'book_waitlist_submit'
  | 'subscribe_linkedin_click'
  | 'contact_email_click';

type ConversionProperties = {
  location:
    | 'home_waitlist'
    | 'newsletter_page'
    | 'contact_page'
    | 'about_page'
    | 'contact_error'
    | 'home_waitlist_error';
  destination?: string;
};

export function trackConversion(event: ConversionEvent, properties: ConversionProperties) {
  track(event, properties);
}

