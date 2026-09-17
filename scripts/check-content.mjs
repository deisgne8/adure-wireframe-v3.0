import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
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
assert.ok(!html.includes('subject to management approval'), 'Internal approval notes must not appear on the website');
assert.ok(!html.includes('Approved client logos'), 'Internal content placeholders must not appear on the website');

assert.ok(!html.includes('A Longer View.'), 'Removed homepage philosophy section must not return');
assert.deepEqual(
  [...html.slice(html.indexOf('id="home"'), html.indexOf('id="properties"')).matchAll(/section-index">(\d+)/g)].map(match => match[1]),
  ['02', '04', '05', '06', '07', '08', '09'],
  'Homepage sitemap section numbering must follow the revised content document',
);
assert.doesNotMatch(html, /\brent(?:al|ing|ed|s)?\b/i, 'Use Lease or Leasing instead of Rent terminology');
assert.ok(html.includes('id="services-dropdown"'), 'Services dropdown must be present');
assert.ok(html.includes('aria-controls="services-menu"'), 'Services dropdown must expose its menu accessibly');
assert.equal((html.match(/role="menuitem"/g) || []).length, 5, 'Services dropdown must include five routes');

assert.equal((html.match(/<section class="page active/g) || []).length, 1, 'One page must be active initially');
assert.ok(html.includes('<section class="page active home-v2" id="home">'), 'Homepage must be the initial page');

console.log('Content checks passed: dist matches the approved wireframe, all 13 routes resolve, assets exist, IDs are unique and the revised homepage sitemap copy is present.');
