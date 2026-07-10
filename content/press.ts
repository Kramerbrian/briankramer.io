export interface PressMention {
  publication: string;
  note?: string;
  url?: string;
}

export const pressMentions: PressMention[] = [
  { publication: 'The Wall Street Journal' },
  { publication: 'Automotive News', note: 'Recipient, inaugural "40 Under 40" award' },
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
    label: 'Recipient, inaugural Automotive News "40 Under 40" award',
  },
  {
    label: 'Former member, Google Dealer Advisory Board',
  },
  {
    label: 'Led the first end-to-end paperless automotive transaction',
    year: '2020',
  },
  {
    label: 'Facilitated the first Web3 transaction in automotive retail',
  },
  {
    label: 'Former GM, Germain Toyota of Naples & Germain Lincoln of Naples',
    detail: 'Retailed 7,500+ vehicles annually',
  },
];
