import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, ChevronLeft, SlidersHorizontal, FileText, X, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useProducts, useCategories } from '@/hooks/useSupabaseData';
import { EnquiryModal } from '@/components/enquiry';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { pageSEO, buildWebPageSchema, buildBreadcrumbSchema, siteUrl, siteName } from '@/lib/seo';
import type { RootState } from '@/store';

type SortBy = 'newest' | 'oldest' | 'popular' | 'rating' | 'az' | 'za';
type ViewMode = 'grid' | 'compact' | 'list';

const ProductListingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const categorySlug = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const [enquiryProduct, setEnquiryProduct] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { data: rawProducts = [], isLoading } = useProducts({ categorySlug, search, limit: 50 });
  const { data: categories = [] } = useCategories();

  const products = useMemo(() => {
    let sorted = [...rawProducts];
    switch (sortBy) {
      case 'newest': sorted.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)); break;
      case 'oldest': sorted.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)); break;
      case 'popular': sorted.sort((a, b) => b.review_count - a.review_count); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'az': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'za': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return sorted;
  }, [rawProducts, sortBy]);

  const title = useMemo(() => {
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      return cat ? cat.name : categorySlug;
    }
    if (search) return `Search: "${search}"`;
    return 'All Products';
  }, [categorySlug, search, categories]);

  const gridCols = viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4' : viewMode === 'compact' ? 'grid-cols-3 md:grid-cols-6' : 'grid-cols-1';

  const productsSEO = pageSEO.products;
  const listingTitle = categorySlug || search ? `${title} | ${siteName}` : productsSEO.title;
  const listingDescription = categorySlug
    ? `Browse ${title} at ${siteName}. High-quality custom printing products in Khopoli, Raigad, Maharashtra.`
    : search
      ? `Search results for "${search}" at ${siteName}. Discover quality custom printing products and services.`
      : productsSEO.description;

  return (
    <Layout>
      <SEO
        title={listingTitle}
        description={listingDescription}
        keywords={productsSEO.keywords}
        canonical={`${siteUrl}/products${categorySlug ? `?category=${categorySlug}` : search ? `?search=${encodeURIComponent(search)}` : ''}`}
        ogType={productsSEO.ogType}
        schema={[
          buildWebPageSchema('/products', listingTitle, listingDescription),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: categorySlug && title !== 'All Products' ? title : 'Products', path: categorySlug ? `/products?category=${categorySlug}` : '/products' },
          ]),
        ]}
      />
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground truncate">{title}</h1>
          <p className="text-[10px] text-muted-foreground">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="px-4 py-4 pb-6 md:py-8 lg:py-10">
        {isLoading ? (
          <div className={`grid ${gridCols} gap-3 md:gap-4 lg:gap-6 items-stretch`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-full flex flex-col gap-1.5">
                <Skeleton className="w-full aspect-square rounded-xl shrink-0" />
                <Skeleton className="w-3/4 h-3 shrink-0" />
                <Skeleton className="w-1/2 h-3 shrink-0" />
                <Skeleton className="w-full h-8 rounded-lg mt-auto shrink-0" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <p className="text-muted-foreground text-sm md:text-base">No Products Found</p>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">Try a different search term or category</p>
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-3 md:gap-4 lg:gap-6 items-stretch`}>
            {products.map((product) => (
              <div key={product.id} className="flex flex-col gap-1.5 group">
                <div className="relative shrink-0">
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-left w-full"
                  >
                    <div className={`w-full rounded-xl overflow-hidden border border-border bg-muted group-hover:border-primary transition-colors shrink-0 ${viewMode === 'list' ? 'aspect-video' : 'aspect-square'}`}>
                      <img
                        src={product.images?.[0] || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </button>
                  <div className="absolute top-2 right-2">
                    <WishlistButton productId={product.id} size="sm" />
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-left flex flex-col flex-1 min-h-0"
                >
                  <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight line-clamp-2 mt-1 min-h-[2.5em]">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-foreground">{product.rating}</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/profile');
                      return;
                    }
                    setEnquiryProduct(product.name);
                  }}
                  className="flex items-center justify-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold py-2 rounded-lg hover:bg-primary/20 transition-colors mt-auto shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Enquiry Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Sheet */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="relative w-full max-w-[calc(100%-2rem)] md:max-w-lg bg-card rounded-t-2xl border border-border p-4 max-h-[80dvh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Filter & Sort</h2>
              <button onClick={() => setFilterOpen(false)} className="p-1.5 hover:bg-muted rounded-lg" aria-label="Close">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <ArrowUpDown className="w-4 h-4" /> Sort By
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'newest' as SortBy, label: 'Newest' },
                  { value: 'oldest' as SortBy, label: 'Oldest' },
                  { value: 'popular' as SortBy, label: 'Most Popular' },
                  { value: 'rating' as SortBy, label: 'Highest Rated' },
                  { value: 'az' as SortBy, label: 'A - Z' },
                  { value: 'za' as SortBy, label: 'Z - A' },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSortBy(s.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      sortBy === s.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">View Style</h3>
              <div className="flex gap-2">
                {[
                  { value: 'grid' as ViewMode, label: 'Grid', icon: LayoutGrid },
                  { value: 'compact' as ViewMode, label: 'Compact', icon: LayoutGrid },
                  { value: 'list' as ViewMode, label: 'List', icon: List },
                ].map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setViewMode(v.value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      viewMode === v.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <v.icon className="w-4 h-4" />
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setSortBy('newest'); setViewMode('grid'); }}
                className="flex-1 py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {enquiryProduct && (
        <EnquiryModal
          productName={enquiryProduct}
          isOpen={!!enquiryProduct}
          onClose={() => setEnquiryProduct(null)}
        />
      )}
    </Layout>
  );
};

export default ProductListingPage;
