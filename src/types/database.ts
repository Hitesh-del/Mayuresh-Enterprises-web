export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  subcategory_id: string | null;
  description: string | null;
  price: number;
  original_price: number;
  discount_percent: number;
  rating: number;
  review_count: number;
  stock: number;
  images: string[];
  tags: string[];
  is_best_seller: boolean;
  is_active: boolean;
  created_at: string;
  category?: Category;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  image: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  user_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: string;
  total: number;
  delivery_charge: number;
  grand_total: number;
  shipping_address: Record<string, unknown> | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  user_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  uses_count: number;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Enquiry {
  id: string;
  product_name: string;
  full_name: string;
  email: string;
  contact: string;
  quantity: number;
  status: string;
  user_id: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  notifications_enabled: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  notifications_enabled: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface AboutUs {
  id: string;
  hero_image: string | null;
  hero_title: string;
  hero_tagline: string;
  hero_description: string;
  story_title: string;
  story_content: string | null;
  cta_title: string;
  cta_subtitle: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyJourney {
  id: string;
  year: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface CompanyGallery {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface CompanyStatistic {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface WhyChooseUs {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  icon: string | null;
  image: string | null;
  features: string[];
  benefits: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceGallery {
  id: string;
  service_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}
