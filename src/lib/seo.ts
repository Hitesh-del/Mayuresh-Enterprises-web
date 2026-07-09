import { siteUrl as seoSiteUrl, siteName as seoSiteName } from '@/components/SEO';

export const siteUrl = seoSiteUrl;
export const siteName = seoSiteName;

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogType: string;
}

export const pageSEO: Record<string, PageSEO> = {
  home: {
    title: 'Professional Printing Services in Khopoli, Raigad -- Premium Digital, Offset & Custom Printing Solutions',
    description:
      'Welcome to Mayuresh Enterprises, your trusted destination for premium-quality printing services in Khopoli, Raigad. We specialize in professional printing solutions for businesses, institutions, and individuals.',
    keywords: [
      'printing services Khopoli',
      'custom printing Raigad',
      'digital printing Maharashtra',
      'offset printing',
      'business stationery printing',
    ],
    ogType: 'website',
  },
  about: {
    title: 'Trusted Printing Solutions in Khopoli, Raigad -- About Mayuresh Enterprises',
    description:
      'Mayuresh Enterprises is one of the most trusted printing service providers in Khopoli, Raigad, Maharashtra. Learn about our commitment to quality, precision, and customer satisfaction.',
    keywords: ['about Mayuresh Enterprises', 'printing company Khopoli', 'printing services Raigad'],
    ogType: 'website',
  },
  categories: {
    title: 'Explore Our Printing Categories -- Custom, Commercial & Promotional Printing Solutions',
    description:
      'Explore a wide range of professional printing categories at Mayuresh Enterprises. Find business stationery, marketing materials, promotional products, and personalized gifts.',
    keywords: ['printing categories', 'custom printing', 'commercial printing', 'promotional printing'],
    ogType: 'website',
  },
  contact: {
    title: 'Contact Mayuresh Enterprises -- Professional Printing Services in Khopoli, Raigad',
    description:
      'Contact Mayuresh Enterprises for customized printing solutions, business stationery, promotional materials, corporate branding products, and bulk commercial printing in Khopoli, Raigad.',
    keywords: ['contact Mayuresh Enterprises', 'printing services Khopoli', 'printing enquiry Raigad'],
    ogType: 'website',
  },
  enquiries: {
    title: 'Printing Enquiries & Custom Quote Requests -- Mayuresh Enterprises',
    description:
      'Send your printing enquiry to Mayuresh Enterprises. Request custom quotes for business printing, promotional products, wedding invitations, and bulk commercial printing in Khopoli, Raigad.',
    keywords: ['printing enquiry', 'custom quote printing', 'bulk printing Khopoli', 'printing order Raigad'],
    ogType: 'website',
  },
  products: {
    title: 'Premium Custom Printing Products in Khopoli, Raigad -- Quality Printing for Every Need',
    description:
      'Discover high-quality printing products at Mayuresh Enterprises. We offer business cards, brochures, banners, labels, wedding cards, promotional gifts, and more in Khopoli, Raigad.',
    keywords: ['printing products', 'custom printed products', 'business cards Khopoli', 'banners Raigad'],
    ogType: 'website',
  },
  services: {
    title: 'Professional Printing Services in Khopoli, Raigad -- Digital, Offset, Screen & Custom Printing',
    description:
      'Explore professional printing services at Mayuresh Enterprises. We offer digital, offset, screen, and custom printing for businesses and individuals in Khopoli, Raigad, Maharashtra.',
    keywords: ['printing services', 'digital printing', 'offset printing', 'screen printing', 'custom printing'],
    ogType: 'website',
  },
  wishlist: {
    title: 'Your Wishlist -- Saved Printing Products & Services',
    description:
      'View your saved printing products and services at Mayuresh Enterprises. Add business cards, banners, brochures, and promotional items to your wishlist.',
    keywords: ['printing wishlist', 'saved printing products', 'custom printing wishlist'],
    ogType: 'website',
  },
  profile: {
    title: 'My Account -- Mayuresh Enterprises',
    description:
      'Manage your Mayuresh Enterprises account, view enquiries, saved products, notifications, and update your profile details.',
    keywords: ['my account', 'Mayuresh Enterprises profile', 'printing account Khopoli'],
    ogType: 'website',
  },
  notifications: {
    title: 'Notifications -- Mayuresh Enterprises',
    description:
      'Stay updated with order confirmations, delivery updates, and promotional offers from Mayuresh Enterprises.',
    keywords: ['notifications', 'Mayuresh Enterprises updates', 'printing order status'],
    ogType: 'website',
  },
};

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteName,
    description:
      'Mayuresh Enterprises provides premium printing services including digital printing, offset printing, screen printing, wedding cards, visiting cards, brochures, banners, and promotional products in Khopoli, Raigad, Maharashtra.',
    url: siteUrl,
    telephone: '+91-XXXXXXXXXX',
    email: 'info@mayureshenterprises.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Khopoli',
      addressLocality: 'Khopoli',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Khopoli, Raigad, Maharashtra',
    },
    priceRange: '₹₹',
    sameAs: [],
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'Mayuresh Enterprises offers professional digital, offset, screen, and custom printing solutions for businesses and individuals in Khopoli, Raigad, Maharashtra.',
    areaServed: 'Khopoli, Raigad, Maharashtra',
  };
}

export function buildWebPageSchema(path: string, title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${siteUrl}${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
