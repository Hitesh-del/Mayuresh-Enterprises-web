# Requirements Document

## 1. Application Overview

**Application Name**: Mayuresh Enterprises

**Tagline**: Print Your Imagination

**Description**: Mayuresh Enterprises is a custom printing e-commerce web application (mobile-first design) where users can browse and order custom printed products including t-shirts, mugs, hoodies, bottles, caps, and more. The application provides a complete shopping experience from product discovery to order placement, along with company information and service offerings.

## 2. Users and Usage Scenarios

**Target Users**: Individuals and businesses looking to order custom printed products

**Core Usage Scenarios**:
- Browse and search for custom printed products
- View product details and pricing
- Add products to cart and complete purchase
- Track order status
- Manage personal profile
- Learn about company background and values
- Explore available printing services

## 3. Page Structure and Functionality

```
Mayuresh Enterprises Web App
├── Home Page
├── Categories Page
├── Product Listing Page
├── Product Detail Page
├── Cart Page
├── Orders Page
├── Profile Page
├── About Us Page
└── Services Page
    └── Service Detail Page
```

### 3.1 Home Page

**Header Section**:
- Logo display: Use logo image from https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg with tagline \"Print Your Imagination\"
- Hamburger menu icon (left side)
- Notification bell icon with badge count (right side)
- Shopping cart icon with badge count (right side)

**Left Sidebar Navigation** (triggered by hamburger menu):
- Menu items in order:
  - Home
  - Products
  - About Us
  - Services
  - My Enquiries
  - Cart
  - Orders
  - Profile

**Search Bar**:
- Full-width search input field
- Placeholder text: \"Search for products, categories...\"
- QR code scanner icon on right side

**Category Navigation**:
- Horizontal scrollable row of category circles
- Categories: T-Shirts, Mugs, Hoodies, Bottles, Caps, More
- Each category displays circular icon/image with label below
- Clicking category navigates to Categories Page with filter applied

**Hero Banner Carousel**:
- Carousel with 4 slides (indicated by dots)
- Slide content includes:
  - \"Premium Quality\" badge
  - Headline: \"Custom Printing Made Just for You!\"
  - Subtext: \"High Quality Prints. Fast Delivery. Endless Possibilities.\"
  - \"Shop Now\" CTA button
  - Product images (t-shirt, mug, cap) on right side
- Carousel dots indicator at bottom
- Auto-rotate slides

**Feature Highlights**:
- 4 icons displayed in a horizontal row:
  - High Quality Printing
  - Fast & Safe Delivery
  - Easy Returns
  - Secure Payment

**Shop by Category Section**:
- Section title with \"View All\" link on right
- Horizontal scrollable product category cards:
  - Custom T-Shirts
  - Custom Shirts
  - Custom Hoodies
  - Custom Jeans
- Each card displays product image with label below
- Clicking card navigates to Product Listing Page for that category

**Best Selling Products Section**:
- Section title with \"View All\" link on right
- Horizontal scrollable product cards displaying:
  - Be You Tiful Printed T-Shirt: ₹499 (original price ₹799 with strikethrough), 4.5 stars
  - Good Vibes Only Mug: ₹349 (original price ₹499 with strikethrough), 4.6 stars
  - Your Design Hoodie: ₹999 (original price ₹1,499 with strikethrough), 4.7 stars
  - Stay Positive Phone Case: ₹299 (original price ₹499 with strikethrough), 4.4 stars
- Each card shows: product image, product name, discounted price, original price with strikethrough, star rating
- Clicking card navigates to Product Detail Page

**Promotional Banners**:
- 3 promotional cards displayed in a row:
  - Bulk Orders card (red/orange theme): \"Get special discounts on bulk quantities\"
  - Custom Design Support card (yellow theme): \"We help you create the perfect design\"
  - Become a Seller card (green theme): \"Start selling your designs with us\"

**Footer Section**:
- Quick Links section with clickable navigation links:
  - Home (navigates to Home Page)
  - Categories (navigates to Categories Page)
  - Products (navigates to Product Listing Page)
  - Enquiries (navigates to My Enquiries Page)
  - Contact (navigates to Contact Page)
  - About (navigates to About Us Page)
- Contact Information section:
  - Address: Shop No. 2, Govind Smruti, Somjai Nagar Road, Khopoli, Taluka Khalapur, District Raigad, Maharashtra – 410203, India
  - Mobile: 98863 232 266 and 97042 842 842
  - Email: mayureshentr2010@gmail.com

