const CACHE_NAME = 'nomorebs-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/dashboard.html',
  '/timer.html',
  '/tasks.html',
  '/settings.html',
  '/env-config.js',
  '/js/auth.js',
  '/js/satire.js',
  '/js/supabase.js',
  '/js/timer.js',
  '/js/todos.js',
  '/assets/LOGO.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
