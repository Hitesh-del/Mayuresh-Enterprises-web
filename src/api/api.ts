import { supabase } from '@/lib/supabase';
import type { Category, Product, Banner, Notification, Review, Coupon, Enquiry, AboutUs, CompanyJourney, CompanyGallery, CompanyStatistic, WhyChooseUs, Service, ServiceGallery, WishlistItem } from '@/types/database';

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(50);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Subcategories
export async function getSubcategories(categoryId?: string) {
  let query = supabase
    .from('subcategories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data, error } = await query.limit(50);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Products
export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  bestSeller?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:category_id(*)')
    .eq('is_active', true);

  if (options?.categorySlug) {
    const cat = await getCategoryBySlug(options.categorySlug);
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }
  if (options?.bestSeller) {
    query = query.eq('is_best_seller', true);
  }

  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;
  const { data, error } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category_id(*)')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSimilarProducts(categoryId: string, excludeId: string, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .order('rating', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Banners
export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(10);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Notifications
export async function getNotifications(userId?: string): Promise<Notification[]> {
  if (userId) {
    // Fetch user-specific + global notifications for logged-in users
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }
  // Fetch only global notifications for anon users
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .is('user_id', null)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId?: string) {
  if (userId) {
    // Mark user-specific + global unread notifications as read
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)
      .or(`user_id.eq.${userId},user_id.is.null`);
    if (error) throw error;
  } else {
    // Mark global unread notifications as read (anon users)
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)
      .is('user_id', null);
    if (error) throw error;
  }
}

export async function clearAllNotifications(userId?: string) {
  if (userId) {
    // Delete user-specific + global notifications
    const { error } = await supabase
      .from('notifications')
      .delete()
      .or(`user_id.eq.${userId},user_id.is.null`);
    if (error) throw error;
  }
}

// Wishlists
export async function getWishlist(userId?: string): Promise<WishlistItem[]> {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('wishlists')
    .select('*, product:product_id(*, category:category_id(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function addToWishlist(productId: string): Promise<WishlistItem> {
  const { data, error } = await supabase
    .from('wishlists')
    .insert({ product_id: productId })
    .select('*, product:product_id(*, category:category_id(*))')
    .single();
  if (error) throw error;
  return data;
}

export async function removeFromWishlist(productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('product_id', productId);
  if (error) throw error;
}

// Enquiries
export async function getEnquiries(userId?: string): Promise<Enquiry[]> {
  let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(100);
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createEnquiry(enquiry: {
  product_name: string;
  full_name: string;
  email: string;
  contact: string;
  quantity: number;
  user_id?: string | null;
}) {
  const { data, error } = await supabase.from('enquiries').insert(enquiry).select().single();
  if (error) throw error;
  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    address: string | null;
    business_hours: string | null;
  }>
): Promise<void> {
  const { error } = await supabase.from('user_profiles').update(updates).eq('id', userId);
  if (error) throw error;
}

// Reviews
export async function getReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Coupons
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .gt('expiry_date', new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data;
}

// About Us
export async function getAboutUs(): Promise<AboutUs | null> {
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Company Journey
export async function getCompanyJourney(): Promise<CompanyJourney[]> {
  const { data, error } = await supabase
    .from('company_journey')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Company Gallery
export async function getCompanyGallery(): Promise<CompanyGallery[]> {
  const { data, error } = await supabase
    .from('company_gallery')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Company Statistics
export async function getCompanyStatistics(): Promise<CompanyStatistic[]> {
  const { data, error } = await supabase
    .from('company_statistics')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Why Choose Us
export async function getWhyChooseUs(): Promise<WhyChooseUs[]> {
  const { data, error } = await supabase
    .from('why_choose_us')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Services
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Service Gallery
export async function getServiceGallery(serviceId: string): Promise<ServiceGallery[]> {
  const { data, error } = await supabase
    .from('service_gallery')
    .select('*')
    .eq('service_id', serviceId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}


