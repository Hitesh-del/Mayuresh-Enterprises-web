import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ChevronDown, FileText, Phone, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useCategories, useNotifications } from '@/hooks/useSupabaseData';

const logoUrl = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg';

const DesktopHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: categories = [] } = useCategories();
  const { data: notifications = [] } = useNotifications(user?.id);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    const query = params.toString();
    navigate(`/products${query ? `?${query}` : ''}`);
  };

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name || 'Category'
    : 'All Categories';

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
        {/* Top row */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 shrink-0">
            <img
              src={logoUrl}
              alt="Mayuresh Enterprises"
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-lg object-contain bg-white border border-border"
            />
            <div className="hidden lg:block text-left">
              <h1 className="text-base lg:text-lg font-bold leading-tight text-foreground">
                Mayuresh <span className="text-primary">Enterprises</span>
              </h1>
            </div>
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex justify-center px-2 lg:px-6 xl:px-10"
          >
            <div className="flex items-stretch w-full max-w-xl lg:max-w-2xl rounded-full overflow-visible border border-border bg-muted/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all h-10 lg:h-11">
              <div className="flex-1 min-w-0 flex items-center px-4">
                <Search className="w-4 h-4 text-muted-foreground shrink-0 mr-2.5" />
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
                />
              </div>

              <div className="shrink-0 relative border-l border-border" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="h-full px-3 lg:px-4 flex items-center gap-2 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
                >
                  <span className="hidden sm:inline">{selectedCategoryName}</span>
                  <span className="sm:hidden">All</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1 max-h-64 overflow-y-auto"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('');
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                        selectedCategory === '' ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                          selectedCategory === cat.slug ? 'text-primary font-medium' : 'text-foreground'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="shrink-0 px-4 lg:px-6 bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 hover:bg-primary/90 transition-colors rounded-r-full"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-0.5 lg:gap-1 shrink-0">
            <button
              onClick={() => navigate('/enquiries')}
              className="relative p-2 lg:p-2.5 hover:bg-muted rounded-xl transition-colors"
              aria-label="My Enquiries"
            >
              <FileText className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 lg:p-2.5 hover:bg-muted rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="relative p-2 lg:p-2.5 hover:bg-muted rounded-xl transition-colors"
              aria-label="Contact"
            >
              <Phone className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1.5 lg:gap-2 p-1.5 lg:p-2 pl-2 lg:pl-3 hover:bg-muted rounded-xl transition-colors ml-1"
            >
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
              </div>
              <span className="hidden xl:inline text-sm font-medium text-foreground truncate max-w-[120px]">
                {user?.email ? user.email.split('@')[0] : 'Account'}
              </span>
              <ChevronDown className="hidden xl:block w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex items-center gap-1 mt-3 lg:mt-4 pt-2 lg:pt-3 border-t border-border overflow-x-auto">
          <button
            onClick={() => navigate('/products')}
            className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.slug)}`)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {cat.name}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          ))}
          <button
            onClick={() => navigate('/enquiries')}
            className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            My Enquiries
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            Contact Us
          </button>
        </nav>
      </div>
    </header>
  );
};

export default DesktopHeader;