**Bottom Navigation Bar**:
- 5 navigation items: Home (active state in orange), Categories, Orders, Cart (with badge count), Profile
- Fixed at bottom of screen
- Active page highlighted in orange (#FF6B00)

### 3.2 Categories Page

**Header**: Same as Home Page

**Category Grid**:
- Display all product categories in grid layout
- Each category shows icon/image and category name
- Clicking category navigates to Product Listing Page with filter applied

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page

### 3.3 Product Listing Page

**Header**: Same as Home Page

**Product Grid**:
- Display products in grid layout (2 columns)
- Each product card shows: product image, product name, discounted price, original price with strikethrough, star rating
- Clicking product card navigates to Product Detail Page

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page

### 3.4 Product Detail Page

**Header**: Same as Home Page

**Product Information**:
- Product image display
- Product name
- Star rating and review count
- Discounted price and original price with strikethrough
- Product description

**Add to Cart Section**:
- Quantity selector
- \"Add to Cart\" button
- Clicking button adds product to cart and updates cart badge count

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page

### 3.5 Cart Page

**Header**: Same as Home Page

**Cart Items List**:
- Display all items added to cart
- Each item shows: product image, product name, price, quantity selector, remove button
- Update quantity or remove items from cart

**Order Summary**:
- Display subtotal, delivery charges, total amount

**Checkout Button**:
- \"Proceed to Checkout\" button
- Clicking button initiates checkout process

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page (Cart icon highlighted)

### 3.6 Orders Page

**Header**: Same as Home Page

**Orders List**:
- Display list of user orders
- Each order shows: order number, order date, order status, total amount, product thumbnails
- Clicking order shows order details

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page (Orders icon highlighted)

### 3.7 Profile Page

**Header**: Same as Home Page

**User Information**:
- Display user name and contact information

**Profile Options**:
- Account settings
- Notification preferences
- Logout option

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page (Profile icon highlighted)

### 3.8 About Us Page

**Header**: Same as Home Page

**Hero Section**:
- Company banner image
- Company name display
- Company tagline
- Short introduction text

**Company Story Section**:
- Section title: \"Our Story\"
- Rich text description

**Company Journey Timeline**:
- Interactive timeline display
- Each timeline entry shows: year, title, description
- Timeline entries displayed in chronological order

**Company Image Gallery**:
- Grid layout displaying company images
- Clicking image opens lightbox view
- Lightbox supports navigation between images

**Why Choose Us Section**:
- 5 feature cards displayed:
  - Quality
  - Experience
  - Technology
  - Support
  - Innovation
- Each card shows icon, title, description

**Statistics Section**:
- 4 statistics displayed:
  - Projects Completed
  - Happy Clients
  - Years Experience
  - Products Delivered
- Each statistic shows label and value

**CTA Section**:
- Headline: \"Need Printing Solutions?\"
- Two CTA buttons:
  - \"Contact Us\" button
  - \"Request Enquiry\" button

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page

### 3.9 Services Page

**Header**: Same as Home Page

**Services Hero Banner**:
- Banner image
- Title text
- Subtitle text

**Services Listing**:
- Dynamic service cards displayed in grid layout
- Each service card shows:
  - Service image
  - Service icon
  - Service title
  - Short description
  - \"View Details\" button
- Clicking \"View Details\" navigates to Service Detail Page

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page

### 3.10 Service Detail Page

**Header**: Same as Home Page

**Service Banner**:
- Service-specific banner image

**Service Information**:
- Service title
- Full description

**Service Features**:
- List of service features

**Service Benefits**:
- List of service benefits

**Service Gallery**:
- Grid layout displaying service-related images
- Clicking image opens lightbox view

**Enquiry CTA**:
- \"Request Enquiry\" button
- Clicking button initiates enquiry process

**Footer**: Same as Home Page

**Bottom Navigation Bar**: Same as Home Page

## 4. Business Rules and Logic

### 4.1 Product Pricing
- All products display discounted price and original price
- Original price shown with strikethrough formatting
- Discount percentage calculated automatically

### 4.2 Cart Management
- Cart badge count updates when items added or removed
- Cart persists across page navigation
- Quantity can be adjusted in cart

### 4.3 Navigation
- Bottom navigation bar remains fixed and visible on all pages
- Active page highlighted in orange color
- Badge counts displayed on Cart and Notification icons when applicable
- Left sidebar navigation accessible via hamburger menu
- Sidebar menu items: Home, Products, About Us, Services, My Enquiries, Cart, Orders, Profile
- Footer Quick Links are clickable and navigate to respective pages

### 4.4 Search Functionality
- Search bar available on all pages via header
- Search queries filter products by name or category

### 4.5 Carousel Behavior
- Hero banner auto-rotates through 4 slides
- Users can manually navigate slides by clicking dots

### 4.6 Image Lightbox
- Clicking gallery images opens lightbox overlay
- Lightbox displays full-size image
- Navigation arrows allow browsing between images
- Close button exits lightbox

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty cart | Display \"Your cart is empty\" message with link to continue shopping |
| No search results | Display \"No products found\" message with suggestion to try different keywords |
| No orders | Display \"You have no orders yet\" message on Orders Page |
| Product out of stock | Display \"Out of Stock\" label on product card, disable Add to Cart button |
| No timeline entries | Display \"Coming soon\" message in Company Journey section |
| No gallery images | Hide gallery section on About Us page |
| No services available | Display \"Services coming soon\" message on Services Page |
| Service detail page for inactive service | Display \"Service not available\" message |

## 6. Acceptance Criteria

1. User opens Mayuresh Enterprises home page and views hero banner, categories, and best selling products
2. User clicks hamburger menu and selects \"About Us\" from sidebar navigation
3. User views About Us page including company story, timeline, gallery, and statistics
4. User clicks \"Services\" from sidebar navigation
5. User views Services page and clicks \"View Details\" on a service card
6. User views Service Detail page and clicks \"Request Enquiry\" button
7. User navigates back to home page and clicks on a product card from Best Selling Products section
8. User views product details and clicks \"Add to Cart\" button
9. User clicks cart icon to navigate to Cart Page
10. User reviews cart items and clicks \"Proceed to Checkout\" button

## 7. Out of Scope for Current Release

- User registration and login functionality
- Payment processing integration
- Order fulfillment and shipping tracking
- Custom design upload and editing tools
- Bulk order discount calculation system
- Seller onboarding and management
- Review and rating submission by users
- Wishlist or favorites functionality
- Product filtering and sorting options
- Real-time inventory management
- Push notifications
- QR code scanning functionality
- Multi-language support
- Currency conversion
- Enquiry form submission and management
- Contact form functionality
- Service category filtering
- Service search functionality
- Social media integration
- Live chat support
- Email notification system
- Analytics and reporting dashboard
- Admin panel and all admin-related features
- Content management system for About Us page
- Content management system for Services page
- Image upload and management for galleries
- Timeline entry management
- Statistics value editing
- Service activation/deactivation