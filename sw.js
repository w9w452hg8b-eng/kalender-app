// sw.js - Service Worker für Offline-Funktion und geplante lokale Benachrichtigungen

// 1. Offline-Cache Handling
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// 2. Empfängt Steuersignale von der index.html (Methode 2)
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'TRIGGER_NOTIFICATION') {
    const title = event.data.title || 'Termin-Erinnerung';
    const options = {
      body: event.data.body || 'Ein Kalender-Termin steht an!',
      icon: '/playstore.png',
      badge: '/playstore.png',
      vibrate: [200, 100, 200],
      tag: event.data.tag || 'calendar-event',
      renotify: true
    };

    self.registration.showNotification(title, options);
  }
});

// 3. Empfängt Push-Signale (falls später genutzt)
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Erinnerung';
  const options = {
    body: data.body || 'Ein Kalender-Termin steht an!',
    icon: '/playstore.png',
    badge: '/playstore.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
