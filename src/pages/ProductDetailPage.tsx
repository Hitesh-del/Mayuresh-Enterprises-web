import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, ChevronLeft, ChevronRight, Heart, Share2, FileText, ZoomIn } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useProduct, useSimilarProducts, useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useSupabaseData';
import { EnquiryModal } from '@/components/enquiry';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { buildWebPageSchema, buildBreadcrumbSchema, siteUrl, siteName } from '@/lib/seo';
import type { RootState } from '@/store';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: wishlist = [] } = useWishlist(user?.id);
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const isFavorite = useMemo(
    () => wishlist.some((item) => item.product_id === id),
    [wishlist, id]
  );

  const handleEnquiryClick = () => {
    if (!user) {
      navigate('/profile');
      return;
    }
    setEnquiryOpen(true);
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/profile');
      return;
    }
    if (!id) return;
    try {
      if (isFavorite) {
        await removeMutation.mutateAsync(id);
        toast.success('Product removed from Wishlist.');
      } else {
        await addMutation.mutateAsync(id);
        toast.success('Product added to Wishlist.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const shareUrl = `${window.location.origin}/product/${product.id}`;
    const shareData = {
      title: product.name,
      text: product.description || `Check out ${product.name} from Mayuresh Enterprises.`,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link Copied Successfully');
        return;
      }

      window.prompt('Copy this link:', shareUrl);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link Copied Successfully');
        } catch {
          toast.error('Unable to share this product right now.');
        }
      }
    }
  };

  const { data: product, isLoading } = useProduct(id || '');
  const { data: similar = [] } = useSimilarProducts(
    product?.category_id || '',
    product?.id || ''
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="px-4 pt-4 pb-6 md:hidden">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <Skeleton className="w-3/4 h-6 mt-4" />
          <Skeleton className="w-1/2 h-4 mt-2" />
          <Skeleton className="w-full h-20 mt-4 rounded-xl" />
        </div>
        <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 gap-10">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-1/2 h-5" />
              <Skeleton className="w-full h-32 rounded-xl" />
              <Skeleton className="w-full h-24 rounded-xl" />
              <Skeleton className="w-1/3 h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="px-4 pt-4 md:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <p className="text-foreground">Product not found</p>
        </div>
        <div className="hidden md:flex max-w-7xl mx-auto px-6 py-8 items-center justify-center min-h-[60vh]">
          <p className="text-foreground text-lg">Product not found</p>
        </div>
      </Layout>
    );
  }

  const images = product.images?.length ? product.images : [''];
  const categoryName = product.category?.name || 'Products';
  const productTitle = `${product.name} | ${siteName}`;
  const productDescription = product.description
    ? `${product.description.slice(0, 160).replace(/\s+\S*$/, '')}...`
    : `Buy ${product.name} from Mayuresh Enterprises. Premium custom printing products in Khopoli, Raigad, Maharashtra.`;

  return (
    <Layout>
      <SEO
        title={productTitle}
        description={productDescription}
        keywords={[product.name, categoryName, 'custom printing', 'Khopoli printing', 'Raigad printing']}
        canonical={`${siteUrl}/product/${id}`}
        ogType="product"
        ogImage={images[0]}
        schema={[
          buildWebPageSchema(`/product/${id}`, productTitle, productDescription),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: product.name, path: `/product/${id}` },
          ]),
        ]}
      />
      {/* Mobile View - unchanged */}
      <div className="md:hidden relative">
        {/* Image section with back button */}
        <div className="relative w-full aspect-square bg-muted">
          <img
            src={images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-40"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleToggleWishlist}
              disabled={addMutation.isPending || removeMutation.isPending}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors disabled:opacity-60"
              aria-label="Favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="px-4 pt-4 pb-24">
          <h1 className="text-lg font-bold text-foreground leading-snug">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({product.review_count} reviews)</span>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-1">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Enquiry CTA */}
          <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <p className="text-sm text-foreground font-medium mb-2">Interested in this product?</p>
            <p className="text-xs text-muted-foreground mb-3">Get a custom quote for bulk printing. Minimum order: 500 pieces.</p>
            <button
              onClick={handleEnquiryClick}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Enquiry Now
            </button>
          </div>

          {/* Similar products */}
          {similar.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Similar Products</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide items-stretch">
                {similar.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="shrink-0 w-28 flex flex-col gap-1 text-left"
                  >
                    <div className="w-28 h-28 rounded-xl overflow-hidden border border-border bg-muted shrink-0">
                      <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-xs font-medium text-foreground line-clamp-2 min-h-[2.5em]">{p.name}</span>
                    <div className="flex items-center gap-0.5 mt-auto">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-foreground">{p.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom action bar - Enquiry Now */}
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-4 py-3 max-w-md mx-auto md:max-w-[1440px] md:px-6">
          <button
            onClick={handleEnquiryClick}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Enquiry Now
          </button>
        </div>
      </div>

      {/* Desktop / Laptop / Tablet View */}
      <div className="hidden md:block pb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Home</button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => navigate('/products')} className="hover:text-foreground transition-colors">{categoryName}</button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate max-w-[240px]" title={product.name}>{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-3 w-20 lg:w-24 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border bg-muted transition-all ${
                      selectedImage === idx
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden border border-border bg-muted group cursor-zoom-in">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground shadow-sm">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Hover to zoom
                </div>
                <button
                  onClick={handleToggleWishlist}
                  disabled={addMutation.isPending || removeMutation.isPending}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors disabled:opacity-60"
                  aria-label="Favorite"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                </button>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {product.is_best_seller && (
                <span className="self-start inline-flex items-center px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold mb-3">
                  Best Seller
                </span>
              )}

              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h2 className="text-base font-semibold text-foreground">Description</h2>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Bulk Order Card */}
              <div className="mt-6 p-4 lg:p-5 rounded-2xl border border-primary/10 bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Bulk Order</h3>
                  <p className="text-sm text-muted-foreground mt-1">Get a custom quote for bulk printing. Minimum order: 500 pieces.</p>
                </div>
                <button
                  onClick={handleEnquiryClick}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Request Bulk Quote
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEnquiryClick}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors sm:flex-1 lg:flex-initial"
                >
                  <FileText className="w-4 h-4" />
                  Enquiry Now
                </button>
                <button
                  onClick={handleToggleWishlist}
                  disabled={addMutation.isPending || removeMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 border border-border bg-background text-foreground font-semibold px-6 py-3 rounded-xl hover:bg-muted transition-colors disabled:opacity-60 sm:flex-1 lg:flex-initial"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save for Later'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 lg:px-6 mt-10 lg:mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-foreground">Similar Products</h2>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {similar.map((p) => (
                <div key={p.id} className="group flex flex-col text-left h-full">
                  <div className="relative mb-3">
                    <button
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="text-left w-full"
                    >
                      <div className="w-full aspect-square rounded-2xl overflow-hidden border border-border bg-muted">
                        <img
                          src={p.images?.[0] || ''}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </button>
                    <div className="absolute top-2 right-2">
                      <WishlistButton productId={p.id} size="sm" />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="text-left flex flex-col flex-1 min-h-0"
                  >
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 min-h-[2.5em]">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-foreground">{p.rating}</span>
                      <span className="text-xs text-muted-foreground">({p.review_count})</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EnquiryModal
        productName={product.name}
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </Layout>
  );
};

export default ProductDetailPage;
