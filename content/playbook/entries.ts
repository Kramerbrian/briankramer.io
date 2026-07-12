export interface PlaybookStep {
  n: number;
  headline: string;
  detail: string;
}

export interface PlaybookEntry {
  slug: string;
  pillar: 'acquisition' | 'appraisal' | 'trust' | 'ai-search';
  title: string;
  dek: string;
  audience: string;
  timeToRun: string;
  steps: PlaybookStep[];
}

/**
 * Unpublished source material. Public /playbook routes are coming-soon / notFound.
 * Held benchmarks and universal thresholds must stay out of public UI.
 */
export const playbookEntries: PlaybookEntry[] = [
  {
    slug: 'service-drive-sourcing',
    pillar: 'acquisition',
    title: 'Service-drive sourcing: the acquisition channel you already own',
    dek: 'Every day, trade-ready vehicles roll through your service drive. Many stores let them roll right back out.',
    audience: 'GM, UCM, Service Director, Acquisition Manager',
    timeToRun: 'Two weeks to install; short daily run cadence once live',
    steps: [
      {
        n: 1,
        headline: 'Get every RO through a used-car eye before it leaves the lane.',
        detail:
          'Your service advisors write the ticket. Your used-car team decides whether that vehicle is worth an offer. Those two people almost never talk. Fix that first. Set a short SLA from write-up to buyer notification (illustrative operator cadence: about 90 seconds when the lane allows). Every RO over a store-defined threshold gets a text with year/make/model/mileage/VIN to a used-car buyer before the customer leaves the write-up desk.',
      },
      {
        n: 2,
        headline: 'Run the equity math in real time.',
        detail:
          "Auto-decode the VIN, pull your book value, compare against remaining payoff or KBB trade. When equity supports an offer, make it while the relationship is warm — not to close on the drive, to plant the seed. Your buyer walks out, introduces themselves, hands the customer a printed number. That's the offer window.",
      },
      {
        n: 3,
        headline: 'Give the service advisor a stake.',
        detail:
          'The advisor is not paid to sell you cars. They are paid to sell hours and parts. If you want their attention, they need a defined spiff on any vehicle acquired through their lane. Amount should be tested and governed locally — do not publish a universal dollar band.',
      },
      {
        n: 4,
        headline: 'Follow up while the offer is still warm.',
        detail:
          'The customer left the store thinking about the offer. Their spouse got home. The number percolated. An illustrative cadence is follow-up within about two days — prove the window locally. Anything much longer and you are competing with CarMax again.',
      },
      {
        n: 5,
        headline: 'Track close rate on drive-sourced offers, not just volume.',
        detail:
          'How many offers made, how many accepted, gross per unit. Diagnose offer quality and follow-up speed from the channel report. Do not apply a universal close-rate floor, ceiling, or healthy band without a defined comparable dataset.',
      },
      {
        n: 6,
        headline: 'Report it as its own channel.',
        detail:
          "Service-drive acquisition is not 'used-car buying.' It has its own funnel, its own economics, its own weekly report. If you can't see it separately, you can't manage it. And you'll default back to auction — which is where margin goes to die.",
      },
    ],
  },
  {
    slug: 'look-to-book',
    pillar: 'appraisal',
    title: 'The Look-to-Book number every dealer should track',
    dek: 'You know your close rate on retail. Do you know your close rate on appraisal? That gap is still under-measured in used-car acquisition.',
    audience: 'UCM, GM',
    timeToRun: 'One afternoon to build the report; ongoing discipline daily',
    steps: [
      {
        n: 1,
        headline: 'Define "Look" and "Book" without ambiguity.',
        detail:
          'A "Look" is any customer who received a real appraisal number — walked, phoned, online tool, service drive, doesn\'t matter. A "Book" is any Look that ended in you owning the vehicle. Retail purchase from a private party, trade at time of sale, pure buy, all count.',
      },
      {
        n: 2,
        headline: 'Instrument the top of the funnel.',
        detail:
          "Every appraiser writes down every appraisal, even the ones that don't buy from you. Even the ones you don't want. Especially those. Because your rejections are as diagnostic as your wins.",
      },
      {
        n: 3,
        headline: 'Publish the Look-to-Book rate weekly, by appraiser.',
        detail:
          'Not a punishment. A mirror. Spreads between appraisers are usually coachable — training, judgment, and confidence. Do not publish illustrative percentages as universal benchmarks.',
      },
      {
        n: 4,
        headline: "Separate 'walk' losses from 'lose to competitor' losses.",
        detail:
          "A walk is the customer choosing to keep their vehicle. That's usually a pricing problem — you didn't stretch. A loss to a competitor is a market problem — someone else stretched harder. Different diagnoses, different fixes.",
      },
      {
        n: 5,
        headline: 'Set a floor and a ceiling — then prove them locally.',
        detail:
          'Build the report first. Then set a floor and a ceiling your UCM can defend in the meeting. Universal Look-to-Book healthy ranges are retired doctrine and must not be published.',
      },
      {
        n: 6,
        headline: 'Treat Look-to-Book like Close Ratio.',
        detail:
          'Bring Look-to-Book to the same table where you argue retail close rate. Same cadence. Same ownership. Same expectation that a number without a name next to it is theater.',
      },
    ],
  },
  {
    slug: 'digital-trust-audit',
    pillar: 'trust',
    title: 'The digital trust audit: what your store looks like before a customer walks in',
    dek: 'Many shoppers form a dealer preference before they call. If you have not audited what they see, you are running blind.',
    audience: 'GM, Marketing Director, Fixed Ops Director',
    timeToRun: 'Half a day quarterly. First one takes longer.',
    steps: [
      {
        n: 1,
        headline: 'Search your store the way a customer would, on a browser you never use.',
        detail:
          "Incognito, phone. Type the store name. Type '<make> dealer near me.' Type '<store name> reviews.' Take screenshots. That first screen is your storefront now.",
      },
      {
        n: 2,
        headline: 'Read a recent block of Google reviews out loud.',
        detail:
          'Not the star rating — the actual words. Note the recurring specifics. Themes over headlines. Repeated named complaints are data.',
      },
      {
        n: 3,
        headline: 'Respond to unanswered reviews that have aged past your SLA.',
        detail:
          'Especially the negative ones. Especially the old ones. A public, specific, non-defensive response to an old one-star review often does more for future shoppers than another round of paid media.',
      },
      {
        n: 4,
        headline: 'Audit the phone experience.',
        detail:
          'Call your own BDC. Sales, service, parts. From an unknown number. Time the pickup. Grade the greeting. Note whether they got your name, your vehicle, your callback number.',
      },
      {
        n: 5,
        headline: 'Check the VDP.',
        detail:
          'Pick a few used vehicles at random. Look at the VDP as a stranger would. Are the photos in? Is the price the price, or a number after unadvertised fees? Is there a video walk-around? Would you buy this vehicle from this listing?',
      },
      {
        n: 6,
        headline: 'Score your trust surface. Set two things to fix this quarter.',
        detail:
          "Don't try to fix everything. Pick the two most-mentioned problems from steps 2-5 and put a person's name against each with a short, dated deadline. Then re-run the audit. This is a compounding practice, not a project.",
      },
    ],
  },
  {
    slug: 'ai-search-quick-start',
    pillar: 'ai-search',
    title: 'AI search visibility quick-start: showing up when ChatGPT recommends a dealer',
    dek: 'Perplexity, ChatGPT, Gemini, and Google AI Overviews already answer shopper questions about local dealers. Whether they mention you is a design problem, not a marketing problem.',
    audience: 'Marketing Director, GM, Web Provider',
    timeToRun: 'One week to install the fundamentals; ongoing to maintain',
    steps: [
      {
        n: 1,
        headline: 'Ask the models what they say about you today.',
        detail:
          'Open ChatGPT, Perplexity, Gemini, and Google AI Overviews. Ask each which dealers they recommend in your brand and city, and what they say about your store. Take screenshots. This is your baseline.',
      },
      {
        n: 2,
        headline: 'Make sure your store schema is right.',
        detail:
          'Your website should serve valid AutoDealer or LocalBusiness schema.org markup on the homepage — name, address, phone, hours, geo coordinates, department information. In audits I have run, broken or missing schema is common enough to treat as non-optional. AI models read structured data first.',
      },
      {
        n: 3,
        headline: 'Own the "about" page like it will be quoted.',
        detail:
          'Because it will. The about page is high-leverage content for AI visibility. Real facts: ownership, history, community involvement, awards, staff. Not marketing prose. Facts, in complete sentences, that a model can lift and cite.',
      },
      {
        n: 4,
        headline: 'Get named in third-party sources.',
        detail:
          'AI models weight sources they trust. Local business journal profiles, chamber of commerce listings, industry press, podcast appearances, awards. One clear third-party mention with your store name and city often beats a pile of paid backlinks.',
      },
      {
        n: 5,
        headline: 'Make your VDP structured and stable.',
        detail:
          "Stable canonical URLs. Valid Product/Vehicle schema. Clean, non-templated titles. If your VDPs 404 or redirect the moment the vehicle sells, AI is training on ghost pages. Serve a 'sold' state at the same URL instead.",
      },
      {
        n: 6,
        headline: 'Re-check monthly. Publish the trend.',
        detail:
          "AI visibility isn't a one-time fix. Set a monthly cadence: repeat step 1, log the answers, watch the trend. Are you being named more? Fewer? Are your competitors gaining? Treat it like a beat, not a project.",
      },
    ],
  },
];
