import type { TopicPillar } from '@/lib/streams/types';

export interface EssaySource {
  label: string;
  url: string;
}

export interface EssayEntry {
  slug: string;
  title: string;
  dek: string;
  topicPillar: TopicPillar;
  publishDate: string;
  featured: boolean;
  body: string;
  /**
   * Named external sources for claims made in the body. Only add a source
   * when it is real, independently verifiable, and directly supports a
   * specific claim in the text — do not add for essays with no externally
   * checkable claim just to have a citation.
   */
  sources?: EssaySource[];
}

/**
 * Reading time is derived from the actual body, never hand-entered. A static
 * number drifts from the real word count the moment either changes and
 * silently overstates depth (previously every essay claimed 6-7 min
 * regardless of length, including 346-word pieces at roughly 2 min).
 * 200 wpm, rounded up, floor of 2 min so short pieces don't read as trivial.
 */
const WORDS_PER_MINUTE = 200;
const MIN_READING_MINUTES = 2;

export function getReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(MIN_READING_MINUTES, Math.ceil(words / WORDS_PER_MINUTE));
}

export const essays: EssayEntry[] = [
  {
    slug: 'ai-search-trust',
    title: "Why AI can't cite your VDP — and what it's costing you",
    dek: 'Structured data, canonical stability, and the invisible tax dealers pay when ChatGPT and Perplexity skip their inventory.',
    topicPillar: 'ai-search',
    publishDate: '2026-03-15',
    featured: true,
    body: `A customer asks ChatGPT: "Who's the best Toyota dealer near me?" The model answers with a short list of store names. Yours is not one of them, and you may never see the missed consideration.

This isn't a ranking problem in the traditional sense. AI models don't crawl your site the way Googlebot does, score your backlinks, or weigh your Quality Score. They synthesize answers from structured data, third-party mentions, and content they can quote with confidence. If your digital footprint doesn't give them clean facts to lift, you don't exist in the answer.

## The VDP problem

Your Vehicle Detail Page is the atomic unit of dealer SEO. For AI visibility, it's worse than invisible — it's unstable.

Some dealer sites 404 or redirect the moment a vehicle sells. A URL that Perplexity indexed recently can become a ghost page later. Models learn that your inventory is unreliable. They stop citing it.

The fix isn't complicated, but it requires your web provider to cooperate:

- Serve a "sold" state at the same canonical URL instead of redirecting to search results
- Include valid Product or Vehicle schema on every VDP — year, make, model, VIN, price, mileage, availability
- Keep titles human-readable instead of templated inventory noise

Broken or missing schema is common enough to make an audit worthwhile. Structured data is one of the machine-readable inputs models can use. If it's absent, the model may move on to a source it can parse with more confidence.

## What AI models actually weight

Across repeated checks in ChatGPT, Perplexity, Gemini, and Google AI Overviews, a useful pattern is:

- **Schema.org markup** on the homepage (AutoDealer or LocalBusiness with geo coordinates, hours, departments)
- **About page content** written in complete sentences with real facts — ownership, history, awards, community involvement
- **Third-party mentions** — local business journal profiles, chamber listings, industry press, podcast appearances
- **Review volume and recency** on Google — not the star rating, the actual text
- **Stable, citable URLs** that don't break when inventory turns

Notice what's not on the list: paid backlinks, keyword density, meta descriptions. AI search is a citation problem, not a keyword problem.

## The invisible tax

When AI skips your store, the cost doesn't show up in any dashboard. There's no "AI impression share" report in your DMS.

But you can estimate it. When shoppers begin with an AI query, every omission from an answer can remove a dealership from the consideration set before its team is contacted.

I call it the invisible tax. It doesn't hit your CRM. It hits your market share in the consideration set — the stores a customer is willing to call. If you're not on that list, your BDC never gets the chance to blow the call.

## What to do this week

You don't need an agency for this. You need an afternoon and a browser you never use.

- Open ChatGPT, Perplexity, and Gemini. Ask each: "Which are the best [your brand] dealers in [your city]?" Screenshot everything. That's your baseline.
- Audit your homepage schema with Google's Rich Results Test. Fix what's broken.
- Rewrite your about page as facts, not marketing. Include ownership, history, and community proof in complete sentences.
- Pick a few VDPs at random. Check schema, canonical URL, and what happens when the vehicle sells.
- Set a monthly cadence to repeat the probe and log the trend.

AI visibility isn't a project. It's a beat — the new local SEO. Dealers who treat their digital footprint like a citable source of record now are positioned to show up in these answers later.`,
    sources: [
      {
        label: 'Google Search Central — Rich Results Test',
        url: 'https://developers.google.com/search/docs/appearance/structured-data',
      },
    ],
  },
  {
    slug: 'service-drive-acquisition',
    title: 'Service drive is a search problem, not a sales problem',
    dek: 'Why strong acquisition programs look like SREs at work, not appraisers with clipboards.',
    topicPillar: 'acquisition',
    publishDate: '2026-02-28',
    featured: true,
    body: `Every day, trade-ready vehicles roll through your service drive. Many stores let them roll right back out. The ones that don't treat acquisition like infrastructure — not sales.

The difference is framing. Sales thinks about the deal on the floor. Infrastructure thinks about the funnel: how many vehicles enter the lane, how many get appraised, how many get an offer, how many close, and what the gross looks like per unit at each stage.

## The lane is a search index

Think about your service drive the way an SRE thinks about a search index. Vehicles arrive (indexed). Some match your buy criteria (retrieved). Your buyer makes an offer (ranked). The customer accepts or rejects (clicked or bounced).

If you can't see each stage separately, you can't optimize it. And many stores can't see it at all. Service-drive acquisition gets lumped into "used-car buying" on the same report as auction purchases and street buys. Different economics, same line item.

That's like reporting organic search traffic and paid traffic as one number. You'd never do that in digital. Don't do it in acquisition.

## A fast response SLA

One operating change that has paid off in stores I've run: a short SLA from RO write-up to used-car buyer notification — about 90 seconds is an illustrative target when the lane allows it, not a universal benchmark.

Your service advisor writes the ticket. Your used-car team decides whether that vehicle is worth an offer. Those two people almost never talk. Fix that first.

Every RO over a threshold defined by the store gets a text with year, make, model, mileage, and VIN to a used-car buyer before the customer leaves the write-up desk. Not a batch at end of day. Not a sticky note on the dispatcher's monitor. A text, while the customer is still at the desk.

The buyer doesn't need to close on the drive. They need to plant the seed. Walk out, introduce themselves, hand the customer a printed number. That's the offer window.

## Equity math in real time

The offer itself should be informed by auto-decoded VIN data, book value, and remaining payoff or KBB trade — calculated in real time, not pulled from a binder.

When the equity signal supports an offer, make the offer while the relationship is warm. With the right tools, the math is quick enough to happen in the moment. The hesitation takes weeks when you do it manually.

## Give the advisor a stake

Your service advisor is not paid to sell you cars. They are paid to sell hours and parts. If you want their attention on acquisition, they need a defined spiff per vehicle acquired through their lane. The amount should be tested and governed locally.

The operating hypothesis is that aligned incentives and a visible response timer can improve drive-sourced acquisition. Measure the result locally before generalizing it.

## Follow up while the offer is still warm

The customer left thinking about the offer. Their spouse got home. The number percolated. In practice, prompt follow-up while the relationship is still warm often beats both an immediate hard close and a cold call after the moment has faded.

Anything longer and you're competing with CarMax again. The service drive gave you a warm lead with built-in trust — they already do business with you. Don't squander that with a long follow-up cadence designed for cold internet leads.

## Report it as its own channel

Service-drive acquisition needs its own funnel, its own economics, and its own weekly report. Offers made, offers accepted, close rate, gross per unit.

Use the channel report to diagnose offer quality and follow-up speed. Do not apply a universal close-rate threshold without a defined, comparable dataset.

If you can't see it separately, you can't manage it. And you'll default back to auction — which is where margin goes to die.

The service drive isn't a sales problem. It's a search problem. Treat it like one.`,
  },
  {
    slug: 'look-to-book',
    title: 'The Look-to-Book number every dealer should track',
    dek: 'You know your close rate on retail. Do you know your close rate on appraisal? That gap is still under-measured in used-car acquisition.',
    topicPillar: 'appraisal',
    publishDate: '2026-02-10',
    featured: false,
    body: `Every 20-group meeting talks about closing ratio on retail traffic. Almost nobody talks about closing ratio on appraisal traffic. That silence is expensive.

Look-to-Book is the appraisal equivalent of close rate. A Look is any customer who received a real appraisal number — walk-in, phone, online tool, service drive, doesn't matter. A Book is any Look that ended in you owning the vehicle. Trade, pure buy, private-party purchase — all count.

If you can't define those two words without arguing, you don't have a metric. You have a vibe.

## Instrument the top of the funnel

Every appraiser writes down every appraisal. Even the ones that don't buy. Even the ones you don't want. Especially those.

Your rejections are as diagnostic as your wins. A store that only logs the cars it books is measuring vanity, not process.

The report is simple: Looks, Books, Look-to-Book rate, by appraiser, weekly. Not a punishment. A mirror. Illustrative only: one store's spread might show a strong appraiser materially ahead of a weaker one — your numbers will differ. The gap is training, judgment, and confidence — all coachable.

## Separate the losses

A walk is the customer choosing to keep their vehicle. That's usually a pricing problem — you didn't stretch, or you didn't explain the number.

A loss to a competitor is a market problem — someone else stretched harder, or moved faster, or earned more trust before the number landed.

Different diagnoses. Different fixes. If you lump them together as "didn't buy," you will coach the wrong thing.

## Set a floor and a ceiling — then prove them locally

Under-measured stores often bid scared. Over-measured stores sometimes overpay or get lucky and call it skill.

I won't hand you a universal healthy range. Ranges only matter when they come from your inventory strategy, your market, and a comparable dataset. Build the report first. Then set a floor and a ceiling your UCM can defend in the meeting.

## Treat it like Close Ratio

Bring Look-to-Book to the same table where you argue retail close rate. Same cadence. Same ownership. Same expectation that a number without a name next to it is theater.

Used cars are an appraisal game dressed up as a sales game. Measure the game you're actually playing.`,
  },
  {
    slug: 'digital-trust-audit',
    title: 'The digital trust audit: what your store looks like before a customer walks in',
    dek: 'Many shoppers form a dealer preference before they call. If you have not audited what they see, you are running blind.',
    topicPillar: 'trust',
    publishDate: '2026-01-22',
    featured: false,
    body: `Trust used to be a handshake on the lot. Now it is a first-screen problem.

Shoppers read reviews. Many of them form a dealer preference before they call. That means your Google presence, your phone greeting, and your VDP are not marketing assets. They are the front door.

If you have not audited what a stranger sees, you are managing the store you remember — not the store the market is shopping.

## Search yourself like a customer

Incognito. Phone. A browser you never use.

Type the store name. Type "[make] dealer near me." Type "[store name] reviews." Screenshot the first screen. That screen is your storefront now.

Then read a recent block of Google reviews out loud. Not the star rating — the words. Themes over headlines. If several people name the same salesperson in bad reviews, that is data. If several mention the F&I upsell, that is data.

## Answer the old ones

Respond to unanswered reviews that have aged past your response SLA. Especially the negative ones. Especially the old ones.

A public, specific, non-defensive response to an old negative review often does more for future shoppers than another round of paid media. Silence reads as agreement.

## Audit the phone and the VDP

Call your own BDC. Sales, service, parts. From an unknown number. Time the pickup. Grade the greeting. Note whether they got your name, your vehicle, and a callback number.

Then pick a few used vehicles at random. Look at the VDP as a stranger would. Are the photos in? Is the price the price, or is it a number after unadvertised fees? Is there a walk-around? Would you buy this vehicle from this listing?

Many stores discover they are not as good as their brand story claims. That discovery is the point.

## Fix a small set of things this quarter

Don't try to fix everything. Pick the most-mentioned problems from the audit and put a person's name against each with a short, dated deadline. Then re-run the audit.

Trust is a compounding practice, not a project. Bad reviews are not just a marketing problem; they can become a paid-media drag. Trust compounds. The lack of it compounds faster.`,
  },
  {
    slug: 'paperless-lessons',
    title: 'What paperless actually taught me about dealer operations',
    dek: 'Helping lead an early end-to-end paperless transaction was never about the PDF. It was about removing friction that operators had learned to live with.',
    topicPillar: 'digital-transformation',
    publishDate: '2025-12-12',
    featured: false,
    body: `I helped lead what we believed was an early end-to-end paperless automotive transaction. People still ask me about the tech stack. That is the wrong question.

Paperless was never about the PDF. It was about forcing every step of the deal to justify why it still required a printer, a wet signature, or a file cabinet.

## Friction is a process confession

Every piece of paper in a dealership is a confession that systems do not talk, or that a person does not trust the system, or that a compliance step was designed for a world that no longer exists.

When you remove the paper, you do not remove the work. You expose it. The desk that "always needed a wet signature" suddenly has to explain why. The F&I process that "couldn't be digital" has to name the real blocker — product, policy, habit, or fear.

That exposure is the value. The software is just the flashlight.

## Operators, not IT, own the outcome

The stores that made paperless stick treated it as an operating change with a named owner on the floor. The stores that stalled treated it as an IT project with a go-live date and a hope.

Same tools. Different ownership. Different result.

If your GM cannot explain the new deal flow quickly and clearly, you do not have a digital process. You have a pilot.

## Trust travels with the customer

Customers did not celebrate paperless because it was modern. They celebrated it because it was clearer. Fewer surprises. Fewer "we need you to come back and sign this." Fewer moments where the deal felt like a maze designed for the store's convenience.

Clarity is a trust product. Paper was often the fog.

## What comes after paperless

Paperless was table stakes. The next fight is AI-native retail — structured data, stable URLs, citation-ready facts, and decision systems that help operators move faster without guessing.

The lesson still holds: do not buy the tool to look current. Buy the change that removes an excuse. Then measure whether the excuse is actually gone.`,
  },
  {
    slug: 'dealer-ai-schema',
    title: 'Dealer AI schema: the boring work that decides if ChatGPT names you',
    dek: 'Structured data is one of the machine-readable inputs models can use. In audits I have run, broken or missing schema is common enough to treat as a design problem, not a marketing problem.',
    topicPillar: 'ai-search',
    publishDate: '2026-01-08',
    featured: false,
    body: `When a shopper asks ChatGPT or Perplexity for the best dealer in town, the model does not care about your billboard. It cares whether it can lift clean facts about you with confidence.

Schema is how you hand those facts over. Boring. Technical. Decisive.

## Start with the homepage contract

Your homepage should serve valid AutoDealer or LocalBusiness markup: name, address, phone, hours, geo coordinates, department information. Not a marketing paragraph pretending to be data. Actual structured fields a model can parse.

Run Google's Rich Results Test. Fix what is broken. In dealer-site audits I have run, broken or missing schema shows up often enough that I treat the check as non-optional. If the model cannot trust your identity block, it will cite someone else's.

## Make the about page quotable

The about page is high-leverage content for AI visibility. Write facts in complete sentences: ownership, history, community involvement, awards, staff.

Not brand poetry. Facts a model can lift and attribute. If your about page could belong to any store in the group after a find-and-replace, it will not help you get named.

## Stabilize the VDP

Canonical URLs. Valid Product or Vehicle schema. Clean titles. A sold state at the same URL instead of a 404 the moment the car leaves.

AI trains on what it can revisit. Ghost pages teach models that your inventory is unreliable. Unreliable sources get skipped.

## Third-party proof still matters

Schema gets you into the conversation. Third-party mentions help you win it — local business journals, chamber listings, industry press, podcast appearances, awards with your store name and city attached.

A clear third-party mention often beats a pile of paid backlinks the model does not trust.

## Re-check monthly

Ask the models the same questions every month. Screenshot the answers. Log whether you are named more, less, or not at all. Watch competitors.

AI visibility is not a one-time SEO ticket. It is a beat. Dealers who treat schema like a living operating surface are better positioned to show up in the answers. Dealers who treat it like a web-provider checkbox keep paying the invisible tax.`,
    sources: [
      {
        label: 'Google Search Central — Rich Results Test',
        url: 'https://developers.google.com/search/docs/appearance/structured-data',
      },
    ],
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
