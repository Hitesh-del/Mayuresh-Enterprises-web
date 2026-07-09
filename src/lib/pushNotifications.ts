import { supabase } from '@/lib/supabase';

export async function requestBrowserPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    await registerServiceWorker();
    return true;
  }
  if (Notification.permission === 'denied') {
    return false;
  }
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    await registerServiceWorker();
    return true;
  }
  return false;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
    return registration;
  } catch {
    return null;
  }
}

export function getBrowserPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) return 'default';
  return Notification.permission;
}

export async function showLocalNotification(title: string, options?: NotificationOptions & { url?: string }) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const registration = await navigator.serviceWorker.ready;
  const url = options?.url;
  const data = url ? { ...options?.data, url } : options?.data;
  await registration.showNotification(title, {
    ...options,
    data,
  });
}

export async function saveNotificationPreference(userId: string, enabled: boolean) {
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ id: userId, notifications_enabled: enabled }, { onConflict: 'id' });
  if (error) throw error;
}

export async function getNotificationPreference(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('notifications_enabled')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.notifications_enabled ?? false;
}

export async function sendTestNotification() {
  await showLocalNotification('Mayuresh Enterprises', {
    body: 'Notifications are working!',
    icon: '/favicon.png',
    url: '/notifications',
    tag: 'test',
  });
}

export async function sendPushNotification(payload: {
  user_ids: string[];
  title: string;
  message: string;
  data?: Record<string, unknown>;
  url?: string;
}) {
  // Insert in-app notifications for each user via RPC (bypasses RLS with SECURITY DEFINER)
  for (const userId of payload.user_ids) {
    const { error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_title: payload.title,
      p_message: payload.message,
      p_type: 'status',
      p_is_read: false,
    });
    if (error) throw error;
  }
}
