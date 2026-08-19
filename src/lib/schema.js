/**
 * JSON-LD structured data.
 *
 * Every page emits one @graph. Shared entities carry stable @id values so the
 * per-page nodes can reference them instead of repeating them, which is both
 * smaller and what Google's parser actually prefers.
 *
 * A deliberate omission: no AggregateRating anywhere unless
 * `site.reviews.show` is turned on with real numbers. Marking up review data
 * you cannot substantiate is a manual-action risk, and the rich result is not
 * worth losing the whole site's snippets over.
 */

import site from '../site.config.js';
import { areas, counties } from '../data/areas.js';
import { services } from '../data/services.js';
import { abs, plain, anchorId } from './ui.js';

const ID = {
  business: `${site.origin}/#business`,
  website: `${site.origin}/#website`,
  page: (path) => `${site.origin}${path}#webpage`,
};

/* ── Shared entities ───────────────────────────────────────────────────────── */

export function businessNode() {
  const node = {
    '@type': ['HomeAndConstructionBusiness', 'ProfessionalService'],
    '@id': ID.business,
    name: site.name,
    url: site.origin,
    telephone: site.phoneHref,
    /*
      Only when there is one. `email: null` was being emitted on all 37 pages,
      which is not "we did not say" -- it is a structured statement that the
      value is empty. Same reasoning as streetAddress and hasCredential below.
    */
    ...(site.email ? { email: site.email } : {}),
    description: `${site.tagline}. Specializing in HVAC, air handler, and duct mold remediation.`,
    // priceRange removed: it asserted a price band on all 37 pages, was
    // hardcoded outside site.config.js so the launch gate could not see it,
    // and no rich result depends on it. Same reasoning as sameAs and geo.
    foundingDate: String(site.foundingYear),
    slogan: site.tagline,
    address: {
      '@type': 'PostalAddress',
      ...(site.address.street ? { streetAddress: site.address.street } : {}),
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      /*
        A locality and a region describe a service area honestly. A POSTCODE
        describes premises, and 33301 is the one that came attached to the
        placeholder street address -- a specific downtown Fort Lauderdale block
        this business has no presence on. It is published only alongside a real
        street, which is the thing that would make it true.
      */
      ...(site.address.street ? { postalCode: site.address.postalCode } : {}),
      addressCountry: site.address.country,
    },
    // Coordinates only once the address they describe is confirmed. The
    // placeholder pair is approximate downtown Fort Lauderdale, and at four
    // decimals that is ~11m — a confident assertion of a specific building.
    // "1234 Example Boulevard" announces itself as fake to anyone who reads
    // it; 26.1224, -80.1373 does not, and a crawler is the only thing that
    // reads either. Unbacked precision is worse than an obvious placeholder,
    // so this stays out of the graph until site.verified includes 'address'.
    ...(site.verified?.includes('address')
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: site.address.lat,
            longitude: site.address.lng,
          },
        }
      : {}),
    areaServed: serviceArea(),
    openingHoursSpecification: site.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    /*
      THE ONE THAT MATTERED MOST. With site.license null this emitted
      hasCredential.name = "FL Mold Remediator Lic. null", recognizedBy the
      Florida DBPR, on every page: a machine-readable claim to hold a state
      licence, addressed to Google rather than to a reader who might notice it
      was nonsense. A credential we do not hold is not a credential with a
      missing number; the whole node is absent until there is one to name.
    */
    ...(site.license
      ? {
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'license',
            name: `${site.licenseLabel} ${site.license}`,
            recognizedBy: {
              '@type': 'GovernmentOrganization',
              name: 'Florida Department of Business and Professional Regulation',
            },
          },
        }
      : {}),
    knowsAbout: [
      'Mold remediation',
      'HVAC mold remediation',
      'Air handler and evaporator coil mold',
      'Air duct cleaning',
      'Mold inspection and testing',
      'Water damage restoration',
      'Indoor air quality',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Mold remediation services',
      // Derived from the service list, not retyped. These six names were
      // maintained by hand with no link to the pages they describe, so every
      // Offer was a stub carrying a name a crawler could not follow, and
      // nothing kept the list in step with src/data/services.js. Point them at
      // the canonical Service nodes instead.
      itemListElement: services.map((sv) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          '@id': `${abs(`/services/${sv.slug}/`)}#service`,
          name: sv.navLong,
          url: abs(`/services/${sv.slug}/`),
        },
      })),
    },
    image: abs('/assets/og-default.png'),
    logo: abs('/assets/brand/lockup.png'),
  };

  if (site.sameAs?.length) node.sameAs = site.sameAs;

  if (site.reviews?.show) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: site.reviews.ratingValue,
      reviewCount: site.reviews.reviewCount,
    };
  }

  return node;
}

/**
 * Place nodes.
 *
 * `name` is the entity's name, not a label for display: a City called
 * "Fort Lauderdale, Florida" is a string where a name belongs, and it leaves
 * the county and the state unstated as data. The hierarchy goes in
 * containedInPlace, which is what a consumer actually reads to work out where
 * this business operates.
 */
