import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const defaultKeywords = [
  'Mayuresh Enterprises',
  'printing services Khopoli',
  'printing Raigad Maharashtra',
  'digital printing',
  'offset printing',
  'custom printing',
  'business cards',
  'brochures',
  'banners',
  'wedding cards',
  'promotional products',
];

export const siteUrl = 'https://www.mayureshenterprises.com';
export const siteName = 'Mayuresh Enterprises';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schema,
  noindex = false,
}) => {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const mergedKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');

  const schemaScripts =
    schema
      ? (Array.isArray(schema) ? schema : [schema]).map((s, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))
      : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={mergedKeywords} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />

      {schemaScripts}
    </Helmet>
  );
};
