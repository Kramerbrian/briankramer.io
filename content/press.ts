export interface PressMention {
  publication: string;
  note?: string;
  url?: string;
}

export const pressMentions: PressMention[] = [
  { publication: 'The Wall Street Journal' },
  { publication: 'Automotive News', note: 'Automotive News “40 Under 40” recognition (citation pending)' },
  { publication: 'F&I Magazine' },
  { publication: 'Digital Dealer Magazine' },
  { publication: 'Jalopnik' },
  { publication: 'PBS "Viewpoint" with Dennis Quaid' },
];

export interface Credential {
  label: string;
  detail?: string;
  year?: string;
}

export const credentials: Credential[] = [
  {
    label: 'Automotive News “40 Under 40” recognition',
    detail: 'Biography evidence; primary award citation pending',
  },
  {
    label: 'Former member, Google Dealer Advisory Board',
    detail: 'Biography evidence; roster confirmation pending',
  },
  {
    label: 'Helped lead an early end-to-end paperless automotive transaction',
    detail: 'Qualified claim — absolute “industry first” not asserted here',
    year: '2020',
  },
  {
    label: 'Facilitated an early Web3 transaction in automotive retail',
    detail: 'Qualified claim — absolute “industry first” not asserted here',
  },
  {
    label: 'Former GM, Germain Toyota of Naples & Germain Lincoln of Naples',
    detail: 'Reported store volume above 7,500 retail vehicles annually (biography evidence; ledger confirmation pending)',
  },
];
