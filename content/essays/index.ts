import type { TopicPillar } from '@/lib/streams/types';

export interface EssayEntry {
  slug: string;
  title: string;
  dek: string;
  topicPillar: TopicPillar;
  readingMinutes: number;
  publishDate: string;
  featured: boolean;
  body: string;
}

export const essays: EssayEntry[] = [
  {
    slug: 'ai-search-trust',
    title: "Why AI can't cite your VDP — and what it's costing you",
    dek: 'Structured data, canonical stability, and the invisible tax dealers pay when ChatGPT and Perplexity skip their inventory.',
    topicPillar: 'ai-search',
    readingMinutes: 7,
    publishDate: '2026-03-15',
    featured: true,
    body: `A customer asks ChatGPT: "Who's the best Toyota dealer near me?" The model answers with three store names. Yours is not one of them, and you may never see the missed consideration.

This isn't a ranking problem in the traditional sense. AI models don't crawl your site the way Googlebot does, score your backlinks, or weigh your Quality Score. They synthesize answers from structured data, third-party mentions, and content they can quote with confidence. If your digital footprint doesn't give them clean facts to lift, you don't exist in the answer.

## The VDP problem

Your Vehicle Detail Page is the atomic unit of dealer SEO. For AI visibility, it's worse than invisible — it's unstable.

Many dealer sites 404 or redirect the moment a vehicle sells. The URL that Perplexity indexed last Tuesday is a ghost page today. Models learn that your inventory is unreliable. They stop citing it.

The fix isn't complicated, but it requires your web provider to cooperate:

- Serve a "sold" state at the same canonical URL instead of redirecting to search results
- Include valid Product or Vehicle schema on every VDP — year, make, model, VIN, price, mileage, availability
- Keep titles human-readable, not templated noise like "2024 Toyota Camry SE 2.5L 4-Cyl FWD Sedan Stock #T24091"

Broken or missing schema is common enough to make an audit worthwhile. AI reads structured data first. If it's absent, the model moves on to your competitor's CarGurus listing.

## What AI models actually weight

Across repeated checks in ChatGPT, Perplexity, Gemini, and Google AI Overviews, a useful pattern is:

1. **Schema.org markup** on the homepage (AutoDealer or LocalBusiness with geo coordinates, hours, departments)
2. **About page content** written in complete sentences with real facts — ownership, history, awards, community involvement
3. **Third-party mentions** — local business journal profiles, chamber listings, industry press, podcast appearances
4. **Review volume and recency** on Google — not the star rating, the actual text
5. **Stable, citable URLs** that don't break when inventory turns

Notice what's not on the list: paid backlinks, keyword density, meta descriptions. AI search is a citation problem, not a keyword problem.

## The invisible tax

When AI skips your store, the cost doesn't show up in any dashboard. There's no "AI impression share" report in your DMS.

But you can estimate it. When shoppers begin with an AI query, every omission from an answer can remove a dealership from the consideration set before its team is contacted.

I call it the invisible tax. It doesn't hit your CRM. It hits your market share in the consideration set — the list of three stores a customer is willing to call. If you're not on that list, your BDC never gets the chance to blow the call.

## What to do this week

You don't need an agency for this. You need an afternoon and a browser you never use.

1. Open ChatGPT, Perplexity, and Gemini. Ask each: "Which are the best [your brand] dealers in [your city]?" Screenshot everything. That's your baseline.
2. Audit your homepage schema with Google's Rich Results Test. Fix what's broken.
3. Rewrite your about page as facts, not marketing. One paragraph on ownership. One on history. One on community. Complete sentences.
4. Pick three VDPs at random. Check schema, canonical URL, and what happens when the vehicle sells.
5. Set a monthly cadence to repeat step 1 and log the trend.

AI visibility isn't a project. It's a beat — the new local SEO. The dealers who show up in these answers in 2027 are the ones who started treating their digital footprint like a citable source of record in 2026.`,
  },
  {
    slug: 'service-drive-acquisition',
    title: 'Service drive is a search problem, not a sales problem',
    dek: 'Why the best acquisition programs look like SREs at work, not appraisers with clipboards.',
    topicPillar: 'acquisition',
    readingMinutes: 6,
    publishDate: '2026-02-28',
    featured: true,
    body: `Every day, trade-ready vehicles roll through your service drive. Many stores let them roll right back out. The ones that don't treat acquisition like infrastructure — not sales.

The difference is framing. Sales thinks about the deal on the floor. Infrastructure thinks about the funnel: how many vehicles enter the lane, how many get appraised, how many get an offer, how many close, and what the gross looks like per unit at each stage.

## The lane is a search index

Think about your service drive the way an SRE thinks about a search index. Vehicles arrive (indexed). Some match your buy criteria (retrieved). Your buyer makes an offer (ranked). The customer accepts or rejects (clicked or bounced).

If you can't see each stage separately, you can't optimize it. And most stores can't see it at all. Service-drive acquisition gets lumped into "used-car buying" on the same report as auction purchases and street buys. Different economics, same line item.

That's like reporting organic search traffic and paid traffic as one number. You'd never do that in digital. Don't do it in acquisition.

## The 90-second SLA

The single highest-leverage change I've seen: a 90-second SLA from RO write-up to used-car buyer notification.

Your service advisor writes the ticket. Your used-car team decides whether that vehicle is worth an offer. Those two people almost never talk. Fix that first.

Every RO over a threshold defined by the store gets a text with year, make, model, mileage, and VIN to a used-car buyer before the customer leaves the write-up desk. Not a batch at end of day. Not a sticky note on the dispatcher's monitor. A text, in 90 seconds.

The buyer doesn't need to close on the drive. They need to plant the seed. Walk out, introduce themselves, hand the customer a printed number. That's the offer window.

## Equity math in real time

The offer itself should be informed by auto-decoded VIN data, book value, and remaining payoff or KBB trade — calculated in real time, not pulled from a binder.

When the equity signal supports an offer, make the offer while the relationship is warm. The math takes 30 seconds with the right tools. The hesitation takes weeks when you do it manually.

## Give the advisor a stake

Your service advisor is not paid to sell you cars. They are paid to sell hours and parts. If you want their attention on acquisition, they need a defined spiff per vehicle acquired through their lane. The amount should be tested and governed locally.

The operating hypothesis is that aligned incentives and a visible response timer can improve drive-sourced acquisition. Measure the result locally before generalizing it.

## Follow up in 48 hours

The customer left thinking about the offer. Their spouse got home. The number percolated. Two days is the sweet spot: past the emotional reflex to say no, before the moment fades.

Anything longer and you're competing with CarMax again. The service drive gave you a warm lead with built-in trust — they already do business with you. Don't squander that with a seven-day follow-up cadence designed for cold internet leads.

## Report it as its own channel

Service-drive acquisition needs its own funnel, its own economics, and its own weekly report. Offers made, offers accepted, close rate, gross per unit.

Use the channel report to diagnose offer quality and follow-up speed. Do not apply a universal close-rate threshold without a defined, comparable dataset.

If you can't see it separately, you can't manage it. And you'll default back to auction — which is where margin goes to die.

The service drive isn't a sales problem. It's a search problem. Treat it like one.`,
  },
];

export function getAllEssays(): EssayEntry[] {
  return [...essays].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}

export function getEssay(slug: string): EssayEntry | undefined {
  return essays.find((e) => e.slug === slug);
}

export function getEssaySlugs(): string[] {
  return essays.map((e) => e.slug);
}
