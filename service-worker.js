const CACHE_NAME = 'hollow-knight-local-v1';

const APP_SHELL = [
  './',
  './index.html',
  './TemplateData/style.css',
  './TemplateData/favicon.ico',
  './TemplateData/fullscreen-button.png',
  './TemplateData/webgl-logo.png',
  './TemplateData/unity-logo-dark.png',
  './TemplateData/unity-logo-light.png',
  './TemplateData/progress-bar-empty-dark.png',
  './TemplateData/progress-bar-empty-light.png',
  './TemplateData/progress-bar-full-dark.png',
  './TemplateData/progress-bar-full-light.png',
  './StreamingAssets/BuildMetadata.json',
  './Build/hk.loader.js',
  './Build/hk.framework.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
