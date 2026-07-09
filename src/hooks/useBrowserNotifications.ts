import { useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/useSupabaseData';
import { showLocalNotification } from '@/lib/pushNotifications';
import type { Notification } from '@/types/database';

export function useBrowserNotifications(userId?: string) {
  const { data: notifications = [] } = useNotifications(userId);
  const prevIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!notifications.length) {
      prevIdsRef.current = new Set();
      return;
    }
    const currentIds = new Set(notifications.map((n) => n.id));
    // Find newly arrived notifications
    const newNotifications = notifications.filter((n) => !prevIdsRef.current.has(n.id));
    prevIdsRef.current = currentIds;

    if (!newNotifications.length) return;

    // Only show browser notification if page is not visible or it's a new arrival
    newNotifications.forEach((n) => {
      if (document.visibilityState === 'hidden' || !n.is_read) {
        showLocalNotification(n.title || 'Mayuresh Enterprises', {
          body: n.message || 'You have a new notification',
          icon: '/favicon.png',
          url: '/notifications',
          tag: n.id,
        }).catch(() => {
          // Silent fail if permission not granted
        });
      }
    });
  }, [notifications]);
}
