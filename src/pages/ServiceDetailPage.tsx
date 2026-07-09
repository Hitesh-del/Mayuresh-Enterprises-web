import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Star, FileText, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useService, useServiceGallery } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { buildWebPageSchema, buildBreadcrumbSchema, siteUrl, siteName } from '@/lib/seo';

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: service, isLoading: serviceLoading } = useService(slug || '');
  const { data: gallery = [], isLoading: galleryLoading } = useServiceGallery(service?.id || '');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const serviceTitle = service ? `${service.title} | ${siteName}` : `Service Details | ${siteName}`;
  const serviceDescription = service
    ? `${service.short_description || `Professional ${service.title} by Mayuresh Enterprises in Khopoli, Raigad, Maharashtra.`}`.slice(0, 160)
    : 'Explore professional printing services at Mayuresh Enterprises.';
  const galleryImage = gallery.length > 0 && typeof gallery[0] === 'string' ? gallery[0] : '';
  const serviceImage = service?.image || galleryImage;

  return (
    <Layout>
      <SEO
        title={serviceTitle}
        description={serviceDescription}
        keywords={service ? [service.title, 'printing service', 'custom printing', 'Khopoli', 'Raigad'] : ['printing services']}
        canonical={service ? `${siteUrl}/service/${service.slug}` : `${siteUrl}/services`}
        ogType="website"
        ogImage={serviceImage}
        schema={[
          buildWebPageSchema(service ? `/service/${service.slug}` : '/services', serviceTitle, serviceDescription),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service?.title || 'Service Details', path: service ? `/service/${service.slug}` : '/services' },
          ]),
        ]}
      />
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1 truncate">{service?.title || 'Service Details'}</h1>
      </div>

      {serviceLoading ? (
        <div className="px-4 py-4 space-y-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8 md:py-8">
          <Skeleton className="w-full aspect-[16/10] md:aspect-[21/9] rounded-xl" />
          <Skeleton className="w-3/4 h-6 md:h-8" />
          <Skeleton className="w-full h-24 md:h-32" />
        </div>
      ) : !service ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 md:max-w-4xl md:mx-auto">
          <h3 className="text-lg font-bold text-foreground">Service Not Found</h3>
          <p className="text-sm text-muted-foreground mt-1">The service you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            View All Services
          </button>
        </div>
      ) : (
        <div className="pb-6 md:pb-12">
          {/* Banner */}
          <div className="w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden md:rounded-2xl bg-muted flex items-center justify-center">
            {service.image ? (
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-sm">No banner image</span>
            )}
          </div>

          {/* Service Info */}
          <div className="px-4 pt-4 pb-24 md:pt-8 md:pb-8 md:max-w-4xl md:mx-auto">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground">{service.title}</h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground mt-2 md:mt-4 leading-relaxed">
              {service.full_description || service.short_description}
            </p>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="mt-5 md:mt-8">
                <h3 className="text-sm md:text-lg font-bold text-foreground mb-2 md:mb-3">Features</h3>
                <div className="flex flex-col gap-2 md:gap-3 md:grid md:grid-cols-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="mt-5 md:mt-8">
                <h3 className="text-sm md:text-lg font-bold text-foreground mb-2 md:mb-3">Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 md:p-4 rounded-lg md:rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
                      <Star className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm md:text-base text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="mt-5 md:mt-8">
                <h3 className="text-sm md:text-lg font-bold text-foreground mb-3 md:mb-4">Gallery</h3>
                {galleryLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {gallery.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setLightboxImage(img.image_url)}
                        className="aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={img.image_url}
                          alt={img.caption || 'Service photo'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-4 py-3 md:py-4 md:border-t-0 md:bg-transparent md:static md:max-w-4xl md:mx-auto md:px-0">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 md:px-8 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Request Enquiry
            </button>
          </div>
        </div>
      )}

      {/* Enquiry Modal (simplified - navigates to products/enquiries) */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setEnquiryOpen(false)}>
          <div
            className="w-full max-w-[calc(100%-2rem)] md:max-w-lg bg-card rounded-t-2xl md:rounded-2xl border border-border p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-foreground mb-2">Request Enquiry</h3>
            <p className="text-sm text-muted-foreground mb-4">Interested in {service?.title}? Send us an enquiry.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setEnquiryOpen(false); navigate('/contact'); }}
                className="flex-1 py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors"
              >
                Contact Page
              </button>
              <button
                onClick={() => { setEnquiryOpen(false); navigate('/products'); }}
                className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ServiceDetailPage;
