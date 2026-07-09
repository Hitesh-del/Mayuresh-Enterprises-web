import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart, ShoppingBag, Trash2, ChevronLeft, Star, FileText, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useSupabaseData';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { pageSEO, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';
import type { RootState } from '@/store';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: wishlist = [], isLoading } = useWishlist(user?.id);
  const removeMutation = useRemoveFromWishlist();

  const handleRemove = async (productId: string) => {
    try {
      await removeMutation.mutateAsync(productId);
      toast.success('Product removed from Wishlist.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const wishlistSEO = pageSEO.wishlist;

  return (
    <Layout>
      <SEO
        title={wishlistSEO.title}
        description={wishlistSEO.description}
        keywords={wishlistSEO.keywords}
        canonical={`${siteUrl}/wishlist`}
        ogType={wishlistSEO.ogType}
        noindex
        schema={[
          buildWebPageSchema('/wishlist', wishlistSEO.title, wishlistSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Profile', path: '/profile' }, { name: 'Wishlist', path: '/wishlist' }]),
        ]}
      />
      {/* Mobile header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">My Wishlist</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 md:py-8 lg:py-10">
        {/* Breadcrumb - desktop */}
        <nav className="hidden md:flex items-center gap-2 text-sm mb-6 lg:mb-8">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">Home</button>
          <span className="text-muted-foreground">/</span>
          <button onClick={() => navigate('/profile')} className="text-muted-foreground hover:text-foreground transition-colors">Profile</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">Wishlist</span>
        </nav>

        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-foreground">My Wishlist</h2>
          {wishlist.length > 0 && (
            <span className="text-sm text-muted-foreground">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-square rounded-xl" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 rounded-2xl md:rounded-3xl border border-border bg-card shadow-sm">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 md:w-9 md:h-9 text-red-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Browse products and save your favorite items to see them here.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div key={item.id} className="group flex flex-col gap-1.5 text-left">
                  <div className="relative">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-left w-full"
                    >
                      <div className="w-full aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-border bg-muted">
                        <img
                          src={product.images?.[0] || ''}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    </button>
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <WishlistButton productId={product.id} size="sm" />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(product.id);
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-background/90 border border-border shadow-sm hover:shadow transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/product/${product.id}`)} className="text-left">
                    <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight line-clamp-2 mt-1 min-h-[2.5em]">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-foreground">{product.rating}</span>
                    </div>
                    <p className={`text-[10px] md:text-xs mt-1 ${product.stock > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="flex items-center justify-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold py-2 rounded-lg hover:bg-primary/20 transition-colors mt-auto shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Enquiry Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