const FLORIDA = { '@type': 'State', name: site.address.regionName };
const countyNode = (c) => ({
  '@type': 'AdministrativeArea',
  name: c.name,
  containedInPlace: FLORIDA,
});
const countyOf = (a) => counties.find((c) => c.short === a.county) || counties[0];
const cityNode = (a) => ({
  '@type': 'City',
  name: a.name,
  containedInPlace: {
    '@type': 'AdministrativeArea',
    name: countyOf(a).name,
    containedInPlace: FLORIDA,
  },
});
const serviceArea = () => [...counties.map(countyNode), ...areas.map(cityNode)];

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': ID.website,
  url: site.origin,
  name: site.name,
  publisher: { '@id': ID.business },
  inLanguage: 'en-US',
});

/**
 * Schema.org has specific WebPage subtypes, and using them costs nothing while
 * telling a parser what kind of page it is landing on. Everything here was
 * emitting a bare WebPage, which is the least informative option available.
 */
export const webPageNode = ({ path, title, description, image, imageAlt, pageType }) => {
  const node = {
    '@type': pageType || 'WebPage',
    '@id': ID.page(path),
    url: abs(path),
    name: title,
    description,
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.business },
    inLanguage: 'en-US',
  };
  /* The page's actual hero, described. Previously every page pointed at one
     generic card, which tells a crawler nothing about what the page is of. */
  if (image) {
    node.primaryImageOfPage = {
      '@type': 'ImageObject',
      '@id': `${abs(path)}#primaryimage`,
      url: abs(`/assets/img/${image}-1376.jpg`),
      contentUrl: abs(`/assets/img/${image}-1376.jpg`),
      width: 1376,
      height: 768,
      caption: imageAlt || undefined,
    };
  }
  return node;
};

/* ── Per-page nodes ────────────────────────────────────────────────────────── */

export const breadcrumbNode = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    ...(c.href ? { item: abs(c.href) } : {}),
  })),
});

/**
 * `path` is optional and gives each Question a url pointing at its own anchor.
 * Every answer on the site is individually addressable, so a consumer can link
 * to the specific one rather than to the page it happens to sit on.
 */
export const faqNode = (faqs, path) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: plain(f.q),
    ...(path ? { url: `${abs(path)}#${anchorId(plain(f.q))}` } : {}),
    // plain(), not the raw string: this answer is authored prose that may carry
    // inline-link syntax for the rendered page. Structured data needs the
    // sentence, not the markup.
    acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
  })),
});

export const serviceNode = ({ name, description, path, serviceType, areaName }) => ({
  '@type': 'Service',
  '@id': `${abs(path)}#service`,
  name,
  description,
  serviceType: serviceType || name,
  url: abs(path),
  provider: { '@id': ID.business },
  areaServed: areaName
    ? [cityNode(areas.find((a) => a.name === areaName) || { name: areaName, county: counties[0].short })]
    : counties.map(countyNode),
  audience: { '@type': 'Audience', audienceType: 'Homeowners and property managers' },
});

export const howToNode = ({ name, description, steps, path }) => ({
  '@type': 'HowTo',
  '@id': `${abs(path)}#howto`,
  name,
  description,
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: plain(s.title),
    text: plain(s.text),
  })),
});

/**
 * Assemble the graph for a page. Pass whatever applies; the shared nodes are
 * always included so every URL is self-describing to a crawler that lands
 * on it directly.
 */
/**
 * Editorial content, as distinct from a service page. Guides are written by the
 * business, so it is both author and publisher; dateModified comes from the
 * data file that produces the page, which is the same source the sitemap uses.
 */
export const articleNode = ({ path, headline, description, image, imageAlt, published, modified, section }) => ({
  '@type': 'Article',
  '@id': `${abs(path)}#article`,
  headline: plain(headline),
  description: plain(description),
  mainEntityOfPage: { '@id': `${abs(path)}#webpage` },
  author: { '@id': ID.business },
  publisher: { '@id': ID.business },
  ...(published ? { datePublished: published } : {}),
  ...(modified ? { dateModified: modified } : {}),
  ...(section ? { articleSection: section } : {}),
  ...(image
    ? {
        image: {
          '@type': 'ImageObject',
          url: abs(`/assets/img/${image}-1376.jpg`),
          width: 1376,
          height: 768,
          caption: imageAlt || undefined,
        },
      }
    : {}),
  inLanguage: 'en-US',
});

export function graph({ path, title, description, trail, image, imageAlt, pageType, extra = [] }) {
  const nodes = [businessNode(), websiteNode(), webPageNode({ path, title, description, image, imageAlt, pageType })];
  if (trail?.length > 1) nodes.push(breadcrumbNode(trail));
  nodes.push(...extra.filter(Boolean));
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export { counties };
