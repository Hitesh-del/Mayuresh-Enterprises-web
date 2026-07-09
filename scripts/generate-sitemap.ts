import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const siteUrl = 'https://www.mayureshenterprises.com';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  priority: number;
  changefreq: string;
}

function toUrl(entry: SitemapEntry): string {
  const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${entry.loc}</loc>${lastmod}\n    <priority>${entry.priority.toFixed(2)}</priority>\n    <changefreq>${entry.changefreq}</changefreq>\n  </url>`;
}

async function main() {
  const today = new Date().toISOString().split('T')[0];

  const staticEntries: SitemapEntry[] = [
    { loc: `${siteUrl}/`, priority: 1.0, changefreq: 'weekly', lastmod: today },
    { loc: `${siteUrl}/about`, priority: 0.9, changefreq: 'monthly', lastmod: today },
    { loc: `${siteUrl}/services`, priority: 0.9, changefreq: 'weekly', lastmod: today },
    { loc: `${siteUrl}/products`, priority: 0.9, changefreq: 'weekly', lastmod: today },
    { loc: `${siteUrl}/categories`, priority: 0.9, changefreq: 'weekly', lastmod: today },
    { loc: `${siteUrl}/contact`, priority: 0.8, changefreq: 'monthly', lastmod: today },
    { loc: `${siteUrl}/enquiries`, priority: 0.7, changefreq: 'monthly', lastmod: today },
  ];

  const [categoriesRes, productsRes, servicesRes] = await Promise.all([
    supabase.from('categories').select('slug,updated_at').eq('is_active', true),
    supabase.from('products').select('slug,updated_at').eq('is_active', true),
    supabase.from('services').select('slug,updated_at').eq('is_active', true),
  ]);

  if (categoriesRes.error) console.error('Categories fetch error:', categoriesRes.error.message);
  if (productsRes.error) console.error('Products fetch error:', productsRes.error.message);
  if (servicesRes.error) console.error('Services fetch error:', servicesRes.error.message);

  const categories = (categoriesRes.data || []).filter((c) => c.slug);
  const products = (productsRes.data || []).filter((p) => p.slug);
  const services = (servicesRes.data || []).filter((s) => s.slug);

  const categoryEntries: SitemapEntry[] = categories.map((c) => ({
    loc: `${siteUrl}/categories/${c.slug}`,
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: c.updated_at ? c.updated_at.split('T')[0] : today,
  }));

  const productEntries: SitemapEntry[] = products.map((p) => ({
    loc: `${siteUrl}/product/${p.slug}`,
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: p.updated_at ? p.updated_at.split('T')[0] : today,
  }));

  const serviceEntries: SitemapEntry[] = services.map((s) => ({
    loc: `${siteUrl}/service/${s.slug}`,
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: s.updated_at ? s.updated_at.split('T')[0] : today,
  }));

  const allEntries = [...staticEntries, ...categoryEntries, ...serviceEntries, ...productEntries];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allEntries.map(toUrl).join('\n')}\n</urlset>\n`;

  const outPath = resolve(process.cwd(), 'public/sitemap.xml');
  writeFileSync(outPath, sitemap);
  console.log(`Generated sitemap with ${allEntries.length} URLs at ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
