import React, { useMemo } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useSupabaseData';
import type { RootState } from '@/store';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-9 h-9',
};

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, size = 'md', className = '' }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: wishlist = [] } = useWishlist(user?.id);
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const isWishlisted = useMemo(
    () => wishlist.some((item) => item.product_id === productId),
    [wishlist, productId]
  );

  const isLoading = addMutation.isPending || removeMutation.isPending;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/profile');
      return;
    }

    try {
      if (isWishlisted) {
        await removeMutation.mutateAsync(productId);
        toast.success('Product removed from Wishlist.');
      } else {
        await addMutation.mutateAsync(productId);
        toast.success('Product added to Wishlist.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-background/90 border border-border shadow-sm hover:shadow transition-all disabled:opacity-60 ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin text-muted-foreground`} />
      ) : (
        <Heart
          className={`${iconSizes[size]} transition-colors ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          }`}
        />
      )}
    </button>
  );
};

export default WishlistButton;
