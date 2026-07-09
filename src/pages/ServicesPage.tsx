import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useServices } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { pageSEO, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';

const iconMap: Record<string, typeof ArrowRight> = {};

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: services = [], isLoading } = useServices();

  const servicesSEO = pageSEO.services;

  return (
    <Layout>
      <SEO
        title={servicesSEO.title}
        description={servicesSEO.description}
        keywords={servicesSEO.keywords}
        canonical={`${siteUrl}/services`}
        ogType={servicesSEO.ogType}
        schema={[
          buildWebPageSchema('/services', servicesSEO.title, servicesSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]),
        ]}
      />
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">Our Services</h1>
      </div>

      {/* Services Grid */}
      <div className="px-4 py-6 md:py-10 lg:py-14">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6">What We Offer</h3>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 md:h-56 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate(`/service/${service.slug}`)}
                className="text-left h-full flex flex-col rounded-xl md:rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-muted shrink-0">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <h4 className="text-sm md:text-base lg:text-lg font-bold text-foreground">{service.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1.5 md:mt-2 leading-relaxed line-clamp-2 flex-1">
                    {service.short_description}
                  </p>
                  <div className="mt-3 md:mt-4 flex items-center gap-1 text-primary text-xs md:text-sm font-semibold">
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServicesPage;
