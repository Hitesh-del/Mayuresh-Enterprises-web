import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import EnquiriesPage from './pages/EnquiriesPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AboutUsPage from './pages/AboutUsPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import WishlistPage from './pages/WishlistPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Home', path: '/', element: <HomePage />, public: true },
  { name: 'Categories', path: '/categories', element: <CategoriesPage />, public: true },
  { name: 'Products', path: '/products', element: <ProductListingPage />, public: true },
  { name: 'Product Detail', path: '/product/:id', element: <ProductDetailPage />, public: true },
  { name: 'Services', path: '/services', element: <ServicesPage />, public: true },
  { name: 'Service Detail', path: '/service/:slug', element: <ServiceDetailPage />, public: true },
  { name: 'About Us', path: '/about', element: <AboutUsPage />, public: true },
  { name: 'Enquiries', path: '/enquiries', element: <EnquiriesPage />, public: true },
  { name: 'Contact', path: '/contact', element: <ContactPage />, public: true },
  { name: 'Profile', path: '/profile', element: <ProfilePage />, public: true },
  { name: 'Wishlist', path: '/wishlist', element: <WishlistPage />, public: true },
  { name: 'Notifications', path: '/notifications', element: <NotificationsPage />, public: true },
];
