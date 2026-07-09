import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getProducts,
  getProductById,
  getBanners,
  getNotifications,
  getEnquiries,
  getReviews,
  getSimilarProducts,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
  createEnquiry,
  getAboutUs,
  getCompanyJourney,
  getCompanyGallery,
  getCompanyStatistics,
  getWhyChooseUs,
  getServices,
  getServiceBySlug,
  getAllServices,
  getServiceGallery,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateUserProfile,
} from '@/api/api';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: getCategories });
}

export function useProducts(options?: Parameters<typeof getProducts>[0]) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => getProducts(options),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useSimilarProducts(categoryId: string, excludeId: string) {
  return useQuery({
    queryKey: ['similar-products', categoryId, excludeId],
    queryFn: () => getSimilarProducts(categoryId, excludeId),
    enabled: !!categoryId && !!excludeId,
  });
}

export function useBanners() {
  return useQuery({ queryKey: ['banners'], queryFn: getBanners });
}

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(userId),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
    },
  });
}

export function useClearAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
    },
  });
}

export function useEnquiries(userId?: string) {
  return useQuery({
    queryKey: ['enquiries', userId],
    queryFn: () => getEnquiries(userId),
  });
}

export function useCreateEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enquiries'] }),
  });
}

export function useReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getReviews(productId),
    enabled: !!productId,
  });
}

// About Us Hooks
export function useAboutUs() {
  return useQuery({ queryKey: ['about-us'], queryFn: getAboutUs });
}

// Company Journey Hooks
export function useCompanyJourney() {
  return useQuery({ queryKey: ['company-journey'], queryFn: getCompanyJourney });
}

// Company Gallery Hooks
export function useCompanyGallery() {
  return useQuery({ queryKey: ['company-gallery'], queryFn: getCompanyGallery });
}

// Company Statistics Hooks
export function useCompanyStatistics() {
  return useQuery({ queryKey: ['company-statistics'], queryFn: getCompanyStatistics });
}

// Why Choose Us Hooks
export function useWhyChooseUs() {
  return useQuery({ queryKey: ['why-choose-us'], queryFn: getWhyChooseUs });
}

// Services Hooks
export function useServices() {
  return useQuery({ queryKey: ['services'], queryFn: getServices });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => getServiceBySlug(slug),
    enabled: !!slug,
  });
}

export function useAllServices() {
  return useQuery({ queryKey: ['all-services'], queryFn: getAllServices });
}

// Service Gallery Hooks
export function useServiceGallery(serviceId: string) {
  return useQuery({
    queryKey: ['service-gallery', serviceId],
    queryFn: () => getServiceGallery(serviceId),
    enabled: !!serviceId,
  });
}
// Wishlist Hooks
export function useWishlist(userId?: string) {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => getWishlist(userId),
    enabled: !!userId,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Parameters<typeof updateUserProfile>[1] }) =>
      updateUserProfile(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}



