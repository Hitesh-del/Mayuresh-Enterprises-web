import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, ChevronRight, FileText, Search, Mic, MicOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCategories, useProducts, useBanners } from '@/hooks/useSupabaseData';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { pageSEO, buildLocalBusinessSchema, buildOrganizationSchema, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';
import type { RootState } from '@/store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: banners = [], isLoading: bannerLoading } = useBanners();
  const { data: bestSellers = [], isLoading: productLoading } = useProducts({ bestSeller: true, limit: 8 });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentSlide];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const startVoiceSearch = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        if (event.results[0].isFinal) {
          navigate(`/products?search=${encodeURIComponent(transcript.trim())}`);
          setSearchQuery('');
        }
      };
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      alert('Could not start voice search. Please check microphone permissions.');
    }
  }, [navigate]);

  const stopVoiceSearch = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const homeSEO = pageSEO.home;

  return (
    <Layout>
      <SEO
        title={homeSEO.title}
        description={homeSEO.description}
        keywords={homeSEO.keywords}
        canonical={`${siteUrl}/`}
        ogType={homeSEO.ogType}
        schema={[
          buildOrganizationSchema(),
          buildLocalBusinessSchema(),
          buildWebPageSchema('/', homeSEO.title, homeSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }]),
        ]}
      />
      {/* Mobile Search Bar */}
      <div className="px-4 py-3 md:hidden">
        <form onSubmit={handleSearch}>
          <div
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all bg-background ${
              isSearchFocused ? 'border-primary ring-1 ring-primary' : 'border-border'
            }`}
          >
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search for products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
            />
            <button
              type="button"
              onClick={isListening ? stopVoiceSearch : startVoiceSearch}
              className={`shrink-0 p-1 rounded-full transition-all ${
                isListening ? 'bg-primary text-white animate-pulse' : ''
              }`}
              aria-label={isListening ? 'Stop voice search' : 'Voice search'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {isListening && (
            <p className="text-[10px] text-primary mt-1 text-center font-medium">Listening... Speak now</p>
          )}
        </form>
      </div>

      {/* Category Circles */}
      <div className="px-4 pb-4 md:pb-8 lg:pb-10 md:pt-6 lg:pt-8">
        {catLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-8 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0 md:shrink-0">
                <Skeleton className="w-14 h-14 md:w-20 md:h-20 rounded-full" />
                <Skeleton className="w-10 h-3 md:h-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-8 md:overflow-visible md:mx-0 md:px-0 md:gap-4 lg:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.slug)}`)}
                className="flex flex-col items-center gap-1 md:gap-2 shrink-0 md:shrink-0 min-w-[72px]"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border border-border bg-muted hover:border-primary transition-colors">
                  <img
                    src={cat.image || ''}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] md:text-sm font-medium text-foreground whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hero Banner - fixed overflow, dark overlay */}
      <div className="px-4 pb-5 md:pb-8 lg:pb-10">
        {bannerLoading || !activeBanner ? (
          <Skeleton className="w-full h-[200px] md:h-[460px] lg:h-[540px] rounded-2xl" />
        ) : (
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
            <div className="relative w-full min-h-[180px] md:h-[460px] lg:h-[540px]">
              <img
                src={activeBanner.image}
                alt={activeBanner.title}
                className="w-full h-full object-cover min-h-[180px] md:min-h-[460px] lg:min-h-[540px]"
                loading="eager"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
              {/* Text content - constrained within container */}
              <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-10 overflow-hidden">
                {activeBanner.badge && (
                  <span className="inline-block self-start px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-semibold bg-primary/90 text-white rounded-full mb-2 md:mb-3">
                    {activeBanner.badge}
                  </span>
                )}
                <h2 className="text-base md:text-3xl lg:text-4xl font-bold text-white leading-snug mb-1.5 md:mb-3 max-w-[80%] md:max-w-[55%] break-words">
                  {activeBanner.title}
                </h2>
                {activeBanner.subtitle && (
                  <p className="text-xs md:text-base lg:text-lg text-white/80 mb-3 md:mb-5 max-w-[75%] md:max-w-[55%] break-words">
                    {activeBanner.subtitle}
                  </p>
                )}
                <button
                  onClick={() => navigate(activeBanner.cta_link || '/products')}
                  className="self-start px-4 md:px-6 py-2 md:py-2.5 bg-white text-foreground text-xs md:text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
                >
                  {activeBanner.cta_text || 'Explore Products'}
                </button>
              </div>
              {/* Dots - positioned inside with padding */}
              {banners.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-4">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                        i === currentSlide ? 'bg-white w-4' : 'bg-white/40'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shop by Category */}
      <div className="px-4 pb-5 md:pb-8 lg:pb-10">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-foreground">Browse by Category</h3>
          <button onClick={() => navigate('/categories')} className="flex items-center gap-0.5 text-sm md:text-base text-primary font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {catLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-32 md:h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 items-stretch">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.slug)}`)}
                className="flex flex-col items-center gap-2 h-full group"
              >
                <div className="w-full aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-border bg-muted group-hover:border-primary transition-colors">
                  <img
                    src={cat.image || ''}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground text-center line-clamp-2">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Products */}
      <div className="px-4 pb-5 md:pb-8 lg:pb-10">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-foreground">Featured Products</h3>
          <button onClick={() => navigate('/products')} className="flex items-center gap-0.5 text-sm md:text-base text-primary font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {productLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:mx-0 md:px-0 md:gap-4 lg:gap-6 items-stretch">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shrink-0 w-36 md:w-full h-full flex flex-col gap-1.5">
                <Skeleton className="w-36 h-36 md:w-full md:h-56 rounded-xl shrink-0" />
                <Skeleton className="w-24 h-3 md:h-4 shrink-0" />
                <Skeleton className="w-16 h-3 md:h-4 shrink-0" />
                <Skeleton className="w-full h-8 rounded-lg mt-auto shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide items-stretch md:grid md:grid-cols-4 md:overflow-visible md:mx-0 md:px-0 md:gap-4 lg:gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="shrink-0 w-36 md:w-full flex flex-col gap-1.5 text-left group">
                <div className="relative shrink-0">
                  <button onClick={() => navigate(`/product/${product.id}`)} className="text-left w-full">
                    <div className="w-36 h-36 md:w-full md:aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-border bg-muted group-hover:border-primary transition-colors">
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
                <button onClick={() => navigate(`/product/${product.id}`)} className="text-left flex flex-col flex-1 min-h-0">
                  <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight line-clamp-2 mt-1 min-h-[2.5em]">{product.name}</h4>
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
                    navigate(`/product/${product.id}`);
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

    </Layout>
  );
};

export default HomePage;
