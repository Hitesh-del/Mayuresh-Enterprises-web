import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Info, Tag, Gift, FileText, CheckCircle, CheckCheck, Trash2, MessageSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useClearAllNotifications } from '@/hooks/useSupabaseData';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { pageSEO, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';

const typeIcons: Record<string, typeof Info> = {
  welcome: Bell,
  offer: Tag,
  promo: Gift,
  general: Info,
  enquiry: FileText,
  status: CheckCircle,
  message: MessageSquare,
};

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: notifications = [], isLoading } = useNotifications(user?.id);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const clearAll = useClearAllNotifications();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleClearAll = () => {
    if (!confirm('Clear all notifications?')) return;
    clearAll.mutate(user?.id || undefined, {
      onSuccess: () => {
        toast.success('All notifications cleared');
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Failed to clear notifications');
      },
    });
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(user?.id || undefined, {
      onSuccess: () => {
        toast.success('All notifications marked as read');
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Failed to mark notifications as read');
      },
    });
  };

  const notificationsSEO = pageSEO.notifications;

  return (
    <Layout>
      <SEO
        title={notificationsSEO.title}
        description={notificationsSEO.description}
        keywords={notificationsSEO.keywords}
        canonical={`${siteUrl}/notifications`}
        ogType={notificationsSEO.ogType}
        noindex
        schema={[
          buildWebPageSchema('/notifications', notificationsSEO.title, notificationsSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Notifications', path: '/notifications' }]),
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
        <h1 className="text-base font-bold text-foreground flex-1">Notifications</h1>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Action bar */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 md:px-0 md:max-w-3xl md:mx-auto md:py-3 border-b border-border bg-muted/30 md:bg-transparent md:border-0">
          <button
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending || unreadCount === 0}
            className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:opacity-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
          <button
            onClick={handleClearAll}
            disabled={clearAll.isPending}
            className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      )}

      <div className="px-4 py-4 pb-6 md:max-w-3xl md:mx-auto md:px-6 lg:px-8 md:py-8">
        {isLoading ? (
          <div className="space-y-3 md:gap-4 md:space-y-0 md:flex md:flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 md:h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center md:py-20">
            <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">No notifications</h3>
            <p className="text-sm md:text-base text-muted-foreground">Check back later for updates</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:gap-3">
            {notifications.map((n) => {
              const Icon = typeIcons[n.type] || Info;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.is_read) {
                      markRead.mutate(n.id, {
                        onSuccess: () => {
                          toast.success('Marked as read');
                        },
                        onError: () => {
                          toast.error('Failed to mark as read');
                        },
                      });
                    }
                  }}
                  className={`flex items-start gap-3 p-4 md:p-5 rounded-xl md:rounded-2xl border text-left transition-colors shadow-sm ${
                    n.is_read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${n.is_read ? 'bg-muted' : 'bg-primary/10'}`}>
                    <Icon className={`w-5 h-5 ${n.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-foreground">{n.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] md:text-xs text-muted-foreground mt-1 block">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
