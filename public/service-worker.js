// Mayuresh Enterprises Service Worker for Background Notifications
/* eslint-disable no-undef */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const payload = event.data.json();
    const title = payload.title || 'Mayuresh Enterprises';
    const options = {
      body: payload.body || payload.message || 'New notification',
      icon: payload.icon || '/favicon.png',
      badge: payload.badge || '/favicon.png',
      tag: payload.tag || payload.id || 'default',
      requireInteraction: false,
      data: payload.data || { url: payload.url || '/' },
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    const title = 'Mayuresh Enterprises';
    const options = {
      body: 'You have a new notification',
      icon: '/favicon.png',
      tag: 'default',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && new URL(client.url).pathname === new URL(url, self.location.origin).pathname) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (self.clients.openWindow) {
        self.clients.openWindow(url);
      }
    })
  );
});
