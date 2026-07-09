import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCategories } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { pageSEO, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategories();

  const categoriesSEO = pageSEO.categories;

  return (
    <Layout>
      <SEO
        title={categoriesSEO.title}
        description={categoriesSEO.description}
        keywords={categoriesSEO.keywords}
        canonical={`${siteUrl}/categories`}
        ogType={categoriesSEO.ogType}
        schema={[
          buildWebPageSchema('/categories', categoriesSEO.title, categoriesSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Categories', path: '/categories' }]),
        ]}
      />
      <div className="px-4 pt-2 pb-6 md:py-8 lg:py-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6">All Categories</h2>
        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3 md:p-4">
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                <Skeleton className="w-12 h-3 md:h-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-stretch">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.slug)}`)}
                className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl border border-border bg-card hover:bg-muted transition-colors h-full shadow-sm"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-muted shrink-0">
                  <img
                    src={cat.image || ''}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground text-center line-clamp-2">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;
