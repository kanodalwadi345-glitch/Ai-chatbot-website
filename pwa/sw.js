// very tiny offline cache for static files
self.addEventListener('install', e=>{
  e.waitUntil(caches.open('kr-cache-v1').then(c=>c.addAll([
    '/', '/index.html','/assets/css/style.css','/assets/js/main.js','/assets/js/qrcode.min.js','/assets/img/logo.svg','/assets/img/cover.svg'
  ])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
