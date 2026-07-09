import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Phone, FileText, Award, Users, Cpu, Headphones, Lightbulb,
  FolderCheck, Smile, Calendar, Package, ChevronRight, X
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import {
  useAboutUs, useCompanyJourney, useCompanyGallery,
  useCompanyStatistics, useWhyChooseUs
} from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { pageSEO, buildOrganizationSchema, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';

const whyIcons: Record<string, typeof Award> = {
  Award, Users, Cpu, Headphones, Lightbulb,
};

const statIcons: Record<string, typeof FolderCheck> = {
  'Projects Completed': FolderCheck,
  'Happy Clients': Smile,
  'Years Experience': Calendar,
  'Products Delivered': Package,
};

const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: about, isLoading: aboutLoading } = useAboutUs();
  const { data: journey = [], isLoading: journeyLoading } = useCompanyJourney();
  const { data: gallery = [], isLoading: galleryLoading } = useCompanyGallery();
  const { data: stats = [], isLoading: statsLoading } = useCompanyStatistics();
  const { data: whyItems = [], isLoading: whyLoading } = useWhyChooseUs();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const aboutSEO = pageSEO.about;

  return (
    <Layout>
      <SEO
        title={aboutSEO.title}
        description={aboutSEO.description}
        keywords={aboutSEO.keywords}
        canonical={`${siteUrl}/about`}
        ogType={aboutSEO.ogType}
        schema={[
          buildOrganizationSchema(),
          buildWebPageSchema('/about', aboutSEO.title, aboutSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about' }]),
        ]}
      />
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">About Us</h1>
      </div>

      <div className="pb-6 md:pb-12">
        {/* Hero Section */}
        {aboutLoading ? (
          <div className="w-full aspect-[16/9] bg-muted md:rounded-2xl md:overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ) : about ? (
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden md:rounded-2xl">
            {about.hero_image ? (
              <img
                src={about.hero_image}
                alt="About Mayuresh Enterprises - trusted printing company in Khopoli, Raigad, Maharashtra"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No hero image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-8">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white">{about.hero_title}</h2>
              <p className="text-sm md:text-base lg:text-lg text-white/90 mt-1 md:mt-2">{about.hero_tagline}</p>
              <p className="text-xs md:text-sm text-white/80 mt-1 md:mt-2 line-clamp-2 max-w-3xl">{about.hero_description}</p>
            </div>
          </div>
        ) : null}

        {/* Company Story */}
        {about && (
          <div className="px-4 py-6 md:py-12 lg:py-16">
            {aboutLoading ? (
              <div className="max-w-3xl mx-auto space-y-3">
                <Skeleton className="w-32 h-6 md:h-8" />
                <Skeleton className="w-full h-20 md:h-28" />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto text-center md:text-left">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-3 md:mb-4">{about.story_title}</h3>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {about.story_content}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Company Journey Timeline */}
        <div className="px-4 py-4 md:py-10 lg:py-14 bg-muted/30">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-8 text-center">Our Journey</h3>
          {journeyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="max-w-prose mx-auto space-y-0">
              {journey.map((entry, idx) => (
                <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">{entry.year.slice(-2)}</span>
                    </div>
                    {idx < journey.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <span className="text-xs font-bold text-primary">{entry.year}</span>
                    <h4 className="text-sm md:text-base font-semibold text-foreground">{entry.title}</h4>
                    {entry.description && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">{entry.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Gallery */}
        {gallery.length > 0 && (
          <div className="px-4 py-6 md:py-10 lg:py-14">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6">Gallery</h3>
            {galleryLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {gallery.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setLightboxImage(img.image_url)}
                    className="aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-border bg-muted"
                  >
                    <img
                      src={img.image_url}
                      alt={img.caption || ''}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Why Choose Us */}
        <div className="px-4 py-6 md:py-10 lg:py-14">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6 text-center">Why Choose Us</h3>
          {whyLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 md:h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 items-stretch">
              {whyItems.map((item) => {
                const Icon = whyIcons[item.icon || ''] || Award;
                return (
                  <div key={item.id} className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-card h-full flex flex-col shadow-sm">
                    <div className="p-2.5 md:p-3 rounded-lg md:rounded-xl bg-primary/10 w-fit shrink-0">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <h4 className="text-sm md:text-base lg:text-lg font-bold text-foreground mt-3 md:mt-4">{item.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1.5 md:mt-2 leading-relaxed flex-1">{item.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="px-4 py-6 md:py-10 lg:py-14 bg-muted/30">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6 text-center">By The Numbers</h3>
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 md:h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 items-stretch">
              {stats.map((stat) => {
                const Icon = statIcons[stat.label] || FolderCheck;
                return (
                  <div key={stat.id} className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-card text-center h-full flex flex-col items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary mx-auto shrink-0" />
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mt-2 md:mt-3">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {about && (
        <div className="px-4 py-8 md:py-12 lg:py-16">
          <div className="p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl border border-primary/20 bg-primary/5 text-center max-w-4xl mx-auto">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">{about.cta_title}</h3>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground mt-2 md:mt-3">{about.cta_subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5 md:mt-6">
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 md:px-8 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-border bg-card text-foreground font-semibold py-3 px-6 md:px-8 rounded-xl hover:bg-muted transition-colors"
              >
                <FileText className="w-4 h-4" />
                Request Enquiry
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={lightboxImage}
            alt="Full size"
            className="max-w-full max-h-[85dvh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Layout>
  );
};

export default AboutUsPage;
