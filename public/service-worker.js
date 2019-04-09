var dataCacheName = 'sample_app_name-v1';
var cacheName = 'sample_app_name-final-1'; 

var filesToCache = [
  '/',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', 
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', 
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
  'http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css',
  '/stylesheets/style.css',
  'https://res.cloudinary.com/sastech/image/upload/v1554756662/Group_10_cxypyd.png',
  'https://res.cloudinary.com/sastech/image/upload/v1554740633/undraw_laravel_and_vue_59tp_d2m8cr.png',
  'https://res.cloudinary.com/sastech/image/upload/c_scale,w_15/v1554755392/ms_io4pnd.jpg',
  'https://res.cloudinary.com/sastech/image/upload/c_scale,w_15/v1554755433/fb_ljukgr.png',
  'https://res.cloudinary.com/sastech/image/upload/c_scale,w_15/v1554755392/ms_io4pnd.jpg',
  'https://res.cloudinary.com/sastech/image/upload/c_scale,h_20,w_25/v1554801099/Lyft_xzqtfe.png'
];


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
      caches.open(cacheName).then(function(cache) {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(filesToCache);
      })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
});
  
self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] Fetch', e.request.url);
    var dataUrl = '/';
    if (e.request.url.indexOf(dataUrl) > -1) {
      e.respondWith(
        caches.open(dataCacheName).then(function(cache) {
          return fetch(e.request).then(function(response){
            cache.put(e.request.url, response.clone());
            return response;
          });
        })
      );
    } else {
      e.respondWith(
        caches.match(e.request).then(function(response) {
          return response || fetch(e.request);
        })
      );
    }
});
  
