import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const distUrl = new URL('../dist/index.html', import.meta.url);
const wireframeUrl = new URL('../wireframe/index.html', import.meta.url);
const html = readFileSync(distUrl, 'utf8');
const wireframe = readFileSync(wireframeUrl, 'utf8');

assert.equal(html, wireframe, 'Published dist must match the approved wireframe');

const pageIds = [...html.matchAll(/<section class="page[^"]*" id="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(pageIds, [
  'home',
  'properties',
  'property-detail',
  'about',
  'customers',
  'services',
  'projects',
  'project-detail',
  'contact',
  'portfolio',
  'list-property',
  'media',
  'careers',
]);
assert.equal(new Set(pageIds).size, pageIds.length, 'Page IDs must be unique');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'All static IDs must be unique');

for (const match of html.matchAll(/data-route="([^"]+)"/g)) {
  assert.ok(pageIds.includes(match[1]), `Missing route target: ${match[1]}`);
}

for (const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
  if (match[1].includes('${')) continue;
  assert.ok(existsSync(fileURLToPath(new URL(`../dist/${match[1]}`, import.meta.url))), match[1]);
}

const approvedCopy = [
  'Creating Value Beyond Property',
  'With You Across Every Stage.',
  'Find Your Next Property.',
  'One connected approach for your asset',
  'A Record That Speaks For Itself.',
  'A Portfolio That Reflects Our Range.',
  'A Considered Start.',
  'Trusted Across Sectors.',
  'We’re Here For What Comes Next.',
  'List Your Property',
  'Manage Your Property',
  'General Enquiry',
  'Beyond Property. Creating Value.',
  'Inquiries@adu-re.com',
];
for (const copy of approvedCopy) assert.ok(html.includes(copy), `Missing approved copy: ${copy}`);

const aboutCopy = [
  'More than a broker. More than a property manager.',
  'Two decades of connected growth.',
  'Our foundation',
  'Building expertise',
  'Integrated services',
  'Real estate, end-to-end',
  'Message from our CEO',
  'Real estate creates lasting value when every stage of the asset journey is connected.',
  'Rashed Aldhaheri',
  'Management Is Where Our Experience Runs Deepest.',
  'Residential Communities',
  'Office Towers',
  'Different goals. One connected platform.',
  'Owners, landlords &amp; sellers',
  'Corporate &amp; government',
  'Find a Property',
  'Manage Your Property',
  'Corporate Enquiry',
];
for (const copy of aboutCopy) assert.ok(html.includes(copy), `Missing About page copy: ${copy}`);

const propertyListingCopy = [
  'Find The Right Place For Your Next Chapter.',
  'Find a place to call home or grow your business',
  'Properties That Match Your Search.',
  'Sunrise Residence 2 · Unit 502',
  'Sunset Residence 1 · Unit 207',
  'Garden Residences 5 · Unit 306',
  'Own property in the UAE?',
  'Project / Community',
  'Price range (AED)',
  'Property results pages',
  'No properties match these filters.',
];
for (const copy of propertyListingCopy) assert.ok(html.includes(copy), `Missing Property Listing copy: ${copy}`);
const propertyDetailCopy = [
  'Two-Bedroom Sea-View Apartment',
  'AED 280,000',
  'A considered home with a clear sea view.',
  '246.97 m²',
  'Vacant / Available',
  'Amenities &amp; facilities',
  'Qaryat Al Hidd · Saadiyat Island',
  'Explore Sunrise Residence 2',
  'Interested in this property?',
  'Unit 502 · Sunrise Residence 2',
  'Sunrise Residence 2 · Unit 404',
  'List your property with ADURE.',
];
for (const copy of propertyDetailCopy) assert.ok(html.includes(copy), `Missing Property Detail copy: ${copy}`);
assert.ok(html.includes('id="detail-enquiry-form"'), 'Property Detail enquiry form must be present');
assert.ok(html.includes('data-scroll-enquiry'), 'Property Detail booking actions must be present');
const customerPageCopy = [
  'Trusted Across Sectors.',
  'Government &amp; Semi-Government',
  'Private Sector &amp; Corporates',
  'Across Every Environment.',
  'Residential Communities',
  'Commercial Buildings',
  'Office Towers',
  'Retail Shops',
  'Hotels',
  'Government Buildings',
  'Mixed-Use Developments',
  'Our Standard of Care.',
  'Integrated Expertise',
  'Operational Accountability',
  'Financial Transparency',
  'Technology &amp; Reporting',
  'Real Estate Needs the Right Team Around It.',
  'Let’s Create More Value',
];
for (const copy of customerPageCopy) assert.ok(html.includes(copy), `Missing Our Customers copy: ${copy}`);
assert.equal(readdirSync(new URL('../dist/assets/customers/', import.meta.url)).filter(name => name.endsWith('.webp')).length, 54, 'Our Customers page must include all 54 approved organisation logos');
assert.ok(!html.includes('Approved testimonial text'), 'Unapproved testimonial placeholders must remain unpublished');
assert.ok(!html.includes('subject to management approval'), 'Internal approval notes must not appear on the website');
assert.ok(!html.includes('Approved client logos'), 'Internal content placeholders must not appear on the website');

assert.ok(!html.includes('A Longer View.'), 'Removed homepage philosophy section must not return');
assert.deepEqual(
  [...html.slice(html.indexOf('id="home"'), html.indexOf('id="properties"')).matchAll(/section-index">(\d+)/g)].map(match => match[1]),
  ['02', '04', '05', '06', '07', '08', '09'],
  'Homepage sitemap section numbering must follow the revised content document',
);
assert.doesNotMatch(html, /\brent(?:al|ing|ed|s)?\b/i, 'Use Lease or Leasing instead of Rent terminology');
const primaryNav = html.match(/<nav class="nav" id="nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
assert.deepEqual(
  [...primaryNav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(match => match[1]),
  ['About ADURE', 'Properties', 'Our Customers', 'Contact'],
  'Primary navigation must contain the four approved items in order',
);
assert.ok(!primaryNav.includes('services-dropdown'), 'Primary navigation must not include the former Services dropdown');

assert.equal((html.match(/<section class="page active/g) || []).length, 1, 'One page must be active initially');
assert.ok(html.includes('<section class="page active home-v2" id="home">'), 'Homepage must be the initial page');

console.log('Content checks passed: dist matches the approved wireframe, all 13 routes resolve, assets exist, IDs are unique and the revised homepage sitemap copy is present.');
