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

export const playbookEntries: PlaybookEntry[] = [
  {
    slug: 'service-drive-sourcing',
    pillar: 'acquisition',
    title: 'Service-drive sourcing: the acquisition channel you already own',
    dek: 'Every day, dozens of trade-ready vehicles roll through your service drive. Most stores let them roll right back out.',
    audience: 'GM, UCM, Service Director, Acquisition Manager',
    timeToRun: 'Two weeks to install, ~15 minutes daily to run',
    steps: [
      {
        n: 1,
        headline: 'Get every RO through a used-car eye before it leaves the lane.',
        detail:
          "Your service advisors write the ticket. Your used-car team decides whether that vehicle is worth an offer. Those two people almost never talk. Fix that first. Set a 90-second SLA: every RO over a threshold (define it — $600? $1,200?) gets a text with year/make/model/mileage/VIN to a used-car buyer before the customer leaves the write-up desk.",
      },
      {
        n: 2,
        headline: 'Run the equity math in real time.',
        detail:
          "Auto-decode the VIN, pull your book value, compare against remaining payoff or KBB trade. If there's more than a few thousand in equity, that's an offer worth making. Not to close on the drive — to plant the seed. Your buyer walks out, introduces themselves, hands the customer a printed number. That's the offer window.",
      },
      {
        n: 3,
        headline: 'Give the service advisor a stake.',
        detail:
          "The advisor is not paid to sell you cars. They are paid to sell hours and parts. If you want their attention, they need a spiff on any vehicle acquired through their lane. Small money — $100-$250 per acquisition. It changes behavior overnight.",
      },
      {
        n: 4,
        headline: 'Follow up in 48 hours, not seven days.',
        detail:
          "The customer left the store thinking about the offer. Their spouse got home. The number percolated. Two days is the sweet spot: past the emotional reflex to say no, before the moment fades. Anything longer and you're competing with CarMax again.",
      },
      {
        n: 5,
        headline: 'Track close rate on drive-sourced offers, not just volume.',
        detail:
          "How many offers made, how many accepted, gross per unit. If close rate is under 20%, your offers are too low or your follow-up is too slow. If it's over 60%, you're leaving money on the table with excessive numbers. Aim for 25-40%.",
      },
      {
        n: 6,
        headline: 'Report it as its own channel.',
        detail:
          "Service-drive acquisition is not 'used-car buying.' It has its own funnel, its own economics, its own weekly report. If you can't see it separately, you can't manage it. And you'll default back to auction, which is where margin goes to die.",
      },
    ],
  },
  {
    slug: 'look-to-book',
    pillar: 'appraisal',
    title: 'The Look-to-Book number every dealer should track',
    dek: 'You know your close rate on retail. Do you know your close rate on appraisal? Most stores don\'t. That gap is the single most under-measured lever in used-car acquisition.',
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
        headline: "Publish the Look-to-Book rate weekly, by appraiser.",
        detail:
          "Not a punishment. A mirror. Your best appraiser might be at 45%. Your worst at 12%. The gap is training, judgment, and confidence. All coachable.",
      },
      {
        n: 4,
        headline: "Separate 'walk' losses from 'lose to competitor' losses.",
        detail:
          "A walk is the customer choosing to keep their vehicle. That's usually a pricing problem — you didn't stretch. A loss to a competitor is a market problem — someone else stretched harder. Different diagnoses, different fixes.",
      },
      {
        n: 5,
        headline: "Set a floor and a ceiling.",
        detail:
          "Under 20% Look-to-Book, you're bidding scared. Over 55%, you're either overpaying or getting lucky. Healthy range for a well-run used-car store is 28-42%. Where you land inside that range depends on your inventory strategy.",
      },
      {
        n: 6,
        headline: 'Treat Look-to-Book like Close Ratio.',
        detail:
          "Every 20-group meeting talks about closing ratio on retail traffic. Nobody talks about closing ratio on appraisal traffic. That's the whole game in used cars. Bring it to the meeting.",
      },
    ],
  },
  {
    slug: 'digital-trust-audit',
    pillar: 'trust',
    title: 'The digital trust audit: what your store looks like before a customer walks in',
    dek: '84% of shoppers read reviews. 71% of them decide on a dealer before they call. If you have not audited what they see, you are running blind.',
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
        headline: 'Read your last 50 Google reviews. All of them. Out loud, to yourself.',
        detail:
          "Not the star rating — the actual words. Note the recurring specifics. If three people mention the same salesperson by name in bad reviews, that's data. If four mention the F&I upsell, that's data. Themes over headlines.",
      },
      {
        n: 3,
        headline: 'Respond to every review over 30 days old that you have not answered.',
        detail:
          "Especially the negative ones. Especially the old ones. A public, specific, non-defensive response to a two-year-old one-star review does more for future shoppers than most of your paid media.",
      },
      {
        n: 4,
        headline: 'Audit the phone experience.',
        detail:
          "Call your own BDC. Sales, service, parts. From an unknown number. Time the pickup. Grade the greeting. Note whether they got your name, your vehicle, your callback number. Most stores are D+. Some are F.",
      },
      {
        n: 5,
        headline: 'Check the VDP.',
        detail:
          "Pick three used vehicles at random. Look at the VDP as a stranger would. Are the photos in? Is the price the price, or is it '$X after $2,000 in unadvertised fees'? Is there a video walk-around? Would you buy this vehicle from this listing?",
      },
      {
        n: 6,
        headline: 'Score your trust surface. Set two things to fix this quarter.',
        detail:
          "Don't try to fix everything. Pick the two most-mentioned problems from steps 2-5 and put a person's name against each with a 90-day deadline. Then re-run the audit. This is a compounding practice, not a project.",
      },
    ],
  },
  {
    slug: 'ai-search-quick-start',
    pillar: 'ai-search',
    title: 'AI search visibility quick-start: showing up when ChatGPT recommends a dealer',
    dek: 'Perplexity, ChatGPT, Gemini, and Google AI Overviews are already answering "best Honda dealer in Naples." Whether they mention you is a design problem, not a marketing problem.',
    audience: 'Marketing Director, GM, Web Provider',
    timeToRun: 'One week to install the fundamentals; ongoing to maintain',
    steps: [
      {
        n: 1,
        headline: 'Ask the models what they say about you today.',
        detail:
          'Open ChatGPT, Perplexity, Gemini, and Google AI Overviews. Ask each: "Which are the best <brand> dealers in <city>?" and "Tell me about <your store name>." Take screenshots. This is your baseline.',
      },
      {
        n: 2,
        headline: 'Make sure your store schema is right.',
        detail:
          'Your website should serve valid AutoDealer or LocalBusiness schema.org markup on the homepage — name, address, phone, hours, geo coordinates, department information. Half of dealer sites have broken or missing schema. AI models read structured data first.',
      },
      {
        n: 3,
        headline: 'Own the "about" page like it will be quoted.',
        detail:
          "Because it will. The about page is the single highest-leverage piece of content for AI visibility. Real facts: ownership, history, community involvement, awards, staff. Not marketing prose. Facts, in complete sentences, that a model can lift and cite.",
      },
      {
        n: 4,
        headline: 'Get named in third-party sources.',
        detail:
          "AI models weight sources they trust. Local business journal profiles, chamber of commerce listings, industry press, podcast appearances, awards. One good third-party mention with your store name and city beats twelve paid backlinks.",
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
          "AI visibility isn't a one-time fix. Set a monthly cadence: repeat step 1, log the answers, watch the trend. Are you being named more? Fewer? Are your competitors gaining? This is the new local SEO. Treat it like a beat, not a project.",
      },
    ],
  },
];
