import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: 'Brian Kramer',
  title: 'Brian Kramer — EVP, Cars Commerce',
  description:
    'EVP at Cars Commerce focused on dealer growth and success. Career GM and executive tenure in automotive retail. Writing The Best End User.',
  url: 'https://www.briankramer.io',
  ogImage: 'https://www.briankramer.io/opengraph-image',
  author: {
    name: 'Brian Kramer',
    role: 'EVP, Cars Commerce · Dealer Growth & Success',
    location: 'Naples, Florida',
    email: 'bkramer@cars.com',
  },
  socials: {
    linkedin: 'https://www.linkedin.com/in/kramerbrian/',
    linktree: 'https://linktr.ee/briankramer',
    youtube: 'https://www.youtube.com/@briankramer',
    instagram: 'https://www.instagram.com/kramerbrian/',
    tiktok: 'https://www.tiktok.com/@kramerbrian',
    facebook: 'https://www.facebook.com/briankramerfl',
    clubhouse: 'https://www.clubhouse.com/@briankramer',
  },
} as const;
