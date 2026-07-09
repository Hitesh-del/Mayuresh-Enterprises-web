import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import Layout from '@/components/layout/Layout';
import { useEnquiries } from '@/hooks/useSupabaseData';
import type { RootState } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { pageSEO, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';

const statusConfig: Record<string, { icon: typeof Clock; label: string; color: string }> = {
  pending: { icon: Clock, label: 'Pending', color: 'bg-orange-50 text-orange-600 border border-orange-200' },
  reviewing: { icon: Loader2, label: 'In Review', color: 'bg-blue-50 text-blue-600 border border-blue-200' },
  approved: { icon: CheckCircle, label: 'Approved', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  rejected: { icon: XCircle, label: 'Rejected', color: 'bg-red-50 text-red-600 border border-red-200' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'bg-green-50 text-green-700 border border-green-200' },
};

const EnquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: enquiries = [], isLoading } = useEnquiries(user?.id || undefined);

  const enquiriesSEO = pageSEO.enquiries;

  return (
    <Layout>
      <SEO
        title={enquiriesSEO.title}
        description={enquiriesSEO.description}
        keywords={enquiriesSEO.keywords}
        canonical={`${siteUrl}/enquiries`}
        ogType={enquiriesSEO.ogType}
        schema={[
          buildWebPageSchema('/enquiries', enquiriesSEO.title, enquiriesSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Enquiries', path: '/enquiries' }]),
        ]}
      />
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">My Enquiries</h1>
      </div>

      <div className="px-4 py-4 pb-6 md:max-w-3xl md:mx-auto md:px-6 lg:px-8 md:py-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-16 text-center md:py-20">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-base md:text-lg font-bold text-foreground mb-2">Login Required</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">Please log in to view your enquiries</p>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-3 md:gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 md:h-28 rounded-xl" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center md:py-20">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-base md:text-lg font-bold text-foreground mb-2">No Enquiries Yet</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">Browse our products and send an enquiry</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:gap-4">
            {enquiries.map((enq) => {
              const status = statusConfig[enq.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={enq.id} className="p-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono">#{enq.id.slice(0, 8).toUpperCase()}</p>
                      <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-1">{enq.product_name}</h3>
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="space-y-1 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Quantity:</span> {enq.quantity >= 5000 ? '5000+' : enq.quantity}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Date:</span>{' '}
                      {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EnquiriesPage;
