// Paste your Google Sheet's ID here (the long id in its URL between /d/ and /edit).
// Share the Sheet as "Anyone with the link -> Viewer" so the site can read it.
export const SHEET_ID = '1jNiK97s5enEyrhy9KGRuAG8TcNcWfXWm0PLCIcN3PlE';
export const SHEET_TAB = 'Products';
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_TAB)}`;

// The curated category list used for the nav menu and homepage tiles.
// `parent` is reserved for future sub-categories (e.g. sarees -> organza / tissue)
// and is unused for now.
export const CATEGORIES = [
  { slug: 'hand-painted-clutches', label: 'Hand Painted Clutches', parent: null },
  { slug: 'hand-painted-sarees', label: 'Hand Painted Sarees', parent: null },
  { slug: 'hand-painted-stoles', label: 'Hand Painted Stoles', parent: null },
];

export const SITE_INFO = {
  name: 'Bluepetal',
  tagline: 'Hand-painted artwork for fashion, made one piece at a time',
  phone: '+91 00000 00000',
  whatsapp: '910000000000',
  email: 'contact@bluepetals.co.in',
  instagram: 'https://instagram.com/bluepetal',
  facebook: 'https://facebook.com/bluepetal',
  // Fill these in once available; leave blank fields out of any structured data.
  address: {
    streetAddress: '',
    addressLocality: '',
    addressRegion: '',
    postalCode: '',
    addressCountry: 'IN',
  },
};
